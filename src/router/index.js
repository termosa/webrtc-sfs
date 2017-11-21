import Vue from 'vue'
import Router from 'vue-router'
import SharePage from '@/components/SharePage'
import FilePage from '@/components/FilePage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SharePage',
      component: SharePage
    },
    {
      path: '/file/:file',
      name: 'FilePage',
      component: FilePage
    }
  ]
})
