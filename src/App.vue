<template>
  <div id="app">
    <router-view/>

    <!-- 登录页不显示助手；登录后的业务页面右下角显示悬浮入口。 -->
    <div v-if="$route.path !== '/login'" class="assistant-widget">
      <section v-if="assistantOpen" class="assistant-panel">
        <header class="assistant-header">
          <span>情义明智能助手</span>
          <button type="button" aria-label="关闭助手" @click="assistantOpen = false">×</button>
        </header>
        <iframe
          class="assistant-frame"
          src="https://udify.app/chat/SRsgf6fHd1W4eiuk"
          title="情义明智能助手"
          allow="microphone"
        ></iframe>
      </section>
      <button
        v-else
        type="button"
        class="assistant-launcher"
        @click="assistantOpen = true"
      >
        情义明智能助手
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      // 默认收起聊天窗口，避免遮挡现有业务页面。
      assistantOpen: false
    }
  }
}
</script>

<style lang="scss">
  @import 'common/css/reset.scss';
  @import 'common/css/global.scss';

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }

  .assistant-widget {
    position: fixed;
    right: 24px;
    bottom: 24px;
    z-index: 3000;
    text-align: left;
  }

  .assistant-launcher {
    border: 0;
    border-radius: 24px;
    padding: 12px 20px;
    color: #fff;
    background: #337ecc;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.2);
    cursor: pointer;
    font-size: 14px;
  }

  .assistant-panel {
    width: 380px;
    height: min(640px, calc(100vh - 48px));
    overflow: hidden;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.24);
  }

  .assistant-header {
    height: 44px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    background: #337ecc;
    font-size: 14px;

    button {
      border: 0;
      padding: 0 4px;
      color: #fff;
      background: transparent;
      cursor: pointer;
      font-size: 24px;
      line-height: 1;
    }
  }

  .assistant-frame {
    display: block;
    width: 100%;
    height: calc(100% - 44px);
    border: 0;
  }

  @media (max-width: 480px) {
    .assistant-widget {
      right: 12px;
      bottom: 12px;
    }

    .assistant-panel {
      width: calc(100vw - 24px);
      height: calc(100vh - 24px);
    }
  }
</style>
