<template>
  <div class="container">
    <h1 class="title">Мои результаты</h1>
    <div v-if="passing">
      <div v-if="passing.length > 0">
        <grid
          :cols="cols"
          :rows="rows"
          :pagination="pagination"
          :search="search"
          :sort="sort"
          :language="language"
        ></grid>
        <download-excel
          :data="json_data"
          type="xls"
          class="btn btn-primary mt-2 mr-2"
        >
          Экспорт в .xls
        </download-excel>
        <button class="btn btn-primary mt-2 mr-2" @click="exportJson">
          Экспорт в .json
        </button>
        <download-excel
          :data="json_data"
          type="csv"
          class="btn btn-primary mt-2 mr-2"
          :escapeCsv="false"
        >
          Экспорт в .csv
        </download-excel>
      </div>
      <b-alert
        :show="passing.length == 0"
        variant="warning"
        class="ml-auto mr-auto"
        >Результаты появятся после того, как вы пройдете хотя бы 1 тест</b-alert
      >
    </div>
  </div>
</template>

<script>
import Grid from "gridjs-vue";
import { mapState } from "vuex";
import { actionTypes } from "@/store/modules/passing";
import moment from "moment";
export default {
  name: "CmnMyResults",
  components: {
    Grid,
  },
  data() {
    return {
      cols: [
        "№",
        "Тест",
        "Владелец",
        "Начат",
        "Закончен",
        "Время прохождения",
        "Всего вопросов",
        "Правильных ответов",
        "%",
      ],
      rows: [],
      pagination: true,
      search: true,
      sort: true,
      language: {
        search: {
          placeholder: "Поиск...",
        },
        sort: {
          sortAsc: "Сортировка по возрастанию",
          sortDesc: "Сортировка по убыванию",
        },
        pagination: {
          previous: "Назад",
          next: "Вперед",
          navigate: (page, pages) => `Страница ${page} из ${pages}`,
          page: (page) => `Страница ${page}`,
          showing: "Показано с",
          of: "из",
          to: "по",
          results: "записей",
        },
        loading: "Загрузка...",
        noRecordsFound: "Совпадений не найдено",
        error: "Ошибка при получении",
      },
      json_data: [],
    };
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.passing.isLoading,
      passing: (state) => state.passing.data,
      error: (state) => state.passing.error,
    }),
  },
  methods: {
    download(content, fileName, contentType) {
      let a = document.createElement("a");
      let file = new Blob([content], { type: contentType });
      a.href = URL.createObjectURL(file);
      a.download = fileName;
      a.click();
    },
    diffDate(endedAt, startedAt) {
      return moment
        .utc(
          moment(endedAt, "DD/MM/YYYY HH:mm:ss").diff(
            moment(startedAt, "DD/MM/YYYY HH:mm:ss")
          )
        )
        .format("HH:mm:ss");
    },
    exportJson() {
      this.download(
        JSON.stringify(this.json_data),
        "data.json",
        "application/json"
      );
    },
  },
  mounted() {
    this.$store.dispatch(actionTypes.getPassingUser).then(() => {
      let temp = [];
      this.passing.forEach((el, index) => {
        let startedAt = new Date(el.startedAt);
        let endedAt = new Date(el.endedAt);
        let timePassing = this.diffDate(endedAt, startedAt);
        if (
          el.testbank.resultAfterTesting == "show" ||
          el.testbank.resultAfterTesting == "showAnswers"
        ) {
          this.json_data.push({
            "№": index + 1,
            Тест: el.testbank.name,
            Владелец: el.user.name,
            Начат: startedAt.toLocaleString(),
            Закончен: endedAt.toLocaleString(),
            "Время прохождения": timePassing,
            "Всего вопросов": el.answersCount,
            "Правильных ответов": el.answersCount - el.countWrongAnswers,
            "%": el.resultPercent,
          });
        } else {
          this.json_data.push({
            "№": index + 1,
            Тест: el.testbank.name,
            Владелец: el.user.name,
            Начат: startedAt.toLocaleString(),
            Закончен: endedAt.toLocaleString(),
            "Время прохождения": timePassing,
            "Всего вопросов": el.answersCount,
            "Правильных ответов": "Скрыто",
            "%": "Скрыто",
          });
        }
        temp.push(index + 1);
        temp.push(el.testbank.name);
        temp.push(el.testbank.user.name);
        temp.push(startedAt.toLocaleString());
        temp.push(endedAt.toLocaleString());
        temp.push(timePassing);
        temp.push(el.answersCount);
        if (
          el.testbank.resultAfterTesting == "show" ||
          el.testbank.resultAfterTesting == "showAnswers"
        ) {
          temp.push(el.answersCount - el.countWrongAnswers);
          temp.push(el.resultPercent);
        } else {
          temp.push("Скрыто");
          temp.push("Скрыто");
        }
        this.rows.push(temp);
        temp = [];
      });
    });
  },
};
</script>

<style scoped>
</style>