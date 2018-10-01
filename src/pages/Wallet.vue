<template>
  <div>
    <navbar/>

    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="card mt-5">
            <div class="card-header"><strong>Client summary</strong></div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-3"><strong>USP:</strong></div>
                  <div class="col-sm-9">{{ usp }}</div>
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
                  <div class="col-sm-3"><strong>Secret key:</strong></div>
                  <div class="col-sm-9"><code>{{ keyPair.secretKey }}</code></div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-4"><strong>Telco Tokens (TT):</strong></div>
                  <div class="col-sm-3">{{ balance }}</div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-4 text-info"><strong>USD:</strong></div>
                  <div class="col-sm-3 text-info">{{ balance * 2 }}</div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="row">
                  <div class="col-sm-4 text-info"><strong>EUR:</strong></div>
                  <div class="col-sm-3 text-info">{{ balance * 1.7 }}</div>
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
                  <div class="row">
                    <label class="col-sm-4"><strong>Telco Tokens (TT):</strong></label>
                    <div class="col-sm-3">{{ amountToAddUSD*2 }}</div>
                  </div>
                </div>
                <button type="submit" class="btn btn-warning">Add USD</button>
              </form>
            </div>
          </div>
        </div>
      </div>
        
      <div class="row">
        <div class="col-md-6">
          <div class="card mt-5">
            <div class="card-header"><strong>Transfer USD</strong></div>
            <div class="card-body">
              <form @submit.prevent="transfer">
                <div class="form-group">
                  <label>Receiver Client_Id:</label>
                  <input v-model="receiver" type="text" class="form-control" required>
                </div>
                <div class="form-group">
                  <label>Amount USD:</label>
                  <div class="input-group">
                    <input v-model="amountToTransferUSD" type="number" class="form-control" placeholder="Enter amount" min="0" required>
                  </div>
                  <div class="row">
                    <label class="col-sm-4"><strong>Telco Tokens (TT):</strong></label>
                    <div class="col-sm-3">{{ amountToTransferUSD*2 }}</div>
                  </div>
                </div>
                <button type="submit" class="btn btn-warning">Transfer USD</button>
              </form>
            </div>
          </div>
        </div>
      </div>
          
      <div class="row">
        <div class="col-md-6">
          <div class="card mt-5">
            <div class="card-header"><strong>Get Music</strong></div>
            <div class="card-body">
              <form @submit.prevent="BuyMusic">
                <div class="form-group">
                  <select v-model="track_name">
                    <option v-for="music_name in music_names" :key="music_name.value">
                      {{ music_name.text }}
                    </option>
                  </select>
                </div>
                <!--div class="form-group">
                  <label class="col-sm-3">{{ music_name.price }}</label>
                </div-->
                <div class="form-group">
                  <label>Receiver USP:</label>
                </div>
                <div class="form-group">
                  <select v-model="usp">
                    <option v-for="usp_name in usp_names" :key="usp_name.value">
                      {{ usp_name.text }}
                    </option>
                  </select>
                </div>
                
                <div class="form-group">
                  <label>Receiver Client_Id:</label>
                  <input v-model="receiverMusic" type="text" class="form-control" required>
                </div>
                
                <div class="form-group">
                  <label>Amount USD:</label>
                  <div class="input-group">
                    <input v-model="amountToTransferMusicUSD" type="number" class="form-control" placeholder="Enter amount" min="0" required>
                  </div>
                  <div class="row">
                    <label class="col-sm-4"><strong>Telco Tokens (TT):</strong></label>
                    <div class="col-sm-3">{{ amountToTransferMusicUSD * 2 }}</div>
                  </div>
                </div>
                <button type="submit" class="btn btn-warning">Buy music</button>
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

      async addFunds() {
        this.isSpinnerVisible = true

        const seed = this.$blockchain.generateSeed()
        
        this.amountToAdd = this.amountToAddUSD * 2
        
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
        this.amountToTransfer = String(Number(this.amountToTransferUSD) * 2)

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
      },
      
      async BuyMusic() {
        
        // Asazel
        // href="https://drive.google.com/uc?authusr=0&id=1ORS6iGEi8OgoD0YR3NuKfM5oi7ThcB0T&export=download"
        // You can't hear me now
        // https://drive.google.com/open?id=1y2Kt_IE4h55OGA7ywNl7LnETJqqyq6tH
        // Albatros
        //         drive.google.com/open?id=1hS3Pt8fn43ZQHpeB9RJg6lzkczlLMBJz
        

        this.isSpinnerVisible = true
        const seed = this.$blockchain.generateSeed()
        this.amountToTransferMusic = String(Number(this.amountToTransferMusicUSD) * 2)
        try {
          await this.$blockchain.transfer(this.keyPair, this.receiverMusic, this.amountToTransferMusic, seed)
          const data = await this.$blockchain.getWallet(this.keyPair.publicKey)
          this.balance = data.wallet.balance
          this.transactions = data.transactions
          this.isSpinnerVisible = false
          this.$notify('success', 'Transaction has been written into the blockchain')
        } catch (error) {
          this.isSpinnerVisible = false
          this.$notify('error', error.toString())
        }
        this.$notify('success', 'Transaction has been written into the blockchain. Start download the track')
        var link = document.createElement('a')
        link.setAttribute('href','https://drive.google.com/uc?authusr=0&id=1ORS6iGEi8OgoD0YR3NuKfM5oi7ThcB0T&export=download')
        link.setAttribute('download','download')
        onload=link.click()
      }
    },
    mounted() {
      this.$nextTick(function() {
        this.loadUser()
      })
    }
  }
</script>
