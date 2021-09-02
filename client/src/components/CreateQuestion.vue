<template>
  <cmn-question-form
    :initialValues="initialValues"
    :errors="validationErrors"
    :isSubmitting="isSubmitting"
    :isEdit="false"
    @questionSubmit="onSubmit"
  >
  </cmn-question-form>
</template>

<script>
import { mapState } from "vuex";

import CmnQuestionForm from "@/components/QuestionForm";
import { actionTypes } from "@/store/modules/createQuestion";

export default {
  name: "McvCreateQuestion",
  components: {
    CmnQuestionForm,
  },
  data() {
    return {
      initialValues: {
        name: "",
        categoryId: "",
        answers: [
          {
            text: "",
            isCorrect: false,
          },
          {
            text: "",
            isCorrect: false,
          },
        ],
        type: "cb",
      },
    };
  },
  computed: {
    ...mapState({
      isSubmitting: (state) => state.createQuestion.isSubmitting,
      validationErrors: (state) => state.createQuestion.validationErrors,
    }),
  },
  methods: {
    onSubmit(questionInput) {
      this.$store
        .dispatch(actionTypes.createQuestion, { questionInput })
        .then(() => {
          this.name = "";
          this.categoryId = "";
          this.type = "cb";
          this.answers = [];
          this.answers.push({
            text: "",
            isCorrect: false,
          });
          this.answers.push({
            text: "",
            isCorrect: false,
          });
          this.$toast.open("Добавлено!");
          this.$router.push({ name: "questionView" });
        });
    },
  },
};
</script>
