<script>
  import Home from './components/drawflow.vue'
  import Programs from './components/tableNodes.vue'
  
  const routes = {
    '/': Home,
    '/programs': Programs
  }
  
  export default {
    data() {
      return {
        currentPath: window.location.hash
      }
    },
    computed: {
      currentView() {
        return routes[this.currentPath.slice(1) || '/'] || NotFound
      }
    },
    mounted() {
      window.addEventListener('hashchange', () => {
        this.currentPath = window.location.hash
      })
    }
  }
</script>
  
<template>
  <el-container class="container">
  <el-header class="header-router header">
    <el-button type="primary" plain><a href="#/" class="button">Home</a></el-button>
    <el-button type="primary" plain><a href="#/programs" class="button">Programs</a></el-button>
    <component :is="currentView" />
  </el-header>
</el-container>
</template>

<style>
  .header-router {
    background-color: #132055;
  }

  a.button {
    -webkit-appearance: button;
    -moz-appearance: button;
    appearance: button;

    text-decoration: none;
    color: initial;
  }
</style>