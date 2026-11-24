import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import App from './App.vue'
import { token } from './api'
import './assets/main.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/posts' },
    { path: '/register', name: 'register', component: () => import('./pages/RegisterPage.vue') },
    { path: '/login', name: 'login', component: () => import('./pages/LoginPage.vue') },

    // Posts are public: anyone can read the blog.
    { path: '/posts', name: 'posts', component: () => import('./pages/PostsPage.vue') },
    { path: '/posts/:id', name: 'postDetails', component: () => import('./pages/PostDetailsPage.vue') },

    { path: '/about', name: 'about', component: () => import('./pages/AboutPage.vue') },

    // Writing a post needs a logged-in user.
    {
      path: '/posts/add',
      name: 'addPost',
      component: () => import('./pages/AddPostPage.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/posts/:id/edit',
      name: 'editPost',
      component: () => import('./pages/EditPostPage.vue'),
      meta: { requiresAuth: true },
    },

    { path: '/:pathMatch(.*)*', name: 'notFound', component: () => import('./pages/NotFoundPage.vue') },
  ],
})

// Routes that only make sense while logged out.
const AUTH_PAGES = ['login', 'register']

router.beforeEach((to) => {
  const loggedIn = Boolean(token.value)

  // Logged in and heading for the auth pages (or "/"): show the posts instead.
  if (loggedIn && (AUTH_PAGES.includes(to.name) || to.path === '/')) {
    return { name: 'posts' }
  }

  // Writing needs a session: send guests to the login page and come back after.
  if (!loggedIn && to.meta.requiresAuth) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
})

// One toast instance shared by every page.
export const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'bottom' },
  dismissible: true,
  types: [
    { type: 'success', background: '#198754', icon: { className: 'check', tagName: 'i' } },
    { type: 'error', background: '#dc3545', icon: { className: 'cross', tagName: 'i' } },
  ],
})

createApp(App).use(router).mount('#app')