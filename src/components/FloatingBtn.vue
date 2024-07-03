<template>
  <div>
    <q-btn round icon="message" class="floating-btn bg-accent text-white" @click="openPopup" />
    <q-dialog v-model="isPopupOpen" full-height>
      <q-card style="width: 500px; height: 100%">
        <div>
          <i class="fa-solid fa-xmark fa-xl" @click="closePopup"></i>
        </div>
        <q-card-section class="row justify-between">
          <div class="text-h6">Send a Message</div>
          <div>
            <q-btn class="bg-accent" flat label="End Chat" color="white" @click="endChat" />
          </div>
        </q-card-section>
        <div id="mychat-container" style="height: calc(100vh - 140px); display: flex; flex-direction: column">
          <div style="flex-grow: 1; min-height: calc(100vh - 400px); overflow-y: auto;" ref="chatMessages">
            <div class="q-pa-md" style="width: 100%; max-width: 490px" align="center">
              <div v-if="messages.length === 0" class="text-center q-pa-md text-grey">
                Type to chat with help support
              </div>
              <q-chat-message v-for="(msg, index) in messages" :key="index" :text="[msg.text]"
                :sent="msg.sent" :stamp="formatTimestamp(msg.timestamp)" >
                </q-chat-message>
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
import { useQuasar } from 'quasar'

const socket = io('http://localhost:5000');

const isPopupOpen = ref(false);
const isLoggedIn = ref(false);
const userId = ref(null);
const message = ref('');
const messages = ref([]); // Array to store chat messages
const chatMessages = ref(null);
const userName = ref(null);
const $q = useQuasar()
const checkLoginStatus = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    userName.value = userData.username;
    userId.value = userData._id; // Assuming user data has an 'id' field
    isLoggedIn.value = true;
  } else {
    isLoggedIn.value = false;
  }
};

const openPopup = () => {
  checkLoginStatus();
  if (isLoggedIn.value) {
    socket.emit('join', userId.value, userName.value); // Pass userName.value instead of userName
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
    id: Date.now(),
    text: message.value,
    sent: true,
    username: userName.value,
    timestamp: new Date().toISOString() // Add timestamp
  };
  messages.value.push(msg);
  socket.emit('message', { userId: userId.value, message: message.value, username: userName.value ,timestamp: msg.timestamp});
  message.value = '';
  nextTick(() => {
    setTimeout(scrollToBottom, 50);
  });
};

const endChat = () => {
  if (isLoggedIn.value) {
    socket.emit('end', userId.value, userName.value); // Emit end chat event to server
    messages.value = []; // Clear the chat messages
    closePopup();
  }
};

// Function to format timestamp to a readable format
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour12: true });; // Format the date to a readable string
};

onMounted(() => {
  console.log("MOUNTED")
  socket.on('message', (data) => {
    messages.value.push({
      timestamp: data.timestamp,
      text: data.message,
      sent: false
    });
    
    nextTick(() => {
      setTimeout(scrollToBottom, 50);
    });
    console.log("Data",data)
    //showNotification("New Message", { body: data.message });

    $q.notify({
          message: `New Message From Admin "${data.message}"`,
          color: 'accent'
        })
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
.text-center {
  text-align: center;
}
</style>
