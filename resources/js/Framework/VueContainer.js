import  BootstrapVue  from 'bootstrap-vue';
import Vue from 'vue';
import $ from 'jquery';


import Login from '../Components/Login/Login.vue';
import Signup from '../Components/Signup/Signup.vue';
import NavProfile from '../Components/NavProfile/NavProfile.vue';
import StartPasswordReset from '../Components/Login/StartPasswordReset.vue';
import PasswordReset from '../Components/Login/PasswordReset.vue';
import ExpeditionsAdmin from '../Components/Expeditions/ExpeditionsAdmin.vue';
import {ModelListSelect, BasicSelect} from 'vue-search-select';
import ExpeditionsCreate from '../Components/Expeditions/ExpeditionsCreate.vue';
import ExpeditionSingle from '../Components/Expeditions/ExpeditionSingle.vue';
import Datepicker from 'vue-bootstrap-datetimepicker';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';
import Loader from '../Components/Utils/Loader.vue';


export default class VueContainer {
  constructor() {
    let app = this.setUp(Vue);
  }

  setUp(Vue) {
    Vue.use(BootstrapVue);
    Vue.component('datepicker', Datepicker);
    Vue.component('model-list-select', ModelListSelect);
    Vue.component('loader', Loader);
    let app = new Vue({
      el: '.vue-app',
      components: {
          BasicSelect,
          Login,
          Signup,
          NavProfile,
          StartPasswordReset,
          PasswordReset,
          ExpeditionsAdmin,
          ExpeditionsCreate,
          ExpeditionSingle
      }
    });
    return app;
  }
};

$.extend(true, $.fn.datetimepicker.defaults, {
    icons: {
        time: 'icon ion-md-clock',
        date: 'icon ion-md-calendar',
        up: 'icon ion-md-arrow-up',
        down: 'icon ion-md-arrow-down',
        previous: 'icon ion-md-arrow-back',
        next: 'icon ion-md-arrow-forward',
        today: 'icon ion-md-play',
        clear: 'icon ion-md-trash',
        close: 'icon ion-md-close',
    }
});
