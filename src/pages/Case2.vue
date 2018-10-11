<template>
  <div>
    <navbar/>

    <div class="container">

      <div class="row">
        <div class="col-md-6">
          <div class="card mt-5">
            <div class="card-header"><strong>[Case2]</strong></div>
            <div class="card-header"><strong>Transfer USD</strong></div>
            <div class="card-body">
              <form @submit.prevent="transfer">
                <div class="form-group">
                  <label>Receiver Client_Id:</label>
                  <input v-model="receiver" type="text" class="form-control" required>
                  <div class="form-group">
                    <label>Amount USD (1TT = 0,1USD)</label>
                    <div class="input-group">
                      <input v-model="amountToTransferUSD" type="number" class="form-control" placeholder="Enter amount" min="0" required>
                    </div>
                  </div>
                  <ul class="list-group list-group-flush">
                    <li class="list-group-item">
                      <div class="row">
                        <label class="col-sm-6"><strong>Telco Tokens (TT):</strong></label>
                        <div class="col-sm-3">{{ amountToTransferUSD * 10 }}</div>
                      </div>
                    </li>
                  </ul>
                </div>
                <button type="submit" class="btn btn-warning">Transfer USD</button>
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
        receiverMusic: '579f0a0a7e885e6eeeec0a3f3fe3c507f69e138a6594ed89955ab3ec3047d4d2',
        receiver_usp: 'MTS',
        track_name: '',
        amountToTransferMusic: 0,
        amountToTransferMusicUSD: 0,
        amountToTransfer: 0,
        amountToTransferUSD: 0,
        isSpinnerVisible: false,
        transactions: [],
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
        
        try {
          const data = await this.$blockchain.getWallet(this.keyPair.publicKey)
          this.name = data.wallet.name
          this.balance = data.wallet.balance
          // this.balance_USD = this.balance * 2
          // this.balance_EUR = this.balance * 1.7
          this.transactions = data.transactions
          this.isSpinnerVisible = false
        } catch (error) {
          this.isSpinnerVisible = false
          this.$notify('error', error.toString())
        }
      },

      async transfer() {
        if (!this.$validateHex(this.receiver)) {
          return this.$notify('error', 'Invalid public key is passed')
        }

        if (this.receiver === this.keyPair.publicKey) {
          return this.$notify('error', 'Can not transfer tokens to yourself')
        }

        this.isSpinnerVisible = true

        const seed = this.$blockchain.generateSeed()
        this.amountToTransfer = String(Number(this.amountToTransferUSD) * 10)

        try {
          await this.$blockchain.transfer(this.keyPair, this.receiver, this.amountToTransfer, seed)
          const data = await this.$blockchain.getWallet(this.keyPair.publicKey)
          this.balance = data.wallet.balance
          this.transactions = data.transactions
          this.isSpinnerVisible = false
          this.$notify('success', 'Transfer transaction has been written into the blockchain')
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
