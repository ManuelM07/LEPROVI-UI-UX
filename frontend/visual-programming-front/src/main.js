import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons'
import { basicSetup } from 'codemirror'
import VueCodemirror from 'vue-codemirror'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

console.log(Icons)

import App from './App.vue'


const app = createApp(App)

app.use(ElementPlus)
app.use(Icons)
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
  app.component('EasyDataTable', Vue3EasyDataTable);



app.mount('#app')