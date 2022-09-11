<template>

  <el-container class="container">
    <!-- Header -->
    <el-header class="header">
        <h3><el-icon :size="30" class="el-icon--left"><Bicycle /></el-icon>LEPROVI</h3>
        <el-select v-model="value" clearable placeholder="Select languaje">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="danger" @click="clearData" plain>
          <el-icon :size="30" class="el-icon--left"><Delete /></el-icon>
          Clear</el-button>
        <el-button :plain="true" type="primary"  @click="exportEditor">
          <el-icon :size="30" class="el-icon--left"><View /></el-icon> 
          Code</el-button>
    </el-header>
    <!-- Nodes -->
    <el-container >
      <!-- Stand of nodes -->
      <el-aside width="250px" class="column">
          <ul>
              <li v-for="n in listNodes" :key="n" draggable="true" :data-node="n.item" @dragstart="drag($event)" class="drag-drawflow" >
                  <div class="node" :style="`background: ${n.color}`" >{{ n.name }}</div>
              </li>
          </ul>
      </el-aside>
      <!-- Board -->
      <el-main>
          <div id="drawflow" @drop="drop($event)" @dragover="allowDrop($event)"></div>
      </el-main>
    </el-container>
  </el-container>
  <!-- Dialog Code & Console -->
  <el-dialog
      v-model="dialogVisible"
      title="Export"
      width="70%"
    >
    <template #header>
      <div class="my-header">
        <el-button type="success" @click="runProgram">
          <el-icon :size="30" class="el-icon--left"><CaretRight /></el-icon>
            Run</el-button
          >
      </div>
    </template>
    <div class="code-editor">
      <span>Code:</span>
      <pre><code>{{codeData}}</code></pre>
      <el-divider>
        <el-icon><star-filled /></el-icon>
      </el-divider>
      <pre><code>{{consoleData}}</code></pre>
    </div>

    <template #footer>

      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogFormVisible = true"
          >Save</el-button
        >
      </span>
    </template>
  </el-dialog>

  <!-- Dialog Form -->
  <el-dialog v-model="dialogFormVisible" title="Register data">
    <el-form :model="form">
      <el-form-item label="Username" :label-width="formLabelWidth">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Program name" :label-width="formLabelWidth">
        <el-input v-model="form.program" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancel</el-button>
        <el-button :plain="true" type="primary" @click="saveProgram"
          >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>


<script>

import Drawflow from 'drawflow'
import styleDrawflow from 'drawflow/dist/drawflow.min.css'
import style from '../assets/style.css' 
import { onMounted, shallowRef, h, getCurrentInstance, render, readonly, ref, reactive } from 'vue'
import NodeMath from './nodes/nodeMath.vue'
import NodeNumber from './nodes/nodeNumber.vue'
import NodePrint from './nodes/nodePrint.vue'
import NodeAssign from './nodes/nodeAssign.vue'
import NodeIf from './nodes/nodeIf.vue'
import NodeElse from './nodes/nodeElse.vue'
import NodeFor from './nodes/nodeFor.vue'
import NodeComOp from './nodes/nodeComOp.vue'
import NodeString from './nodes/nodeString.vue'
import NodeStringOp from './nodes/nodeStringOp.vue'
import EventService from "@/services/endpoints.js";
import { ElMessage } from 'element-plus'


