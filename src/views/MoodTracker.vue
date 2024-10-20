<template>
    <section class="mood-tracker">
      <h2>Log Your Mood</h2>
      <form @submit.prevent="submitMood">
        <div class="input-group">
          <label for="mood">Mood</label>
          <input type="text" v-model="mood" placeholder="Describe your mood" required />
        </div>
        <div class="input-group">
          <label for="note">Notes</label>
          <textarea v-model="note" placeholder="Any specific thoughts or triggers?" required></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        mood: '',
        note: ''
      };
    },
    methods: {
      submitMood() {
        console.log(`Mood: ${this.mood}, Note: ${this.note}`);
      }
    }
  };
  </script>
  
  <style scoped>
  .mood-tracker {
    padding: 20px;
  }
  
  .input-group {
    margin-bottom: 20px;
  }
  
  button {
    background-color: #78b7e1;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
  }
  </style>
  