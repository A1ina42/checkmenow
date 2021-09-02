<template>
  <div class="container justify-content-center">
    <div class="row mt-5">
      <div class="col-sm-12 col-md-4">
        <div
          class="card text-white bg-secondary mb-3 ml-auto mr-auto"
          style="max-width: 18rem"
        >
          <div class="card-header">Категории</div>
          <div class="card-body">
            <h5 class="card-title">Создание категорий</h5>
            <p class="card-text">
              Для удобной группировки вопросов можно создать неограниченное
              количество категорий.
            </p>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-4">
        <div
          class="card text-white bg-secondary mb-3 ml-auto mr-auto"
          style="max-width: 18rem"
        >
          <div class="card-header">Группы</div>
          <div class="card-body">
            <h5 class="card-title">Объединение пользователей</h5>
            <p class="card-text">
              С помощью создания групп пользователей можно открыть доступ на
              прохождение тестов.
            </p>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-4">
        <div
          class="card text-white bg-secondary mb-3 ml-auto mr-auto"
          style="max-width: 18rem"
        >
          <div class="card-header">Тесты</div>
          <div class="card-body">
            <h5 class="card-title">Создание тестов</h5>
            <p class="card-text">
              Многофункциональный онлайн конструктор тестов покрывает все задачи
              проведения тестирования.
            </p>
          </div>
        </div>
      </div>
    </div>
    <h1 class="title">Как это работает:</h1>
    <div class="row mt-10">
      <div class="col-sm-12 col-md-4">
        <div
          class="card text-white bg-secondary mb-3 ml-auto mr-auto"
          style="max-width: 18rem"
        >
          <div class="card-header">Шаг 1</div>
          <div class="card-body">
            <h5 class="card-title">Создайте тест</h5>
            <p class="card-text">
              который можно пройти в любое время и на любом устройстве
            </p>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-4">
        <div
          class="card text-white bg-secondary mb-3 ml-auto mr-auto"
          style="max-width: 18rem"
        >
          <div class="card-header">Шаг 2</div>
          <div class="card-body">
            <h5 class="card-title">Отправьте ссылку</h5>
            <p class="card-text">
              пользователям на свой тест или пригласите их в группу
            </p>
          </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-4">
        <div
          class="card text-white bg-secondary mb-3 ml-auto mr-auto"
          style="max-width: 18rem"
        >
          <div class="card-header">Шаг 3</div>
          <div class="card-body">
            <h5 class="card-title">Получите доступ</h5>
            <p class="card-text">
              к результатам прохождения теста и аналитическому отчету
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CmnHomepage",
};
</script>

<style scoped>
.fa-tasks {
  font-size: 220px;
  color: gray;
  text-align: center;
}

.card {
  background-image: url("../assets/card_bg.jpg");
  min-height: 220px;
}

.card-header {
  color: #f5c125;
  font-size: 25px;
  font-weight: bold;
}
</style>
