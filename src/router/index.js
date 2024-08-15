import { createRouter, createWebHistory } from 'vue-router';
import HelloWorld from '../components/HelloWorld.vue';
import NewPage from '../components/newPage.vue';
import Configurator from '../views/ShoeConfigurator.vue';

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
  },
  {
    path: '/configurator',
    name: 'Configurator',
    component: Configurator // Add route for Configurator
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
