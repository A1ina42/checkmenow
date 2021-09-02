<template>
  <div class="container">
    <div class="row justify-content-center">
      <div
        class="col-9 col-sm-7 col-md-5 col-lg-4 col-xl-4 ml-auto mr-auto log-border"
      >
        <h1 class="title">Вход</h1>
        <cmn-validation-errors
          v-if="validationErrors"
          :validation-errors="validationErrors"
        />
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              v-model="email"
              class="form-control form-control-lg"
              placeholder="Email"
            />
          </div>

          <div class="form-group">
            <label for="password">Пароль</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control form-control-lg"
              placeholder="Пароль"
            />
          </div>

          <div class="form-group">
            <button
              type="submit"
              class="btn btn-dark btn-lg btn-block"
              :disabled="isSubmitting"
            >
              Войти
            </button>
          </div>
        </form>
        <div class="form-group">
          <button class="btn btn-light form-control google-btn" @click="gogin">
            <img
              src="@/assets/google_logo.png"
              class="google mr-2"
              :disabled="isSubmitting"
            />
            <span>Войти с помощью Google</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CmnValidationErrors from "@/components/ValidationErrors";
import { actionTypes } from "@/store/modules/auth";
import firebase from "firebase/app";
export default {
  name: "CmnRegister",
  components: {
    CmnValidationErrors,
  },
  data() {
    return {
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapState({
      isSubmitting: (state) => state.auth.isSubmitting,
      validationErrors: (state) => state.auth.validationErrors,
    }),
  },
  methods: {
    onSubmit() {
      this.$store
        .dispatch(actionTypes.login, {
          email: this.email,
          name: this.name,
          password: this.password,
          g: false,
        })
        .then(() => {
          this.$router.push({ name: "homepage" });
        });
    },
    gogin() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          this.$store
            .dispatch(actionTypes.login, {
              email: result.user.email,
              password: result.user.uid,
              g: true,
              name: result.user.displayName,
            })
            .then(() => {
              this.$router.push({ name: "homepage" });
            });
        })
        .catch((err) => {
          this.error = err.message;
        });
    },
  },
};
</script>


<style>
.log-border {
  border: 2px solid black;
  border-radius: 20px;
  background-color: #eee;
  margin: 40px;
  padding: 30px;
}
.google {
  width: 45px;
}
.google-btn {
  height: auto;
  box-shadow: 2px 2px 5px #c7c7c7;
}
</style>