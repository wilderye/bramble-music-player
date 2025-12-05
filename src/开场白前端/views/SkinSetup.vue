<template>
  <div class="flex h-full w-full flex-col bg-[#FDFCF8] px-6 pb-32 transition-colors duration-500 dark:bg-[#1c1917]">
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
        <span>返回首页</span>
      </button>
    </header>

    <main class="mx-auto w-full max-w-3xl space-y-16 pt-4">
      <!-- 标题区 (重构：作为主视觉核心) -->
      <div class="text-center">
        <h2 class="text-3xl leading-relaxed font-bold text-stone-700 dark:text-stone-200">
          以下内容均为引导，<br class="hidden sm:block" />
          选填选择有想法的内容即可。
        </h2>
      </div>

      <!-- 板块 1: 组件构成 (重构：Grid布局 + 正向选择逻辑) -->
      <section class="space-y-8">
        <div class="border-b border-stone-200 pb-2 dark:border-stone-800">
          <h3 class="text-xl font-bold text-stone-700 dark:text-stone-200">1. 组件构成</h3>
        </div>

        <!-- Grid 布局 -->
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <button
            v-for="comp in componentOptions"
            :key="comp.id"
            type="button"
            class="group relative flex flex-col items-start justify-center rounded-2xl border px-5 py-4 text-left transition-all duration-200"
            :class="
              !isExcluded(comp.id)
                ? 'border-[#5C7F67]/30 bg-[#5C7F67]/10 shadow-sm dark:border-[#5C7F67]/30 dark:bg-[#5C7F67]/20'
                : 'border-transparent bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700'
            "
            @click="toggleComponent(comp.id)"
          >
            <!-- 主要标签 -->
            <span
              class="text-base font-bold transition-colors"
              :class="
                !isExcluded(comp.id) ? 'text-[#3A5241] dark:text-[#8AB096]' : 'text-stone-400 dark:text-stone-500'
              "
            >
              {{ comp.label }}
            </span>

            <!-- 解释说明 (如果有) -->
            <span
              v-if="comp.desc"
              class="mt-1 text-xs leading-tight font-medium transition-colors"
              :class="
                !isExcluded(comp.id)
                  ? 'text-[#5C7F67] opacity-80 dark:text-[#5C7F67]'
                  : 'text-stone-300 dark:text-stone-600'
              "
            >
              {{ comp.desc }}
            </span>

            <!-- 选中状态指示器 (右上角圆点) -->
            <div
              class="absolute top-3 right-3 h-2 w-2 rounded-full transition-colors"
              :class="!isExcluded(comp.id) ? 'bg-[#5C7F67]' : 'bg-transparent'"
            ></div>
          </button>
        </div>
      </section>

      <!-- 板块 2: 核心隐喻 (重构：增加间距，优化输入框视觉) -->
      <section class="space-y-12">
        <div class="border-b border-stone-200 pb-2 dark:border-stone-800">
          <h3 class="text-xl font-bold text-stone-700 dark:text-stone-200">2. 想法引导</h3>
        </div>

        <!-- 问题 1: 实体 -->
        <div class="space-y-4">
          <label class="block text-lg font-bold text-stone-700 dark:text-stone-200">
            <i class="fas fa-cube mr-2 text-[#5C7F67] opacity-80"></i>
            这个播放器是有实体的吗？如果角色世界中的实体物品，它是什么？
          </label>
          <input
            v-model="skinConfig.metaphor.entity"
            type="text"
            class="w-full border-b border-stone-200 bg-transparent px-2 py-2 text-base text-stone-800 transition-colors placeholder:text-sm placeholder:text-stone-300 focus:border-[#5C7F67] focus:outline-none dark:border-stone-700 dark:text-stone-200 dark:placeholder:text-stone-600"
            placeholder="例如: 90年代随身听 / 时尚杂志 / 羊皮纸卷轴 / 终端机..."
          />
          <p class="text-sm text-stone-400">如果它不是实体，也可以在这里描述它的概念。</p>
        </div>

        <!-- 问题 2: 材质 -->
        <div class="space-y-4">
          <label class="block text-lg font-bold text-stone-700 dark:text-stone-200">
            <i class="fas fa-fingerprint mr-2 text-[#5C7F67] opacity-80"></i>
            如果你能摸到这个界面，它的手感是怎样的？
          </label>
          <input
            v-model="skinConfig.metaphor.texture"
            type="text"
            class="w-full border-b border-stone-200 bg-transparent px-2 py-2 text-base text-stone-800 transition-colors placeholder:text-sm placeholder:text-stone-300 focus:border-[#5C7F67] focus:outline-none dark:border-stone-700 dark:text-stone-200 dark:placeholder:text-stone-600"
            placeholder="例如: 破损屏幕 / 磨砂玻璃 / 牛皮纸 / 拉丝金属..."
          />
        </div>

        <!-- 问题 3: 动态 -->
        <div class="space-y-4">
          <label class="block text-lg font-bold text-stone-700 dark:text-stone-200">
            <i class="fas fa-wind mr-2 text-[#5C7F67] opacity-80"></i>
            这个界面的交互动态是什么样的？
          </label>
          <input
            v-model="skinConfig.metaphor.dynamics"
            type="text"
            class="w-full border-b border-stone-200 bg-transparent px-2 py-2 text-base text-stone-800 transition-colors placeholder:text-sm placeholder:text-stone-300 focus:border-[#5C7F67] focus:outline-none dark:border-stone-700 dark:text-stone-200 dark:placeholder:text-stone-600"
            placeholder="例如: 缓慢优雅 / 故障闪烁 / Q弹果冻..."
          />
        </div>

        <!-- 问题 4: 致敬 -->
        <div class="space-y-4">
          <label class="block text-lg font-bold text-stone-700 dark:text-stone-200">
            <i class="fas fa-eye mr-2 text-[#5C7F67] opacity-80"></i>
            视觉参考 (致敬作品/游戏UI/现实产品)
          </label>
          <input
            v-model="skinConfig.metaphor.visualRef"
            type="text"
            class="w-full border-b border-stone-200 bg-transparent px-2 py-2 text-base text-stone-800 transition-colors placeholder:text-sm placeholder:text-stone-300 focus:border-[#5C7F67] focus:outline-none dark:border-stone-700 dark:text-stone-200 dark:placeholder:text-stone-600"
            placeholder="例如: 《尼尔：自动人形》 / 《女神异闻录》 /Windows 98 / 复古黑胶..."
          />
        </div>
      </section>

      <!-- 板块 3: 视觉基因 (重构：分类显示) -->
      <section class="space-y-8">
        <div class="border-b border-stone-200 pb-2 dark:border-stone-800">
          <h3 class="text-xl font-bold text-stone-700 dark:text-stone-200">3. 视觉基因</h3>
        </div>

        <div class="space-y-6">
          <!-- Group 1: 风格流派 -->
          <div>
            <h4 class="mb-3 text-sm font-bold text-stone-400 dark:text-stone-500">风格流派</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in styleGroups.genre"
                :key="tag"
                type="button"
                class="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200"
                :class="
                  skinConfig.styleKeywords.includes(tag)
                    ? 'bg-[#5C7F67] text-white shadow-md'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
                "
                @click="toggleStyleKeyword(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Group 2: 材质纹理 -->
          <div>
            <h4 class="mb-3 text-sm font-bold text-stone-400 dark:text-stone-500">材质纹理</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in styleGroups.texture"
                :key="tag"
                type="button"
                class="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200"
                :class="
                  skinConfig.styleKeywords.includes(tag)
                    ? 'bg-[#5C7F67] text-white shadow-md'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
                "
                @click="toggleStyleKeyword(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <!-- Group 3: 特效滤镜 -->
          <div>
            <h4 class="mb-3 text-sm font-bold text-stone-400 dark:text-stone-500">特效滤镜</h4>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in styleGroups.fx"
                :key="tag"
                type="button"
                class="rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200"
                :class="
                  skinConfig.styleKeywords.includes(tag)
                    ? 'bg-[#5C7F67] text-white shadow-md'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-400 dark:hover:bg-stone-700'
                "
                @click="toggleStyleKeyword(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 板块 4: 自由描述 -->
      <section class="space-y-6">
        <div class="border-b border-stone-200 pb-2 dark:border-stone-800">
          <h3 class="text-xl font-bold text-stone-700 dark:text-stone-200">4. 需求描述区</h3>
        </div>
        <textarea
          v-model="skinConfig.freeformRequirements"
          rows="5"
          class="w-full appearance-none rounded-2xl bg-stone-100 p-5 text-base text-stone-700 shadow-inner transition-all outline-none placeholder:text-sm placeholder:text-stone-400 focus:bg-white focus:ring-2 focus:ring-[#5C7F67]/30 dark:bg-stone-800 dark:text-stone-300 dark:placeholder:text-stone-500"
          placeholder="在这里写下任何其他要求。&#10;例如: 色调倾向、字体要求、具体的素材图片链接..."
        ></textarea>
      </section>

      <!-- 底部生成按钮 -->
      <div class="flex justify-center pt-8">
        <button
          type="button"
          class="group flex items-center rounded-full bg-[#5C7F67] px-12 py-4 text-xl font-bold text-white shadow-[0_10px_30px_-5px_rgba(92,127,103,0.4)] transition-all hover:-translate-y-1 hover:bg-[#4A6852] hover:shadow-[0_20px_40px_-5px_rgba(92,127,103,0.5)] active:translate-y-0 active:scale-95"
          @click="handleGenerate"
        >
          <i class="fas fa-magic mr-3 transition-transform group-hover:rotate-12"></i>
          生成皮肤配置
        </button>
      </div>
    </main>

    <!-- 确认模态窗 -->
    <Transition name="fade">
      <div
        v-if="showConfirmModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/30 p-6 backdrop-blur-sm"
        @click.self="showConfirmModal = false"
      >
        <div class="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-stone-800">
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#5C7F67]/10 text-2xl text-[#5C7F67]"
          >
            <i class="fas fa-paper-plane"></i>
          </div>
          <h3 class="mb-2 text-center text-xl font-bold text-stone-800 dark:text-stone-100">准备发送</h3>
          <p class="mb-8 text-center text-stone-600 dark:text-stone-300">
            建议使用Default预设，关闭无关世界书<br />
            把黑棘世界书中含[🍳歌单]的条目全部关闭。
          </p>
          <div class="flex gap-4">
            <button
              class="flex-1 rounded-full bg-stone-100 py-3 font-bold text-stone-600 hover:bg-stone-200 dark:bg-stone-700 dark:text-stone-300"
              @click="showConfirmModal = false"
            >
              取消
            </button>
            <button
              class="flex-1 rounded-full bg-[#5C7F67] py-3 font-bold text-white hover:bg-[#4A6852]"
              @click="confirmSend"
            >
              确认发送
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { SkinConfig } from '../types';
import { generateSkinPrompt } from '../utils/skin-prompt-generator';

