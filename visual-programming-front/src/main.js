import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import App from './App.vue'


const app = createApp(App)

app.use(ElementPlus)
app.use(Icons)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.component('EasyDataTable', Vue3EasyDataTable);

app.mount('#app')