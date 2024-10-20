<template>
    <section class="home">
      <h2>Welcome to DiscoverMe</h2>
      <p>Your journey to emotional well-being starts here.</p>
      <router-link to="/mood-tracker" class="btn">Start Tracking Your Mood</router-link>
    </section>
  </template>
  
  <script>
  export default {
    name: 'Home',
  };
  </script>
  
  <style scoped>
  .home {
    text-align: center;
    margin-top: 50px;
  }
  
  .btn {
    padding: 10px 20px;
    background-color: #78b7e1;
    color: white;
    text-decoration: none;
    border-radius: 5px;
  }
  
  .btn:hover {
    background-color: #78b7e1;
  }
  </style>
  