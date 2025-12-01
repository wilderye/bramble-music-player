import { Playlist, TargetType, ValidationResult } from '../types';

/**
 * 1. 基础格式校验 (实时反馈用)
 * 检查必填项是否为空，ID 格式是否正确
 */
export function validatePlaylistBasic(
  playlist: Playlist,
  existingIds: string[] = [], // 用于 ID 查重
): ValidationResult {
  const errors: Record<string, string> = {};

  // ID 校验
  if (!playlist.id || !playlist.id.trim()) {
    errors['id'] = 'ID 不能为空';
  } else if (existingIds.includes(playlist.id)) {
    errors['id'] = 'ID 已被使用，请更换';
  }

  // 歌曲内容校验
  if (playlist.trackInputMode === 'raw') {
    if (!playlist.tracksRaw || !playlist.tracksRaw.trim()) {
      errors['tracks'] = '请粘贴歌曲信息';
    }
  } else if (playlist.tracksStructured.length === 0) {
    // 修正：合并 else { if } -> else if
    errors['tracks'] = '请至少添加一首歌曲';
  } else {
    const hasEmptyUrl = playlist.tracksStructured.some(t => !t.url.trim());
    if (hasEmptyUrl) {
      errors['tracks'] = '存在未填写音频链接的歌曲';
    }
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

/**
 * 2. 业务逻辑校验 (提交拦截用)
 * 检查场景配置是否完整
 */
export function validatePlaylistLogic(playlist: Playlist, targetType: TargetType): string[] {
  const logicErrors: string[] = [];
  const baseLabel = `歌单 "${playlist.id || '未命名'}"`;
  const isScene = playlist.mvuConfig.type === 'scene';

  if (isScene) {
    if (targetType === 'mvu') {
      // MVU 场景：必须有触发条件
      const validConditions = playlist.mvuConfig.conditions.filter(c => c.path.trim() && c.value.trim());
      if (validConditions.length === 0) {
        logicErrors.push(`${baseLabel}: 作为 MVU 场景歌单，必须设置至少一个完整的触发条件`);
      }
    } else if (!playlist.textConfig.sceneDescription.trim()) {
      // 修正：合并 else { if } -> else if
      // Text 场景：必须有情景描述
      logicErrors.push(`${baseLabel}: 作为场景歌单，必须填写“场景歌单播放条件”`);
    }
  }

  // 基础歌单 (Base) 无需额外逻辑校验
  return logicErrors;
}

/**
 * 3. 全局一致性校验 (最终生成前调用)
 */
export function validateGlobalState(
  playlists: Playlist[],
  targetType: TargetType,
  defaultPlaylistId: string | null,
): { passed: boolean; messages: string[] } {
  const messages: string[] = [];

  // A. 数量检查
  if (playlists.length === 0) {
    return { passed: false, messages: ['请至少创建一个歌单'] };
  }

  // B. 逐条检查
  const allIds = playlists.map(p => p.id);

  playlists.forEach(p => {
    // 1. 基础格式 (排除自身的 ID 查重)
    const otherIds = allIds.filter(id => id !== p.id);
    const basic = validatePlaylistBasic(p, otherIds);

    if (!basic.isValid) {
      const errFields = Object.values(basic.errors).join('、');
      messages.push(`歌单 "${p.id || '未命名'}" 格式错误: ${errFields}`);
    }

    // 2. 业务逻辑
    const logicErrors = validatePlaylistLogic(p, targetType);
    messages.push(...logicErrors);
  });

  // C. 默认歌单规则检查
  if (defaultPlaylistId) {
    const target = playlists.find(p => p.id === defaultPlaylistId);

    if (!target) {
      // 理论上 UI 不会允许选不存在的 ID，但防万一
      messages.push(`设置的默认歌单 "${defaultPlaylistId}" 不存在`);
    } else if (target.mvuConfig.type !== 'base') {
      // 修正：合并 else { if } -> else if
      // 强制规则：默认歌单必须是 Base 类型
      messages.push(
        `默认歌单 "${target.id}" 是场景歌单。只有“基础歌单”才能被设为默认背景音乐，请修改其类型或取消默认设置。`,
      );
    }
  }

  return {
    passed: messages.length === 0,
    messages,
  };
}
