<template>
  <div class="container">
    <div class="row justify-content-md-center">
      <div
        class="col-9 col-sm-7 col-md-5 col-lg-5 col-xl-4 reg-border ml-auto mr-auto"
      >
        <h1 class="title">Регистрация</h1>
        <cmn-validation-errors
          v-if="validationErrors"
          :validation-errors="validationErrors"
        />
        <form @submit.prevent="onSubmit">
          <div class="form-group">
            <label for="name">Имя пользователя</label>
            <input
              type="text"
              v-model="name"
              class="form-control form-control-lg"
              placeholder="Имя пользователя"
            />
          </div>

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
            <label for="password1">Пароль</label>
            <input
              id="password1"
              v-model="password1"
              type="password"
              class="form-control form-control-lg"
              placeholder="Пароль"
            />
          </div>

          <div class="form-group">
            <label for="password2">Повторите пароль</label>
            <input
              id="password2"
              v-model="password2"
              type="password"
              class="form-control form-control-lg"
              placeholder="Повторите пароль"
            />
          </div>

          <div class="form-group form-check">
            <input
              type="checkbox"
              class="form-check-input"
              id="conditions"
              v-model="conditions"
            />
            <label class="form-check-label" for="conditions"
              >Я принимаю условия
              <router-link :to="{ name: 'terms' }"
                >пользовательского соглашения</router-link
              ></label
            >
          </div>

          <div class="form-group">
            <button
              type="submit"
              class="btn btn-dark btn-lg btn-block"
              :disabled="isSubmitting"
            >
              Зарегистрироваться
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CmnValidationErrors from "@/components/ValidationErrors";
import { actionTypes } from "@/store/modules/auth";
export default {
  name: "CmnRegister",
  components: {
    CmnValidationErrors,
  },
  data() {
    return {
      email: "",
      password1: "",
      password2: "",
      name: "",
      conditions: false,
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
        .dispatch(actionTypes.register, {
          email: this.email,
          name: this.name,
          password1: this.password1,
          password2: this.password2,
          conditions: this.conditions,
        })
        .then((user) => {
          this.$router.push({ name: "homepage" });
        });
    },
  },
};
</script>


<style scoped>
.reg-border {
  padding: 30px;
  border: 2px solid black;
  border-radius: 20px;
  background-color: #eee;
  margin: 40px;
}
</style>