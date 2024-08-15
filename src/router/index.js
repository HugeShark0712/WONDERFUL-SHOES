import { createRouter, createWebHistory } from 'vue-router'; // Updated imports
import HelloWorld from '../components/HelloWorld.vue';
import NewPage from '../components/newPage.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HelloWorld
  },
  {
    path: '/new-page',
    name: 'NewPage',
    component: NewPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
