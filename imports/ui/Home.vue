<template class="kh-battambang">
  <h1 class="text-3xl font-bold my-6">Welcome to Meteor!</h1>
  <Hello />
  <Info />
  <el-button>Default</el-button>
  <h1 class="main-header">Hii</h1>
</template>

<script lang="ts" setup>
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from "@element-plus/icons-vue";
import Hello from "./Hello.vue";
import Info from "./Info.vue";
</script>
<style lang="scss">
@import "./styles/index.scss";
</style>
