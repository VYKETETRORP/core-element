<script setup>
const makeFullScreen = async () => {
  const doc = window.document;
  const docEl = doc.documentElement;

  const requestFullScreen =
    docEl.requestFullscreen ||
    docEl.mozRequestFullScreen ||
    docEl.webkitRequestFullScreen ||
    docEl.msRequestFullscreen;
  const cancelFullScreen =
    doc.exitFullscreen ||
    doc.mozCancelFullScreen ||
    doc.webkitExitFullscreen ||
    doc.msExitFullscreen;

  if (
    !doc.fullscreenElement &&
    !doc.mozFullScreenElement &&
    !doc.webkitFullscreenElement &&
    !doc.msFullscreenElement
  ) {
    await requestFullScreen.call(docEl);
  } else {
    await cancelFullScreen.call(doc);
  }
};
</script>
<template>
  <div style="display: inline-block">
    <el-tooltip effect="dark" content="Full Screen" placement="bottom-end">
      <el-button link class="btn-link" @click="makeFullScreen()">
        <template #icon>
          <i class="far fa-expand-arrows-alt fa-lg icon-link" />
        </template>
      </el-button>
    </el-tooltip>
  </div>
</template>

<style lang="scss" scoped>
.btn-link {
  color: #303133 !important;
}
</style>
