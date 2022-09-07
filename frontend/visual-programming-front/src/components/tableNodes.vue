<template>
  <el-container class="container">
    <el-main>
    <EasyDataTable
    theme-color="#1d90ff"
      v-model:items-selected="itemsSelected"
      show-index
      :headers="headers"
      :items="items"
      @click-row="showRow"
    />
  </el-main>
  </el-container>
  <el-dialog
    v-model="outerVisible"
    title="Export"
    width="70%"
  >
  <span>Code:</span>
  <pre><code></code></pre>
  <span>Console:</span>
  <pre><code></code></pre>
    <template #footer>
      <span class="dialog-footer">
        
        >
      </span>
    </template>
  </el-dialog>
  row clicked:<br />
  <div id="row-clicked"></div>
</template>
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import type { Header, Item, ClickRowArgument } from "vue3-easy-data-table";

  const outerVisible = ref(false)
  const showRow = (item: ClickRowArgument) => {
    outerVisible.value = true
    console.log((item))
    document.getElementById('row-clicked').innerHTML = JSON.stringify(item);
};


  
const headers: Header[] = [
  { text: "PLAYER", value: "player" },
  { text: "TEAM", value: "team"},
];

const items: Item[] = [
  { player: "Stephen Curry", team: "GSW", number: 30, position: 'G', indicator: {"height": '6-2', "weight": 185}, lastAttended: "Davidson", country: "USA"},
  { player: "Lebron James", team: "LAL", number: 6, position: 'F', indicator: {"height": '6-9', "weight": 250}, lastAttended: "St. Vincent-St. Mary HS (OH)", country: "USA"},
  { player: "Kevin Durant", team: "BKN", number: 7, position: 'F', indicator: {"height": '6-10', "weight": 240}, lastAttended: "Texas-Austin", country: "USA"},
  { player: "Giannis Antetokounmpo", team: "MIL", number: 34, position: 'F', indicator: {"height": '6-11', "weight": 242}, lastAttended: "Filathlitikos", country: "Greece"},
];

  </script>
  <style>
    .container {
    min-height: calc(100vh - 100px);
    }
  </style>