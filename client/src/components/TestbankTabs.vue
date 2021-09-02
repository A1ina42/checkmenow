<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "CmnTestbankTabs",
};
</script>

<style scoped>
.nav-link {
  color: black;
}

.router-link-active {
  background-color: #28a745;
  color: white;
}
</style>