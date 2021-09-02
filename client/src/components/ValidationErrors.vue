<template>
  <ul>
    <li v-for="errorMessage in validationErrors" :key="errorMessage">
      {{ errorMessage }}
    </li>
  </ul>
</template>

<script>
export default {
  name: "CmnValidationErrors",
  props: {
    validationErrors: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
li {
  color: rgb(184, 38, 38);
  list-style: none;
  font-family: "Exo 2";
}

li::before {
  content: "✖";
}

ul {
  padding: 0;
}
</style>