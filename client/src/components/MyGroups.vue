<template>
  <div class="container">
    <h1 class="title">Мои группы</h1>

    <!-- Отображение списка ошибок -->
    <cmn-validation-errors :validation-errors="error" v-if="error" />

    <div v-if="group">
      <!-- Перебор списка групп -->
      <div v-for="(invite, indexInvites) in group.invites" :key="indexInvites">
        <!-- Модальное окно для подтвереждения отклонения от приглашения в группу -->
        <Modal
          v-model="showModalQuestionInvite"
          title="Вопрос"
          @close="showModalQuestionInvite = false"
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
                Вы действительно хотите отклонить приглашение в группу
                {{ currentNameGroup }}?
              </p>
            </div>
          </div>
          <div class="text-center">
            <div class="btn-group w-50 mt-2">
              <button
                type="button"
                class="btn btn-success mt-2 col-6"
                @click="reject(selectedId)"
              >
                Ок
              </button>
              <button
                type="button"
                class="btn btn-outline-secondary mt-2 col-6"
                @keyup.esc="closeModalQuestionInvite"
                @click="showModalQuestionInvite = false"
              >
                Отмена
              </button>
            </div>
          </div>
        </Modal>
        <div class="row">
          <span class="mt-1 col-12 col-sm-12 col-md-12 col-lg-9"
            >Пользователь <b>{{ invite.owner.name }}</b> приглашает вас в группу
            <b>{{ invite.name }}</b></span
          >
          <div
            class="
              btn-group
              col-12 col-sm-12 col-md-12 col-lg-2
              mt-2 mt-lg-0
              mb-3
            "
          >
            <button class="btn btn-primary" @click="accept(invite._id)">
              Принять
            </button>
            <button
              class="btn btn-danger"
              @click="
                currentNameGroup = invite.name;
                showModalQuestionInvite = true;
                selectedId = invite._id;
              "
            >
              Отклонить
            </button>
          </div>
        </div>
      </div>
      <hr
        v-if="
          group.invites &&
          group.invites.length > 0 &&
          group.myGroups &&
          group.myGroups.length > 0
        "
      />

      <!-- Перебор списка групп -->
      <div
        v-for="(myGroup, indexMyGroups) in group.myGroups"
        :key="indexMyGroups"
      >
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
              <p class="mb-1 mt-2">Вы действительно хотите выйти из группы?</p>
            </div>
          </div>
          <div class="text-center">
            <div class="btn-group w-50 mt-2">
              <button
                type="button"
                class="btn btn-success mt-2 col-6"
                @click="leave(selectedItem._id)"
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
        <div class="d-flex justify-content-between">
          <!-- Название группы -->
          <span class="p-1 mb-2">{{ myGroup.name }}</span>

          <!-- Функциональные кнопки -->
          <div
            class="ml-2 d-flex justify-content-between"
            v-if="selectedItems[indexMyGroups]"
          >
            <!-- Раскрыть/скрыть тесты группы -->
            <span class="mt-1"
              ><i>{{ myGroup.owner.name }}</i></span
            >
            <span @click="changeActive(indexMyGroups)"
              ><i
                class="fas fa-sort-down mt-1 ml-4"
                v-if="!selectedItems[indexMyGroups].isActive"
                v-tippy="{ delay: 400 }"
                content="Раскрыть группу"
              ></i>

              <i
                class="fas fa-sort-up mt-1 ml-4"
                v-if="selectedItems[indexMyGroups].isActive"
                v-tippy="{ delay: 400 }"
                content="Скрыть группу"
              ></i
            ></span>

            <!-- Покинуть группу -->
            <i
              class="fas fa-times ml-3 mt-1"
              @click="
                showModalQuestion = true;
                selectedItem = myGroup;
                selectedIndex = indexMyGroups;
              "
              v-tippy="{ delay: 400 }"
              content="Покинуть группу"
            ></i>
          </div>
        </div>

        <!-- Тесты группы -->
        <div
          v-if="
            myGroup.testbanks &&
            myGroup.testbanks.length < 1 &&
            selectedItems[indexMyGroups] &&
            selectedItems[indexMyGroups].isActive == true
          "
        >
          <div class="alert-test m-2 p-2 align-middle">
            <i
              class="fas fa-exclamation-triangle mr-2 mt-2"
              style="font-size: 24px; color: #856404"
            ></i>
            <span style="color: #856404">
              Владелец пока что не добавил тесты
            </span>
          </div>
        </div>
        <div
          v-if="
            selectedItems[indexMyGroups] &&
            selectedItems[indexMyGroups].isActive == true &&
            myGroup.testbanks.length > 0
          "
          class="testbanks"
        >
          <!-- Перебор тестов группы -->
          <div
            v-for="(testbank, id) in myGroup.testbanks"
            :key="id"
            class="d-flex justify-content-between"
          >
            <!-- Название теста -->
            <div class="m-2">
              {{ testbank.name }}
            </div>
            <!-- Функциональные кнопки -->
            <div>
              <router-link
                :to="{ name: 'run', params: { slug: testbank.link } }"
                class="btn btn-outline-primary mr-2 mt-1 mb-1"
                >Пройти</router-link
              >
              <router-link
                :to="{ name: 'currentResult', params: { slug: testbank.link } }"
                class="btn btn-outline-success mr-2 mt-1 mb-1"
                >Результат</router-link
              >
            </div>
          </div>
        </div>
      </div>
      <b-alert
        :show="group.myGroups && group.myGroups.length == 0"
        variant="warning"
        >Вы пока что не состоите в группах</b-alert
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CmnLoading from "@/components/Loading";
import { actionTypes } from "@/store/modules/group";
import CmnValidationErrors from "@/components/ValidationErrors";
export default {
  name: "CmnMyGroups",
  components: {
    CmnLoading,
    CmnValidationErrors,
  },
  data() {
    return {
      linkTest: "https://checkmenow.ru/t/run/",
      selectedId: null,
      currentNameGroup: null,
      showModalQuestionInvite: false,
      selectedItems: [], //массив объектов со значением: index выбранной группы и статус (раскрыта/открыта)
      showModalQuestion: false, //Отображение диалогового окна при исключении себя из группы
    };
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.group.isLoading,
      group: (state) => state.group.data,
      error: (state) => state.group.error,
    }),
  },
  async mounted() {
    await this.fetchMyGroups();
    for (let i = 0; i < this.group.myGroups.length; i++) {
      this.selectedItems.push({
        isActive: false,
        index: i,
      });
    }
  },
  methods: {
    //* Получение списка групп и приглашений пользователя с сервера
    async fetchMyGroups() {
      await this.$store.dispatch(actionTypes.getMyGroups).then((item) => {
        if (this.selectedItems.length != 0 && item.group) {
          //Расстановка индексов
          for (let i = 0; i < item.group.myGroups.length; i++) {
            this.selectedItems[i].index = i;
          }
        }
      });
    },

    //* Принять приглашение в группу
    accept(itemId) {
      const slug = itemId;
      this.$store
        .dispatch(actionTypes.acceptInviteGroup, {
          slug,
        })
        .then(() => {
          this.selectedItems.push({
            isActive: false,
            index: 0,
          });
          this.fetchMyGroups();
          this.$toast.open("Принято!");
        });
    },

    //* Смена статуса выбранной группы (скрыть/раскрыть список)
    changeActive(index) {
      let newValue = null;
      this.selectedItems.forEach((el) => {
        if (el.index == index) newValue = el.isActive;
      });
      this.$set(this.selectedItems[index], "isActive", !newValue);
    },

    //* Отклонить приглашение в группу
    reject(itemId) {
      const slug = itemId;
      this.$store
        .dispatch(actionTypes.rejectInviteGroup, {
          slug,
        })
        .then(() => {
          this.showModalQuestionInvite = false;
          this.fetchMyGroups();
          this.$toast.open("Отклонено!");
        });
    },

    //* Выйти из группы
    leave(itemId) {
      const slug = itemId;
      this.$store
        .dispatch(actionTypes.rejectInviteGroup, {
          slug,
        })
        .then(() => {
          this.showModalQuestion = false;
          this.fetchMyGroups();
          this.$toast.open("Вы вышли из группы!");
        });
    },

    //* Закрыть модальное окно с вопросом
    closeModalQuestion() {
      this.showModalQuestionInvite = false;
      this.selectedItem = null;
      this.selectedIndex = null;
    },

    //* Закрыть модальное окно с вопросом
    closeModalQuestion() {
      this.showModalQuestion = false;
      this.selectedItem = null;
      this.selectedIndex = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 900px;
}

.fa-times {
  font-size: 26px;
}

.testbanks {
  background-color: rgba(143, 143, 143, 0.1);
  padding: 5px;
  margin: 10px;
  border-radius: 5px;
  border: 1px dashed #0069d9;
}

.alert-test {
  background-color: #fff3cd;
  padding: 5px;
  margin: 10px;
  border-radius: 5px;
  border: 1px dashed #daca99;
}
</style>