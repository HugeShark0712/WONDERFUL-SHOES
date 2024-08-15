<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      showMainContent: true
    };
  },
  methods: {
    toggleContent() {
      this.showMainContent = !this.showMainContent;
    },
    goToConfigurator() { 
      this.$router.push('/configurator');
    }
  }
}
</script>

<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <div v-if="showMainContent">
      <button @click="goToConfigurator" class="about-button">Go to Configurator</button>
    </div>

    <div v-else>
      <h1>About This App</h1>
      <p>This is a simple Vue.js application demonstrating basic component toggling on a single page.</p>
      <button @click="toggleContent" class="about-button">Back to Home</button>
    </div>
  </div>
</template>

<style scoped>
.hello {
  text-align: center;
  margin-top: 60px;
}

h1 {
  color: #42b983;
  font-size: 2.5rem;
  margin-bottom: 20px;
}

p {
  font-size: 1.2rem;
  color: #2c3e50;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover {
  color: #2c3e50;
}

.about-button {
  display: inline-block;
  margin-top: 30px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.about-button:hover {
  background-color: #2c3e50;
}
</style>