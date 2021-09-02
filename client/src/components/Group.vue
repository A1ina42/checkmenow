<template>
  <div class="container group-view">
    <h1 class="title">Группы</h1>
    <!-- Отображение ошибок при добавлении -->
    <cmn-validation-errors
      :validation-errors="errorCreate"
      v-if="errorCreate"
    />

    <!-- Добавление группы -->
    <div class="form-row ml-2">
      <input
        type="text"
        class="
          form-control
          col-xs-8 col-sm-7 col-md-7 col-lg-8 col-xl-8
          mr-sm-2 mr-xs-2 mr-md-2 mr-lg-2 mr-xl-4
          mb-2
        "
        placeholder="Введите название группы"
        @keyup.enter="createGroup()"
        v-model="name"
      />
      <div class="col-xs-4 col-md-4 col-lg-3 col-sm-4 p-0">
        <button
          type="button"
          class="btn btn-success w-100"
          @click="createGroup()"
        >
          Добавить
        </button>
      </div>
    </div>

    <hr />

    <!-- Отображение загрузки -->
    <cmn-loading v-if="isLoading" />

    <!-- Отображение ошибок при удалении -->
    <cmn-validation-errors
      :validation-errors="errorDelete"
      v-if="errorDelete"
    />

    <!-- Отображение ошибок при изменении -->
    <cmn-validation-errors
      :validation-errors="errorUpdate"
      v-if="errorUpdate"
    />

    <!-- Отображение списка групп -->
    <div v-if="group">
      <!-- Модальное окно для добавления пользователей в группу -->
      <Modal
        v-model="showModalUser"
        title="Добавление пользователя"
        @close="closeModalUser"
      >
        <div>
          <label for="tags-pills">
            Введите имена пользователей с помощью кнопки "Enter" или кнопки "+".
            После чего нажмите кнопку "Добавить".</label
          >

          <!-- Обработчик ошибок -->
          <cmn-validation-errors
            :validation-errors="errorsExist"
            v-if="errorsExist"
          />

          <!-- Поле для ввода тегов с именами пользователей -->
          <b-form-tags
            input-id="tags-pills"
            v-model="users"
            addButtonText="+"
            size="lg"
            duplicate-tag-text="Повторяющееся значение"
            invalid-tag-text=""
            placeholder=""
          ></b-form-tags>
          <button
            type="button"
            class="btn btn-success mt-2 btn-add"
            @click="addUser()"
          >
            Добавить
          </button>
        </div>
      </Modal>

      <!-- Модальное окно для добавления теста в группу -->
      <Modal
        v-model="showModalTest"
        title="Добавление теста"
        @close="closeModalTest"
      >
        <div v-if="testbank">
          <div v-if="testbank.allTestbank && testbank.allTestbank.length > 0">
            <label for="tests">Выберите вопросы</label>
            <div id="tests">
              <table>
                <tr
                  v-for="(item, index) in testbank.allTestbank"
                  :key="index"
                  class="mr-3"
                >
                  <td>
                    <input
                      type="checkbox"
                      v-model="testbanksId"
                      :value="item._id"
                      class="m-1"
                    />
                  </td>
                  <td v-html="item.name"></td>
                </tr>
              </table>
            </div>
            <button
              type="button"
              class="btn btn-success mt-2 btn-add"
              @click="addTestbank()"
            >
              Добавить
            </button>
          </div>

          <b-alert
            :show="testbank.allTestbank && testbank.allTestbank.length <= 0"
            variant="warning"
            >Необходимо добавить тест</b-alert
          >
        </div>
      </Modal>

      <div v-if="group && group.group && group.group.length > 0">
        <b-alert
          :show="!isHideAlertGroup"
          dismissible
          @dismissed="hideAlertGroup()"
          variant="success"
        >
          <b>Объединяйте пользователей в группы и открывайте доступ к тестам</b
          ><br />
          Для изменения названия группы кликните на значок
          <i class="fas fa-edit ml-2 mt-3 mr-1 mb-2"></i> или дважды кликните по
          названию. После редактирования нажмите кнопку Enter. Для удаления
          группы нажмите на значок
          <i class="fas fa-trash ml-2 mt-2 mr-2 mb-2"></i> и подтвердите
          удаление в появившемся диалоговом окне. Нажмите на значок
          <i class="fas fa-user-plus ml-2 mt-2 mr-2 mb-2"></i>
          для добавления пользователей в группу. Значок
          <i class="fas fa-list ml-2 mt-2 mr-2"></i>
          предназначен для добавления тестов группе. С помощью значков
          <i class="fas fa-sort-down ml-2 mt-2 mr-2 mb-2"></i>
          <i class="fas fa-sort-up mt-2 mr-2 mb-3"></i> можно раскрыть/скрыть
          информацию о группе.
        </b-alert>
        <!-- Перебор списка групп -->
        <div v-for="(item, index) in group.group" :key="index">
          <!-- Модальное окно для удаления записи -->
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
                  @click="deleteGroup()"
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
            <span
              class="p-1"
              @dblclick="editItem(item, index)"
              v-if="activeIndex != index"
              >{{ item.name }}</span
            >

            <!-- Поле для изменения названия группы -->
            <input
              :ref="'group' + index"
              v-if="activeIndex == index"
              @keyup.enter="doneEnterEdit(item)"
              @keyup.esc="cancelEdit(item)"
              type="text"
              autofocus
              @blur="doneBlurEdit(item)"
              v-model="item.name"
              class="edit-item"
            />

            <!-- Функциональные кнопки -->
            <div
              class="ml-2 d-flex justify-content-between"
              v-if="selectedItems[index]"
            >
              <i
                class="fas fa-edit mr-2"
                @click="editItem(item, index)"
                v-tippy="{ delay: 400 }"
                content="Изменить группу"
              ></i>
              <i
                class="fas fa-trash mr-2"
                @click="
                  showModalQuestion = true;
                  selectedItem = item;
                  selectedIndex = index;
                "
                v-tippy="{ delay: 400 }"
                content="Удалить группу"
              ></i>
              <i
                class="fas fa-user-plus mr-2"
                v-tippy="{ delay: 400 }"
                @click="openModalUser(item._id, index)"
                content="Добавить пользователя"
              ></i>

              <i
                class="fas fa-list fa-fw mr-2"
                style="font-size: 22px"
                v-tippy="{ delay: 400 }"
                @click="openModalTest(item._id)"
                content="Добавить тест"
              ></i>

              <!-- Раскрыть/скрыть данные о группе -->
              <span @click="changeActive(index)"
                ><i
                  class="fas fa-sort-down"
                  v-if="!selectedItems[index].isActive"
                  v-tippy="{ delay: 400 }"
                  content="Раскрыть список"
                ></i>

                <i
                  class="fas fa-sort-up"
                  v-if="selectedItems[index].isActive"
                  v-tippy="{ delay: 400 }"
                  content="Скрыть список"
                ></i
              ></span>
            </div>
          </div>

          <!-- Данные о группе -->
          <div
            v-if="selectedItems[index] && selectedItems[index].isActive == true"
            class="members"
          >
            <!-- Перебор пользователей, состоящих в группе -->
            <div v-for="(member, id) in item.members" :key="id" class="row">
              <!-- Название -->
              <div class="col-5 col-md-4 col-lg-4 mt-2">
                {{ member.user.name }}
              </div>
              <!-- Статус -->
              <div
                class="col-3 col-md-6 col-lg-4"
                v-if="member.isAccepted == false"
              >
                <span class="d-none d-md-inline">В ожидании</span>
                <i
                  class="fas fa-hourglass-half ml-md-2 mb-md-1 mt-2 fa-fw"
                  v-tippy="{ delay: 400 }"
                  content="Пользователь пока не принял приглашение в группу"
                ></i>
              </div>
              <div
                class="col-3 col-md-6 col-lg-4"
                v-if="member.isAccepted == true"
              >
                <span class="d-none d-md-inline">Принято</span>
                <i
                  class="fas fa-check ml-md-2 mb-md-1 mt-2 fa-fw"
                  v-tippy="{ delay: 400 }"
                  content="Пользователь принял приглашение в группу"
                ></i>
              </div>
              <!-- Исключить из группы -->
              <div class="col-3 col-md-2 col-lg-4 text-right">
                <span class="d-none d-lg-inline">Исключить</span>
                <i
                  class="fas fa-times ml-md-2 mb-md-1 mt-2 fa-fw"
                  v-tippy="{ delay: 400 }"
                  @click="removeUser(item._id, member._id)"
                  content="Исключить пользователя из группы"
                ></i>
              </div>
            </div>
            <p v-if="item.members.length < 1">Пользователи не добавлены</p>
          </div>
        </div>
      </div>
      <b-alert
        :show="group && group.group && group.group.length == 0"
        variant="warning"
        >Добавьте группу пользователей</b-alert
      >
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CmnLoading from "@/components/Loading";
import { actionTypes as actionTypesGroup } from "@/store/modules/group";
import { actionTypes as actionTypesCreateGroup } from "@/store/modules/createGroup";
import { actionTypes as actionTypesUpdateGroup } from "@/store/modules/updateGroup";
import CmnValidationErrors from "@/components/ValidationErrors";
export default {
  name: "CmnGroup",
  components: {
    CmnValidationErrors,
    CmnLoading,
  },
  data() {
    return {
      name: "",
      oldItem: "",
      activeIndex: null,
      isEnter: false,
      showModalUser: false, //Показ модального окна для добавления пользователей в группу
      showModalTest: false, //Показ модального окна для добавления теста группе
      users: [], //Массив имен пользователей
      selectedId: null,
      selectedIndex: null,
      selectedItems: [], //массив объектов со значением: index выбранной группы и статус (раскрыта/открыта)
      isOpened: false,
      showModalQuestion: false, //Отображение диалогового окна при удалении
      testbanksId: [], //Массив добавленых тестов группе
      isHideAlertGroup: false,
    };
  },
  computed: {
    ...mapState({
      isLoading: (state) => state.group.isLoading,
      group: (state) => state.group.data,
      testbank: (state) => state.updateGroup.data,
      usersGroup: (state) => state.group.users,
      errorDelete: (state) => state.group.error,
      errorUpdate: (state) => state.updateGroup.validationErrors,
      errorCreate: (state) => state.createGroup.validationErrors,
      errorsExist: (state) => state.updateGroup.errorsExist,
    }),
  },
  async mounted() {
    if (window.localStorage.isHideAlertGroup) {
      this.isHideAlertGroup = window.localStorage.isHideAlertGroup;
    }
    //* Первая загрузка статусов групп (по умолчанию все скрыты)
    await this.fetchGroup();
    for (let i = 0; i < this.group.group.length; i++) {
      this.selectedItems.push({
        isActive: false,
        index: i,
      });
    }
  },
  watch: {
    isHideAlertGroup(newValue) {
      window.localStorage.isHideAlertGroup = newValue;
    },
  },
  methods: {
    //* Получение списка тестов с сервера
    fetchTestbank() {
      const slug = this.selectedId;
      this.$store
        .dispatch(actionTypesUpdateGroup.getTestbank, {
          slug,
        })
        .then((obj, err) => {
          if (this.testbank.groupTestbank != null)
            this.testbanksId = this.testbank.groupTestbank;
          if (err) console.log(err);
        });
    },

    //* Cброс ошибок при закрытии модального окна для добавления пользователей в группу
    closeModalUser() {
      if (!this.isOpened) {
        this.$set(this.selectedItems[this.selectedIndex], "isActive", false);
      }
      this.selectedId = null;
      this.selectedIndex = null;
      this.showModalUser = false;
      this.$store.dispatch(actionTypesUpdateGroup.resetErrorsExist);
    },

    //* Смена статуса выбранной группы (скрыть/раскрыть список)
    changeActive(index) {
      let newValue = null;
      this.selectedItems.forEach((el) => {
        if (el.index == index) newValue = el.isActive;
      });
      this.$set(this.selectedItems[index], "isActive", !newValue);
    },

    //* Получение списка групп с сервера
    async fetchGroup() {
      await this.$store.dispatch(actionTypesGroup.getGroup).then((item) => {
        if (this.selectedItems.length != 0) {
          //Расстановка индексов
          for (let i = 0; i < item.group.length; i++) {
            this.selectedItems[i].index = i;
          }
        }
      });
    },

    //* Создание группы
    createGroup() {
      this.$store
        .dispatch(actionTypesCreateGroup.createGroup, {
          name: this.name,
        })
        .then(() => {
          // Очищение поля после добавления
          this.name = "";
          this.selectedItems.push({
            isActive: false,
            index: 0,
          });
          this.fetchGroup();
          this.$toast.open("Добавлено!");
        });
    },

    //* Добавление пользователей в группу
    addUser() {
      const slug = this.selectedId;
      const users = this.users;
      this.$store
        .dispatch(actionTypesUpdateGroup.addUser, {
          users,
          slug,
        })
        .then((response) => {
          this.users = [];
          if (response.data.newAddUsers.length > 0) {
            this.fetchGroup();
            this.isOpened = true;
            this.$set(this.selectedItems[this.selectedIndex], "isActive", true);
            this.$toast.open("Добавлено!");
          }
        });
    },

    //* Удаление пользователя из группы
    removeUser(groupId, userId) {
      this.$store
        .dispatch(actionTypesGroup.deleteUserGroup, {
          groupId,
          userId,
        })
        .then(() => {
          this.fetchGroup();
          this.$toast.open("Удалено!");
        });
    },

    //* Добавление теста группе
    addTestbank() {
      const testbanks = this.testbanksId;
      const slug = this.selectedId;
      this.$store
        .dispatch(actionTypesUpdateGroup.addTestbank, {
          testbanks,
          slug,
        })
        .then((response) => {
          this.closeModalTest();
          this.fetchGroup();
          this.$toast.open("Сохранено!");
        });
    },

    //* Удаление группы из списка
    deleteGroup() {
      this.$store
        .dispatch(actionTypesGroup.deleteGroup, {
          slug: this.selectedItem._id,
        })
        .then(() => {
          this.removeSelectedIndex(this.selectedIndex);
          this.showModalQuestion = false;
          this.fetchGroup();
          this.$toast.open("Удалено!");
        })
        .catch((err) => {
          this.showModalQuestion = false;
        });
    },

    //* Установка фокуса на поле ввода
    setFocus(index) {
      setTimeout(() => {
        this.$refs["group" + index][0].focus();
      }, 50);
    },

    //* Изменение группы
    editItem(item, index) {
      this.activeIndex = index;
      this.oldItem = item.name;
      this.setFocus(index);
    },

    //* Завершение редактирования группы
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
          .dispatch(actionTypesUpdateGroup.updateGroup, {
            id: item._id,
            name: item.name,
          })
          .then(() => {
            //При успешном изменении обновляется список групп
            this.fetchGroup();
            this.$toast.open("Изменено!");
          })
          .catch((error) => {
            //В случае получения ошибки - поле остается активным
            if (error) this.activeIndex = index;
            this.setFocus(index);
          });
      }
    },

    //* Завершение редактирования группы по кнопке Enter
    doneEnterEdit: function (item) {
      if (!this.errorUpdate) {
        this.isEnter = true;
        this.doneEdit(item);
      }
    },

    //* Завершение редактирования группы при смене фокуса
    doneBlurEdit: function (item) {
      if (this.errorUpdate) {
        this.cancelEdit(item);
        this.$store.dispatch(actionTypesUpdateGroup.resetValidation);
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

    //* Удаление элементов из активных групп
    removeSelectedIndex(index) {
      let position = this.selectedItems
        .map((item) => item.index)
        .indexOf(index);
      this.selectedItems.splice(position, 1);
    },

    //* Открытие модального окна для добавления пользователей в группу
    openModalUser(itemId, index) {
      // Добавление индекса в массив активных групп, если такой еще не добавлен
      let item = this.selectedItems.find((el) => el.index === index).isActive;
      if (item) this.isOpened = true;
      else this.isOpened = false;
      this.showModalUser = true;
      this.selectedId = itemId;
      this.selectedIndex = index;
    },

    //* Открытие модального окна для добавления теста группе
    async openModalTest(itemId) {
      this.selectedId = itemId;
      await this.fetchTestbank();
      this.showModalTest = true;
    },

    //* Закрыть модальное окно с вопросов
    closeModalQuestion() {
      this.showModalQuestion = false;
      this.selectedItem = null;
      this.selectedIndex = null;
    },

    //* Cброс ошибок при закрытии модального окна для добавления теста группе
    closeModalTest() {
      this.showModalTest = false;
      this.selectedId = null;
    },

    //*Скрыть алерт
    hideAlertGroup() {
      window.localStorage.isHideAlertGroup = true;
    },
  },
};
</script>

<style scoped>
.group-view {
  max-width: 900px;
}

.btn-add {
  margin: 0 auto;
  display: block;
}

.fa-times {
  font-size: 22px;
}

input[type="checkbox"] {
  transform: scale(1.5);
}

.members {
  background-color: rgba(143, 143, 143, 0.1);
  padding: 5px;
  margin: 10px;
  border-radius: 5px;
  border: 1px dashed #28a745;
}

.label-member {
  display: inline-block;
}
</style>