// 声明全局 API
declare const toastr: any;
declare function triggerSlash(content: string): void;

// Emits
const emit = defineEmits<{
  (e: 'back'): void;
}>();

// Model
const skinConfig = defineModel<SkinConfig>('skinConfig', { required: true });

// Local State
const showConfirmModal = ref(false);

// Options Data
// 按照用户要求的顺序和解释重新整理
const componentOptions = [
  {
    id: 'cover',
    label: '歌曲封面',
    desc: '每首歌曲单独的封面图，需要在歌单配置中填写封面链接。',
  },
  { id: 'title', label: '歌曲名' },
  { id: 'artist', label: '歌手名' },
  { id: 'progress', label: '进度条' },
  { id: 'time', label: '当前/总时长' },
  {
    id: 'mode',
    label: '播放模式切换',
    desc: '列表/单曲/随机',
  },
  { id: 'volume', label: '音量' },
  { id: 'controls', label: '上一首/下一首' },
  {
    id: 'playlist',
    label: '歌单列表',
    desc: '查看当前播放的歌单',
  },
];

// 视觉基因分类
const styleGroups = {
  genre: ['极简主义', '新拟态', '玻璃拟态', '赛博朋克', '蒸汽波', 'Y2K', '像素艺术', '杂志排版'],
  texture: ['噪点/颗粒', '扫描线', '半调网点', '纸质', '网格'],
  fx: ['色差', '故障艺术', '晕影', '高斯模糊', '倒置/负片', '抖动', '打字机效果'],
};

