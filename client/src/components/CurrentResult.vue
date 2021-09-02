<template>
  <div class="container current-result-view">
    <div class="printing">
      <h1 class="title">Результат</h1>
      <div
        v-if="
          currentResult &&
          currentResult.testbank.resultAfterTesting == 'dontShow'
        "
      >
        <div
          class="alert alert-warning mt-1 w-lg-50 ml-auto mr-auto"
          role="alert"
        >
          <div class="row">
            <div class="col-12 col-sm-1 text-center">
              <i
                class="fas fa-exclamation-triangle mr-2"
                style="font-size: 30px"
              ></i>
            </div>
            <div class="col-12 col-sm-11">
              <p class="text-center mb-0">Результат скрыт владельцем</p>
            </div>
          </div>
        </div>
      </div>
      <div
        id="chart"
        v-if="
          currentResult &&
          (currentResult.testbank.resultAfterTesting == 'show' ||
            currentResult.testbank.resultAfterTesting == 'showAnswers')
        "
        class="d-flex justify-content-between row"
      >
        <span class="col-12 col-md-6 col-lg-6">
          <ul class="stats">
            <li><b>Ваш результат: </b> {{ currentResult.result }}%</li>
            <li><b>Тест: </b> {{ currentResult.testbank.name }}</li>
            <li class="mt-3">
              <b>Дата и время начала: </b>
              {{ getDate(currentResult.passing.startedAt) }}
            </li>
            <li>
              <b>Время прохождения: </b
              >{{
                diffDate(
                  currentResult.passing.endedAt,
                  currentResult.passing.startedAt
                )
              }}
            </li>
            <li class="mt-3">
              <b>Правильных ответов: </b> {{ currentResult.right }}
            </li>
            <li><b>Неправильных ответов: </b> {{ currentResult.wrong }}</li>
          </ul>
        </span>
        <apexchart
          class="col-12 col-md-6 col-lg-6"
          type="pie"
          :options="getChartOptions"
          :series="getSeries"
        ></apexchart>
      </div>
      <div
        id="result"
        v-if="
          currentResult &&
          currentResult.testbank &&
          currentResult.testbank.resultAfterTesting == 'showAnswers'
        "
      >
        <div
          v-for="(item, indexQuest) in currentResult.passing.qna"
          :key="indexQuest"
          class="testbank-view m-3"
        >
          <div v-html="item.question.name"></div>
          <div v-for="(answer, indexAnswer) in item.answers" :key="indexAnswer">
            <div class="d-flex">
              <div class="col-1 p-0 text-right">
                <i
                  class="fas fa-check fa-fw"
                  v-if="
                    (item.question.answers[indexAnswer].isCorrect == true &&
                      answer.isCorrect == true) ||
                    item.question.answers[indexAnswer].isCorrect == true
                  "
                ></i>
                <i
                  class="fas fa-times fa-fw"
                  v-if="
                    answer.isCorrect == true &&
                    item.question.answers[indexAnswer].isCorrect == false
                  "
                ></i>
              </div>
              <div class="col-11">
                <input
                  type="checkbox"
                  v-if="item.question.type == 'cb'"
                  :value="answer._id"
                  @click.prevent=""
                  v-model="answer.isCorrect"
                  class="mr-3"
                />
                <input
                  v-if="item.question.type == 'rb'"
                  type="radio"
                  @click.prevent=""
                  :value="indexAnswer"
                  :checked="answer.isCorrect"
                  @change="onChangeRb(indexQuest, $event)"
                  class="mr-3"
                />
                <input
                  v-if="item.question.type == 'free'"
                  class="mr-3"
                  v-model="answer.isCorrect"
                />
                <template v-if="item.question.questionType != 'free'">
                  {{ answer.userText }}
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="container"
      v-if="
        currentResult &&
        currentResult.testbank &&
        (currentResult.testbank.resultAfterTesting == 'showAnswers' ||
          currentResult.testbank.resultAfterTesting == 'show')
      "
    >
      <div class="row">
        <div class="col text-center">
          <button @click="print" class="btn btn-primary">Напечатать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CmnLoading from "@/components/Loading";
