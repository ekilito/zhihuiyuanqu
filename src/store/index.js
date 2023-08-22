import Vue from 'vue'
import Vuex from 'vuex'
// 默认导入
import user from './modules/user'
Vue.use(Vuex)

const store = new Vuex.Store({
  // 组合模块的配置项
  modules: {
    user: user // 右边user匹配导入的 可以修改
  }
})

// 组件中使用user模块中的数据？
// this.$store.state.user.name

// 组件触发mutation？
// this.$store.commit('user/mutation name')

// 组件触发啊action
// this.$store.dispach('user/action name')

// 场景1：组件中使用state和方法很少 this.$store
// 场景2：映射方法 mapState() mapMutations

export default store
