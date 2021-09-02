<template>
  <div>
    <h1 class="title">Статистика</h1>
    <div id="chart" v-if="statistics">
      <apexchart
        type="bar"
        height="350"
        :options="getChartOptions"
        :series="getSeries"
      ></apexchart>
    </div>
    <b-alert :show="!statistics" variant="warning" class="container w-50"
      >Тест пока что никто не прошел</b-alert
    >
  </div>
</template>

<script>
import { mapState } from "vuex";
import CmnLoading from "@/components/Loading";
import { actionTypes } from "@/store/modules/statistics";
import CmnValidationErrors from "@/components/ValidationErrors";
import VueApexCharts from "vue-apexcharts";
export default {
  name: "CmnStatistics",
  components: {
    apexchart: VueApexCharts,
    CmnLoading,
    CmnValidationErrors,
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.statistics.isLoading,
      statistics: (state) => state.statistics.data,
    }),
    getSeries() {
      return [
        {
          name: "Процент",
          data: this.statistics.percents,
        },
      ];
    },
    getChartOptions() {
      return {
        chart: {
          height: 350,
          type: "bar",
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: "50%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: 2,
        },

        grid: {
          row: {
            colors: ["#fff", "#f2f2f2"],
          },
        },
        xaxis: {
          labels: {
            rotate: -45,
          },
          categories: this.statistics.labels,
          tickPlacement: "on",
        },
        yaxis: {
          title: {
            text: "Процент правильных ответов",
            style: {
              fontSize: "16px",
              fontFamily: "Helvetica, Arial, sans-serif",
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "horizontal",
            shadeIntensity: 0.25,
            gradientToColors: undefined,
            inverseColors: true,
            opacityFrom: 0.85,
            opacityTo: 0.85,
            stops: [50, 0, 100],
          },
        },
      };
    },
  },
  mounted() {
    this.fetchStatistics();
  },
  methods: {
    //* Получение списка категорий с сервера
    fetchStatistics() {
      this.$store.dispatch(actionTypes.getStatistics, {
        slug: this.$route.params.slug,
      });
    },
  },
};
</script>

<style scoped>
</style>