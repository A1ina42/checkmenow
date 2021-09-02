<template>
  <div id="app">
    <div>
      <cmn-navbar class="sticky-top" />
    </div>
    <div id="content">
      <router-view />
    </div>
  </div>
</template>

<script>
import CmnNavbar from "@/components/Navbar";
import { actionTypes } from "@/store/modules/auth";

export default {
  name: "CmnApp",
  components: {
    CmnNavbar,
  },
  mounted() {
    this.$store.dispatch(actionTypes.getCurrentUser).then(() => {});
  },
};
</script>

<style>
div {
  font-family: "Exo 2";
}

body {
  background-image: url("./assets/background.png");
}
.title {
  margin-bottom: 30px;
  text-align: center;
}

.fa-trash,
.fa-edit,
.fa-plus-square,
.fa-lock,
.fa-user-plus,
.fa-lock-open,
.fa-sort-down,
.fa-sort-up,
.fa-hourglass-half,
.fa-check,
.fa-times,
.fa-list,
.fa-chart-bar,
.fa-copy {
  color: #616161;
  font-size: 20px;
  user-select: none;
  cursor: pointer;
}

.fa-copy:focus,
.fa-lock-open:focus,
.fa-hourglass-half:focus,
.fa-check:focus,
.fa-times:focus,
.fa-plus-square:focus,
.fa-list:focus,
.fa-lock:focus,
.fa-edit:focus,
.fa-user-plus:focus,
.fa-trash:focus,
.fa-sort-down:focus,
.fa-chart-bar:focus,
.fa-sort-up:focus {
  outline: none;
}

.fa-trash:hover,
.fa-times {
  color: rgb(180, 30, 30);
}
.fa-edit:hover,
.fa-check {
  color: #28a745;
}

.fa-user-plus:hover,
.fa-list:hover,
.fa-chart-bar:hover {
  color: #3896fa;
}

.fa-sort-down:hover,
.fa-hourglass-half,
.fa-sort-up:hover,
.fa-copy:hover {
  color: #f5c125;
}

.ql-syntax {
  background-color: rgb(88, 88, 88) !important;
  color: white;
  padding: 5px;
}

.fa-lock {
  color: rgb(136, 51, 51);
}

.fa-lock-open {
  color: rgb(58, 136, 51);
}

.sticky-top {
  position: fixed;
  top: 0;
  width: 100%;
}

#content {
  padding-top: 65px;
}
</style>