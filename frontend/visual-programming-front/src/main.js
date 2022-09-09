import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//import { basicSetup } from 'codemirror'
//import VueCodemirror from 'vue-codemirror'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import { GlobalCmComponent } from "codemirror-editor-vue3";

console.log(Icons)

import App from './App.vue'


const app = createApp(App)

app.use(ElementPlus)
app.use(Icons)
app.use(GlobalCmComponent);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
//Vue.use(VueCodeMirror)
//Vue.component('codemirror', VueCodeMirror.codemirror)
/*app.use(VueCodemirror, {
    // optional default global options
    autofocus: true,
    disabled: false,
    indentWithTab: true,
    tabSize: 2,
    placeholder: 'Code goes here...',
    extensions: [basicSetup],
    autoRefresh: true
    // ...
  })*/
app.use(GlobalCmComponent, { componentName: "Codemirror" });
app.component('EasyDataTable', Vue3EasyDataTable);



app.mount('#app')