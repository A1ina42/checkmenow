<template>
  <div class="container category-view">
    <h1 class="title">Категории</h1>

    <!-- Отображение списка ошибок -->
    <cmn-validation-errors
      :validation-errors="errorCreate"
      v-if="errorCreate"
    />

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

    <!-- Добавление категории -->
    <div class="form-row ml-2">
      <input
        type="text"
        class="
          form-control
          col-xs-8 col-sm-7 col-md-7 col-lg-8 col-xl-8
          mr-sm-2 mr-xs-2 mr-md-2 mr-lg-2 mr-xl-4
          mb-2
        "
        placeholder="Введите название категории"
        @keyup.enter="createCategory()"
        v-model="name"
      />
      <div class="col-xs-4 col-md-4 col-lg-3 col-sm-4 p-0">
        <button
          type="button"
          class="btn btn-success w-100"
          @click="createCategory()"
        >
          Добавить
        </button>
      </div>
    </div>

    <hr />

    <!-- Отображение загрузки компонента -->
    <cmn-loading v-if="isLoading" />

    <!-- Отображение ошибок при изменении -->
    <cmn-validation-errors
      :validation-errors="errorUpdate"
      v-if="errorUpdate"
    />

    <!-- Отображение списка категорий -->
    <div v-if="category">
      <div v-if="category.category.length > 0">
        <div class="alert-category">
          <b-alert
            :show="!isHideAlertCategory"
            dismissible
            @dismissed="hideAlertCategory()"
            variant="success"
          >
            <b>Категории для вопросов</b><br />
            Для изменения названия категории кликните на значок
            <i class="fas fa-edit ml-2 mr-1"></i> или дважды кликните по
            названию. После редактирования нажмите кнопку Enter. Для удаления
            категории нажмите на значок <i class="fas fa-trash ml-2 mr-2"></i> и
            подтвердите удаление в появившемся диалоговом окне.
          </b-alert>
        </div>

        <!-- Перебор списка категорий -->
        <div v-for="(item, index) in category.category" :key="index">
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
                  @click="deleteCategory()"
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
          <div class="d-flex justify-content-between mt-3">
            <!-- Название категории -->
            <span
              @dblclick="editItem(item, index)"
              v-show="activeIndex !== index"
              >{{ item.name }}</span
            >
            <!-- Поле для изменения категории -->
            <input
              :ref="'cat' + index"
              v-show="activeIndex == index"
              @keyup.enter="doneEnterEdit(item)"
              @keyup.esc="cancelEdit(item)"
              type="text"
              autofocus
              @blur="doneBlurEdit(item)"
              v-model="item.name"
              class="edit-item"
            />

            <!-- Функциональные кнопки -->
            <div class="ml-2 mt-1 d-flex justify-content-between">
              <i
                class="fas fa-edit mr-3 ml-3"
                @click="editItem(item, index)"
                v-tippy="{ delay: 400 }"
                content="Изменить категорию"
              ></i>
              <i
                class="fas fa-trash"
                @click="
                  showModalQuestion = true;
                  removeItem = item;
                "
                v-tippy="{ delay: 400 }"
                content="Удалить категорию"
              ></i>
            </div>
          </div>
        </div>
      </div>
      <b-alert :show="category.category.length == 0" variant="warning"
        >Необходимо добавить категорию</b-alert
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CmnLoading from "@/components/Loading";
import { actionTypes } from "@/store/modules/category";
import { actionTypes as actionTypesCreateCategory } from "@/store/modules/createCategory";
import { actionTypes as actionTypesUpdateCategory } from "@/store/modules/updateCategory";
import CmnValidationErrors from "@/components/ValidationErrors";
export default {
  name: "CmnCategory",
  components: {
    CmnLoading,
    CmnValidationErrors,
  },
  data() {
    return {
      name: "",
      oldItem: null,
      activeIndex: null,
      isEnter: false,
      showModalWarning: false,
      showModalQuestion: false,
      removeItem: null,
      isHideAlertCategory: false,
    };
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.category.isLoading,
      category: (state) => state.category.data,
      errorDelete: (state) => state.category.errorDelete,
      errorUpdate: (state) => state.updateCategory.validationErrors,
      errorCreate: (state) => state.createCategory.validationErrors,
    }),
  },
  mounted() {
    if (window.localStorage.isHideAlertCategory) {
      this.isHideAlertCategory = window.localStorage.isHideAlertCategory;
    }
    this.fetchCategory();
  },
  watch: {
    isHideAlertCategory(newValue) {
      window.localStorage.isHideAlertCategory = newValue;
    },
  },
  methods: {
    //*Скрыть алерт
    hideAlertCategory() {
      window.localStorage.isHideAlertCategory = true;
    },

    //* Получение списка категорий с сервера
    fetchCategory() {
      this.$store.dispatch(actionTypes.getCategory);
    },

    //* Создание категории
    createCategory() {
      this.$store
        .dispatch(actionTypesCreateCategory.createCategory, {
          name: this.name,
        })
        .then(() => {
          // Чистка поля после добавления
          this.name = "";
          this.fetchCategory();
          this.$toast.open("Добавлено!");
        });
    },

    //* Удаление категории из списка
    deleteCategory() {
      this.$store
        .dispatch(actionTypes.deleteCategory, {
          slug: this.removeItem._id,
        })
        .then(() => {
          this.showModalQuestion = false;
          this.fetchCategory();
          this.$toast.open("Удалено!");
        })
        .catch((err) => {
          this.showModalQuestion = false;
          if (err) this.showModalWarning = true;
        });
    },

    //* Установка фокуса на поле ввода
    setFocus(index) {
      setTimeout(() => {
        this.$refs["cat" + index][0].focus();
      }, 50);
    },

    //* Изменение категории
    editItem(item, index) {
      this.activeIndex = index;
      this.oldItem = item.name;
      this.setFocus(index);
    },

    //* Завершение редактирования категории
    doneEdit: function (item) {
      let index = this.activeIndex;
      this.activeIndex = null;
      // Отмена редактирования, если новое значение пустое
      if (!item.name) {
        this.cancelEdit(item);
      }

      // Отправка данных на сервер для изменения
      if (item.name !== this.oldItem) {
        this.$store
          .dispatch(actionTypesUpdateCategory.updateCategory, {
            id: item._id,
            name: item.name,
          })
          .then(() => {
            //При успешном изменении обновляется список категорий
            this.fetchCategory();
            this.$toast.open("Изменено!");
          })
          .catch((error) => {
            //В случае получения ошибки - поле остается активным
            if (error) this.activeIndex = index;
            this.setFocus(index);
          });
      }
    },

    //* Завершение редактирования категории по кнопке Enter
    doneEnterEdit: function (item) {
      if (!this.errorUpdate) {
        this.isEnter = true;
        this.doneEdit(item);
      }
    },

    //* Завершение редактирования категории при смене фокуса
    doneBlurEdit: function (item) {
      if (this.errorUpdate) {
        this.cancelEdit(item);
        this.$store.dispatch(actionTypesUpdateCategory.resetValidation);
      } else {
        if (!this.isEnter) {
          this.doneEdit(item);
        }
        this.isEnter = false;
      }
    },

    //* Отмена редактирования
    cancelEdit: function (item) {
      this.activeIndex = null;
      item.name = this.oldItem;
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
.category-view {
  max-width: 900px;
}

.edit-item {
  width: 500px;
}

.alert-category {
  line-height: 2;
}
</style>