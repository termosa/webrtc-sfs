import Vue from 'vue'
import App from './App'
import router from './router'
import log from '@/log'

Vue.config.productionTip = false

log('start new application')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
