import { createApp } from 'vue'; // Updated import
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router); // Register router
app.mount('#app');
