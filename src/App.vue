<template>
  <div id="app">
    <router-view class="page"/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, “Segoe UI”, Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  min-width: 320px;
  min-height: 320px;
}

.page {
  height: 100%;
  overflow: auto;
  background-color: #e5edf1;
}
</style>
