<template>
  <div
    class="flex h-full w-full flex-col items-center bg-[#FDFCF8] p-6 transition-colors duration-500 dark:bg-[#1c1917]"
  >
    <!-- 1. 核心内容区 (垂直居中，避免顶头) -->
    <main class="flex w-full max-w-md flex-1 flex-col items-center justify-center">
      <!-- 星球图标 (悬浮动画，无底色) -->
      <div class="animate-float mb-8 text-7xl select-none">🪐</div>

      <!-- 标题组 -->
      <div class="fade-in-up mb-12 text-center" style="animation-delay: 100ms">
        <h1 class="mb-3 text-3xl font-bold tracking-tight text-stone-700 dark:text-stone-200">欢迎降落黑棘星</h1>
        <p class="text-base text-stone-400 dark:text-stone-500">
          为你的角色卡打造沉浸式听觉体验。<br />
          请选择一种方式开始你的旅程。
        </p>
      </div>

      <!-- 功能入口卡片组 (Action Tiles) -->
      <div class="flex w-full flex-col gap-4">
        <!-- 卡片 2: 批量配置 (原 Dashboard) -->
        <button
          type="button"
          class="fade-in-up group relative flex w-full items-center gap-5 rounded-2xl bg-white p-5 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-4px_rgba(92,127,103,0.15)] dark:bg-stone-800 dark:shadow-none"
          style="animation-delay: 200ms"
          @click="$emit('start')"
        >
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#5C7F67]/10 text-[#5C7F67] transition-transform group-hover:scale-110 dark:bg-[#5C7F67]/20"
          >
            <i class="fas fa-layer-group text-lg"></i>
          </div>
          <div class="flex flex-col">
            <span
              class="text-base font-bold text-stone-700 group-hover:text-[#5C7F67] dark:text-stone-200 dark:group-hover:text-[#5C7F67]"
            >
              开始创建歌单
            </span>
            <span class="text-xs text-stone-400"> 填写需求后交由AI生成配置 </span>
          </div>
          <div class="ml-auto text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-[#5C7F67]">
            <i class="fas fa-chevron-right"></i>
          </div>
        </button>

        <!-- 卡片 3: 皮肤制作 -->
        <button
          type="button"
          class="fade-in-up group relative flex w-full items-center gap-5 rounded-2xl bg-white p-5 text-left shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-1 hover:shadow-[0_10px_30px_-4px_rgba(92,127,103,0.15)] dark:bg-stone-800 dark:shadow-none"
          style="animation-delay: 400ms"
          @click="$emit('skin')"
        >
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#5C7F67]/10 text-[#5C7F67] transition-transform group-hover:scale-110 dark:bg-[#5C7F67]/20"
          >
            <i class="fas fa-paint-brush text-lg"></i>
          </div>
          <div class="flex flex-col">
            <span
              class="text-base font-bold text-stone-700 group-hover:text-[#5C7F67] dark:text-stone-200 dark:group-hover:text-[#5C7F67]"
            >
              制作播放器皮肤
            </span>
            <span class="text-xs text-stone-400"> 定制角色的专属播放器 </span>
          </div>
          <div class="ml-auto text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-[#5C7F67]">
            <i class="fas fa-chevron-right"></i>
          </div>
        </button>
      </div>
    </main>

    <!-- 2. 底部版权 (沉底，不重叠) -->
    <footer class="fade-in-up mt-auto pt-10 pb-2 text-center" style="animation-delay: 600ms">
      <p class="text-[10px] font-medium tracking-[0.2em] text-stone-300 uppercase dark:text-stone-700">
        Copyright © 荒行
      </p>
    </footer>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'start'): void;
  (e: 'skin'): void;
}>();
</script>

<style scoped>
/* 星球悬浮动画 */
@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

/* 入场淡入上浮动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  opacity: 0; /* 初始不可见 */
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