export default {
  name: 'drawflow',
  setup() {
    const listNodes = readonly([
          {
              name: 'Math Operations',
              color: '#49494970',
              item: 'NodeMath',
              input:2,
              output:1
          },
          {
              name: 'Number',
              color: '#67F095',
              item: 'NodeNumber',
              input:0,
              output:1
          },
          {
              name: 'Print',
              color: '#E6D16B',
              item: 'NodePrint',
              input:1,
              output:0
          },
          {
              name: 'Assign',
              color: '#DCACCE',
              item: 'NodeAssign',
              input:1,
              output:1
          },
          {
              name: 'If',
              color: '#1CE6CE',
              item: 'NodeIf',
              input:3,
              output:2,
          },
          {
              name: 'Else',
              color: '#96BACE',
              item: 'NodeElse',
              input:1,
              output:1,
          },
          {
              name: 'For',
              color: '#9688CE',
              item: 'NodeFor',
              input:2,
              output:1,
          },
          {
              name: 'Comparison Operators',
              color: '#F08A4F',
              item: 'NodeComOp',
              input:0,
              output:1,
          },
          {
              name: 'String',
              color: '#C9F52F',
              item: 'NodeString',
              input:0,
              output:1,
          },
          {
              name: 'String Operations',
              color: '#EB4C62',
              item: 'NodeStringOp',
              input:1,
              output:1,
          },
      ])
    const form = reactive({
      name: '',
      program: '',
    })

    const saveProgramData = ref({})
    const dialogFormVisible = ref(false)
    const codeData = ref("")
    const consoleData = ref("")
    const editor = shallowRef({})
    const dialogVisible = ref(false)
    const dialogData = ref({})
    const Vue = { version: 3, h, render };
    const internalInstance = getCurrentInstance()
    const value = ref('')
    const options = [
      {
        value: 'python3',
        label: 'Python3',
      },
      {
        value: 'nodejs',
        label: 'JavaScript',
      },
    ]
    internalInstance.appContext.app._context.config.globalProperties.$df = editor;
    
    function exportEditor() {
      if (value.value == "") {
        value.value = "python3"
      }
      let data = editor.value.export();
      dialogData.value = data.drawflow.Home.data
      console.log(dialogData);

      (async () => {
        try {
          const res = await EventService.program({"code": data.drawflow.Home.data, "languaje": value.value});
          codeData.value = res.data
          consoleData.value = ""
          dialogVisible.value = true;
          console.log(codeData)
        } catch (error) {
          open4()
        }
      })()
          
    }

    function runProgram() {
      (async () => {
          const res = await EventService.runProgram({"code": codeData.value, "languaje": value.value, versionIndex: "4"});
          console.log(codeData.value)
          consoleData.value = res.data.output
      })()
    }

    function saveProgram() {
      saveProgramData.value = {
        "Uid":          "_:",
        "Name":         form.name,
        "program_name": form.program,
        "Body":         codeData.value,
        "Languaje":     value.value
      };
    
      (async () => {
          const res = await EventService.createProgram(saveProgramData.value);
          console.log(res.data)
          dialogFormVisible.value = false
          dialogVisible.value = false;
          open2()
      })()

      form.name = ""
      form.program = ""

    }

    function clearData() {
      editor.value.clear('drawflow');
    }

    const open2 = () => {
      ElMessage({
        message: 'Program saved successfully.',
        type: 'success',
      })
    }

    const open4 = () => {
      ElMessage({
        showClose: true,
        message: 'Oops, your code is not correct, please check.',
        type: 'error',
      })
    }

    const drag = (ev) => {
      if (ev.type === "touchstart") {
        mobile_item_selec = ev.target.closest(".drag-drawflow").getAttribute('data-node');
      } else {
      ev.dataTransfer.setData("node", ev.target.getAttribute('data-node'));
      }
    }

    const drop = (ev) => {
      if (ev.type === "touchend") {
        var parentdrawflow = document.elementFromPoint( mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY).closest("#drawflow");
        if(parentdrawflow != null) {
          addNodeToDrawFlow(mobile_item_selec, mobile_last_move.touches[0].clientX, mobile_last_move.touches[0].clientY);
        }
        mobile_item_selec = '';
      } else {
        ev.preventDefault();
        var data = ev.dataTransfer.getData("node");
        addNodeToDrawFlow(data, ev.clientX, ev.clientY);
      }
    }

    const allowDrop = (ev) => {
      ev.preventDefault();
    }

    let mobile_item_selec = '';
    let mobile_last_move = null;
    function positionMobile(ev) {
      mobile_last_move = ev;
    }

    function addNodeToDrawFlow(name, pos_x, pos_y) {
      pos_x = pos_x * ( editor.value.precanvas.clientWidth / (editor.value.precanvas.clientWidth * editor.value.zoom)) - (editor.value.precanvas.getBoundingClientRect().x * ( editor.value.precanvas.clientWidth / (editor.value.precanvas.clientWidth * editor.value.zoom)));
      pos_y = pos_y * ( editor.value.precanvas.clientHeight / (editor.value.precanvas.clientHeight * editor.value.zoom)) - (editor.value.precanvas.getBoundingClientRect().y * ( editor.value.precanvas.clientHeight / (editor.value.precanvas.clientHeight * editor.value.zoom)));
    
      const nodeSelected = listNodes.find(ele => ele.item == name);
      editor.value.addNode(name, nodeSelected.input,  nodeSelected.output, pos_x, pos_y, name, {}, name, 'vue');
      
    }


    onMounted(() => {
        var elements = document.getElementsByClassName('drag-drawflow');
        for (var i = 0; i < elements.length; i++) {
          elements[i].addEventListener('touchend', drop, false);
          elements[i].addEventListener('touchmove', positionMobile, false);
          elements[i].addEventListener('touchstart', drag, false );
        }
          
        const id = document.getElementById("drawflow");
        editor.value = new Drawflow(id, Vue, internalInstance.appContext.app._context);
        editor.value.start();
        
        editor.value.registerNode('NodeMath', NodeMath, {}, {});
        editor.value.registerNode('NodeNumber', NodeNumber, {}, {});
        editor.value.registerNode('NodePrint', NodePrint, {}, {});
        editor.value.registerNode('NodeAssign', NodeAssign, {}, {});
        editor.value.registerNode('NodeIf', NodeIf, {}, {});
        editor.value.registerNode('NodeElse', NodeElse, {}, {});
        editor.value.registerNode('NodeFor', NodeFor, {}, {});
        editor.value.registerNode('NodeComOp', NodeComOp, {}, {});
        editor.value.registerNode('NodeString', NodeString, {}, {});
        editor.value.registerNode('NodeStringOp', NodeStringOp, {}, {});

    })
    return {
      exportEditor, listNodes, drag, drop, allowDrop, dialogVisible, dialogData, codeData, consoleData, runProgram, 
      dialogFormVisible, form, saveProgram, saveProgramData, open2, open4, value, options, clearData
    }

  },
}

</script>


<style scoped>
  .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #494949;
  }
  .container {
      min-height: calc(100vh - 100px);
  }
  .column {
      border-right: 1px solid #494949;
  }
  .column ul {
      padding-inline-start: 0px;
      padding: 10px 10px;
      
  }
  .column li {
      background: transparent;
  }

  .node {
      border-radius: 8px;
      border: 2px solid #141579c8;
      display: block;
      height:60px;
      line-height:40px;
      padding: 10px;
      margin: 10px 0px;
      cursor: move;
  }

  #drawflow {
    width: 100%;
    height: 100%;
    text-align: initial;
    background: #132055;
    background-size: 20px 20px;
    background-image: radial-gradient(#494949 1px, transparent 1px);
    
  }

  .my-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .code-editor {
    background: #132055;
    color: white
  }

</style>