// Logic
const isExcluded = (id: string) => skinConfig.value.excludedComponents.includes(id);

const toggleComponent = (id: string) => {
  const list = skinConfig.value.excludedComponents;
  const idx = list.indexOf(id);

  if (idx === -1) {
    // 当前不在排除列表（即当前是“选中/保留”状态），用户想移除它
    list.push(id);
  } else {
    // 当前在排除列表（即当前是“未选中/移除”状态），用户想保留它
    list.splice(idx, 1);
  }
};

const toggleStyleKeyword = (tag: string) => {
  const list = skinConfig.value.styleKeywords;
  const idx = list.indexOf(tag);
  if (idx === -1) {
    list.push(tag);
  } else {
    list.splice(idx, 1);
  }
};

const handleGenerate = () => {
  showConfirmModal.value = true;
};

const confirmSend = () => {
  try {
    const prompt = generateSkinPrompt(skinConfig.value);
    const command = `/send ${prompt} | /trigger`;

    if (typeof triggerSlash === 'function') {
      triggerSlash(command);
      if (typeof toastr !== 'undefined') {
        toastr.success('已发送皮肤设计需求，请等待 AI 绘制。', '发送成功');
      }
    } else {
      alert('无法调用 triggerSlash，请在酒馆环境中运行。');
    }
  } catch (e) {
    console.error(e);
    alert('发送过程中出错。');
  } finally {
    showConfirmModal.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
