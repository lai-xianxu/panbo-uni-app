import { ref } from "vue";
const websoket = ref();

const webSoketInit = () => {
  //   const proto = window.location.protocol === "http:" ? "ws:" : "wss:";
  //   //路径
  //   const wsUrl = `${proto}//${window.location.host}/kitop`;

  websoket.value = uni.connectSocket({
    url: "http://113.250.177.237:8080/jeecg-boot/drag/websocket/sendData",
    success: () => {
      console.log("websoket连接成功");
    },
    fail: () => {
      console.log("websoket连接失败");
    //   uni.showToast({
    //     title: "websoket连接失败",
    //     icon: "error",
    //     duration: 2000,
    //   });
    },
  });

  websoket.value.onOpen((res: any) => {
    console.log("WebSocket连接正常打开中...！", res);
  });

  websoket.value.onClose(() => {
    console.log("已经被关闭了");
  });
};

// 关闭websocket【离开这个页面的时候执行关闭】
const closeSocket = () => {
  websoket.value.close({
    success(res: any) {
      this.is_open_socket = false;
      console.log("关闭成功", res);
    },
    fail(err: any) {
      console.log("关闭失败", err);
    },
  });
};

const sendMessage = (data: string) => {
  websoket.value.send({
    data,
    async success() {
      console.log("消息发送成功");
    },
  });
};
export { websoket, webSoketInit, closeSocket, sendMessage };
