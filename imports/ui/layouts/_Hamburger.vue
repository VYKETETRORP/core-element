<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    isCollapse: boolean;
  }>(),
  {
    isCollapse: false,
  }
);
const toggled = ref<boolean>(props.isCollapse);

watch(
  () => props.isCollapse,
  (val) => {
    toggled.value = val;
  },
  {
    immediate: true,
  }
);
</script>

<template class="kh-battambang">
  <div class="hamburger" :class="{ open: toggled }">
    <span />
    <span />
    <span />
  </div>
</template>

<style lang="scss" scoped>
.hamburger {
  display: inline-block;
  width: 20px;
  height: 16px;
  position: relative;
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;

  span {
    display: block;
    position: absolute;
    height: 2px;
    width: 100%;
    background: #303133;
    border-radius: 4px;
    opacity: 1;
    left: 0;
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
    transition: 0.25s ease-in-out;

    &:nth-child(1) {
      top: 0px;
    }
    &:nth-child(2) {
      top: 6px;
    }
    &:nth-child(3) {
      top: 12px;
    }
  }

  &.open {
    span {
      &:nth-child(1) {
        top: 6px;
        -webkit-transform: rotate(135deg);
        -moz-transform: rotate(135deg);
        -o-transform: rotate(135deg);
        transform: rotate(135deg);
      }
      &:nth-child(2) {
        opacity: 0;
        left: -15px;
      }
      &:nth-child(3) {
        top: 6px;
        -webkit-transform: rotate(-135deg);
        -moz-transform: rotate(-135deg);
        -o-transform: rotate(-135deg);
        transform: rotate(-135deg);
      }
    }
  }
}
</style>