import { actionTypes } from "@/store/modules/passing";
import CmnValidationErrors from "@/components/ValidationErrors";
import moment from "moment";
import VueApexCharts from "vue-apexcharts";
import { Printd } from "printd";
export default {
  name: "CmnCurrentResult",
  components: {
    CmnLoading,
    Printd,
    apexchart: VueApexCharts,
    CmnValidationErrors,
  },
  data() {
    return {
      d: null,
      cssText: `
      .title {
        margin-bottom: 30px;
        text-align: center;
      }

      .fa-check {
          font-size: 20px;
      }

      .testbank-center {
        width: 700px;
        margin-left: auto;
        margin-right: auto;
      }

      input[type="checkbox"],
      input[type="radio"],
      .custom-checkbox {
        transform: scale(1.5);
      }

      .fa-times {
        font-size: 23px;
      }

      .btn-center {
        text-align: center;
      }

      .stats {
        list-style: none;
      }

      .testbank-view {
        padding: 10px;
        background-color: rgba(143, 143, 143, 0.1);
        border-radius: 5px;
        border: 1px dashed #007bff;
      }`,
    };
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.passing.isLoading,
      currentResult: (state) => state.passing.currentResult,
      error: (state) => state.passing.error,
    }),
    getChartOptions() {
      return {
        chart: {
          width: 480,
          height: 480,
          type: "pie",
        },
        colors: ["#45d18b", "#dd4343"],
        labels: ["Правильных ответов", "Неправильных ответов"],
        responsive: [
          {
            breakpoint: 1200,
            options: {
              chart: {
                width: 280,
                height: 280,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };
    },
    getSeries() {
      return [this.currentResult.right, this.currentResult.wrong];
    },
  },
  async mounted() {
    await this.fetchCurrentResult();
    this.d = new Printd();
  },
  methods: {
    print() {
      this.d.print(this.$el, [
        this.cssText,
        "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
        "https://use.fontawesome.com/releases/v5.0.13/css/all.css",
        "https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.26.1/apexcharts.min.css",
        "https://cdnjs.cloudflare.com/ajax/libs/apexcharts/3.26.1/apexcharts.css",
      ]);
    },
    //* Получение списка категорий с сервера
    fetchCurrentResult() {
      const slug = this.$route.params.slug;
      this.$store.dispatch(actionTypes.getCurrentResult, { slug });
    },

    onChangeRb(indexQuest, $event) {
      for (const index in this.qna[indexQuest].answers) {
        this.qna[indexQuest].answers[index].isCorrect =
          index === $event.target.value;
      }
    },

    getDate(value) {
      let startedAt = new Date(value).toLocaleString();
      return startedAt;
    },

    diffDate(end, start) {
      let startedAt = new Date(start);
      let endedAt = new Date(end);
      return moment
        .utc(
          moment(endedAt, "DD/MM/YYYY HH:mm:ss").diff(
            moment(startedAt, "DD/MM/YYYY HH:mm:ss")
          )
        )
        .format("HH:mm:ss");
    },
  },
};
</script>



<style scoped>
.testbank-center {
  /* width: 700px; */
  margin-left: auto;
  margin-right: auto;
}

input[type="checkbox"],
input[type="radio"],
.custom-checkbox {
  transform: scale(1.5);
}

.fa-times {
  font-size: 23px;
}

.btn-center {
  text-align: center;
}

.stats {
  list-style: none;
}

.testbank-view {
  padding: 10px;
  background-color: rgba(143, 143, 143, 0.1);
  border-radius: 5px;
  border: 1px dashed #007bff;
}

.current-result-view {
  max-width: 1000px;
}

.alert-warning {
  min-width: 100px;
  font-size: 18px;
  max-width: 700px;
}

@media print {
  .apexcharts-legend-marker:before {
    content: "\25A0";
    position: absolute;
    top: 0;
    left: 0;
    display: block;
    line-height: 12px;
    font-size: 24px;
  }
}
</style>