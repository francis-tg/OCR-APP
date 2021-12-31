import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import './css/main.css'
import AllIon from 'vue-ionicons/dist/ionicons';
import VueHtml2Canvas from 'vue-html2canvas';


createApp(App)
    .use(store)
    .use(AllIon)
    .use(VueHtml2Canvas)
    .mount('#app')