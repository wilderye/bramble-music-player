<template>
  <div class="flex h-full w-full flex-col bg-[#FDFCF8] px-6 pb-32 dark:bg-[#1c1917]">
    <!-- 1. 顶部导航 -->
    <header class="flex w-full items-center py-6">
      <button
        type="button"
        class="group flex items-center text-lg font-bold text-stone-500 transition-colors hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200"
        @click="$emit('back')"
      >
        <div
          class="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 transition-colors group-hover:bg-stone-200 dark:bg-stone-800 dark:group-hover:bg-stone-700"
        >
          <i class="fas fa-arrow-left text-sm"></i>
        </div>
        <span>保存并返回</span>
      </button>
    </header>

    <!-- 2. 主表单流 -->
    <main class="mx-auto w-full max-w-2xl space-y-12">
      <!-- 标题区 -->
      <h1 class="text-3xl font-bold text-stone-800 dark:text-stone-100">
        {{ playlist.id || '编辑歌单' }}
      </h1>

      <!-- Field 1: ID -->
      <div>
        <label class="mb-3 block text-lg font-bold text-stone-700 dark:text-stone-200">
          歌单 ID <span class="text-rose-400">*</span>
        </label>
        <input
          v-model="playlist.id"
          type="text"
          class="w-full appearance-none rounded-2xl bg-stone-100 px-5 py-4 text-lg text-stone-800 transition-all outline-none placeholder:text-stone-400 focus:bg-white focus:ring-4 focus:ring-[#5C7F67]/20 dark:bg-stone-800 dark:text-stone-200 dark:focus:bg-stone-800 dark:focus:ring-[#5C7F67]/30"
          placeholder="例如: battle_theme"
        />
        <p class="mt-2 text-base text-stone-400">唯一标识符，不可重复。</p>
      </div>

      <!-- Field 2: 歌单类型 -->
      <div>
        <label class="mb-3 block text-lg font-bold text-stone-700 dark:text-stone-200"> 歌单类型 </label>
        <div class="flex w-full rounded-2xl bg-stone-100 p-1.5 dark:bg-stone-800">
          <button
            type="button"
            class="flex-1 rounded-xl py-3 text-base font-bold transition-all"
            :class="
              currentType === 'base'
                ? 'bg-white text-stone-800 shadow-sm dark:bg-stone-700 dark:text-stone-100'
                : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
            "
            @click="setPlaylistType('base')"
          >
            基础歌单
          </button>
          <button
            type="button"
            class="flex-1 rounded-xl py-3 text-base font-bold transition-all"
            :class="
              currentType === 'scene'
                ? 'bg-white text-stone-800 shadow-sm dark:bg-stone-700 dark:text-stone-100'
                : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
            "
            @click="setPlaylistType('scene')"
          >
            场景歌单
          </button>
        </div>
        <p class="mt-3 text-base text-stone-500">
          {{
            currentType === 'base'
              ? '从开场白开始无条件播放的歌单，可作为默认背景音乐。'
              : '根据特定条件触发的歌单（如下雨、战斗、进入特定地点）。'
          }}
        </p>
      </div>

      <!-- Field 3: 播放模式 -->
      <div>
        <label class="mb-3 block text-lg font-bold text-stone-700 dark:text-stone-200"> 播放模式 </label>
        <div class="flex w-full max-w-md rounded-2xl bg-stone-100 p-1.5 dark:bg-stone-800">
          <button
            type="button"
            class="flex-1 rounded-xl py-3 text-base font-bold transition-all"
            :class="
              playlist.onFinishRule === 'loop'
                ? 'bg-white text-stone-800 shadow-sm dark:bg-stone-700 dark:text-stone-100'
                : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
            "
            @click="playlist.onFinishRule = 'loop'"
          >
            Loop (循环)
          </button>
          <button
            type="button"
            class="flex-1 rounded-xl py-3 text-base font-bold transition-all"
            :class="
              playlist.onFinishRule === 'pop'
                ? 'bg-white text-stone-800 shadow-sm dark:bg-stone-700 dark:text-stone-100'
                : 'text-stone-500 hover:text-stone-700 dark:text-stone-400'
            "
            @click="playlist.onFinishRule = 'pop'"
          >
            Pop (播完即焚)
          </button>
