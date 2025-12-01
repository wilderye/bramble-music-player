/**
 * 生成简单的唯一标识符
 * 用于 Vue 的 :key 绑定和内部数据追踪
 */
export function generateUUID(): string {
  // 生成 16 字符的随机字符串 (类似 Mongo ObjectId 或简易 UUID)
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let autoId = '';
  for (let i = 0; i < 16; i++) {
    autoId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return autoId;
}
