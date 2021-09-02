<template>
  <div class="container">
    <h1 v-if="isEdit" class="title">Редактировать</h1>
    <h1 v-else class="title">Добавить</h1>
    <form @submit.prevent="onSubmit" v-if="question">
      <div class="form-group">
        <cmn-validation-errors v-if="errors" :validation-errors="errors" />
        <label for="name">Название теста</label>
        <span class="float-right" v-if="isOpen" @click="isOpenToggle">
          <label for="status" class="is-open-label">Открыто</label>
          <i
            class="fas fa-lock-open ml-2"
            content="Тест доступен для прохождения"
            v-tippy
          ></i>
        </span>
        <span class="float-right" v-if="!isOpen" @click="isOpenToggle">
          <label for="status" class="is-open-label">Закрыто</label>
          <i
            class="fas fa-lock ml-2"
            content="Тест недоступен для прохождения"
            v-tippy
          ></i>
        </span>
        <input type="text" class="form-control" id="name" v-model="name" />
      </div>

      <div class="form-group">
        <label for="radio" class="mb-3"
          >Что делать с результатами после прохождения:</label
        >
        <div class="form-group">
          <label for="dontShow">
            <input
              value="dontShow"
              name="radio"
              type="radio"
              id="dontShow"
              class="mr-2"
              v-model="resultAfterTesting"
            />Не показывать</label
          >
        </div>
        <div class="form-group">
          <label for="show">
            <input
              value="show"
              name="radio"
              type="radio"
              id="show"
              class="mr-2"
              v-model="resultAfterTesting"
            />Показывать без правильных ответов</label
          >
        </div>
        <div class="form-group">
          <label for="showAnswers">
            <input
              value="showAnswers"
              name="radio"
              type="radio"
              id="showAnswers"
              class="mr-2"
              v-model="resultAfterTesting"
            />Показывать с правильными ответами</label
          >
        </div>
      </div>
      <div class="form-group">
        <label for="questions">Выберите вопросы</label>
        <div class="table-questions" v-if="question.question.length > 0">
          <table>
            <tr
              v-for="(item, index) in question.question"
              :key="index"
              class="mr-3"
            >
              <td>
                <input
                  type="checkbox"
                  v-model="questionsId"
                  :value="item._id"
                />
              </td>
              <td v-html="item.name"></td>
            </tr>
          </table>
        </div>
        <div class="table-questions" v-else>
          ❌ Сначала необходимо добавить вопросы!
        </div>
      </div>
      <div class="btn-center mb-3">
        <button type="submit" class="btn btn-success" :disabled="isSubmitting">
          <i class="fas fa-save mr-2"></i>Сохранить
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CmnValidationErrors from "@/components/ValidationErrors";
import { actionTypes as actionTypesQuestion } from "@/store/modules/question";
export default {
  name: "CmnTestbankForm",
  props: {
    initialValues: {
      type: Object,
      required: true,
    },
    errors: {
      type: Array,
      required: false,
    },
    isSubmitting: {
      type: Boolean,
      required: true,
    },
    isEdit: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    CmnValidationErrors,
  },
  data() {
    return {
      name: this.initialValues.name,
      questionsId: this.initialValues.questionsId,
      isOpen: this.initialValues.isOpen,
      resultAfterTesting: this.initialValues.resultAfterTesting,
    };
  },
  computed: {
    ...mapState({
      question: (state) => state.question.data,
    }),
  },
  mounted() {
    this.$store.dispatch(actionTypesQuestion.getQuestion);
  },
  methods: {
    onSubmit() {
      const form = {
        name: this.name,
        questions: this.questionsId,
        isOpen: this.isOpen,
        resultAfterTesting: this.resultAfterTesting,
      };
      this.$emit("testbankSubmit", form);
    },
    isOpenToggle() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>

<style scoped>
.form-group {
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
}

.btn-center {
  text-align: center;
}

input[type="checkbox"],
input[type="radio"] {
  transform: scale(1.2);
  margin: 5px;
}

td {
  vertical-align: top;
}

.table-questions {
  padding: 10px;
  background-color: rgba(143, 143, 143, 0.1);
  border-radius: 5px;
  border: 1px dashed #28a745;
}

.fa-lock,
.fa-lock-open {
  cursor: pointer;
}

.is-open-label {
  cursor: pointer;
  user-select: none;
}
</style>