<template>
  <div class="container">
    <!-- Заголовок -->
    <h1 v-if="isEdit" class="title">Редактировать</h1>
    <h1 v-else class="title">Добавить</h1>

    <!-- Форма вопроса -->
    <form @submit.prevent="onSubmit">
      <div class="form-group" v-if="category">
        <!-- Отрисовка ошибок -->
        <cmn-validation-errors v-if="errors" :validation-errors="errors" />

        <!-- Выбор категории -->
        <label for="name">Выберите категорию</label>
        <v-select
          v-if="!isEdit"
          class="vselect"
          @change="clearCategory()"
          @input="(category) => selectCategory(category)"
          :options="category.category"
          label="name"
        ></v-select>
        <v-select
          v-if="isEdit"
          class="vselect"
          @change="clearCategory()"
          @input="(category) => selectCategory(category)"
          :options="category.category"
          :value="getCategory"
          label="name"
        ></v-select>
      </div>

      <!-- Выбор типа вопроса -->
      <div class="form-group radio-buttons" v-if="!isEdit">
        <label>Выберите тип вопроса</label><br />
        <div class="custom-control custom-radio custom-control-inline">
          <input
            type="radio"
            id="rb-cb"
            class="custom-control-input"
            value="cb"
            v-model="type"
            @change="onChangeType"
            checked
          />
          <label class="custom-control-label" for="rb-cb"
            >Множественный ответ</label
          >
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input
            type="radio"
            id="rb-rb"
            v-model="type"
            value="rb"
            @change="onChangeType"
            class="custom-control-input"
          />
          <label class="custom-control-label" for="rb-rb" readonly
            >Одиночный ответ</label
          >
        </div>
        <div class="custom-control custom-radio custom-control-inline">
          <input
            type="radio"
            id="rb-free"
            v-model="type"
            value="free"
            @change="onChangeType"
            class="custom-control-input"
          />
          <label class="custom-control-label" for="rb-free" readonly
            >Свободный ответ</label
          >
        </div>
      </div>

      <!-- Редактор текста вопроса -->
      <div class="form-group">
        <label for="name">Текст вопроса</label>
        <vue-editor
          v-model="name"
          spellcheck="true"
          :editor-toolbar="customToolbar"
          class="editor-quest"
        ></vue-editor>
      </div>

      <!-- Добавление поля -->
      <div class="btn-center mb-3" v-if="type != 'free'">
        <button
          type="button"
          class="btn btn-success btn-sm"
          @click="addAnswer()"
        >
          <i class="fas fa-plus-circle mr-2"></i>Добавить вариант ответа
        </button>
      </div>

      <div class="form-group">
        <label v-if="type != 'free'">Варианты ответов</label>
        <label v-else>Ответ</label>
        <br />
        <draggable
          v-model="answers"
          @start="drag = true"
          @end="drag = false"
          handle=".handle"
        >
          <div v-for="(item, index) in answers" :key="index">
            <div class="input-arrow">
              <div class="input-group mb-3">
                <div class="input-group-prepend">
                  <i
                    class="fas fa-arrows-alt-v handle"
                    v-if="type != 'free'"
                  ></i>
                  <div class="input-group-text" v-if="type == 'cb'">
                    <input type="checkbox" v-model="item.isCorrect" />
                  </div>

                  <div class="input-group-text" v-if="type == 'rb'">
                    <input
                      type="radio"
                      name="rb"
                      :value="index"
                      :checked="item.isCorrect"
                      @change="onChangeRb"
                    />
                  </div>
                </div>
                <textarea
                  class="form-control textarea-cb"
                  v-model="item.text"
                ></textarea>
                <i
                  class="fas fa-backspace"
                  v-if="type != 'free'"
                  @click="removeAnswer(index)"
                  v-tippy="{ delay: 400 }"
                  content="Удалить поле"
                ></i>
              </div>
            </div>
          </div>
        </draggable>
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
import { VueEditor } from "vue2-editor";
import { mapState } from "vuex";
import draggable from "vuedraggable";
import CmnValidationErrors from "@/components/ValidationErrors";
import { actionTypes as actionTypesCategory } from "@/store/modules/category";
export default {
  name: "CmnQuestionForm",
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
    draggable,
    VueEditor,
  },
  data() {
    return {
      name: this.initialValues.name,
      categoryId: this.initialValues.categoryId,
      answers: this.initialValues.answers,
      type: this.initialValues.type,
      customToolbar: [
        ["bold", "italic", "underline", "strike"], // стиль текста
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }], // отступы
        [{ color: [] }, { background: [] }], // цвет текста и фон текста
        ["link", "video"],
        ["clean"], // очистить форматирование
      ],
    };
  },
  computed: {
    ...mapState({
      category: (state) => state.category.data,
    }),
    //* Получение списка категорий
    getCategory() {
      if (this.category != null) {
        let cat = this.category.category.find((x) => x._id == this.categoryId);
        return cat != null ? cat.name : null;
      }
    },
  },
  mounted() {
    this.$store.dispatch(actionTypesCategory.getCategory);
  },
  watch: {
    //* Если тип вопроса переключается на свободный - лишние поля удаляются
    type: function () {
      if (this.type == "free") {
        if (this.answers.length >= 2)
          this.answers.splice(1, this.answers.length - 1);
      } else {
        if (this.answers.length == 1) this.addAnswer();
      }
    },
  },
  methods: {
    //* Срабатывает при изменении типа вопроса, для сброса статуса ответа
    onChangeType() {
      if (this.type == "free") {
        //* У типа"Свободный ответ" единственное значение по умолчанию правильное
        this.answers[0].isCorrect = true;
      } else {
        this.answers.forEach((item) => {
          item.isCorrect = false;
        });
      }
    },
    //* Срабатывает при переключении значений в одиночном ответе, для смены статуса ответа
    onChangeRb($event) {
      for (const index in this.answers) {
        this.answers[index].isCorrect = index === $event.target.value;
      }
    },
    onSubmit() {
      const form = {
        name: this.name,
        category: this.categoryId,
        answers: this.answers,
        type: this.type,
      };
      this.$emit("questionSubmit", form);
    },
    //* Добавление поля
    addAnswer() {
      this.answers.push({ text: "", isCorrect: false });
    },
    //* Удаление поля
    removeAnswer(index) {
      if (this.answers.length > 2) this.answers.splice(index, 1);
    },
    //* Сохранение Id при выборе категории
    selectCategory(category) {
      if (category != null) {
        this.categoryId = category._id;
      } else {
        this.categoryId = "";
      }
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-left: auto;
  margin-right: auto;
  max-width: 700px;
}
.vselect {
  background-color: white;
}
.fa-arrows-alt-v {
  min-width: 20px;
  font-size: 20px;
  color: transparent;
  margin: auto;
}
.input-arrow:hover .fa-arrows-alt-v {
  color: #28a745;
  cursor: s-resize;
}

input[type="checkbox"],
input[type="radio"] {
  transform: scale(1.5);
}

.textarea-cb {
  overflow: hidden;
  min-height: 40px;
  height: 40px;
}

.textarea-name {
  min-height: 70px;
}

.fa-backspace {
  margin: auto;
  font-size: 20px;
  margin-left: 10px;
}

.fa-backspace:hover {
  color: rgb(180, 30, 30);
}

.btn-center {
  text-align: center;
}

.editor-quest {
  background-color: white;
}
</style>