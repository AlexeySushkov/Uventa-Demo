<template>
  <div>
    <navbar/>

    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="card mt-5">
            <div class="card-header"><strong>[Case1]</strong></div>
            <div class="card-header"><strong>Client summary</strong></div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-3"><strong>USP:</strong></div>
                  <div class="col-sm-9">{{ mongo_usp }}</div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-3"><strong>Client:</strong></div>
                  <div class="col-sm-9">{{ name }}</div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-3"><strong>Client_Id:</strong></div>
                  <div class="col-sm-9"><code>{{ keyPair.publicKey }}</code></div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-3"><strong>Phone:</strong></div>
                  <div class="col-sm-9">{{ mongo_phone }}</div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-3"><strong>Secret key:</strong></div>
                  <div class="col-sm-9"><code>{{ keyPair.secretKey }}</code></div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-6"><strong>Telco Tokens (TT):</strong></div>
                  <div class="col-sm-3">{{ balance | currency('') }}</div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-6 text-info"><strong>USD (1TT = 0,1USD):</strong></div>
                  <div class="col-sm-3 text-info">{{ balance / 10 | currency('') }}</div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-6 text-info"><strong>EUR (1TT = 0,087EUR):</strong></div>
                  <div class="col-sm-3 text-info">{{ showEUR | currency('') }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
        
      <div class="row">
        <div class="col-md-6">
          <div class="card mt-5">
            <div class="card-header"><strong>Refill the balance</strong></div>
            <div class="card-body">
              <form @submit.prevent="addFunds">
                <div class="form-group">
                  <label class="d-block"><strong>Select amount of USD to be added:</strong></label>
                  <div v-for="variant in variants" :key="variant.id" class="form-check form-check-inline">
                    <input :id="variant.id" :value="variant.amount" :checked="amountToAddUSD == variant.amount" v-model="amountToAddUSD" class="form-check-input" type="radio">
                    <label :for="variant.id" class="form-check-label">{{ variant.amount }}</label>
                  </div>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                      <div class="row">
                        <label class="col-sm-6"><strong>Telco Tokens (TT):</strong></label>
                        <div class="col-sm-6">{{ amountToAddUSD*10 | currency('') }}</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <button type="submit" class="btn btn-warning">Add USD</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <spinner :visible="isSpinnerVisible"/>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import Modal from '../components/Modal.vue'
  import Navbar from '../components/Navbar.vue'
  import Spinner from '../components/Spinner.vue'

  module.exports = {
    components: {
      Modal,
      Navbar,
      Spinner
    },
    data() {
      return {
        name: '',
        balance: 0,
        amountToAddUSD: 10,
        amountToAdd: 0,
        receiver: '',
        amountToTransfer: 0,
        amountToTransferUSD: 0,
        showEUR: 0,
        isSpinnerVisible: false,
        transactions: [],
        mongo_usp: 'MTS',
        mongo_phone: '',
        variants: [
          { id: 'ten', amount: 10 },
          { id: 'fifty', amount: 50 },
          { id: 'hundred', amount: 100 }
        ],
        usp_names: [
          { text: 'MTS', value: '1' },
          { text: 'TURKCELL', value: '2' },
          { text: 'Telefonica', value: '3' },
          { text: 'TIM', value: '4' }
        ],
        music_names: [
          { text: 'Track 1', value: '1', price: '3' },
          { text: 'Track 2', value: '2', price: '4' },
          { text: 'Track 3', value: '3', price: '5' }
        ]
      }
    },
    computed: Object.assign({
      reverseTransactions() {
        return this.transactions.slice().reverse()
      }
    }, mapState({
      keyPair: state => state.keyPair,
      usp: state => state.usp
    })),
    methods: {
      async loadUser() {
        if (this.keyPair === null) {
          this.$store.commit('logout')
          this.$router.push({ name: 'home' })
          return
        }
        this.isSpinnerVisible = true
        
        //this.mongo_usp = this.$mongo.get_usp('aaaaaaa')
        //document.write(this.usp)
          
        try {
          const data = await this.$blockchain.getWallet(this.keyPair.publicKey)
          this.name = data.wallet.name
          this.balance = data.wallet.balance
          this.showEUR = this.balance * 0.087 // 1 USD = 0.87 EUR
          this.showEUR = this.showEUR.toFixed(2)
          this.transactions = data.transactions
          
          var usp_db_list = await this.$mongo.get_usp_all()
          
          for (var i=0, iLen=usp_db_list.length; i<iLen; i++) {
           if (usp_db_list[i].publicKey == this.keyPair.publicKey) this.mongo_usp = usp_db_list[i].usp
          }
          
          var phone_db_list = await this.$mongo.get_phone_all()

          for (var i=0, iLen=phone_db_list.length; i<iLen; i++) {
           if (phone_db_list[i].publicKey == this.keyPair.publicKey) this.mongo_phone = phone_db_list[i].phone
           // document.write(phone_db_list[i].publicKey + "   " + phone_db_list[i].phone)
          }
          
          this.isSpinnerVisible = false
        } catch (error) {
          this.isSpinnerVisible = false
          this.$notify('error', error.toString())
        }
      },

      async addFunds() {
        this.isSpinnerVisible = true

        const seed = this.$blockchain.generateSeed()
        
        this.amountToAdd = this.amountToAddUSD*10
        
        try {
          await this.$blockchain.addFunds(this.keyPair, this.amountToAdd, seed)
          const data = await this.$blockchain.getWallet(this.keyPair.publicKey)
          this.balance = data.wallet.balance
          this.transactions = data.transactions
          this.isSpinnerVisible = false
          this.$notify('success', 'Add tokens transaction has been written into the blockchain')
        } catch (error) {
          this.isSpinnerVisible = false
          this.$notify('error', error.toString())
        }
      }
    },
    mounted() {
      this.$nextTick(function() {
        this.loadUser()
      })
    }
  }
</script>
