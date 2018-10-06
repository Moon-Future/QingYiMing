<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  @import 'common/css/reset.scss';
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }
  .field-required::after {
    content: ' *';
    color: red;
  }
  table th, table td {
    text-align: center !important;
  }
  .subWait {
    background-color: #c0c0c0;
    cursor: wait;
  }
</style>
