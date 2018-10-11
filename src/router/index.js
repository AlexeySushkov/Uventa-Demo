import Vue from 'vue'
import Router from 'vue-router'
import AuthPage from '../pages/Auth.vue'
import WalletPage from '../pages/Wallet.vue'
import BlockchainPage from '../pages/Blockchain.vue'
import BlockPage from '../pages/Block.vue'
import TransactionPage from '../pages/Transaction.vue'
import Case1 from '../pages/Case1.vue'
import Case2 from '../pages/Case2.vue'
import Case3 from '../pages/Case3.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: AuthPage
    },
    {
      path: '/case1',
      name: 'case1',
      component: Case1
    },
    {
      path: '/case2',
      name: 'case2',
      component: Case2
    },
    {
      path: '/case3',
      name: 'case3',
      component: Case3
    },
    {
      path: '/user',
      name: 'user',
      component: Case1
    },
    {
      path: '/blockchain',
      name: 'blockchain',
      component: BlockchainPage
    },
    {
      path: '/block/:height',
      name: 'block',
      component: BlockPage,
      props: true
    },
    {
      path: '/transaction/:hash',
      name: 'transaction',
      component: TransactionPage,
      props: true
    }
  ]
})
