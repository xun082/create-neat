<script setup lang="ts">
import Giscus from '@giscus/vue';
import {useData, useRoute} from 'vitepress';
import {ref, watch, nextTick} from 'vue';

const {isDark} = useData();

const route = useRoute();
const showComment = ref(true);
watch(
  () => route.path,
  () => {
    showComment.value = false;
    nextTick(() => {
      showComment.value = true;
    });
  },
  {
    immediate: true
  }
);
</script>

<template>
  <Giscus
    v-if="showComment"
    src="https://giscus.app/client.js"
    repo="xun082/create-neat"
    repo-id="R_kgDOI6xB6Q"
    category="Announcements"
    category-id="DIC_kwDOI6xB6c4Cd396"
    mapping="title"
    strict="1"
    reactions-enabled="1"
    emit-metadata="0"
    input-position="top"
    theme="dark"
    lang="zh-CN"
    loading="lazy"
    crossorigin="anonymous"
    async
  ></Giscus>
</template>

<style scoped></style>
