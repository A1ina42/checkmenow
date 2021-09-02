<template>
  <div class="container">
    <h1 class="title">Мои прохождения</h1>
    <div v-if="myPassing">
      <!-- Перебор тестов группы -->
      <div
        v-for="(item, index) in myPassing"
        :key="index"
        class="d-flex justify-content-between"
      >
        <!-- Название теста -->
        <div class="m-2 col-8 passing">
          <i>{{ item.testbank.user.name }}</i> <br />
          <hr />
          {{ item.testbank.name }}
        </div>
        <!-- Функциональные кнопки -->
        <div class="col-4 text-right mt-auto mb-auto">
          <router-link
            :to="{ name: 'run', params: { slug: item.testbank.link } }"
            class="btn btn-outline-primary mr-2 mt-1 mb-1 w-250"
            >Пройти</router-link
          >
          <router-link
            :to="{
              name: 'currentResult',
              params: { slug: item.testbank.link },
            }"
            class="btn btn-outline-success mr-2 mt-1 mb-1"
            >Результат</router-link
          >
        </div>
      </div>
      <b-alert :show="myPassing.length == 0" variant="warning"
        >Прохождения не найдены</b-alert
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CmnLoading from "@/components/Loading";
import { actionTypes } from "@/store/modules/passing";
import CmnValidationErrors from "@/components/ValidationErrors";

export default {
  name: "CmnMyPassing",
  components: {
    CmnLoading,
    CmnValidationErrors,
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.passing.isLoading,
      myPassing: (state) => state.passing.myPassing,
      error: (state) => state.passing.error,
    }),
  },
  async mounted() {
    await this.fetchMyPassing();
  },
  methods: {
    //* Получение списка моих прохождений
    async fetchMyPassing() {
      await this.$store.dispatch(actionTypes.getMyPassing);
    },
  },
};
</script>

<style scoped>
.test-name {
  min-width: 200px;
}

.container {
  max-width: 900px;
}

.passing {
  background-color: rgba(143, 143, 143, 0.1);
  padding: 10px;
  border-radius: 5px;
  border: 1px dashed #007bff;
  width: 900px;
}
</style>