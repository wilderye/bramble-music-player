<template>
  <div class="w-full space-y-6">
    <!-- 1. 模式切换 (Clean Segmented Control) -->
    <div class="flex w-full rounded-2xl bg-stone-100 p-1.5 dark:bg-stone-800">
      <button
        type="button"
        class="flex-1 rounded-xl py-3 text-base font-bold transition-all"
        :class="
          mode === 'raw'
            ? 'bg-white text-stone-800 shadow-sm dark:bg-stone-700 dark:text-stone-100'
            : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
        "
        @click="mode = 'raw'"
      >
        <i class="fas fa-magic mr-2"></i>
        直接粘贴
      </button>

      <button
        type="button"
        class="flex-1 rounded-xl py-3 text-base font-bold transition-all"
        :class="
          mode === 'structured'
            ? 'bg-white text-stone-800 shadow-sm dark:bg-stone-700 dark:text-stone-100'
            : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
        "
        @click="mode = 'structured'"
      >
        <i class="fas fa-list-ul mr-2"></i>
        手动录入
      </button>
    </div>

    <!-- 2. 模式 A: Raw 文本输入 -->
    <div v-show="mode === 'raw'" class="relative w-full">
      <textarea
        v-model="rawText"
        class="min-h-[240px] w-full appearance-none rounded-2xl bg-stone-100 p-5 font-mono text-base text-stone-700 shadow-sm transition-all outline-none placeholder:text-stone-400 focus:bg-white focus:ring-4 focus:ring-[#5C7F67]/20 dark:bg-stone-800 dark:text-stone-200 dark:focus:bg-stone-800 dark:focus:ring-[#5C7F67]/30"
        placeholder="请直接粘贴歌曲信息，希望展示的信息完整即可，届时AI会处理内容。&#10;例如：&#10;1. 歌名 - 歌手 (https://example.com/1.mp3)&#10;2. 歌名 https://example.com/2.mp3"
      ></textarea>

      <div class="pointer-events-none absolute right-5 bottom-5 text-sm text-stone-400">纯文本模式</div>
    </div>

    <!-- 3. 模式 B: 结构化表单 -->
    <div v-show="mode === 'structured'" class="w-full space-y-6">
      <!-- 空状态 -->
      <div
        v-if="structuredList.length === 0"
        class="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-200 py-12 text-center dark:border-stone-700"
      >
        <p class="mb-4 text-lg font-medium text-stone-500 dark:text-stone-400">暂无歌曲</p>
        <button
          type="button"
          class="rounded-full bg-stone-100 px-8 py-3 text-base font-bold text-stone-600 transition-all hover:-translate-y-0.5 hover:bg-[#5C7F67] hover:text-white hover:shadow-lg dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-[#5C7F67]"
          @click="addTrack"
        >
          <i class="fas fa-plus mr-2"></i>
          添加第一首歌
        </button>
      </div>

      <!-- 列表 -->
      <div v-else class="space-y-6">
        <TransitionGroup name="list">
          <div
            v-for="(track, index) in structuredList"
            :key="track.id"
            class="group relative w-full rounded-3xl bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all dark:bg-stone-800"
          >
            <!-- 序号 -->
            <div
              class="absolute -top-3 -left-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-base font-bold text-stone-400 shadow-sm ring-4 ring-[#FDFCF8] dark:bg-stone-700 dark:text-stone-500 dark:ring-[#1c1917]"
            >
              {{ index + 1 }}
            </div>

            <!-- 删除按钮 -->
            <button
              type="button"
              class="absolute top-4 right-4 rounded-full p-2 text-stone-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20"
              @click="removeTrack(index)"
            >
              <i class="fas fa-trash-alt text-lg"></i>
            </button>

            <div class="grid gap-6 pt-2">
              <!-- URL -->
              <div>
                <label class="mb-2 block text-sm font-bold text-stone-600 dark:text-stone-300">
                  音频直链 <span class="text-rose-400">*</span>
                </label>
                <input
                  v-model="track.url"
                  type="text"
                  class="w-full appearance-none rounded-2xl bg-stone-50 px-5 py-4 text-base text-stone-800 transition-all outline-none placeholder:text-stone-400 focus:bg-white focus:ring-4 focus:ring-[#5C7F67]/20 dark:bg-stone-900 dark:text-stone-200 dark:focus:ring-[#5C7F67]/30"
                  placeholder="https://..."
                />
              </div>

              <!-- Title & Artist -->
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label class="mb-2 block text-sm font-bold text-stone-600 dark:text-stone-300">歌名</label>
                  <input
                    v-model="track.title"
                    type="text"
                    class="w-full appearance-none rounded-2xl bg-stone-50 px-5 py-4 text-base text-stone-800 transition-all outline-none placeholder:text-stone-400 focus:bg-white focus:ring-4 focus:ring-[#5C7F67]/20 dark:bg-stone-900 dark:text-stone-200 dark:focus:ring-[#5C7F67]/30"
                    placeholder="选填"
                  />
                </div>
                <div>
                  <label class="mb-2 block text-sm font-bold text-stone-600 dark:text-stone-300">歌手</label>
                  <input
                    v-model="track.artist"
                    type="text"
                    class="w-full appearance-none rounded-2xl bg-stone-50 px-5 py-4 text-base text-stone-800 transition-all outline-none placeholder:text-stone-400 focus:bg-white focus:ring-4 focus:ring-[#5C7F67]/20 dark:bg-stone-900 dark:text-stone-200 dark:focus:ring-[#5C7F67]/30"
                    placeholder="选填"
                  />
                </div>
              </div>

              <!-- Cover -->
              <div>
                <label class="mb-2 block text-sm font-bold text-stone-600 dark:text-stone-300">封面图片链接</label>
                <input
                  v-model="track.cover"
                  type="text"
                  class="w-full appearance-none rounded-2xl bg-stone-50 px-5 py-4 text-base text-stone-800 transition-all outline-none placeholder:text-stone-400 focus:bg-white focus:ring-4 focus:ring-[#5C7F67]/20 dark:bg-stone-900 dark:text-stone-200 dark:focus:ring-[#5C7F67]/30"
                  placeholder="https://... (选填)"
                />
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- 继续添加按钮 -->
        <button
          type="button"
          class="flex w-full items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-stone-200 py-5 text-base font-bold text-stone-400 transition-all hover:border-[#5C7F67]/50 hover:bg-[#5C7F67]/5 hover:text-[#5C7F67] dark:border-stone-700 dark:hover:border-[#5C7F67] dark:hover:bg-[#5C7F67]/10 dark:hover:text-[#5C7F67]"
          @click="addTrack"
        >
          <i class="fas fa-plus"></i>
          继续添加
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { StructuredTrack, TrackInputMode } from '../types';
import { generateUUID } from '../utils/id-generator';

const mode = defineModel<TrackInputMode>('mode', { required: true });
const rawText = defineModel<string>('raw', { required: true });
const structuredList = defineModel<StructuredTrack[]>('structured', { required: true });

const addTrack = () => {
  structuredList.value.push({
    id: generateUUID(),
    url: '',
    title: '',
    artist: '',
    cover: '',
  });
};

const removeTrack = (index: number) => {
  structuredList.value.splice(index, 1);
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
