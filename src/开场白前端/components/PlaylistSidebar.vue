<template>
  <div class="flex h-full flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
    <!-- 1. 顶部标题 -->
    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-4 dark:border-gray-800">
      <h2 class="text-sm font-bold text-gray-700 dark:text-gray-200">
        歌单列表
        <span class="ml-1 text-xs font-normal text-gray-400">({{ playlists.length }})</span>
      </h2>
    </div>

    <!-- 2. 滚动列表区 -->
    <div class="flex-1 space-y-2 overflow-y-auto p-3">
      <div
        v-for="(playlist, index) in playlists"
        :key="playlist._uuid"
        class="group relative flex cursor-pointer items-center justify-between rounded-lg px-3 py-3 transition-colors"
        :class="[
          playlist._uuid === activeUuid
            ? 'bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700'
            : 'hover:bg-gray-200/50 dark:hover:bg-gray-800/50'
        ]"
        @click="$emit('select', playlist._uuid)"
      >
        <!-- 左侧：图标 + 名称 -->
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <!-- 状态图标 -->
          <div
            class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors"
            :class="getIconStyle(playlist)"
          >
            <!-- 逻辑：优先显示默认(家)，其次警告(叹号)，最后普通(音符) -->
            <i
              class="fas text-xs"
              :class="[
                playlist.id === defaultPlaylistId ? 'fa-home' :
                !validationStates[playlist._uuid] ? 'fa-exclamation' :
                'fa-music'
              ]"
            ></i>
          </div>

          <!-- 歌单信息 -->
          <div class="flex min-w-0 flex-col">
            <span
              class="truncate text-sm font-medium transition-colors"
              :class="playlist._uuid === activeUuid ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'"
            >
              {{ playlist.id || '未命名歌单' }}
            </span>
            <span class="truncate text-xs text-gray-400">
              {{ playlist.onFinishRule === 'loop' ? '循环播放' : '播完即焚' }}
            </span>
          </div>
        </div>

        <!-- 右侧：删除按钮 -->
        <!-- 修正说明：将 group-hover:opacity-100 移到了 hover:bg-gray-100 之前 -->
        <button
          v-if="playlists.length > 1"
          type="button"
          class="ml-2 rounded p-1.5 text-gray-400 opacity-0 transition-all group-hover:opacity-100 hover:bg-gray-100 hover:text-red-500 dark:hover:bg-gray-700"
          title="删除歌单"
          @click.stop="$emit('delete', index)"
        >
          <i class="fas fa-trash-alt text-xs"></i>
        </button>
      </div>
    </div>

    <!-- 3. 底部新建按钮 -->
    <div class="border-t border-gray-200 p-4 dark:border-gray-800">
      <button
        type="button"
        class="flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-all hover:bg-gray-50 hover:text-blue-600 hover:ring-blue-300 dark:bg-gray-800 dark:text-gray-200 dark:ring-gray-600 dark:hover:bg-gray-700"
        @click="$emit('create')"
      >
        <i class="fas fa-plus"></i>
        新建歌单
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Playlist } from '../types';

// 定义接口
interface Props {
  playlists: Playlist[];
  activeUuid: string; // 当前选中的 UUID
  defaultPlaylistId: string | null; // 全局默认歌单 ID (用于显示小房子)
  validationStates: Record<string, boolean>; // 校验结果映射表 { uuid: isValid }
}

const props = defineProps<Props>();

// 定义事件
const emit = defineEmits<{
  (e: 'select', uuid: string): void;
  (e: 'create'): void;
  (e: 'delete', index: number): void;
}>();

// --- 辅助逻辑 ---

// 计算图标容器的样式颜色
const getIconStyle = (playlist: Playlist) => {
  // 1. 如果是全局默认歌单 -> 绿色/主要色
  if (playlist.id === props.defaultPlaylistId) {
    return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400';
  }
  // 2. 如果校验未通过 -> 红色警告色
  if (props.validationStates[playlist._uuid] === false) {
    return 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400';
  }
  // 3. 普通状态 -> 灰色
  return 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400';
};
</script>
