<template>
  <div id="app">
    <div className="header">
      <h2>Realtime Pointing Poker</h2>
    </div>
    <div className="ChatHistory">
      <h2>Chat History</h2>
      <p v-for="message in messages" :key="message.data">
        {{ message.data }}
      </p>
    </div>
    <button v-on:click="sendMessage('7')">7</button>
  </div>
</template>

<script>
import { connect, sendMsg } from "./websocket.js";
export default {
  name: "App",
  data: function () {
    return {
      messages: [],
    };
  },
  methods: {
    sendMessage: function (message) {
      console.log("Hello");
      sendMsg(message);
    },
  },
  created: function () {
    connect((msg) => {
      this.messages = this.messages.concat(msg);
    });
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.header {
  background-color: #15223b;
  width: 100%;
  margin: 0;
  padding: 10px;
  color: white;

  h2 {
    margin: 0;
    padding: 0;
  }
}
.ChatHistory {
  background-color: #f7f7f7;
  margin: 0;
  padding: 20px;
  h2 {
    margin: 0;
    padding: 0;
  }
}
</style>
