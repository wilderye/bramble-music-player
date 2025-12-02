<template>
  <div class="flex h-full w-full flex-col bg-[#FDFCF8] p-6 pb-20 dark:bg-[#1c1917]">
    <!-- 1. 顶部导航 -->
    <header class="flex w-full items-center justify-between py-4">
      <!-- 左侧：返回首页 -->
      <button
        type="button"
        class="group flex items-center rounded-full px-4 py-2 text-sm font-bold text-stone-500 transition-all hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-200"
        @click="$emit('navigate', 'home')"
      >
        <div
          class="mr-2 flex h-6 w-6 items-center justify-center rounded-full bg-stone-200 transition-colors group-hover:bg-stone-300 dark:bg-stone-700 dark:group-hover:bg-stone-600"
        >
          <i class="fas fa-chevron-left text-[10px]"></i>
        </div>
        返回首页
      </button>

      <!-- 右侧：模式切换 -->
      <div class="flex items-center gap-4">
        <!-- 当前模式指示 -->
        <div class="hidden flex-col text-right sm:flex">
          <span class="text-xs font-bold tracking-wider text-stone-400 uppercase">Current Mode</span>
          <span class="text-sm font-bold text-[#5C7F67] dark:text-[#5C7F67]">
            {{ isMvu ? 'MVU 变量卡' : '纯文字 / 传统卡' }}
          </span>
        </div>

        <button
          type="button"
          class="flex items-center rounded-full bg-white px-4 py-2 text-sm font-bold text-stone-600 shadow-sm transition-all hover:bg-stone-50 hover:text-stone-900 active:scale-95 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
          @click="handleSwitchMode"
        >
          <i class="fas fa-exchange-alt mr-2 text-xs"></i>
          切换模式
        </button>
      </div>
    </header>

    <!-- 2. 主内容区 (转场容器) -->
    <main class="flex w-full flex-1 flex-col">
      <div class="mx-auto flex w-full max-w-3xl flex-1 flex-col">
        <Transition name="fade-slide" mode="out-in">
          <!-- A. 空状态 (垂直居中) -->
          <div
            v-if="state.playlists.length === 0"
            key="empty"
            class="flex flex-1 flex-col items-center justify-center py-20"
          >
            <div
              class="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#5C7F67]/10 text-4xl text-[#5C7F67] dark:bg-[#5C7F67]/20"
            >
              <i class="fas fa-music"></i>
            </div>
            <p class="mb-8 text-lg font-medium text-stone-500 dark:text-stone-400">这里还很安静，开始添加乐章吧</p>
            <button
              type="button"
              class="flex items-center justify-center rounded-full bg-[#5C7F67] px-8 py-4 text-base font-bold text-white shadow-[0_10px_30px_-10px_rgba(92,127,103,0.4)] transition-all hover:-translate-y-1 hover:bg-[#4A6852] hover:shadow-[0_20px_40px_-10px_rgba(92,127,103,0.5)] active:translate-y-0 active:scale-95"
              @click="$emit('create')"
            >
              <i class="fas fa-plus mr-2"></i>
              新建第一个歌单
            </button>
          </div>

          <!-- B. 列表状态 (包含底部配置) -->
          <div v-else key="list" class="flex flex-col">
            <!-- 标题 -->
            <h2 class="mb-6 ml-2 text-2xl font-bold text-stone-700 dark:text-stone-200">
              歌单列表
              <span class="ml-2 text-base font-normal text-stone-400">({{ state.playlists.length }})</span>
            </h2>

            <!-- 歌单列表 -->
            <div class="space-y-4">
              <TransitionGroup name="list">
                <div
                  v-for="playlist in state.playlists"
                  :key="playlist._uuid"
                  class="group relative flex w-full cursor-pointer items-center justify-between rounded-3xl bg-white p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all dark:hover:bg-stone-750 hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] dark:bg-stone-800 dark:shadow-none"
                  @click="$emit('edit', playlist._uuid)"
                >
                  <!-- 左侧信息 -->
                  <div class="flex items-center gap-5">
                    <div
                      class="flex h-12 w-12 items-center justify-center rounded-full transition-colors"
                      :class="getIconContainerClass(playlist)"
                    >
                      <i :class="['fas', getIconClass(playlist)]"></i>
                    </div>

                    <div class="flex flex-col">
                      <span class="text-lg font-bold text-stone-700 dark:text-stone-200">
                        {{ playlist.id || '未命名歌单' }}
                      </span>
                      <span class="text-sm text-stone-400">
                        {{ getPlaylistTypeLabel(playlist) }}
                      </span>
                    </div>
                  </div>

                  <!-- 右侧删除 -->
                  <button
                    type="button"
                    class="rounded-full p-3 text-stone-300 opacity-0 transition-all group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20"
                    @click.stop="$emit('delete', playlist._uuid)"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>

                <!-- 列表末尾的新建按钮 -->
                <button
                  key="create-btn"
                  type="button"
                  class="flex w-full items-center justify-center rounded-3xl border-2 border-dashed border-stone-200 bg-transparent py-4 text-base font-bold text-stone-400 transition-all hover:border-[#5C7F67]/50 hover:bg-[#5C7F67]/5 hover:text-[#5C7F67] dark:border-stone-700 dark:hover:border-[#5C7F67] dark:hover:bg-[#5C7F67]/10 dark:hover:text-[#5C7F67]"
                  @click="$emit('create')"
                >
                  <i class="fas fa-plus mr-2"></i>
                  新建歌单
                </button>
              </TransitionGroup>
            </div>

            <!-- C. 全局配置与生成 -->
            <div class="mt-32 flex flex-col items-center">
              <!-- 全局配置卡片 -->
              <div
                class="mb-8 w-full rounded-3xl bg-white p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:bg-stone-800/50"
              >
                <div class="mb-4 flex items-center gap-2">
                  <label class="text-lg font-bold text-stone-700 dark:text-stone-200">
                    默认背景音乐 (Default Playlist)
                  </label>
                  <button
                    type="button"
                    class="text-stone-400 transition-colors hover:text-[#5C7F67]"
                    @click="showHelpModal = true"
                  >
                    <i class="fas fa-question-circle text-lg"></i>
                  </button>
                </div>

                <div class="relative w-full max-w-md">
                  <select
                    :value="state.defaultPlaylistId || ''"
                    class="w-full appearance-none rounded-2xl bg-stone-50 px-5 py-4 text-base text-stone-700 ring-1 ring-stone-200 transition-all outline-none focus:bg-white focus:ring-2 focus:ring-[#5C7F67]/30 dark:bg-stone-800 dark:text-stone-200 dark:ring-stone-700"
                    @change="onDefaultPlaylistChange"
                  >
                    <option value="">(无)</option>
                    <option v-for="p in state.playlists" :key="p._uuid" :value="p.id">
                      {{ p.id || '未命名歌单' }}
                    </option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-5 text-stone-400">
                    <i class="fas fa-chevron-down text-xs"></i>
                  </div>
                </div>
                <p class="mt-3 text-sm text-stone-500">基础歌单才可以作为默认歌单。</p>
              </div>

              <!-- 生成按钮 (点击后弹出确认框) -->
              <button
                type="button"
                class="w-fit rounded-full bg-[#5C7F67] px-16 py-4 text-xl font-bold text-white shadow-[0_10px_30px_-5px_rgba(92,127,103,0.4)] transition-all hover:-translate-y-1 hover:bg-[#4A6852] hover:shadow-[0_20px_40px_-5px_rgba(92,127,103,0.5)] active:translate-y-0 active:scale-95"
                @click="handleGenerateCheck"
              >
                生成并发送给 AI
                <i class="fas fa-paper-plane ml-3"></i>
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </main>

    <!-- 3. 帮助模态窗 (Help Modal) -->
    <Transition name="fade">
      <div
        v-if="showHelpModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 p-6 backdrop-blur-sm"
        @click.self="showHelpModal = false"
      >
        <div class="w-full max-w-md scale-100 rounded-3xl bg-white p-8 shadow-2xl transition-all dark:bg-stone-800">
          <h3 class="mb-4 text-xl font-bold text-stone-800 dark:text-stone-100">关于默认背景音乐</h3>
          <p class="mb-8 text-base leading-relaxed text-stone-600 dark:text-stone-300">
            快速给所有开场白指定默认基础歌单，可在特定开场白使用&lt;playlist:...&gt;标签使用特定歌单取代默认歌单。
          </p>
          <div class="flex justify-end">
            <button
              type="button"
              class="rounded-full bg-[#5C7F67]/10 px-6 py-2 text-sm font-bold text-[#5C7F67] hover:bg-[#5C7F67]/20 dark:bg-[#5C7F67]/20 dark:text-[#5C7F67]"
              @click="showHelpModal = false"
            >
              我知道了
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 4. 发送确认模态窗 (Confirmation Modal) -->
    <Transition name="fade">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 z-[60] flex items-center justify-center bg-stone-900/30 p-6 backdrop-blur-sm"
        @click.self="showConfirmModal = false"
      >
        <div
          class="relative w-full max-w-md scale-100 rounded-3xl bg-white p-8 shadow-2xl transition-all dark:bg-stone-800"
        >
          <!-- 关闭按钮 (右上角小 X) -->
          <button
            type="button"
            class="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
            @click="showConfirmModal = false"
          >
            <i class="fas fa-times"></i>
          </button>

          <!-- 内容 -->
          <div class="flex flex-col items-center text-center">
            <!-- 问号图标 -->
            <div
              class="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#5C7F67]/10 text-2xl text-[#5C7F67]"
            >
              <i class="fas fa-paper-plane"></i>
            </div>

            <h3 class="mb-4 text-xl font-bold text-stone-800 dark:text-stone-100">是否发送？</h3>

            <!-- 提示文本 (主要内容) -->
            <p class="mb-8 text-base leading-relaxed text-stone-600 dark:text-stone-300">
              💡 建议使用
              <span class="font-bold text-[#5C7F67]">Default</span> 预设，并关掉不相关的世界书，否则可能挤占 AI
              注意力导致生成配置出错哦。
            </p>

            <!-- 按钮组 -->
            <div class="flex w-full gap-4">
              <!-- 取消按钮 -->
              <button
                type="button"
                class="flex-1 rounded-full bg-stone-100 py-3 text-sm font-bold text-stone-600 transition-colors hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-300 dark:hover:bg-stone-600"
                @click="showConfirmModal = false"
              >
                取消
              </button>

              <!-- 确认按钮 -->
              <button
                type="button"
                class="flex-1 rounded-full bg-[#5C7F67] py-3 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-[#4A6852] active:scale-95"
                @click="confirmSend"
              >
                确认发送
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Playlist, ProjectState, ViewName } from '../types';
import { generatePrompt } from '../utils/prompt-generator';
import { validateGlobalState } from '../utils/validator';

