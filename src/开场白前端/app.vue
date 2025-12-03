<template>
  <div
    class="flex min-h-[600px] w-full flex-col bg-[#FDFCF8] font-sans text-stone-600 transition-colors duration-500 dark:bg-[#1c1917] dark:text-stone-300"
  >
    <!-- 页面转场容器 -->
    <Transition name="page" mode="out-in">
      <!-- View 1: 首页 -->
      <Home v-if="state.currentView === 'home'" key="home" @start="navigate('setup')" @skin="navigate('skin')" />

      <!-- View 2: 模式选择 -->
      <Setup
        v-else-if="state.currentView === 'setup'"
        key="setup"
        @back="navigate('home')"
        @select="handleSetupComplete"
      />

      <!-- View 3: 仪表盘 (管理中心) -->
      <Dashboard
        v-else-if="state.currentView === 'dashboard'"
        key="dashboard"
        :state="state"
        @navigate="navigate"
        @create="createPlaylist"
        @edit="enterEditor"
        @delete="deletePlaylist"
        @update:default-playlist="updateDefaultPlaylist"
      />

      <!-- View 4: 编辑器 -->
      <PlaylistEditor
        v-else-if="state.currentView === 'editor'"
        key="editor"
        v-model="activePlaylist"
        :target-type="state.targetType"
        :errors="{}"
        @back="navigate('dashboard')"
      />
      <!-- View 5: 皮肤设置 -->
      <SkinSetup
        v-else-if="state.currentView === 'skin'"
        key="skin"
        v-model:skin-config="state.skinConfig"
        @back="navigate('home')"
      />
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, nextTick } from 'vue';
import { Playlist, ProjectState, TargetType, ViewName } from './types';
import { generateUUID } from './utils/id-generator';

import PlaylistEditor from './components/PlaylistEditor.vue';
import Dashboard from './views/Dashboard.vue';
import Home from './views/Home.vue';
import Setup from './views/Setup.vue';
import SkinSetup from './views/SkinSetup.vue';

// --- 全局状态初始化 ---
const state = reactive<ProjectState>({
  currentView: 'home',
  activePlaylistUuid: null,
  targetType: 'mvu',
  defaultPlaylistId: null,
  playlists: [],
  // [新增] 皮肤配置初始化
  skinConfig: {
    excludedComponents: [],
    metaphor: {
      visualRef: '',
      entity: '',
      texture: '',
      dynamics: '',
    },
    styleKeywords: [],
    freeformRequirements: '',
  },
});

// --- Computed ---
const activePlaylist = computed({
  get: () => state.playlists.find(p => p._uuid === state.activePlaylistUuid) as Playlist,
  set: newVal => {
    if (!newVal) return;
    const idx = state.playlists.findIndex(p => p._uuid === newVal._uuid);
    if (idx !== -1) state.playlists[idx] = newVal;
  },
});

// --- Actions ---
const navigate = async (view: ViewName) => {
  // 1. 切换视图
  state.currentView = view;
  if (view !== 'editor') state.activePlaylistUuid = null;

  // 2. 滚动条复位
  // 使用 nextTick 确保 DOM 已经切换为新页面后再执行滚动
  await nextTick();
  // 强制瞬间回顶，移除 smooth 以避免长短页面切换时的视觉残留
  window.scrollTo(0, 0);
};

const handleSetupComplete = (type: TargetType) => {
  state.targetType = type;
  // 移除自动创建逻辑，允许空列表
  navigate('dashboard');
};

const enterEditor = (uuid: string) => {
  state.activePlaylistUuid = uuid;
  navigate('editor');
};

const createPlaylist = () => {
  const newPlaylist: Playlist = {
    _uuid: generateUUID(),
    id: '',
    onFinishRule: 'loop',
    trackInputMode: 'raw',
    tracksRaw: '',
    tracksStructured: [],
    mvuConfig: { type: 'base', priority: 10, initVarRaw: '', conditions: [] },
    textConfig: { sceneDescription: '', priority: 10 },
  };
  state.playlists.push(newPlaylist);
};

const deletePlaylist = (uuid: string) => {
  const idx = state.playlists.findIndex(p => p._uuid === uuid);
  if (idx !== -1) {
    if (state.playlists[idx].id === state.defaultPlaylistId) state.defaultPlaylistId = null;
    state.playlists.splice(idx, 1);
  }
};

const updateDefaultPlaylist = (id: string | null) => {
  state.defaultPlaylistId = id;
};
</script>

<style>
/* 页面转场动画：淡入上浮 */
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1),
    transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(15px) scale(0.98);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.98);
}
</style>
