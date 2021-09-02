<template>
  <div class="container testbank-center">
    <h1 class="title">Список тестов</h1>
    <cmn-loading v-if="isLoading" />
    <cmn-validation-errors v-if="error" :validationErrors="error" />

    <!-- Модальное окно с предупреждением при ошибке -->
    <Modal
      v-model="showModalWarning"
      title="Предупреждение"
      @close="closeModalWarning"
      @keyup.esc="closeModalWarning"
    >
      <div class="alert alert-warning mt-1 row" role="alert">
        <div class="col-2">
          <i
            class="fas fa-exclamation-triangle mr-2 mt-2"
            style="font-size: 30px"
          ></i>
        </div>
        <div class="col-10">
          <p class="mb-1" v-if="errorDelete">{{ errorDelete[0] }}</p>
        </div>
      </div>
    </Modal>

    <div v-if="testbank && question">
      <div v-if="testbank.testbank.length > 0">
        <div class="alert-testbank">
          <b-alert
            :show="!isHideAlertTestbank"
            dismissible
            @dismissed="hideAlertTestbank()"
            variant="success"
          >
            <b>Тесты</b><br />
            Для изменения теста кликните на значок
            <i class="fas fa-edit ml-2 mr-1"></i> и введите новые данные. Для
            удаления теста нажмите на значок
            <i class="fas fa-trash ml-2 mr-2"></i> и подтвердите удаление в
            появившемся диалоговом окне. Для прохождения теста необходимо
            скопировать ссылку, нажав на значок
            <i class="fas fa-copy ml-2 mr-2"></i> и дать пользователю, либо же
            создать группу и добавить тест группе, после чего у пользователей в
            группе появится возможности пройти тест. Нажав на значок
            <i class="fas fa-chart-bar ml-2 mr-2"></i> можно посмотреть
            статистику прохождений теста.
          </b-alert>
        </div>
        <div v-for="(item, index) in testbank.testbank" :key="index">
          <!-- Подсказка о тестах -->
          <Modal
            v-model="showModalQuestion"
            title="Вопрос"
            @close="closeModalQuestion"
          >
            <div class="alert alert-success mt-1 row" role="alert">
              <div class="col-2">
                <i
                  class="
                    fas
                    fa-question-circle
                    mr-2
                    mt-2 mt-sm-2 mt-md-0 mt-lg-0
                  "
                  style="font-size: 50px"
                ></i>
              </div>
              <div class="col-10">
                <p class="mb-1 mt-2">Вы действительно хотите удалить запись?</p>
              </div>
            </div>
            <div class="text-center">
              <div class="btn-group w-50 mt-2">
                <button
                  type="button"
                  class="btn btn-success mt-2 col-6"
                  @click="deleteTestbank(item)"
                >
                  Ок
                </button>
                <button
                  type="button"
                  class="btn btn-outline-secondary mt-2 col-6"
                  @keyup.esc="closeModalQuestion"
                  @click="closeModalQuestion"
                >
                  Отмена
                </button>
              </div>
            </div>
          </Modal>
          <div class="d-flex">
            <div class="testbank-view mr-2 m-1">
              <div class="d-flex">
                <div class="testbank-name mb-2">
                  {{ item.name }}
                </div>
                <div v-if="!item.isOpen" class="ml-auto">
                  Закрытый
                  <i
                    class="fas fa-lock ml-2"
                    v-tippy
                    content="Тест недоступен для прохождения"
                  ></i>
                </div>
                <div v-if="item.isOpen" class="ml-auto">
                  Открытый
                  <i
                    class="fas fa-lock-open ml-2"
                    v-tippy
                    content="Тест доступен для прохождения"
                  ></i>
                </div>
              </div>
              <div class="mb-2">
                <a
                  v-tippy
                  content="Ссылка для прохождения"
                  :href="linkTest + item.link"
                  >{{ linkTest + item.link }}</a
                >
                <i
                  class="fas fa-copy ml-3"
                  v-tippy
                  content="Скопировать ссылку"
                  v-clipboard="linkTest + item.link"
                  @click="$toast.open('Скопировано!')"
                ></i>
              </div>
              <div class="mb-2">
                <span style="font-size: 18px"
                  >Результат после прохождения:
                </span>
                <span v-if="item.resultAfterTesting == 'dontShow'">
                  <i style="color: red">не показывать</i></span
                >
                <span v-if="item.resultAfterTesting == 'show'">
                  <i style="color: #007bff"
                    >показывать без правильных ответов</i
                  ></span
                >
                <span v-if="item.resultAfterTesting == 'showAnswers'">
                  <i style="color: #28a745"
                    >показывать с правильными ответами</i
                  ></span
                >
              </div>

              <hr />
              <ol>
                <li v-for="(el, index) in item.questions" :key="index">
                  <div v-if="questionOfTestbank(el)">
                    <div
                      v-html="questionOfTestbank(el).name"
                      class="mt-2"
                    ></div>
                    <ul>
                      <li
                        v-for="(answer, index) in questionOfTestbank(el)
                          .answers"
                        :key="index"
                      >
                        {{ answer.text }}
                      </li>
                    </ul>
                  </div>
                </li>
              </ol>
            </div>
            <div class="ml-2 mt-2 d-flex justify-content-between">
              <i
                class="fas fa-edit mr-3"
                @click="updateTestbank(item)"
                v-tippy="{ delay: 400 }"
                content="Изменить тест"
              ></i>
              <i
                class="fas fa-trash mr-3"
                @click="showModalQuestion = true"
                v-tippy="{ delay: 400 }"
                content="Удалить тест"
              ></i>
              <i
                class="fas fa-chart-bar"
                v-tippy="{ delay: 400 }"
                @click="showStatistic(item)"
                content="Просмотр статистики по тесту"
              ></i>
            </div>
          </div>
        </div>
      </div>
      <b-alert :show="testbank.testbank.length == 0" variant="warning"
        >Необходимо добавить тест</b-alert
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CmnLoading from "@/components/Loading";
import CmnValidationErrors from "@/components/ValidationErrors";
import { actionTypes as actionTypesQuestion } from "@/store/modules/question";
import { actionTypes as actionTypesTestbank } from "@/store/modules/testbank";
export default {
  name: "CmnTestbankView",
  components: {
    CmnLoading,
    CmnValidationErrors,
  },
  data() {
    return {
      showModalWarning: false,
      showModalQuestion: false,
      isHideAlertTestbank: false,
      linkTest: "https://checkmenow.ru/t/run/",
    };
  },
  watch: {
    isHideAlertTestbank(newValue) {
      window.localStorage.isHideAlertTestbank = newValue;
    },
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.testbank.isLoading,
      testbank: (state) => state.testbank.data,
      question: (state) => state.question.data,
      error: (state) => state.testbank.error,
      errorDelete: (state) => state.testbank.errorDelete,
    }),
  },
  mounted() {
    if (window.localStorage.isHideAlertTestbank) {
      this.isHideAlertTestbank = window.localStorage.isHideAlertTestbank;
    }
    this.fetchTestbank();
  },
  methods: {
    //*Скрыть алерт
    hideAlertTestbank() {
      window.localStorage.isHideAlertTestbank = true;
    },

    fetchTestbank() {
      this.$store.dispatch(actionTypesTestbank.getTestbank).then((obj, err) => {
        if (err) console.log(err);
      });
      this.$store.dispatch(actionTypesQuestion.getQuestion).then((obj, err) => {
        if (err) console.log(err);
      });
    },
    questionOfTestbank(el) {
      if (this.question != null) {
        const quest = this.question.question.filter((obj) => {
          return obj._id === el;
        });
        return quest.length > 0 ? quest[0] : null;
      }
    },
    updateTestbank(testbank) {
      this.$router.push({
        name: "testbankUpdate",
        params: { slug: testbank._id },
      });
    },
    showStatistic(testbank) {
      this.$router.push({
        name: "testbankStatistics",
        params: { slug: testbank._id },
      });
    },
    deleteTestbank(testbank) {
      this.$store
        .dispatch(actionTypesTestbank.deleteTestbank, {
          slug: testbank._id,
        })
        .then(() => {
          this.showModalQuestion = false;
          this.fetchTestbank();
          this.$toast.open("Удалено!");
        })
        .catch((err) => {
          this.showModalQuestion = false;
          if (err) this.showModalWarning = true;
        });
    },

    //* Закрытие модального окна с вопросом
    closeModalQuestion() {
      this.showModalQuestion = false;
    },

    //* Закрытие модального окна с предупреждением
    closeModalWarning() {
      this.showModalWarning = false;
    },
  },
};
</script>

<style scoped>
.testbank-center {
  max-width: 900px;
}

.testbank-view {
  background-color: rgba(143, 143, 143, 0.1);
  padding: 10px;
  border-radius: 5px;
  border: 1px dashed #28a745;
  width: 900px;
}

.testbank-name {
  font-size: 20px;
}

.fa-chart-bar {
  font-size: 22px;
}

a {
  color: #28a745;
}

a:hover {
  color: #bb941f;
  text-decoration: none;
}

.alert-testbank {
  line-height: 2;
}
</style>