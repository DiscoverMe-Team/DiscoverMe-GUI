
<template>
    <header class="header">
      <div class="logo">DiscoverMe</div>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/mood-tracker">Mood Tracker</router-link></li>
          <li><router-link to="/goals">Goals</router-link></li>
        </ul>
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    name: 'AppHeader',
  };
  </script>
  
  <style scoped>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 50px;
    background-color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  }
  
  .logo {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
  }
  
  nav ul {
    list-style: none;
    display: flex;
  }
  
  nav ul li {
    margin-left: 20px;
  }
  
  nav ul li a {
    text-decoration: none;
    color: #333;
    font-weight: 500;
  }
  
  nav ul li a:hover {
    color: #78b7e1; /* Add a modern accent color */
  }
  </style>
  