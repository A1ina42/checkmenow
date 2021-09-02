<template>
  <div
    id="sidebar"
    :class="[{ collapsed: collapsed }, { onmobile: isOnMobile }]"
  >
    <div class="sidebar">
      <div>
        <router-view />
      </div>
      <sidebar-menu
        :menu="getMenu"
        :width="width"
        :theme="selectedTheme"
        :collapsed="collapsed"
        :show-one-child="true"
        @toggle-collapse="onToggleCollapse"
      />
      <div
        v-if="isOnMobile && !collapsed"
        class="sidebar-overlay"
        @click="collapsed = true"
      />
    </div>
  </div>
</template>

<script>
import { SidebarMenu } from "vue-sidebar-menu";
export default {
  name: "CmnCreatePage",
  components: {
    SidebarMenu,
  },
  data() {
    return {
      width: "250px",
      collapsed: false,
      isOnMobile: false,
      selectedTheme: "success-theme",
    };
  },
  computed: {
    getMenu() {
      return [
        {
          header: true,
          title: "Создание тестов",
          hiddenOnCollapse: true,
        },
        {
          href: "/c/category",
          title: "Категории",
          icon: "fas fa-folder-open",
        },
        {
          href: "/c/question/view",
          title: "Вопросы",
          icon: "fas fa-question",
          child: [
            {
              title: "Список вопросов",
              href: "/c/question/view",
              icon: "fas fa-list fa-fw",
            },
            {
              title: "Добавить вопрос",
              href: "/c/question/create",
              icon: "fas fa-plus-square fa-fw",
            },
            {
              title: "Изменить вопрос",
              href: "/c/question/update/0",
              icon: "fas fa-edit fa-fw",
              alias: "/c/question/update/:id",
              hidden: this.$store.state.updateQuestion.isHideSidebar,
            },
          ],
        },
        {
          href: "/c/testbank/view",
          title: "Тесты",
          icon: "fas fa-check-square",
          child: [
            {
              title: "Список тестов",
              href: "/c/testbank/view",
              icon: "fas fa-list fa-fw",
            },
            {
              title: "Добавить тест",
              href: "/c/testbank/create",
              icon: "fas fa-plus-square fa-fw",
            },
            {
              title: "Изменить тест",
              href: "/c/testbank/update/0",
              icon: "fas fa-edit fa-fw",
              alias: "/c/testbank/update/:id",
              hidden: this.$store.state.updateTestbank.isHideSidebar,
            },
            {
              title: "Статистика теста",
              href: "/c/testbank/statistics/0",
              icon: "fas fa-chart-bar fa-fw",
              alias: "/c/testbank/statistics/:id",
              hidden: this.$store.state.statistics.isHideSidebar,
            },
          ],
        },
        {
          href: "/c/group",
          title: "Группы",
          icon: "fas fa-users",
        },
        {
          href: "/c/result",
          title: "Результаты",
          icon: "fas fa-chart-line",
        },
      ];
    },
  },
  mounted() {
    this.onResize();
    window.addEventListener("resize", this.onResize);
  },
  methods: {
    onToggleCollapse(collapsed) {
      this.collapsed = collapsed;
    },
    onResize() {
      if (window.innerWidth <= 767) {
        this.isOnMobile = true;
        this.collapsed = true;
      } else {
        this.isOnMobile = false;
        this.collapsed = false;
      }
    },
  },
};
</script>

<style>
#sidebar {
  padding-left: 350px;
  transition: 0.3s ease;
}
#sidebar.collapsed {
  padding-left: 50px;
}
#sidebar.onmobile {
  padding-left: 50px;
}
.sidebar-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 30px;
  left: 0;
  background-color: #000;
  opacity: 0.5;
  z-index: 900;
}

.vsm--link_hover .fa-plus-square,
.vsm--link_hover .fa-edit,
.vsm--link_hover .fa-list,
.vsm--link_active .fa-edit,
.router-link-active .fa-plus-square,
.router-link-active .fa-list,
.router-link-active .fa-edit {
  color: #28a745;
}

.v-sidebar-menu {
  top: 50px;
}

.sidebar {
  padding: 20px;
}
.container {
  max-width: 1200px;
}
</style>