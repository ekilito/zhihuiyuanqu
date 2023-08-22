<template>
  <main class="app-wrapper">
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <!-- 二级路由的渲染位置 -->
        <!--
          :key :给一个组件添加一个不同的key的时候，每次渲染都会销毁重建
          路由默认会有缓存机制
          detail/1001
          detail/1002
          当路由从1001跳转到1002的时候，因为路由主path不变只是参数变了 默认走缓存
        -->
        <router-view :key="key" />
      </transition>
    </section>
  </main>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>

<style scoped>
.app-wrapper {
  padding: 0 20px;
}

.app-main {
  /*50 = navbar  */
  height: calc(100vh - 80px);
  width: 100%;
  position: relative;
  overflow-y: auto;
  background-color: #fff;
  padding: 20px 20px 0;
}
</style>