// --- 类型声明 ---
declare const toastr: any;
declare function triggerSlash(content: string): void;

const props = defineProps<{
  state: ProjectState;
}>();

const emit = defineEmits<{
  (e: 'navigate', view: ViewName): void;
  (e: 'create'): void;
  (e: 'edit', uuid: string): void;
  (e: 'delete', uuid: string): void;
  (e: 'update:default-playlist', id: string | null): void;
}>();

// --- Local State ---
const showHelpModal = ref(false);
const showConfirmModal = ref(false); // 重命名为 ConfirmModal

// --- Computed ---
const isMvu = computed(() => props.state.targetType === 'mvu');

// --- Helpers ---
const getIconContainerClass = (playlist: Playlist) => {
  if (playlist.id === props.state.defaultPlaylistId) {
    return 'bg-[#5C7F67]/10 text-[#5C7F67] dark:bg-[#5C7F67]/20';
  }
  return 'bg-stone-100 text-stone-400 dark:bg-stone-700 dark:text-stone-500';
};

const getIconClass = (playlist: Playlist) => {
  if (playlist.id === props.state.defaultPlaylistId) return 'fa-home';
  if (isMvu.value && playlist.mvuConfig.type === 'scene') return 'fa-bolt';
  return 'fa-music';
};

const getPlaylistTypeLabel = (playlist: Playlist) => {
  // 无论何种模式，都读取真实的类型字段
  return playlist.mvuConfig.type === 'base' ? '基础歌单' : '场景歌单';
};

