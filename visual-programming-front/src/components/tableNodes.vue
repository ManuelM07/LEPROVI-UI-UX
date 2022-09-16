<template>
  <el-container class="container">
    <el-header class="header">
      <h3><el-icon :size="30" class="el-icon--left"><Bicycle /></el-icon>LEPROVI</h3>
    </el-header>
    <el-main>
      <EasyDataTable
        theme-color="#1d90ff"
        table-class-name="customize-table"
        header-text-direction="center"
        body-text-direction="center"
        v-model:items-selected="itemsSelected"
        show-index
        :headers="headers"
        :items="items"
        @click-row="showRow"
      />
    </el-main>
  </el-container>
  <!-- Dialog -->
  <el-dialog
    v-model="outerVisible"
    title="Export"
  >
    <template #header>
      <div class="my-header">
        <el-button type="success" @click="runProgram">
          <el-icon :size="30" class="el-icon--left"><CaretRight /></el-icon>
            Run
        </el-button>
      </div>
    <!-- Code & Console-->
    </template>
    <Codemirror
    class="CodeMirror"
    v-model:value="code"
    :options="cmOptions"
    border
    :disabled="true"
    placeholder=""
    :height="200"
    @change="change"
    />
    <div class="code-editor">
      <el-divider>
        <el-icon><star-filled /></el-icon>
      </el-divider>
      <pre><code>{{consoleData}}</code></pre>
    </div>
    <template #footer>
      <span class="dialog-footer">
      </span>
    </template>
  </el-dialog>
</template>


<script lang="ts">
  import { ref } from 'vue'
  import type { Header, Item, ClickRowArgument } from "vue3-easy-data-table";
  import EventService from "@/services/endpoints.js";
  import Codemirror from "codemirror-editor-vue3";

  // language
  import "codemirror/mode/javascript/javascript.js";
  // theme
  import "codemirror/theme/dracula.css";


  export default {
    setup() {
      const mode = ref("")
      const consoleData = ref("")
      const programSelect = ref("")
      const languajeSelect = ref("")
      const dataItems = ref([])
      const outerVisible = ref(false)
      const code = ref(` `);
      const showRow = (item: ClickRowArgument) => {
        programSelect.value = item.body
        code.value = programSelect.value
        languajeSelect.value = item.languaje
        consoleData.value = ""
        if (item.languaje == "python3") {
          mode.value = "python"
        } else {
          mode.value = "javascript"
        }
        outerVisible.value = true
        console.log((item))
      };
      const headers: Header[] = [
        { text: "USERNAME", value: "name" },
        { text: "PROGRAM NAME", value: "program_name"},
        { text: "LANGUAJE", value: "languaje"},
      ];
      const items = ref(dataItems)

      programs()
      function programs() {
        (async () => {
          const res = await EventService.getPrograms();
          dataItems.value = res.data.foo
          console.log(dataItems)
        })()
      }

      function runProgram() {
        (async () => {
          const res = await EventService.runProgram({"code": programSelect.value, "languaje": languajeSelect.value, versionIndex: "4"});
          consoleData.value = res.data.output
        })()
      }

      return {
        showRow, headers, items, dataItems, outerVisible, programSelect, runProgram, consoleData, languajeSelect, code, mode,
        cmOptions: {
          mode: mode,
          theme: "monokai",
          lineNumbers: false,
          smartIndent: true,
          indentUnit: 2,
          foldGutter: true,
          styleActiveLine: true,
          readOnly: true,
        },
      }
    } 
  }
</script>


<style>
  .container {
    min-height: calc(100vh - 100px);
    background-color: #e8f0f1;
  }

  .customize-table {
    --easy-table-border: 1px solid #445269;
    --easy-table-row-border: 1px solid #445269;

    --easy-table-header-font-size: 14px;
    --easy-table-header-height: 50px;
    --easy-table-header-font-color: #c1cad4;
    --easy-table-header-background-color: #132055;

    --easy-table-header-item-padding: 10px 15px;

    --easy-table-body-even-row-font-color: #fff;
    --easy-table-body-even-row-background-color: #273958;

    --easy-table-body-row-font-color: #c0c7d2;
    --easy-table-body-row-background-color: #21577b;
    --easy-table-body-row-height: 50px;
    --easy-table-body-row-font-size: 14px;

    --easy-table-body-row-hover-font-color: #2d3a4f;
    --easy-table-body-row-hover-background-color: #eee;

    --easy-table-body-item-padding: 10px 15px;

    --easy-table-footer-background-color: #132055;
    --easy-table-footer-font-color: #c0c7d2;
    --easy-table-footer-font-size: 14px;
    --easy-table-footer-padding: 0px 10px;
    --easy-table-footer-height: 50px;

    --easy-table-rows-per-page-selector-width: 70px;
    --easy-table-rows-per-page-selector-option-padding: 10px;

    --easy-table-scrollbar-track-color: #2d3a4f;
    --easy-table-scrollbar-color: #2d3a4f;
    --easy-table-scrollbar-thumb-color: #4c5d7a;;
    --easy-table-scrollbar-corner-color: #2d3a4f;

    --easy-table-loading-mask-background-color: #2d3a4f;
  }

  .code-editor {
    background: #272822;
    color: white
  }

  .CodeMirror {
    font-size: 20px;
  }

</style>