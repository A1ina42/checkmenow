<template>
  <div>
    <cmn-loading v-if="isLoading" />
    <cmn-testbank-form
      v-if="initialValues"
      :initialValues="initialValues"
      :errors="validationErrors"
      :isSubmitting="isSubmitting"
      :isEdit="true"
      @testbankSubmit="onSubmit"
    >
    </cmn-testbank-form>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { actionTypes } from "@/store/modules/updateTestbank";
import CmnLoading from "@/components/Loading";
import CmnTestbankForm from "@/components/TestbankForm";

export default {
  name: "CmnUpdateTestbank",
  components: {
    CmnTestbankForm,
    CmnLoading,
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.updateTestbank.isLoading,
      testbank: (state) => state.updateTestbank.testbank,
      isSubmitting: (state) => state.updateTestbank.isSubmitting,
      validationErrors: (state) => state.updateTestbank.validationErrors,
    }),
    initialValues() {
      if (!this.testbank) {
        return null;
      }
      return {
        name: this.testbank.name,
        questionsId: this.testbank.questions,
        isOpen: this.testbank.isOpen,
        resultAfterTesting: this.testbank.resultAfterTesting,
      };
    },
  },
  mounted() {
    this.$store.dispatch(actionTypes.getTestbank, {
      slug: this.$route.params.slug,
    });
  },
  methods: {
    onSubmit(testbankInput) {
      const slug = this.$route.params.slug;
      this.$store
        .dispatch(actionTypes.updateTestbank, { testbankInput, slug })
        .then(() => {
          this.name = "";
          this.questionsId = [];
          this.isOpen = false;
          this.resultAfterTesting = "dontShow";
          this.$toast.open("Изменено!");
          this.$router.push({ name: "testbankView" });
        });
    },
  },
};
</script>
