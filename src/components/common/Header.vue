<template>
  <div class="header-container">
    <div class="welcome-message">
      欢迎
    </div>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .header-container {
    position: fixed;
    left: 250px;
    right: 0;
    height: 50px;
    background-color: $color-gray;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0 10px;
  }
</style>