</div>

        <!-- [新增] 解释说明文本 -->
        <!-- whitespace-pre-line 用于识别文案中的换行符 \n -->
        <p class="mt-3 text-base whitespace-pre-line text-stone-500">
          {{ finishRuleDescription }}
        </p>
      </div>

      <!-- Field 4: 歌曲列表 -->
      <div>
        <label class="mb-3 block text-lg font-bold text-stone-700 dark:text-stone-200"> 歌曲列表 </label>
        <TrackInput
          v-model:mode="playlist.trackInputMode"
          v-model:raw="playlist.tracksRaw"
          v-model:structured="playlist.tracksStructured"
        />
      </div>

      <!-- Field 5: 场景触发配置 (仅 Scene 显示) -->
      <Transition name="slide-down">
        <div v-if="currentType === 'scene'" class="overflow-hidden">
          <!-- 容器：淡雅外框 (Bg Stone 50 + Border Stone 200) -->
          <div
            class="rounded-3xl border border-stone-200 bg-stone-50/50 p-6 dark:border-stone-700 dark:bg-stone-800/30"
          >
            <h3 class="mb-6 flex items-center text-xl font-bold text-[#5C7F67] dark:text-[#5C7F67]">
              <i class="fas fa-bolt mr-2"></i>
              触发配置
            </h3>

            <!-- A. MVU 模式 -->
            <div v-if="targetType === 'mvu'" class="space-y-8">
              <!-- 优先级 -->
              <div>
                <label class="mb-3 block text-base font-bold text-stone-700 dark:text-stone-300">
                  优先级 (Priority)
                </label>
                <div class="flex items-center gap-4">
                  <input
                    v-model.number="playlist.mvuConfig.priority"
                    type="number"
                    class="w-28 appearance-none rounded-2xl bg-white px-4 py-3 text-center text-lg font-bold text-stone-800 shadow-sm transition-all outline-none focus:ring-2 focus:ring-[#5C7F67]/30 dark:bg-stone-900 dark:text-stone-100"
                  />
                  <span class="text-base text-stone-500"
                    >场景歌单的优先级。多个场景歌单满足条件时，播放优先级最高的歌曲。数字越大，优先级越高。</span
                  >
                </div>
              </div>

              <!-- 触发条件列表 -->
              <div>
                <div class="mb-4 flex items-center justify-between">
                  <label class="text-base font-bold text-stone-700 dark:text-stone-300"> 条件列表 (AND) </label>
                  <button
                    type="button"
                    class="rounded-lg px-3 py-1 text-sm font-bold text-[#5C7F67] hover:bg-[#5C7F67]/10 dark:hover:bg-[#5C7F67]/20"
                    @click="addMvuCondition"
                  >
                    + 添加条件
                  </button>
                </div>

                <div class="space-y-3">
                  <div
                    v-for="(cond, idx) in playlist.mvuConfig.conditions"
                    :key="cond.id"
                    class="flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm transition-all hover:shadow-md dark:bg-stone-900"
                  >
                    <!-- 变量路径 -->
                    <input
                      v-model="cond.path"
                      type="text"
                      placeholder="变量路径"
                      class="min-w-[140px] flex-1 appearance-none rounded-xl bg-stone-50 px-4 py-3 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-[#5C7F67]/30 dark:bg-stone-800 dark:text-stone-200"
                    />

                    <!-- 操作符 (带自定义下拉图标) -->
                    <div class="relative">
                      <select
                        v-model="cond.operator"
                        class="appearance-none rounded-xl bg-stone-50 py-3 pr-10 pl-4 text-base font-medium text-stone-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#5C7F67]/30 dark:bg-stone-800 dark:text-stone-200"
                      >
                        <option>等于</option>
                        <option>大于</option>
                        <option>大于等于</option>
                        <option>小于</option>
                        <option>小于等于</option>
                        <option>它的文字包含</option>
                        <option>时间范围是</option>
                      </select>
                      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-400">
                        <i class="fas fa-chevron-down text-xs"></i>
                      </div>
                    </div>

                    <!-- 值 -->
                    <input
                      v-model="cond.value"
                      type="text"
                      placeholder="值"
                      class="min-w-[100px] flex-1 appearance-none rounded-xl bg-stone-50 px-4 py-3 text-base text-stone-800 outline-none placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-[#5C7F67]/30 dark:bg-stone-800 dark:text-stone-200"
                    />

                    <!-- 删除 -->
                    <button
                      type="button"
                      class="px-3 text-stone-300 transition-colors hover:text-rose-400"
                      @click="removeMvuCondition(idx)"
                    >
                      <i class="fas fa-times text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>

              <!-- InitVar (参考) -->
              <div>
                <label class="mb-3 block text-base font-bold text-stone-700 dark:text-stone-300">
                  InitVar 参考 (选填)
                </label>
                <textarea
                  v-model="playlist.mvuConfig.initVarRaw"
                  rows="3"
                  class="w-full appearance-none rounded-2xl bg-white px-5 py-4 text-base text-stone-600 shadow-sm transition-all outline-none placeholder:text-stone-300 focus:ring-2 focus:ring-[#5C7F67]/30 dark:bg-stone-900 dark:text-stone-300"
                  placeholder="在此粘贴 InitVar 内容，帮助 AI 理解变量结构..."
                ></textarea>
              </div>
            </div>

            <!-- B. Text 模式 -->
            <div v-else class="space-y-4">
              <div>
                <label class="mb-3 block text-xl font-bold text-stone-700 dark:text-stone-200">
                  场景歌单播放条件 <span class="text-rose-400">*</span>
                </label>
                <textarea
                  v-model="playlist.textConfig.sceneDescription"
                  rows="4"
                  class="w-full appearance-none rounded-2xl bg-white px-5 py-4 text-lg text-stone-700 shadow-sm transition-all outline-none placeholder:text-stone-300 focus:ring-2 focus:ring-[#5C7F67]/30 dark:bg-stone-900 dark:text-stone-200"
                  placeholder="例如：<user>进入/位于家中时。条件最好清晰、明确，不和其他歌单重叠。"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <!-- 底部保存按钮 -->
      <div class="mt-12 flex justify-center pb-8">
        <button
          type="button"
          class="flex items-center rounded-full bg-[#6B8E78] px-10 py-3 text-lg font-bold text-white shadow-md transition-all hover:-translate-y-1 hover:bg-[#5C7F67] hover:shadow-lg active:translate-y-0 active:scale-95"
          @click="$emit('back')"
        >
          <i class="fas fa-check mr-3"></i>
          保存
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { MvuPlaylistType, Playlist, TargetType } from '../types';
import { generateUUID } from '../utils/id-generator';
import TrackInput from './TrackInput.vue';

