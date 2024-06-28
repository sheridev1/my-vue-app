<template>
    <div>
      <q-btn round icon="message" class="floating-btn bg-accent text-white" @click="openPopup" />
      <q-dialog v-model="isPopupOpen" full-height>
        <q-card style="width: 500px; height: 100%">
          <div>
            <i class="fa-solid fa-xmark fa-xl" @click="closePopup"></i>
          </div>
          <q-card-section>
            <div class="text-h6">Send a Message</div>
          </q-card-section>
          <div id="mychat-container" style="height: calc(100vh - 140px); display: flex; flex-direction: column">
            <div style="flex-grow: 1; min-height: calc(100vh - 400px); overflow-y: auto;" ref="chatMessages">
              <div class="q-pa-md" style="width: 100%; max-width: 490px" align="center">
                <q-chat-message v-for="(msg, index) in messages" :key="index" :text="[msg.content]"
                  :sent="msg.sent" />
              </div>
            </div>
            <div v-if="isLoggedIn">
              <div>
                <q-card-section>
                  <div class="row" align="center">
                    <div class="col-10">
                      <q-input color="black" bg-color="white" v-model="message" label="Message"
                        @keyup.enter="sendMessage" />
                    </div>
                    <div class="col-2">
                      <q-btn class="bg-accent" flat label="Send" color="white" @click="sendMessage" />
                    </div>
                  </div>
                </q-card-section>
              </div>
            </div>
            <div v-else>
              <q-card-section class="row justify-center">
                <q-btn class="bg-accent" flat label="Login to chat" color="white" @click="redirectToLogin" />
              </q-card-section>
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick } from 'vue';
  import io from "socket.io-client";
  import { showNotification } from './ShowNotification';
  
  const socket = io('http://localhost:5000');
  
  const isPopupOpen = ref(false);
  const isLoggedIn = ref(false);
  const userId = ref(null);
  const message = ref('');
  const messages = ref([]); // Array to store chat messages
  const chatMessages = ref(null);
  
  const checkLoginStatus = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      console.log("userData", userData._id);
      userId.value = userData._id; // Assuming user data has an 'id' field
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
  };
  
  const openPopup = () => {
    checkLoginStatus();
    if (isLoggedIn.value) {
      socket.emit('join', userId.value);
    }
    isPopupOpen.value = true;
    nextTick(() => {
      setTimeout(scrollToBottom, 50);
    });
  };
  
  const closePopup = () => {
    isPopupOpen.value = false;
  };
  
  const sendMessage = () => {
    if (!userId.value) {
      console.error('User ID not found. Cannot send message.');
      return;
    }
  
    const msg = {
      content: message.value,
      sent: true
    };
    messages.value.push(msg);
    console.log('Message sent:', message.value);
    socket.emit('message', { userId: userId.value, message: message.value });
    message.value = '';
    nextTick(() => {
      setTimeout(scrollToBottom, 50);
    });
  };
  
  onMounted(() => {
    socket.on('message', (data) => {
      console.log('Message from admin:', data.message);
      messages.value.push({
        content: data.message,
        sent: false
      });
      showNotification("New Message", { body: data.message });
      nextTick(() => {
        setTimeout(scrollToBottom, 50);
      });
    });
  });
  
  const scrollToBottom = () => {
    const el = chatMessages.value;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };
  </script>
  
  <style scoped>
  .floating-btn {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
  }
  </style>
  