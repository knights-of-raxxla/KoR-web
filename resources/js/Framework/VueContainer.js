import  BootstrapVue  from 'bootstrap-vue';
import Vue from 'vue';
export default class VueContainer {
  constructor() {
    let app = this.setUp(Vue);
  }

  setUp(Vue) {
    Vue.use(BootstrapVue);
    let app = new Vue({
      el: '.vue-app'
    });
    return app;
  }
}