<template>
  <div class="flex h-full w-full flex-col bg-[#FDFCF8] p-6 transition-colors duration-500 dark:bg-[#1c1917]">

    <!-- 1. 顶部导航 -->
    <header class="fade-in-up w-full py-4" style="animation-delay: 0ms;">
      <button
        type="button"
        class="group flex items-center rounded-full px-4 py-2 text-sm font-bold text-stone-500 transition-all hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
        @click="$emit('back')"
      >
        <div class="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 transition-colors group-hover:bg-stone-300 dark:bg-stone-700 dark:group-hover:bg-stone-600">
          <i class="fas fa-chevron-left text-[10px]"></i>
        </div>
        返回
      </button>
    </header>

    <!-- 2. 核心选择区 -->
    <main class="flex w-full flex-1 flex-col items-center justify-center pb-20">

      <!-- 标题组 -->
      <div class="fade-in-up mb-12 text-center" style="animation-delay: 100ms;">
        <h2 class="mb-3 text-2xl font-bold tracking-tight text-stone-700 dark:text-stone-200">
          选择你的角色卡类型
        </h2>
        <p class="text-base text-stone-400 dark:text-stone-500">
          我们将根据卡片类型，为你提供最合适的配置工具。
        </p>
      </div>

      <!-- 卡片网格 -->
      <div class="grid w-full max-w-4xl gap-8 md:grid-cols-2">

        <!-- 选项 A: MVU 卡 -->
        <button
          type="button"
          class="fade-in-up group relative flex w-full flex-col items-center rounded-3xl bg-white p-10 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_-4px_rgba(92,127,103,0.15)] dark:bg-stone-800 dark:shadow-none"
          style="animation-delay: 200ms;"
          @click="$emit('select', 'mvu')"
        >
          <!-- 图标容器 -->
          <div class="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#5C7F67]/10 text-4xl text-[#5C7F67] transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 dark:bg-[#5C7F67]/20">
            <i class="fas fa-bolt"></i>
          </div>

          <!-- 文本 -->
          <h3 class="mb-3 text-xl font-bold text-stone-700 group-hover:text-[#5C7F67] dark:text-stone-200 dark:group-hover:text-[#5C7F67]">
            MVU 卡
          </h3>
          <p class="leading-relaxed text-stone-400 dark:text-stone-500">
            不涉及 AI 判断<br/>
            可根据变量变化切换歌单
          </p>

          <!-- 底部装饰条 (Hover时显现) -->
          <div class="absolute bottom-0 h-1.5 w-1/3 rounded-t-full bg-[#5C7F67] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </button>

        <!-- 选项 B: 非 MVU 卡 -->
        <button
          type="button"
          class="fade-in-up group relative flex w-full flex-col items-center rounded-3xl bg-white p-10 text-center shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_-4px_rgba(92,127,103,0.15)] dark:bg-stone-800 dark:shadow-none"
          style="animation-delay: 300ms;"
          @click="$emit('select', 'text')"
        >
          <!-- 图标容器 -->
          <div class="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-[#5C7F67]/10 text-4xl text-[#5C7F67] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 dark:bg-[#5C7F67]/20">
            <i class="fas fa-book-open"></i>
          </div>

          <!-- 文本 -->
          <h3 class="mb-3 text-xl font-bold text-stone-700 group-hover:text-[#5C7F67] dark:text-stone-200 dark:group-hover:text-[#5C7F67]">
            非 MVU 卡
          </h3>
          <p class="leading-relaxed text-stone-400 dark:text-stone-500">
            适合自然语言<br/>
            由 AI 判断切换歌单
          </p>

           <!-- 底部装饰条 (Hover时显现) -->
          <div class="absolute bottom-0 h-1.5 w-1/3 rounded-t-full bg-[#5C7F67] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </button>

      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { TargetType } from '../types';

defineEmits<{
  (e: 'back'): void;
  (e: 'select', type: TargetType): void;
}>();
</script>

<style scoped>
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
  opacity: 0;
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
