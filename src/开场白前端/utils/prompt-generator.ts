import { ProjectState, Playlist, StructuredTrack, MvuOperator } from '../types';

/**
 * 映射表：前端中文操作符 -> 后端 YAML 键名
 */
const OPERATOR_MAP: Record<MvuOperator, string> = {
  等于: 'value',
  大于: 'greater_than',
  大于等于: 'greater_than_or_equal_to',
  小于: 'less_than',
  小于等于: 'less_than_or_equal_to',
  它的文字包含: 'value_contains',
  时间范围是: 'time_in_range',
};

/**
 * 辅助函数：生成缩进
 */
const indent = (level: number) => '  '.repeat(level);

/**
 * 格式化结构化歌曲列表为 YAML
 */
function formatStructuredTracks(tracks: StructuredTrack[]): string {
  if (tracks.length === 0) return '[]';

  let yaml = 'tracks:\n';
  tracks.forEach(t => {
    yaml += indent(1) + `- url: "${t.url.trim()}"\n`;
    if (t.title.trim()) yaml += indent(2) + `歌名: "${t.title.trim()}"\n`;
    if (t.artist.trim()) yaml += indent(2) + `歌手: "${t.artist.trim()}"\n`;
    if (t.cover.trim()) yaml += indent(2) + `封面: "${t.cover.trim()}"\n`;
  });
  return yaml;
}

/**
 * 格式化 MVU 触发器为 YAML
 */
function formatMvuConfig(playlist: Playlist): string {
  const { priority, conditions } = playlist.mvuConfig;

  // 过滤无效条件
  const validConditions = conditions.filter(c => c.path.trim() && c.value.trim());

  // 如果没有有效条件，但它是场景歌单，AI 依然需要知道它是场景歌单，只是条件为空
  if (validConditions.length === 0) return '# (警告: 用户未设置有效触发条件)\n';

  let yaml = `[触发器配置 (已格式化-请直接采纳)]\n`;
  // 修正点1：补全 type 字段
  yaml += `- type: mvu_variable\n`;
  // 修正点2：playlist_id 增加缩进以对齐
  yaml += indent(1) + `playlist_id: ${playlist.id}\n`;
  yaml += indent(1) + `priority: ${priority}\n`;
  yaml += indent(1) + `conditions:\n`;

  validConditions.forEach(c => {
    const yamlKey = OPERATOR_MAP[c.operator];
    let val = c.value.trim();

    // 修正点3：增加布尔值检测，true/false 也不加引号
    const isNumber = /^-?\d+(\.\d+)?$/.test(val);
    const isBoolean = val === 'true' || val === 'false';
    // 只有既不是数字，也不是布尔值，或者操作符特殊时，才加引号
    const needsQuote = (!isNumber && !isBoolean) || c.operator === '它的文字包含' || c.operator === '时间范围是';

    if (needsQuote) val = `"${val}"`;

    yaml += indent(2) + `- variable_path: "${c.path.trim()}"\n`;
    yaml += indent(3) + `${yamlKey}: ${val}\n`;
  });

  return yaml;
}

/**
 * 核心生成函数
 */
export function generatePrompt(state: ProjectState): string {
  const { playlists, targetType, defaultPlaylistId } = state;
  const isMvu = targetType === 'mvu';

  // 1. Header (指令部分，不包裹在代码块中)
  const header = `以下是用户的歌单配置信息。请你检查完整性，解析未格式化的歌曲文本，并输出最终的 YAML [MusicConfig] 配置。\n\n`;

  // 2. Body (数据部分，包裹在代码块中)
  let body = '```yaml\n';

  // --- 全局块 ---
  body += `(全局配置)\n`;
  body += `运行模式: [is_mvu: ${isMvu}]\n`;

  // 只有在 ID 有效且属于当前列表时才写入
  const defaultPlaylist = playlists.find(p => p.id === defaultPlaylistId);
  const isValidDefault = defaultPlaylist && defaultPlaylist.mvuConfig.type === 'base';

  if (isValidDefault && defaultPlaylistId) {
    body += `默认基础歌单ID: ${defaultPlaylistId}\n`;
  } else {
    body += `默认基础歌单ID: (无) - 用户未指定，不要设置默认歌单\n`;
  }
  body += `\n`;

  // --- 歌单块 ---
  playlists.forEach((p, index) => {
    body += `=========================\n`;
    body += `【歌单 ${index + 1}】\n`;

    // A. 通用核心数据 (所有模式、所有类型都必须输出)
    body += `ID: ${p.id}\n`;
    // 明确输出类型，即使是文字卡也要告诉 AI 这是“场景”还是“基础”
    const typeLabel = p.mvuConfig.type === 'base' ? '基础歌单' : '场景歌单';
    body += `类型: ${typeLabel}\n`;
    body += `结束规则: ${p.onFinishRule}\n`;

    // B. 歌曲数据
    if (p.trackInputMode === 'structured') {
      body += `\n[歌曲列表 (已格式化-请直接采纳)]\n`;
      body += formatStructuredTracks(p.tracksStructured);
    } else {
      body += `\n[歌曲列表 (原始文本-请解析为YAML)]\n`;
      body += (p.tracksRaw || '').trim() + `\n`;
    }

    // C. 场景触发逻辑 (仅场景歌单需要)
    if (p.mvuConfig.type === 'scene') {
      if (isMvu) {
        // MVU 模式: 输出 InitVar 和 触发器YAML
        if (p.mvuConfig.initVarRaw && p.mvuConfig.initVarRaw.trim()) {
          body += `\n[InitVar (仅供参考变量结构)]\n`;
          body += p.mvuConfig.initVarRaw.trim() + `\n`;
        }
        // 这里会调用 formatMvuConfig，它内部已经过滤了无效的触发器条目
        body += `\n` + formatMvuConfig(p);
      } else {
        // 文字模式: 输出情景描述
        body += `\n[情景描述]\n`;
        body += (p.textConfig.sceneDescription || '').trim() + `\n`;
      }
    } else {
      // 基础歌单
      body += `\n[触发条件]: 无 (作为基础背景音乐)\n`;
    }
  });

  body += `=========================\n`;
  body += '```'; // 代码块结束

  return header + body;
}
