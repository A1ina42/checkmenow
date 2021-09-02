import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store/index.js'

import Login from '@/views/Login';
import Register from '@/views/Register'
import Homepage from '@/views/Homepage'
import CreatePage from '@/views/CreatePage';
import TestingPage from '@/views/TestingPage';
import Terms from '@/views/Terms';

import Category from '@/components/Category';
import QuestionTabs from '@/components/QuestionTabs';
import QuestionView from '@/components/QuestionView';
import CreateQuestion from '@/components/CreateQuestion';
import UpdateQuestion from '@/components/UpdateQuestion';
import TestbankTabs from '@/components/TestbankTabs';
import TestbankView from '@/components/TestbankView';
import CreateTestbank from '@/components/CreateTestbank';
import UpdateTestbank from '@/components/UpdateTestbank';
import Group from '@/components/Group';
import MyResults from '@/components/MyResults';
import MyGroups from '@/components/MyGroups';
import MyPassing from '@/components/MyPassing';
import Run from '@/components/Run';
import ResultView from '@/components/ResultView';
import StatisticsTestbank from '@/components/StatisticsTestbank';
import CurrentResult from '@/components/CurrentResult';

import { actionTypes as actionTypesAuth } from "@/store/modules/auth";
import { actionTypes as actionTypesCreateCategory } from "@/store/modules/createCategory";
import { actionTypes as actionTypesUpdateCategory } from "@/store/modules/updateCategory";
import { actionTypes as actionTypesCreateGroup } from "@/store/modules/createGroup";
import { actionTypes as actionTypesUpdateQuestion } from "@/store/modules/updateQuestion";
import { actionTypes as actionTypesUpdateTestbank } from "@/store/modules/updateTestbank";
import { actionTypes as actionTypesStatistics } from "@/store/modules/statistics";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'homepage',
    component: Homepage,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    meta: {
      guest: true
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    path: '/terms',
    name: 'terms',
    component: Terms,
    meta: {
      guest: true
    }
  },
  {
    path: '/c',
    name: 'createPage',
    component: CreatePage,
    children: [
      {
        name: 'category',
        path: 'category',
        component: Category
      },
      {
        name: 'question',
        path: 'question',
        component: QuestionTabs,
        children: [
          {
            name: 'questionView',
            path: 'view',
            component: QuestionView
          },
          {
            name: 'questionCreate',
            path: 'create',
            component: CreateQuestion
          },
          {
            name: 'questionUpdate',
            path: 'update/:slug',
            component: UpdateQuestion
          }
        ]
      },
      {
        name: 'testbank',
        path: 'testbank',
        component: TestbankTabs,
        children: [
          {
            name: 'testbankView',
            path: 'view',
            component: TestbankView
          },
          {
            name: 'testbankCreate',
            path: 'create',
            component: CreateTestbank
          },
          {
            name: 'testbankUpdate',
            path: 'update/:slug',
            component: UpdateTestbank
          },
          {
            name: 'testbankStatistics',
            path: 'statistics/:slug',
            component: StatisticsTestbank
          }
        ]
      },
      {
        name: 'group',
        path: 'group',
        component: Group
      },
      {
        name: 'resultView',
        path: 'result',
        component: ResultView
      },
    ],
    beforeEnter: (to, from, next) => {
      store.dispatch(actionTypesAuth.getCurrentUser).then(() => {
        next();
      });
    }
  },
  {
    path: '/t',
    name: 'testingPage',
    component: TestingPage,
    children: [
      {
        name: 'myGroups',
        path: 'my-groups',
        component: MyGroups
      },
      {
        name: 'myResults',
        path: 'my-results',
        component: MyResults
      },
      {
        name: 'myPassing',
        path: 'my-passing',
        component: MyPassing
      },
      {
        name: 'run',
        path: 'run/:slug',
        component: Run
      },
      {
        name: 'currentResult',
        path: 'run/:slug/current-result',
        component: CurrentResult
      },
    ],
    beforeEnter: (to, from, next) => {
      store.dispatch(actionTypesAuth.getCurrentUser).then(() => {
        next();
      });
    }
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  store.dispatch(actionTypesAuth.resetValidation);
  store.dispatch(actionTypesCreateCategory.resetValidation);
  store.dispatch(actionTypesUpdateCategory.resetValidation);
  store.dispatch(actionTypesCreateGroup.resetValidation);
  store.dispatch(actionTypesUpdateQuestion.resetSidebar);
  store.dispatch(actionTypesUpdateTestbank.resetSidebar);
  store.dispatch(actionTypesStatistics.resetSidebar);
  next();
})

export default router
