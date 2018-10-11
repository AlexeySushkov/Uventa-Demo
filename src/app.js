import 'babel-polyfill';
import Vue from 'vue'
import router from './router'
import numeral from './directives/numeral'
import Validate from './plugins/validate'
import Notify from './plugins/notify'
import Blockchain from './plugins/blockchain'
import Mongo from './plugins/mongo'
import App from './App.vue'
import store from './store'
import VueUp from 'vueup'

Vue.use(numeral)
Vue.use(Validate)
Vue.use(Notify)
Vue.use(Blockchain)
Vue.use(Mongo)
Vue.use(VueUp)

new Vue({
  el: '#app',
  router,
  store,
  render: createElement => createElement(App)
})
