<template>
  <div class="container testbank-center">
    <cmn-loading v-if="isLoading" />
    <div v-if="error">
      <h1 class="title">Прохождение теста</h1>
      <div class="alert alert-warning row" role="alert">
        <div class="col-2 col-sm-1 pr-0">
          <i
            class="fas fa-exclamation-triangle mr-2"
            style="font-size: 30px"
          ></i>
        </div>
        <div class="col-10 col-sm-11 pl-0 center">
          <p class="align-middle text-center mb-0">{{ error[0] }}</p>
        </div>
      </div>
    </div>
    <div v-if="testbank">
      <h1 class="title">{{ testbank.name }}</h1>

      <div v-for="(item, indexQuest) in qna" :key="indexQuest" class="mr-2 m-3">
        <div class="testbank-view">
          <div v-html="item.questionName"></div>
          <div
            v-for="(answer, indexAnswer) in item.answers"
            :key="indexAnswer"
            class="ml-4"
          >
            <input
              type="checkbox"
              v-if="item.questionType == 'cb'"
              v-model="answer.isCorrect"
              :value="answer._id"
              class="mr-3"
            />
            <input
              v-if="item.questionType == 'rb'"
              type="radio"
              :value="indexAnswer"
              :checked="answer.isCorrect"
              @change="onChangeRb(indexQuest, $event)"
              class="mr-3"
            />
            <input
              v-if="item.questionType == 'free'"
              class="mr-3"
              v-model="answer.userText"
            />
            <span v-if="item.questionType != 'free'">
              {{ answer.userText }}
            </span>
          </div>
        </div>
      </div>

      <div class="btn-center mb-3">
        <button
          type="submit"
          class="btn btn-primary mt-3"
          :disabled="isSubmitting"
          @click="createPassing()"
        >
          <i class="fas fa-check mr-2"></i>Готово
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { actionTypes as actionTypesPassing } from "@/store/modules/passing";
import CmnLoading from "@/components/Loading";
import CmnValidationErrors from "@/components/ValidationErrors";
export default {
  name: "CmnRun",
  components: {
    CmnLoading,
    CmnValidationErrors,
  },
  data() {
    return {
      qna: [],
    };
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.passing.isLoading,
      testbank: (state) => state.passing.testbank,
      error: (state) => state.passing.error,
      passing: (state) => state.passing.data,
      isSubmitting: (state) => state.passing.isSubmitting,
    }),
  },
  mounted() {
    this.fetchPassing();
  },
  methods: {
    fetchPassing() {
      const slug = this.$route.params.slug;
      this.$store
        .dispatch(actionTypesPassing.getTestbank, { slug })
        .then((obj, err) => {
          if (err) console.log(err);
          obj.questions.forEach((question, indexQuest) => {
            this.qna.push({
              question: question._id,
              questionType: question.type,
              questionName: question.name,
              answers: [],
            });
            question.answers.forEach((answer, indexAnswer) => {
              if (this.qna[indexQuest].questionType == "free") {
                this.qna[indexQuest].answers.push({
                  userText: "",
                  isCorrect: false,
                });
              } else {
                this.qna[indexQuest].answers.push({
                  userText: answer.text,
                  isCorrect: false,
                });
              }
            });
          });
        });
    },

    onChangeRb(indexQuest, $event) {
      for (const index in this.qna[indexQuest].answers) {
        this.qna[indexQuest].answers[index].isCorrect =
          index === $event.target.value;
      }
    },
    createPassing() {
      this.$store
        .dispatch(actionTypesPassing.createPassing, {
          qna: this.qna,
          passing: this.passing,
        })
        .then(() => {
          this.qna = [];
          this.$router.push({
            name: "currentResult",
          });
          this.$toast.open("Готово!");
        });
    },
  },
};
</script>

<style scoped>
.testbank-center {
  max-width: 700px;
}

input[type="checkbox"],
input[type="radio"] {
  transform: scale(1.5);
}

.btn-center {
  text-align: center;
}

.testbank-view {
  padding: 10px;
  background-color: rgba(143, 143, 143, 0.1);
  border-radius: 5px;
  border: 1px dashed #007bff;
}
</style>