// --- Handlers ---
const onDefaultPlaylistChange = (event: Event) => {
  const val = (event.target as HTMLSelectElement).value;
  emit('update:default-playlist', val || null);
};

const handleSwitchMode = () => {
  if (confirm('切换模式将清空所有‘场景歌单’的触发条件配置（歌曲列表会保留）。是否继续？')) {
    emit('navigate', 'setup');
  }
};

/**
 * 步骤 1: 校验并弹出确认框
 * 替代之前的 handleGenerate
 */
const handleGenerateCheck = () => {
  const result = validateGlobalState(props.state.playlists, props.state.targetType, props.state.defaultPlaylistId);

  if (!result.passed) {
    const errorMsg = `配置检查未通过：\n\n${result.messages.join('\n')}`;
    if (typeof toastr !== 'undefined') toastr.error('配置存在问题', '发送中断');
    alert(errorMsg);
    return;
  }

  // 校验通过，打开确认弹窗
  showConfirmModal.value = true;
};

/**
 * 步骤 2: 确认发送
 * 在 Modal 点击“确认”后触发
 */
const confirmSend = () => {
  const promptText = generatePrompt(props.state);

  try {
    const command = `/send ${promptText} | /trigger`;
    if (typeof triggerSlash === 'function') {
      triggerSlash(command);

      // 成功提示 (合并了之前的 Wait 文本)
      if (typeof toastr !== 'undefined') {
        toastr.success(
          `已将 ${props.state.playlists.length} 个歌单配置发送给 AI。请等待 AI 回复和指导后续操作。`,
          '发送成功',
          { timeOut: 4000 }, // 停留 4s
        );
      }
    } else {
      console.error('triggerSlash not found');
      alert('环境错误：无法调用 triggerSlash。');
    }
  } catch (e) {
    console.error(e);
    alert('发送指令时发生意外错误。');
  } finally {
    // 无论成功失败，都关闭弹窗
    showConfirmModal.value = false;
  }
};
</script>

<style scoped>
/* 页面视图切换 */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* 列表项增删动画 */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Modal Fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
