<template>
    <button :class="buttonClass" @click="onClick">
      <slot></slot>
    </button>
  </template>
  
  <script>
  export default {
    name: 'CustomButton',
    props: {
      buttonClass: {
        type: String,
        default: ''
      }
    },
    methods: {
      onClick(event) {
        this.$emit('click', event);
      }
    }
  }
  </script>
  
  <style scoped>
  button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  button:hover {
    background-color: #2c3e50;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  </style>
  