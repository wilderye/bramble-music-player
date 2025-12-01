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

  // 1. Header
  let prompt = `以下是用户的歌单配置信息。请你检查完整性，解析未格式化的歌曲文本，并输出最终的 YAML [MusicConfig] 配置。\n\n`;

  // 2. Global Block
  prompt += `(全局块)\n`;
  prompt += `运行模式: [is_mvu: ${isMvu}]\n`;

  // 只有在 ID 有效且属于当前列表时才写入
  // 且必须是 Base 类型 (防止逻辑错误)
  const defaultPlaylist = playlists.find(p => p.id === defaultPlaylistId);
  const isValidDefault = defaultPlaylist && (!isMvu || defaultPlaylist.mvuConfig.type === 'base');

  if (isValidDefault && defaultPlaylistId) {
    prompt += `默认基础歌单ID: ${defaultPlaylistId}\n`;
  } else {
    // 显式告诉 AI 没有默认歌单，防止它幻觉补全
    prompt += `默认基础歌单ID: (无) - 用户未指定，请勿自动设置任何默认歌单\n`;
  }
  prompt += `\n`;

  // 3. Playlists Block

  playlists.forEach((p, index) => {
    prompt += `=========================\n`;
    prompt += `【歌单 ${index + 1} 数据】\n`;
    prompt += `ID: ${p.id}\n`;
    prompt += `结束规则: ${p.onFinishRule}\n`;

    // A. 歌曲部分
    if (p.trackInputMode === 'structured') {
      prompt += `\n[歌曲列表 (已格式化-请直接采纳)]\n`;
      prompt += formatStructuredTracks(p.tracksStructured);
    } else {
      prompt += `\n[歌曲列表 (原始文本-请解析为YAML)]\n`;
      prompt += (p.tracksRaw || '').trim() + `\n`;
    }

    // B. 触发逻辑部分
    if (isMvu) {
      if (p.mvuConfig.type === 'base') {
        prompt += `\n[类型]: 基础歌单 (无需触发器，作为背景音乐候选项)\n`;
      } else {
        prompt += `\n[类型]: 场景歌单 (条件触发)\n`;

        // MVU Scene: 如果有 InitVar，先输出
        if (p.mvuConfig.initVarRaw && p.mvuConfig.initVarRaw.trim()) {
          prompt += `\n[InitVar (仅供参考变量结构)]\n`;
          prompt += p.mvuConfig.initVarRaw.trim() + `\n`;
        }

        // 输出触发器
        prompt += `\n` + formatMvuConfig(p);
      }
    } else {
      // Text Mode
      prompt += `\n[情景描述]\n`;
      prompt += (p.textConfig.sceneDescription || '').trim() + `\n`;
    }
  });

  prompt += `=========================\n`;

  return prompt;
}
