import  BootstrapVue  from 'bootstrap-vue';
import Vue from 'vue';
import Login from '../Components/Login/Login.vue';
import Signup from '../Components/Signup/Signup.vue';
export default class VueContainer {
  constructor() {
    let app = this.setUp(Vue);
  }

  setUp(Vue) {
    Vue.use(BootstrapVue);
    let app = new Vue({
      el: '.vue-app',
      components: {
          Login,
          Signup

      }
    });
    return app;
  }
}
