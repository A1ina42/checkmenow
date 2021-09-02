<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark pt-0 pb-0">
      <a class="navbar-brand" href="#">
        <router-link class="navbar-brand" :to="{ name: 'homepage' }">
          <img class="logo-img" src="@/assets/logo_cmn.png" /> </router-link
      ></a>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#toggler-menu"
        aria-controls="toggler-menu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div
        class="collapse navbar-collapse justify-content-between"
        id="toggler-menu"
      >
        <template v-if="isLoggedIn">
          <div class="ml-lg-5 ml-md-0">
            <router-link
              :to="{ name: 'createPage' }"
              class="btn btn-success mr-2 mt-1 mb-1"
              >Создание тестов</router-link
            >
            <router-link
              :to="{ name: 'testingPage' }"
              class="btn btn-primary mr-2 mt-1 mb-1"
              >Прохождение тестов</router-link
            >
          </div>
        </template>
        <form class="form-inline my-2 my-lg-0">
          <template v-if="isLoggedIn">
            <a class="nav-link current-user pl-0">{{ currentUser }}</a>
            <i class="fas fa-sign-out-alt" @click="logout"></i>
          </template>
          <template v-if="!isLoggedIn">
            <router-link class="nav-link" :to="{ name: 'login' }"
              >Вход</router-link
            >
            <router-link class="nav-link" :to="{ name: 'register' }"
              >Регистрация</router-link
            >
          </template>
        </form>
      </div>
    </nav>
  </div>
</template>

<script>
import {
  getterTypes as authGetterTypes,
  actionTypes as authActionTypes,
} from "@/store/modules/auth";
import firebase from "firebase/app";

export default {
  name: "CmnNavbar",
  computed: {
    currentUser() {
      return this.$store.getters[authGetterTypes.currentUser].name;
    },
    isLoggedIn() {
      return this.$store.getters[authGetterTypes.isLoggedIn];
    },
  },
  methods: {
    logout() {
      firebase.auth().signOut();
      this.$store.dispatch(authActionTypes.logout).then(() => {
        this.$router.push({ name: "login" });
      });
    },
  },
};
</script>

<style scoped>
.fa-sign-out-alt {
  margin-top: 3px;
  cursor: pointer;
  color: white;
  font-size: 20px;
}

.fa-sign-out-alt:hover {
  color: #f5c125;
}

.logo-img {
  width: 150px;
}

.navbar {
  background: linear-gradient(
    0deg,
    rgba(30, 30, 33, 1) 0%,
    rgba(52, 48, 48, 1) 31%,
    rgba(52, 48, 48, 1) 65%,
    rgba(30, 30, 33, 1) 100%
  );
}

.nav-link {
  color: white;
  cursor: pointer;
  user-select: none;
}

.nav-link:hover {
  color: #f5c125;
}

.current-user {
  cursor: default;
  user-select: none;
}
</style>