<template>
  <div class="test3">
    <div>
      用户名：
      <input type="text" v-model="userName" />
    </div>
    <div class="msg" ref="box">
      <div
        class="msg-item"
        v-for="(item, index) in list"
        :key="index"
        :class="{ mine: item.userName === userName }"
      >
        <p>{{ item.content }}</p>
      </div>
    </div>
    <div class="input-group">
      <input type="text" v-model="contentText" />
      <button @click="sendText">发送</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userName: "Auroka",
      list: [], //聊天记录的数组
      contentText: "", //input输入的值
      ws: ""
    };
  },
  mounted() {
    console.log(Notification.permission);
    if (Notification.permission == "default") {
      Notification.requestPermission(per => {
        console.log("per:", per);
      });
    }
    setTimeout(() => {
      this.createNotify();
    }, 2000);
    if (window.WebSocket) {
      const that = this;
      this.ws = new WebSocket("ws://192.168.1.88:8081");
      console.log(this.ws);
      this.ws.onopen = function(e) {
        console.log("链接服务器成功");
      };
      this.ws.onclose = function(e) {
        console.log("服务器关闭");
      };
      this.ws.onerror = function() {
        console.log("服务器出错");
      };
      this.ws.onmessage = function(e) {
        console.log("接收到了信息");
        console.log(JSON.parse(e.data));
        that.createNotify();
        that.list = [...that.list, JSON.parse(e.data)];
      };
    }
  },
  methods: {
    //发送聊天信息
    sendText() {
      if (this.userName) {
        this.ws.send(
          JSON.stringify({ userName: this.userName, content: this.contentText })
        );
        this.contentText = "";
      }
    },
    createNotify() {
      if (Notification.permission === "granted") {
        new Notification("XX网站消息通知", {
          dir: "auto", //auto（自动）, ltr（从左到右）, or rtl（从右到左）
          tag: "testTag", //赋予通知一个ID，以便在必要的时候对通知进行刷新、替换或移除。
          icon: "https://2ue.github.io/images/common/avatar.png", //提示时候的图标
          body: "你的朋友有新状态啦，快去围观吧" // 一个图片的URL，将被用于显示通知的图标。
        });
      }
    }
  },
  watch: {
    //监听list,当有修改的时候进行div的屏幕滚动，确保能看到最新的聊天
    list: function() {
      let that = this;
      setTimeout(() => {
        that.$refs.box.scrollTop = that.$refs.box.scrollHeight;
      }, 0);
      //加setTimeout的原因：由于vue采用虚拟dom，我每次生成新的消息时获取到的div的scrollHeight的值是生成新消息之前的值，所以造成每次都是最新的那条消息被隐藏掉了
    }
  }
};
</script>

<style scoped lang="less">
.test3 {
  text-align: center;
}

.msg {
  width: 960px;
  height: 500px;
  padding: 20px;
  overflow: auto;
  padding-top: 5px;
  border: 1px solid red;
  display: inline-block;
  margin-bottom: 6px;

  .msg-item {
    position: relative;
    overflow: hidden;
    p {
      display: inline-block;
      border-radius: 40px;
      background: #3c3d5a;
      color: white;
      float: left;
      padding: 2px 12px;
      margin: 0 0 2px 0;
      max-width: 70%;
      text-align: left;
      box-sizing: border-box;
    }

    &.mine {
      p {
        float: right;
        background: aquamarine;
        color: white;
      }
    }
  }
}
</style>
