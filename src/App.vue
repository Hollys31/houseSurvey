<template>
  <div id="app">
      <router-view/>
     <Loading v-show="$store.state.loading" />
  </div>
</template>

<script>

import Loading from './components/Loading'
export default {
  name: 'app',
  components: {
  Loading
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
body{
  background:#F9F9F9;
}
</style>
