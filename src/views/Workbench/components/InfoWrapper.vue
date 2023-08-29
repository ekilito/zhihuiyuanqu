<template>
  <!--
      为什么要封装组件？
        结构是相似的可以复用的  标题title（纯文本string 可变的） + 主要内容区域main（模版 可变的）

      封装方案？
        纯展示类的封装
        1. 先不考虑变化的部分 先写一个纯静态的结构 保证有title和main两块区域
        2. 考虑变化的部分 变化的部分由父组件通过参数传给我 我负责显示
           1. 父传子 props  传递是纯js数据 对象 数组 布尔值... [title]
           2. 插槽  传递的是HTML结构模版  [主要内容区域main]

      思想：
       一个组件本质上就是一个函数 可以把props / 插槽理解函数的形参
       定义好组件之后 然后在父组件中传递参数其实就是一个传递实参的过程

       props参数的传递 如果这个参数是字符串类型 不用加冒号
       如果传递的参数是一个需要变动的数据 才加上冒号来识别表达式 data computed

       所有的三方组件库 都是把形参封装好了 然后我们在业务中用的时候传递各种各种的实参
     -->

  <div class="info-wrapper">
    <!-- 标题区域 -->
    <p class="info-wrapper__title">{{ title }}</p>
    <div>
      <!-- 主要内容区域 -->
      <slot />
    </div>
  </div>

</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .info-wrapper {
    background-color: #ffffff;
    padding: 20px;
    margin-bottom: 20px;
    min-width: 260px;
    &__title {
      font-size: 14px;
      color: #303035;
      font-weight: 500;
      margin-bottom: 20px;
    }
  }
</style>

