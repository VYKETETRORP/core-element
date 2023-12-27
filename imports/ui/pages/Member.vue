<template>

  <div style="margin-top: 20px">
    <el-radio-group v-model="radio2">
      <el-radio label="1" border>Option A</el-radio>
      <el-radio label="2" border>Option B</el-radio>
    </el-radio-group>
  </div>

</template>

<script lang="ts" setup>
import { ref } from 'vue'

const radio2 = ref('1')

</script>
