<template>
  <div>
    <cmn-loading v-if="isLoading" />
    <cmn-question-form
      v-if="initialValues"
      :initialValues="initialValues"
      :errors="validationErrors"
      :isEdit="true"
      :isSubmitting="isSubmitting"
      @questionSubmit="onSubmit"
    >
    </cmn-question-form>
  </div>
</template>

<script>
import { mapState } from "vuex";

import CmnQuestionForm from "@/components/QuestionForm";
import CmnLoading from "@/components/Loading";
import { actionTypes } from "@/store/modules/updateQuestion";

export default {
  name: "CmnUpdateQuestion",
  components: {
    CmnQuestionForm,
    CmnLoading,
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.updateQuestion.isLoading,
      question: (state) => state.updateQuestion.question,
      isSubmitting: (state) => state.updateQuestion.isSubmitting,
      validationErrors: (state) => state.updateQuestion.validationErrors,
    }),
    initialValues() {
      if (!this.question) {
        return null;
      }
      return {
        name: this.question.name,
        categoryId: this.question.category,
        answers: this.question.answers,
        type: this.question.type,
      };
    },
  },
  mounted() {
    this.$store.dispatch(actionTypes.getQuestion, {
      slug: this.$route.params.slug,
    });
  },
  methods: {
    onSubmit(questionInput) {
      const slug = this.$route.params.slug;
      this.$store
        .dispatch(actionTypes.updateQuestion, { questionInput, slug })
        .then(() => {
          this.name = "";
          this.categoryId = "";
          this.answers = [];
          this.type = "cb";
          this.answers.push({
            text: "",
            isCorrect: false,
          });
          this.answers.push({
            text: "",
            isCorrect: false,
          });
          this.$toast.open("Изменено!");
          this.$router.push({ name: "questionView" });
        });
    },
  },
};
</script>
