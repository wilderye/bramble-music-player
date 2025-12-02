import { SkinConfig } from '../types';

/**
 * 组件 ID 到中文描述的映射表
 * 用于告诉 AI 用户具体想删掉哪个部件
 */
const COMPONENT_MAP: Record<string, string> = {
  cover: '歌曲独立封面',
  title: '歌曲名',
  artist: '歌手名',
  progress: '播放进度条',
  time: '当前/总时长',
  mode: '播放模式切换按钮',
  volume: '音量控制',
  controls: '上一首/下一首按钮',
  playlist: '歌单列表',
};

/**
 * 生成皮肤制作的 Prompt
 * 核心原则：只发送用户明确填写的内容，留白处让 AI 自由发挥
 */
export function generateSkinPrompt(config: SkinConfig): string {
  // 1. 基础指令
  let prompt = '请为我编写一个 SillyTavern 的前端播放器界面 (HTML/CSS/JS)。\n';
  prompt += '严格基于 <MUSICPLAYER_FRONTEND_DEV> 开发规范，产出完整的代码块。\n\n';

  // 2. 组件删减 (只列出用户【不需要】的)
  if (config.excludedComponents.length > 0) {
    prompt += '【功能删减 (以下组件请务必在界面中移除)】\n';
    config.excludedComponents.forEach(id => {
      const name = COMPONENT_MAP[id] || id;
      prompt += `- 不显示: ${name}\n`;
    });
    prompt += '\n';
  }

  // 3. 核心隐喻 (只列出用户填写的)
  let metaphorSection = '';
  const { entity, texture, dynamics, visualRef } = config.metaphor;

  if (entity && entity.trim()) metaphorSection += `- 核心/实体概念: ${entity.trim()}\n`;
  if (texture && texture.trim()) metaphorSection += `- 材质与触感: ${texture.trim()}\n`;
  if (dynamics && dynamics.trim()) metaphorSection += `- 交互动态: ${dynamics.trim()}\n`;
  if (visualRef && visualRef.trim()) metaphorSection += `- 致敬/参考: ${visualRef.trim()}\n`;

  if (metaphorSection) {
    prompt += '【设计隐喻】\n' + metaphorSection + '\n';
  }

  // 4. 视觉关键词
  if (config.styleKeywords.length > 0) {
    prompt += '【视觉风格关键词】\n';
    prompt += config.styleKeywords.join(', ') + '\n\n';
  }

  // 5. 自由描述
  if (config.freeformRequirements && config.freeformRequirements.trim()) {
    prompt += '【详细需求与补充】\n';
    prompt += config.freeformRequirements.trim() + '\n';
  }

  return prompt;
}
