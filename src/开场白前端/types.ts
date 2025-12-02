/**
 * 核心数据类型定义
 */

// --- 1. 视图与导航枚举 ---
export type ViewName = 'home' | 'setup' | 'dashboard' | 'editor' | 'skin';

// --- 2. 基础业务枚举 ---
export type TargetType = 'mvu' | 'text';
export type FinishRule = 'loop' | 'pop';
export type TrackInputMode = 'raw' | 'structured';
export type MvuPlaylistType = 'base' | 'scene';

// 触发器运算符
export type MvuOperator = '等于' | '大于' | '大于等于' | '小于' | '小于等于' | '它的文字包含' | '时间范围是';

// --- 3. 子数据结构 ---
export interface StructuredTrack {
  id: string;
  url: string;
  title: string;
  artist: string;
  cover: string;
}

export interface MvuCondition {
  id: string;
  path: string;
  operator: MvuOperator;
  value: string;
}

export interface MvuConfigData {
  type: MvuPlaylistType;
  priority: number;
  initVarRaw: string; // [新增] 用于 Prompt 参考
  conditions: MvuCondition[];
}

export interface TextConfigData {
  sceneDescription: string;
}

// --- 4. 核心实体 ---
export interface Playlist {
  _uuid: string;
  id: string;
  onFinishRule: FinishRule;

  // 歌曲数据
  trackInputMode: TrackInputMode;
  tracksRaw: string;
  tracksStructured: StructuredTrack[];

  // 类型配置
  mvuConfig: MvuConfigData;
  textConfig: TextConfigData;
}
// --- 新增：皮肤配置相关类型 ---
export interface SkinMetaphor {
  visualRef: string; // 视觉参考
  entity: string; // 实体隐喻
  texture: string; // 材质触感
  dynamics: string; // 动态交互
}

export interface SkinConfig {
  excludedComponents: string[]; // 被剔除的组件ID列表 (存用户不要的内容)
  metaphor: SkinMetaphor; // 隐喻配置
  styleKeywords: string[]; // 选中的风格关键词
  freeformRequirements: string; // 自由描述
}

// --- 5. 全局状态 ---
export interface ProjectState {
  currentView: ViewName;
  activePlaylistUuid: string | null;
  targetType: TargetType;
  defaultPlaylistId: string | null;
  playlists: Playlist[];
  skinConfig: SkinConfig;
}

// --- 6. 校验结果 ---
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}
