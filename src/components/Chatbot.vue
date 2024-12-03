<script setup>
import { ref, watch, onMounted } from 'vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useChatbotStore } from '@/stores/chatbot';

// Chat state
const chatbotStore = useChatbotStore();
const { chatOpen, messages } = storeToRefs(chatbotStore);
const userInput = ref('');

// Toggle chat visibility
const toggleChat = () => {
  chatbotStore.toggleChat();
};

// Scroll to the latest message
const scrollToBottom = () => {
  const chatMessages = document.querySelector('.chat-messages');
  if (chatMessages) {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
};

// Send user message and get bot response
const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  chatbotStore.addMessage(userInput.value, 'user');
  scrollToBottom();

  try {
    chatbotStore.addMessage('...', 'bot'); // Typing indicator
    const response = await axios.post('http://127.0.0.1:8000/api/chatbot-response/', {
      message: userInput.value,
    });
    chatbotStore.messages.pop(); // Remove typing indicator
    chatbotStore.addMessage(response.data.response, 'bot');
  } catch (error) {
    chatbotStore.messages.pop(); // Remove typing indicator
    chatbotStore.addMessage('Sorry, something went wrong. Please try again.', 'bot');
  }

  userInput.value = '';
  scrollToBottom();
};

// Persist chat messages in localStorage
onMounted(() => {
  const savedMessages = JSON.parse(localStorage.getItem('chatMessages'));
  if (savedMessages) {
    chatbotStore.$patch({ messages: savedMessages });
  }
});

watch(
  () => messages.value,
  (newMessages) => {
    localStorage.setItem('chatMessages', JSON.stringify(newMessages));
  },
  { deep: true }
);
</script>

<style scoped>
.chat-bubble {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: var(--primary-color, #8A2BE2);;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chat-panel {
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  height: 400px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.chat-header {
  background: var(--primary-color, #8A2BE2);
  color: white;
  padding: 10px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  padding: 10px;
  border-radius: 8px;
  max-width: 70%;
}

.message.user {
  align-self: flex-end;
  background-color: #e0e0e0;
}

.message.bot {
  align-self: flex-start;
  background-color: #f1f8e9;
}

.chat-input {
  display: flex;
  border-top: 1px solid #ddd;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 0 0 0 10px;
}

.chat-input button {
  background: var(--primary-color, #8A2BE2);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 0 0 10px 0;
}
</style>

<template>
  <div>
    <!-- Floating Chat Bubble -->
      <Button class="chat-bubble" icon="pi pi-comments" severity="info" rounded  @click="toggleChat" />

    <!-- Chat Panel -->
    <div v-if="chatOpen" class="chat-panel">
      <div class="chat-header">
        <span>Mental Health Assistant</span>
        <button @click="toggleChat" class="close-button">&times;</button>
      </div>
      <div class="chat-messages">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.sender]"
        >
          {{ message.text }}
        </div>
      </div>
      <div class="chat-input">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Type your message..."
        />
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>
