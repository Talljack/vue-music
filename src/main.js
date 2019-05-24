import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/index'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import 'common/stylus/index.styl'

/* eslint-disable no-unused-vars */
import vConsole from 'vconsole'

Vue.config.productionTip = false

Vue.use(VueLazyload, {
  loading: require('common/image/default.png')
})
fastclick.attach(document.body)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