const playlist = defineModel<Playlist>({ required: true });

defineProps<{
  targetType: TargetType;
  errors: Record<string, string>;
}>();

defineEmits<{
  (e: 'back'): void;
}>();

// --- Computed ---
const currentType = computed(() => playlist.value.mvuConfig.type);

// [新增] 动态计算播放模式的解释文案
const finishRuleDescription = computed(() => {
  const isBase = currentType.value === 'base';
  const isLoop = playlist.value.onFinishRule === 'loop';

  if (isBase) {
    if (isLoop) return '只要没有满足条件的场景歌单，则循环播放基础歌单。';
    return '只要没有满足条件的场景歌单，则播放基础歌单，播完歌单后停止播放。';
  } else {
    // 场景歌单 (Scene)
    if (isLoop) {
      return '当场景歌单满足条件时，循环播放，直到不再满足。\n此时如有未播完或loop模式的基础歌单，则播放基础歌单。';
    }
    return '当场景歌单满足条件时播放，直到播完一次或不再满足条件。\n此时如有未播完或loop模式的基础歌单，则播放基础歌单。';
  }
});

// --- Methods ---
const setPlaylistType = (type: MvuPlaylistType) => {
  playlist.value.mvuConfig.type = type;
};

const addMvuCondition = () => {
  playlist.value.mvuConfig.conditions.push({
    id: generateUUID(),
    path: '',
    operator: '等于',
    value: '',
  });
};

const removeMvuCondition = (index: number) => {
  playlist.value.mvuConfig.conditions.splice(index, 1);
};

// --- Watchers ---
// 当切换到 'scene' 且没有条件时，自动添加一条空条件
watch(
  () => playlist.value.mvuConfig.type,
  newType => {
    if (newType === 'scene' && playlist.value.mvuConfig.conditions.length === 0) {
      addMvuCondition();
    }
  },
);
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  max-height: 800px;
  opacity: 1;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  margin-top: 0;
  transform: translateY(-10px);
}
</style>
