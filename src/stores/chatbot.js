// stores/chatbot.js
import { defineStore } from 'pinia';

export const useChatbotStore = defineStore('chatbot', {
  state: () => ({
    chatOpen: false,
    messages: [{ text: 'Hi! How can I support you today?', sender: 'bot' }],
  }),
  actions: {
    toggleChat() {
      this.chatOpen = !this.chatOpen;
    },
    addMessage(message, sender) {
      this.messages.push({ text: message, sender });
    },
  },
});
