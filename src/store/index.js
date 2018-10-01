import Vue from 'vue'
import Vuex from 'vuex'

const KEY = 'cryptocurrency'
const KEY2 = 'cryptocurrency2'
const keyPair = JSON.parse(localStorage.getItem(KEY))
const get_usp = JSON.parse(localStorage.getItem(KEY2))

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    keyPair: keyPair,
    usp: get_usp
  },
  mutations: {
    login: (state, keyPair) => {
      localStorage.setItem(KEY, JSON.stringify(keyPair))
      state.keyPair = keyPair
    },
    usp: (state, usp) => {
      localStorage.setItem(KEY2, JSON.stringify(usp))
      state.usp = usp
    },
    logout: state => {
      localStorage.removeItem(KEY)
      state.keyPair = null
    }
  }
})
