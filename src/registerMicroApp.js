// 注册子应用
import { registerMicroApps, start } from 'qiankun'

registerMicroApps([{
    name: 'big-screen', // 子应用名称
    entry: '//localhost:5173', // 子应用运行服务地址（就是npm run dev时的那个地址）
    container: '#container', // 挂载容器（id=container）
    activeRule: '/big-screen' // 激活路由(在哪个路由下加载子应用,需要和子应用的路由名称对应)
}])

start()