<template>
  <div class="admin-page q-pa-none">
    <!-- Left sidebar with client list -->
    <div class="sidebar q-pa-none q-gutter-sm">
      <q-list class="text-black">
        <q-item-label header>Clients</q-item-label>
        <q-item v-for="client in clients" :key="client.id" clickable @click="selectClient(client)"
          :class="{ 'q-item-selected': client.id === selectedClient?.id }">
          <q-item-section avatar>
            <q-avatar>
              <img src="https://cdn.quasar.dev/img/avatar3.jpg" />
            </q-avatar>
          </q-item-section>
          <q-item-section>{{ client.name }}</q-item-section>
          <q-item-section v-if="newMessagesCount[client.id]" class="new-messages-counter">
            {{ newMessagesCount[client.id] }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Main chat area -->
    <div class="main-container q-pa-none q-gutter-sm">
      <div v-if="selectedClient" class="chat-container">
        <div class="q-px-md">
          <h6>Chat with {{ selectedClient.name }}</h6>
          <q-separator color="black" />
        </div>

        <div style="height: calc(100vh - 130px); display: flex; flex-direction: column;"
          class="q-px-md q-py-sm q-gutter-y-xs">
          <div style="flex-grow: 1; min-height: calc(100vh - 400px); overflow-y: auto;" class="q-pa-md"
            ref="chatMessages">
            <div>
              <q-chat-message v-for="msg in messages" :key="msg.id" :text="[msg.text]" :sent="msg.sent" />
            </div>
          </div>

          <div>
            <q-card-section>
              <div class="row" align="center">
                <div class="col-10">
                  <q-input color="black" bg-color="white" v-model="newMessage" label="Message"
                    @keyup.enter="sendMessage" />
                </div>
                <div class="col-2">
                  <q-btn class="bg-accent" flat label="Send" @click="sendMessage" color="white" />
                </div>
              </div>
            </q-card-section>
          </div>
        </div>
      </div>
      <div v-else class="no-client-selected q-mt-xl q-ml-md">
        <p>Select a client to start chatting</p>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, nextTick } from 'vue';
import io from "socket.io-client";
import { showNotification } from '../components/ShowNotification';

const clients = ref([]);
const selectedClient = ref(null);
const messages = ref([]);
const newMessage = ref('');
const newMessagesCount = ref({});

// Define chatMessages ref to reference the chat container element
const chatMessages = ref(null);

const socket = io('http://localhost:5000');

onMounted(() => {
  console.log('Admin component mounted');
  socket.emit('adminJoin');

  socket.on('activeRooms', (activeRooms) => {
    console.log('Active rooms:', activeRooms);
    clients.value = Object.values(activeRooms);
  });

  socket.on('message', (data) => {
    console.log('Message received from client:', data);
    if (selectedClient.value && selectedClient.value.id === data.userId) {
      messages.value.push({
        id: messages.value.length,
        text: data.message,
        sent: false
      });
      nextTick(() => {
        setTimeout(scrollToBottom, 50);
      });
      showNotification('New Message', { body: data.message });
    } else {
      if (!newMessagesCount.value[data.userId]) {
        newMessagesCount.value[data.userId] = 1;
      }
      else {
        newMessagesCount.value[data.userId]++;
      }
    }
  });

  socket.on('previousMessages', (previousMessages) => {
    console.log('Previous messages:', previousMessages);
    if (selectedClient.value && previousMessages.userId === selectedClient.value.id) {
      messages.value = previousMessages.messages.map((msg, index) => ({
        id: index,
        text: msg.message,
        sent: msg.sentBy === 'admin'
      }));
      nextTick(() => {
        scrollToBottom();
      });
    }
  });
});

const selectClient = (client) => {
  selectedClient.value = client;
  newMessagesCount.value[client.id]=0;
  messages.value = []; // Clear messages when a new client is selected
  socket.emit('fetchMessages', client.id);

  socket.on('previousMessages', (previousMessages) => {
    console.log('Previous messages:', previousMessages);
    messages.value = previousMessages.map((msg, index) => ({
      id: index,
      text: msg.message,
      sent: msg.sentBy === 'admin'
    }));

    nextTick(() => {
      setTimeout(scrollToBottom, 50);
    });
    console.log("tick")
  });
};

const sendMessage = () => {
  if (selectedClient.value) {
    const msg = {
      id: messages.value.length,
      text: newMessage.value,
      sent: true
    };
    messages.value.push(msg);
    socket.emit('adminMessage', { userId: selectedClient.value.id, message: newMessage.value });
    newMessage.value = '';
    nextTick(() => {
      setTimeout(scrollToBottom, 50);
    });
  }
};

const scrollToBottom = () => {
  const el = chatMessages.value;
  console.log("ref", el)
  if (el) {
    el.scrollTop = el.scrollHeight;
    console.log("el", el.scrollTop)
  }

};
</script>


<style scoped>
.admin-page {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 300px;
  background: #f5f5f5;
  border-right: 1px solid #e0e0e0;
  box-sizing: border-box;
}

.q-item-selected {
  background-color: #f0f0f0;
  color: #000;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.no-client-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.new-messages-counter{
  position: absolute;
  top: 10px;
  right:10px;
  background-color: red;
  color: #e0e0e0;
  border-radius: 50%;
  font-size: 12px;
  width: 20px;
  height: 20px;
  text-align: center;

}
</style>
