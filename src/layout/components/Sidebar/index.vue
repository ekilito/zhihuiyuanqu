<template>
  <div class="has-logo">
    <logo />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- 左侧菜单组件 -->
      <el-menu
        :default-active="activeMenu"
        mode="vertical"
        :collapse-transition="false"
        :unique-opened="true"
      >
        <!-- 菜单中的每一项 -->
        <!-- route是路由表中的每一个对象 -->
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import Logo from './Logo'
import SidebarItem from './SidebarItem'
export default {
  components: { SidebarItem, Logo },
  computed: {
    routes() {
      //  内置的属性 拿到的是路由初始化的时候传入routes配置项中的数组
      // return this.$router.options.routes
      // 改写组件中菜单渲染数据
      // 解决方案：一个地方能动态的往里面添加数据据 且一旦数据变化 还会让视图发生重新渲染
      // data vuex
      // 1. permission.js 中得到最终的路由表之后 存入vuex
      // 2. 把当前位置静态的路由表改成具有响应式特性的Vuex中的数据
      return this.$store.state.menu.menuList
    },
    activeMenu() {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    }
  }
}
</script>

