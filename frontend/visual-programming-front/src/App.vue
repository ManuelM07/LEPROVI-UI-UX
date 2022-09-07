<script>
  import Home from './components/drawflow.vue'
  import About from './components/tableNodes.vue'
  
  const routes = {
    '/': Home,
    '/about': About
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
  <el-header class="header">
    <el-button type="primary" plain><a href="#/">Home</a></el-button>
    <el-button type="success" plain><a href="#/about">About</a></el-button>
    <component :is="currentView" />
  </el-header>
  </template>

  <style>
  </style>