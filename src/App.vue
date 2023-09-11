<template>
  <div id="app">
    <!-- 一级路由出口 -->
    <router-view />
    <!-- 准备一个挂载子应用的节点 -->
    <div id="container"></div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
