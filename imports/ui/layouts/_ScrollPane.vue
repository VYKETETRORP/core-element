<template>
  <el-scrollbar
    ref="scrollContainer"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <slot />
  </el-scrollbar>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElScrollbar } from "element-plus";

const tagAndTagSpacing = ref(4);
const left = ref(0);

const scrollWrapper = ref<HTMLElement | null>(null);

const handleScroll = (e: WheelEvent) => {
  const eventDelta = e.wheelDelta || -e.deltaY * 40;
  if (scrollWrapper.value) {
    scrollWrapper.value.scrollLeft += eventDelta / 4;
  }
};

const moveToTarget = (currentTag: HTMLElement) => {
  const container = scrollContainer.value?.$el;
  const containerWidth = container?.offsetWidth || 0;
  const $scrollWrapper = scrollWrapper.value;
  const tagList = parent.value?.$refs.tag || [];

  let firstTag: HTMLElement | null = null;
  let lastTag: HTMLElement | null = null;

  if (tagList.length > 0) {
    firstTag = tagList[0];
    lastTag = tagList[tagList.length - 1];
  }

  if (firstTag === currentTag) {
    $scrollWrapper.scrollLeft = 0;
  } else if (lastTag === currentTag) {
    $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - containerWidth;
  } else {
    const currentIndex = tagList.findIndex((item) => item === currentTag);
    const prevTag = tagList[currentIndex - 1];
    const nextTag = tagList[currentIndex + 1];

    const afterNextTagOffsetLeft =
      nextTag?.$el.offsetLeft +
        nextTag?.$el.offsetWidth +
        tagAndTagSpacing.value || 0;

    const beforePrevTagOffsetLeft =
      prevTag?.$el.offsetLeft - tagAndTagSpacing.value || 0;

    if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + containerWidth) {
      $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - containerWidth;
    } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
      $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft;
    }
  }
};

onMounted(() => {
  // Perform any setup on mount if needed
});
</script>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
  // /deep/ {
  //   .el-scrollbar__bar {
  //     bottom: 0px;
  //   }
  //   .el-scrollbar__wrap {
  //     height: 49px;
  //   }
  // }
}
</style>
