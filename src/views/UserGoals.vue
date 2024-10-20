<template>
    <section class="goals">
      <h2>Your Mental Health Goals</h2>
      <form @submit.prevent="addGoal">
        <input v-model="newGoal" placeholder="Add a new goal" />
        <button type="submit">Add Goal</button>
      </form>
      <ul>
        <li v-for="goal in goals" :key="goal.id">{{ goal.text }}</li>
      </ul>
    </section>
  </template>
  
  <script>
  export default {
    data() {
      return {
        newGoal: '',
        goals: []
      };
    },
    methods: {
      addGoal() {
        this.goals.push({ text: this.newGoal });
        this.newGoal = '';
      }
    }
  };
  </script>
  
  <style scoped>
  .goals {
    padding: 20px;
  }
  
  button {
    background-color: #78b7e1;
    color: white;
    padding: 10px;
    border-radius: 5px;
    border: none;
  }
  </style>
  