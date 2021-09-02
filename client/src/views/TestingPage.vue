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
        :menu="menu"
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
  name: "CmnTestingPage",
  components: {
    SidebarMenu,
  },
  data() {
    return {
      menu: [
        {
          header: true,
          title: "Прохождение тестов",
          hiddenOnCollapse: true,
        },
        {
          href: "/t/my-groups",
          title: "Мои группы",
          icon: "fas fa-users",
        },
        {
          href: "/t/my-passing",
          title: "Мои прохождения",
          icon: "fas fa-tasks",
        },
        {
          href: "/t/my-results",
          title: "Мои результаты",
          icon: "fas fa-check-square",
        },
      ],
      width: "250px",
      collapsed: false,
      isOnMobile: false,
      selectedTheme: "primary-theme",
    };
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

<style scoped>
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

.v-sidebar-menu {
  top: 50px;
}

.sidebar {
  padding: 20px;
}
</style>