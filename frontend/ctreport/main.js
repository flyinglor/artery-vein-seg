import App from './App'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  // 服务器可能会到期更换这里拼接一下前缀
  app.config.globalProperties['$getUrl'] = (path) => {
          if (/http/.test(path)) {
                  return path
          }
          return `https://www.ccnihao.fun/public-resource${path}`
  }
  return {
    app
  }
}
// #endif


