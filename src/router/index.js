import Vue from 'vue'
import Router from 'vue-router'
import SharePage from '@/components/SharePage'
import DownloadPage from '@/components/DownloadPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'SharePage',
      component: SharePage
    },
    {
      path: '/file/:peer/:file',
      name: 'DownloadPage',
      component: DownloadPage
    }
  ]
})
