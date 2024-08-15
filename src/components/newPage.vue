<template>
  <div class="new-page">
    <h1>Welcome to the New Page</h1>
    <p>This is another page in the application.</p>
    <button @click="goBack" class="back-button">Back to Home</button>
  </div>
</template>

<script>
export default {
  name: 'NewPage',
  methods: {
    goBack() {
      this.$router.push('/');
    }
  }
}
</script>

<style scoped>
.new-page {
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

.back-button {
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

.back-button:hover {
  background-color: #2c3e50;
}
</style>
