<template>
  <cmn-testbank-form
    :initialValues="initialValues"
    :errors="validationErrors"
    :isSubmitting="isSubmitting"
    :isEdit="false"
    @testbankSubmit="onSubmit"
  >
  </cmn-testbank-form>
</template>

<script>
import { mapState } from "vuex";
import CmnTestbankForm from "@/components/TestbankForm";
import { actionTypes } from "@/store/modules/createTestbank";

export default {
  name: "CmnCreateTestbank",
  components: {
    CmnTestbankForm,
  },
  data() {
    return {
      initialValues: {
        name: "",
        questionsId: [],
        isOpen: false,
        resultAfterTesting: "dontShow",
      },
    };
  },
  computed: {
    ...mapState({
      isSubmitting: (state) => state.createTestbank.isSubmitting,
      validationErrors: (state) => state.createTestbank.validationErrors,
    }),
  },
  methods: {
    onSubmit(testbankInput) {
      this.$store
        .dispatch(actionTypes.createTestbank, { testbankInput })
        .then(() => {
          this.name = "";
          this.questionsId = [];
          this.isOpen = false;
          this.resultAfterTesting = "dontShow";
          this.$toast.open("Добавлено!");
          this.$router.push({ name: "testbankView" });
        });
    },
  },
};
</script>
