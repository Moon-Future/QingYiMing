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

<style lang="scss">
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
    &.no-padding {
      // padding: 6px !important;
      .cell {
        padding-left: initial !important;
        padding-right: initial !important;
        .el-select {
          width: 100% !important;
        }
      }
    }
    input {
      padding: initial !important;
    }
  }
  .subWait {
    background-color: #c0c0c0;
    cursor: wait;
  }
</style>
