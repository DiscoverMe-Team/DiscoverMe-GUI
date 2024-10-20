<template>
  <div id="app">
    <AppHeader />
    <main>
      <section class="hero">
        <h1>DiscoverMe</h1>
        <p>Your journey to better mental health starts here.</p>
        <button class="cta-button">Get Started</button>
      </section>
      <section class="mission">
        <h2>Mission</h2>
        <p>Track your mood and set goals to improve your mental well-being over time.</p>
      </section>
    </main>
    <router-view />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';

export default {
  name: 'App',
  components: {
    AppHeader
  }
};
</script>

<style scoped>
/* Global Styles */
#app {
  font-family: 'Poppins', sans-serif; /* Modern, clean font */
  color: #333;
  margin: 0;
  padding: 0;
}

/* Hero Section - Full-width with bold text */
.hero {
  background-color: #99d9f4; /* Light pastel background */
  text-align: center;
  padding: 100px 20px;
  color: #333;
}

.hero h1 {
  font-size: 4rem; /* Large, bold heading */
  font-weight: bold;
}

.hero p {
  font-size: 1.5rem;
  margin: 20px 0;
}

.cta-button {
  background-color: black;
  color: white;
  border: none;
  padding: 15px 30px;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 4px;
}

.cta-button:hover {
  background-color: #333;
}

/* Mission Section */
.mission {
  text-align: center;
  padding: 50px;
  background-color: #f9f9f9; /* Light grey background */
}

.mission h2 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 20px;
}

.mission p {
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}
</style>
