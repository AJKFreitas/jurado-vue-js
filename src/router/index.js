import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import PostsManager from '@/components/PostsManager'
import NotesManager from '@/components/NotesManager'
import MusicManager from '@/components/MusicManager'
import Auth from '@okta/okta-vue'

Vue.use(Auth, {
  issuer: 'https://dev-180132.okta.com/oauth2/default',
  client_id: '0oa11l4iwolAHfjYj357',
  redirect_uri: 'http://localhost:8080/implicit/callback',
  scope: 'openid profile email'
})

Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/implicit/callback',
      component: Auth.handleCallback()
    },
    {
      path: '/posts-manager',
      name: 'PostsManager',
      component: PostsManager,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/notas',
      name: 'NotesManager',
      component: NotesManager,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/musicas',
      name: 'MusicManager',
      component: MusicManager,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach(Vue.prototype.$auth.authRedirectGuard())

export default router
