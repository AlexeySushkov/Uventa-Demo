import Vue from 'vue'
import Vuex from 'vuex'

const KEY = 'cryptocurrency'
const keyPair = JSON.parse(localStorage.getItem(KEY))

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    keyPair: keyPair,
    usp: ''
  },
  mutations: {
    login: (state, keyPair) => {
      localStorage.setItem(KEY, JSON.stringify(keyPair))
      state.keyPair = keyPair
    },
    usp: (state, usp) => {
      state.usp = usp
    },
    logout: state => {
      localStorage.removeItem(KEY)
      state.keyPair = null
    }
  }
})
