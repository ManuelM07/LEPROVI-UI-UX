<template>

<el-container>
  <el-header class="header">
      <h3>Visual Programming</h3>
      <el-button type="primary"   @click="exportEditor">Run</el-button>
  </el-header>
  <el-container class="container">
    <el-aside width="250px" class="column">
        <ul>
            <li v-for="n in listNodes" :key="n" draggable="true" :data-node="n.item" @dragstart="drag($event)" class="drag-drawflow" >
                <div class="node" :style="`background: ${n.color}`" >{{ n.name }}</div>
            </li>
        </ul>
    </el-aside>
    <el-main>
        <div id="drawflow" @drop="drop($event)" @dragover="allowDrop($event)"></div>
    </el-main>
  </el-container>
</el-container>
<el-dialog
    v-model="dialogVisible"
    title="Export"
    width="70%"
  >
  <div>
    <Code codex="print('Hellooo!')"/>
  </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="dialogVisible = false"
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
import { onMounted, shallowRef, h, getCurrentInstance, render, readonly, ref } from 'vue'
import NodeMath from './nodes/nodeMath.vue'
import NodeNumber from './nodes/nodeNumber.vue'
import NodePrint from './nodes/nodePrint.vue'
import NodeAssign from './nodes/nodeAssign.vue'
import NodeIf from './nodes/nodeIf.vue'
import NodeElse from './nodes/nodeElse.vue'
import NodeFor from './nodes/nodeFor.vue'
import NodeComOp from './nodes/nodeComOp.vue'
import EventService from "@/services/endpoints.js";
import Code from '../views/Codex.vue'




export default {
  name: 'drawflow',
  components: {
      Code
  },
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
      ])
    
    const editor = shallowRef({})
    const dialogVisible = ref(false)
    const dialogData = ref({})
    const Vue = { version: 3, h, render };
    const internalInstance = getCurrentInstance()
    internalInstance.appContext.app._context.config.globalProperties.$df = editor;
    
      function exportEditor() {
          let data = editor.value.export();
          dialogData.value = data.drawflow.Home.data
          dialogVisible.value = true;
          console.log(data.drawflow.Home.data);

          //let response = await EventService.runProgram(dialogData.value).then(res => res.json());
          //console.log(response.data);
          //const users = ref([])
          //EventService.getPrograms().then(({ data }) => (users.value = data))
          //console.log("YEAH: "+ users.value  )

          (async () => {
          const res = await EventService.runProgram(data.drawflow.Home.data);
          //users.value = res.data;
          //console.log(res.data.foo[0].name);
          })()
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

        //editor.value.import({"drawflow":{"Home":{"data":{"5":{"id":5,"name":"NodeNumber","data":{"script":"(req,res) => {\n console.log(req);\n}"},"class":"NodeNumber","html":"NodeNumber","typenode":"vue","inputs":{"input_1":{"connections":[{"node":"6","input":"output_1"}]}},"outputs":{"output_1":{"connections":[]},"output_2":{"connections":[]}},"pos_x":1000,"pos_y":117},"6":{"id":6,"name":"NodeMath","data":{"url":"localhost/add", "method": "add"},"class":"NodeMath","html":"NodeMath","typenode":"vue","inputs":{},"outputs":{"output_1":{"connections":[{"node":"5","output":"input_1"}]}},"pos_x":137,"pos_y":89}}}}})
    })



    return {
      exportEditor, listNodes, drag, drop, allowDrop, dialogVisible, dialogData, Code
    }

  },

  async created() {
    let response = await EventService.getPrograms();
    console.log(response.data);
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
    border: 2px solid #7ac8efc8;
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
</style>