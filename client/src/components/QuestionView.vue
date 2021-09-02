<template>
  <div class="container question-center">
    <h1 class="title">Список вопросов</h1>
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

    <div v-if="category">
      <div v-if="category.category.length > 0">
        <!-- Выводим теги категорий -->
        <label
          for="checkAll"
          class="badge badge-pill badge-secondary checkAll mr-2"
        >
          <input
            id="checkAll"
            type="checkbox"
            checked="checkedAll"
            class="mr-2"
            @click="checkAll"
          />Выбрать все
        </label>
        <span
          v-for="(item, index) in category.category"
          :key="index"
          class="mr-2"
        >
          <label class="badge badge-pill badge-secondary" :for="'chk' + index"
            ><input
              :id="'chk' + index"
              type="checkbox"
              class="mr-2"
              :checked="checkedAll"
              @change="pushCategory(item._id)"
            />{{ item.name }}</label
          >
        </span>
        <hr />

        <div v-if="question">
          <div v-if="question.question.length > 0">
            <!-- Подсказка о вопросах -->
            <div class="alert-question">
              <b-alert
                :show="!isHideAlertQuestion"
                dismissible
                @dismissed="hideAlertQuestion()"
                variant="success"
              >
                <b>Вопросы</b><br />
                Для изменения вопроса кликните на значок
                <i class="fas fa-edit ml-2 mr-1"></i> и введите новые данные.
                Для удаления вопроса нажмите на значок
                <i class="fas fa-trash ml-2 mr-2"></i> и подтвердите удаление в
                появившемся диалоговом окне. Вопросы можно фильтровать по
                категориям, для этого необходимо нажать на галочку слева от
                названия категории. По умолчанию отображаются все вопросы.
              </b-alert>
            </div>

            <!-- Выводим вопросы -->
            <div v-for="(item, index) in checkedCategory" :key="index">
              <!-- Модальное окно для удаления записи -->
              <Modal
                v-model="showModalQuestion"
                title="Вопрос"
                @close="closeModalQuestion"
              >
                <div class="alert alert-success mt-1 row" role="alert">
                  <div class="col-2">
                    <i
                      class="fas fa-question-circle mr-2 mt-2 mt-sm-2 mt-md-0 mt-lg-0"
                      style="font-size: 50px"
                    ></i>
                  </div>
                  <div class="col-10">
                    <p class="mb-1 mt-2">
                      Вы действительно хотите удалить запись?
                    </p>
                  </div>
                </div>
                <div class="text-center">
                  <div class="btn-group w-50 mt-2">
                    <button
                      type="button"
                      class="btn btn-success mt-2 col-6"
                      @click="deleteQuestion(item)"
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
                <div class="question-view m-1">
                  <div style="text-align: right">
                    <span class="cat-in-quest">{{
                      categoryOfQuestion(item)
                    }}</span>
                  </div>
                  <div v-html="item.name"></div>
                  <hr />
                  <div v-for="(answer, index) in item.answers" :key="index">
                    <input
                      :checked="answer.isCorrect"
                      type="checkbox"
                      class="mr-2"
                      @click.prevent=""
                      v-if="item.type == 'cb'"
                    />
                    <input
                      :checked="answer.isCorrect"
                      class="mr-2"
                      type="radio"
                      @click.prevent=""
                      v-if="item.type == 'rb'"
                    />
                    {{ answer.text }}
                  </div>
                </div>
                <div class="ml-2 d-flex justify-content-between">
                  <i
                    class="fas fa-edit mr-3"
                    @click="updateQuestion(item)"
                    v-tippy="{ delay: 400 }"
                    content="Изменить вопрос"
                  ></i>
                </div>
                <i
                  class="fas fa-trash"
                  @click="showModalQuestion = true"
                  v-tippy="{ delay: 400 }"
                  content="Удалить вопрос"
                ></i>
              </div>
            </div>
          </div>
          <b-alert :show="question.question.length == 0" variant="warning"
            >Необходимо добавить вопрос</b-alert
          >
        </div>
      </div>
      <b-alert :show="category.category.length == 0" variant="warning"
        >Сначала добавьте категорию</b-alert
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CmnLoading from "@/components/Loading";
import { actionTypes } from "@/store/modules/question";
import { actionTypes as actionTypesCategory } from "@/store/modules/category";
import CmnValidationErrors from "@/components/ValidationErrors";
export default {
  name: "CmnQuestionView",
  components: {
    CmnLoading,
    CmnValidationErrors,
  },
  data() {
    return {
      showModalWarning: false,
      showModalQuestion: false,
      checkedCategories: [],
      checkedAll: true,
      isHideAlertQuestion: false,
    };
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.question.isLoading,
      question: (state) => state.question.data,
      category: (state) => state.category.data,
      error: (state) => state.question.error,
      errorDelete: (state) => state.question.errorDelete,
    }),
    //* Получение списка выбранных категори
    checkedCategory() {
      if (!this.checkedCategories) return this.question;
      return this.question.question.filter((quest) =>
        this.checkedCategories.includes(quest.category)
      );
    },
  },
  watch: {
    isHideAlertQuestion(newValue) {
      window.localStorage.isHideAlertQuestion = newValue;
    },
  },
  mounted() {
    if (window.localStorage.isHideAlertQuestion) {
      this.isHideAlertQuestion = window.localStorage.isHideAlertQuestion;
    }
    this.fetchQuestion();
  },
  methods: {
    //*Скрыть алерт
    hideAlertQuestion() {
      window.localStorage.isHideAlertQuestion = true;
    },
    fetchQuestion() {
      this.$store.dispatch(actionTypesCategory.getCategory).then((obj, err) => {
        if (err) console.log(err);
        if (this.checkedCategories.length == 0) {
          this.checkedCategories = [];
          obj.category.forEach((el) => {
            this.checkedCategories.push(el._id);
          });
        }
      });
      this.$store.dispatch(actionTypes.getQuestion);
    },
    //* Переход на окно изменения вопроса
    updateQuestion(question) {
      this.$router.push({
        name: "questionUpdate",
        params: { slug: question._id },
      });
    },
    //* Удаление вопроса
    deleteQuestion(el) {
      this.$store
        .dispatch(actionTypes.deleteQuestion, {
          slug: el._id,
        })
        .then(() => {
          this.showModalQuestion = false;
          this.fetchQuestion();
          this.$toast.open("Удалено!");
        })
        .catch((err) => {
          this.showModalQuestion = false;
          if (err) this.showModalWarning = true;
        });
    },
    categoryOfQuestion(item) {
      const cat = this.category.category.filter((obj) => {
        return obj._id === item.category;
      });
      return cat[0].name;
    },
    pushCategory(itemId) {
      let index = this.checkedCategories.indexOf(itemId);
      if (index > -1) {
        this.checkedCategories.splice(index, 1);
      } else {
        this.checkedCategories.push(itemId);
      }
    },
    //* Выбор всех типов категорий в списке
    checkAll() {
      if (this.checkedAll) {
        this.checkedCategories = [];
        this.checkedAll = false;
      } else {
        this.checkedAll = true;
        this.category.category.forEach((el) => {
          this.checkedCategories.push(el._id);
        });
      }
    },

    closeModalQuestion() {
      this.showModalQuestion = false;
    },

    closeModalWarning() {
      this.showModalWarning = false;
    },
  },
};
</script>

<style scoped>
.question-view {
  background-color: rgba(143, 143, 143, 0.1);
  padding: 10px;
  border-radius: 5px;
  border: 1px dashed #28a745;
  width: 900px;
}
.badge-secondary {
  font-size: 16px;
  font-weight: 100;
  user-select: none;
}

input[type="checkbox"] {
  transform: scale(1.2);
  margin: 5px;
}

.cat-in-quest {
  background-color: #8ac497;
  font-size: 14px;
  color: white;
  padding: 3px;
  border-radius: 5px;
}

.question-center {
  max-width: 900px;
}

.checkAll {
  color: white;
  background-color: #28a745;
  user-select: none;
}

.alert-question {
  line-height: 2;
}
</style>