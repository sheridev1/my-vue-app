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
          <h6>Chat with {{ selectedClient.name }}</h6> <!-- Updated to client.name -->
          <q-separator color="black" />
        </div>

        <div style="height: calc(100vh - 130px); display: flex; flex-direction: column;"
          class="q-px-md q-py-sm q-gutter-y-xs">
          <div style="flex-grow: 1; min-height: calc(100vh - 400px); overflow-y: auto;" class="q-pa-md"
            ref="chatMessages">
            <div>
              <template v-for="(group, index) in groupedMessages" :key="index">
                <div class="date-separator">{{ group.date }}</div>
                <q-chat-message v-for="(msg, idx) in group.messages" :key="idx" :text="[msg.text]" :sent="msg.sent"
                  :stamp="formatTimestamp(msg.timestamp)" />
              </template>
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
import { ref, onMounted, nextTick, computed } from 'vue';
import io from "socket.io-client";
import { useQuasar } from 'quasar';

const clients = ref([]);
const selectedClient = ref(null);
const messages = ref([]);
const newMessage = ref('');
const newMessagesCount = ref({});
const chatMessages = ref(null);
const $q = useQuasar();
const socket = io('http://localhost:5000');

onMounted(() => {
  console.log('Admin component mounted');
  socket.emit('adminJoin');

  console.log("Clients", clients.value);

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
        sent: false,
        username: data.username,
        timestamp: data.timestamp
      });
      nextTick(() => {
        setTimeout(scrollToBottom, 50);
      });
    } else {
      if (!newMessagesCount.value[data.userId]) {
        newMessagesCount.value[data.userId] = 1;
      } else {
        newMessagesCount.value[data.userId]++;
      }
      $q.notify({
        message: `New Message From ${data.username} "${data.message}"`,
        color: 'accent'
      });
    }
  });

  socket.on('previousMessages', (previousMessages) => {
    console.log('Previous messages:', previousMessages);
    console.log('Previous messages:', previousMessages.messages);

    if (previousMessages && Array.isArray(previousMessages.messages)) {
      messages.value = previousMessages.messages.map((msg, index) => ({
        id: index,
        text: msg.message,
        sent: msg.sentBy === 'admin',
        username: msg.username,
        timestamp: msg.timestamp // Add timestamp
      }));
    } else {
      messages.value = [];
    }
    nextTick(() => {
      scrollToBottom();
    });
  });
});

const selectClient = (client) => {
  selectedClient.value = client;
  newMessagesCount.value[client.id] = 0;
  messages.value = []; // Clear messages when a new client is selected
  socket.emit('fetchMessages', client.id);

  socket.on('previousMessages', (previousMessages) => {
    console.log('Previous messages:', previousMessages);
    console.log('Previous messages:', previousMessages.messages);

    if (previousMessages && Array.isArray(previousMessages.messages)) {
      messages.value = previousMessages.messages.map((msg, index) => ({
        id: index,
        text: msg.message,
        sent: msg.sentBy === 'admin',
        username: msg.username,
        timestamp: msg.timestamp // Add timestamp
      }));
    } else {
      messages.value = [];
    }
    nextTick(() => {
      scrollToBottom();
    });
  });
};

const sendMessage = () => {
  if (selectedClient.value) {
    const msg = {
      id: messages.value.length,
      text: newMessage.value,
      sent: true,
      username: 'Admin',
      timestamp: new Date().toISOString() // Add timestamp
    };
    messages.value.push(msg);
    socket.emit('adminMessage', { userId: selectedClient.value.id, message: newMessage.value, username: 'Admin', timestamp: msg.timestamp });
    newMessage.value = '';
    nextTick(() => {
      setTimeout(scrollToBottom, 50);
    });
  }
};

const scrollToBottom = () => {
  const el = chatMessages.value;
  console.log("ref", el);
  if (el) {
    el.scrollTop = el.scrollHeight;
    console.log("el", el.scrollTop);
  }
};

// Function to format timestamp to a readable format
const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', { hour12: true });
};

// Function to format date to a readable format
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

// Computed property to group messages by day
const groupedMessages = computed(() => {
  const groups = [];
  let currentGroup = { date: '', messages: [] };

  messages.value.forEach((msg) => {
    const msgDate = formatDate(msg.timestamp);
    if (msgDate !== currentGroup.date) {
      if (currentGroup.messages.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = { date: msgDate, messages: [msg] };
    } else {
      currentGroup.messages.push(msg);
    }
  });

  if (currentGroup.messages.length > 0) {
    groups.push(currentGroup);
  }

  return groups;
});
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
  background-color: #DB4444;
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

.timestamp {
  font-size: 0.8em;
  color: gray;
  margin-top: 2px;
}

.no-client-selected {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.new-messages-counter {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #DB4444;
  color: #e0e0e0;
  border-radius: 50%;
  font-size: 12px;
  width: 20px;
  height: 20px;
  text-align: center;
}

.date-separator {
  text-align: center;
  font-weight: bold;
  margin: 10px 0;
}
</style>
