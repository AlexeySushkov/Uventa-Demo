<template>
  <div>
    <div class="container">
      <div class="row justify-content-sm-center">
        <div class="col-md-6 col-md-offset-3">
          <h1 class="mt-5 mb-4 text-white">Authorization</h1>
          <tabs>
            <tab :is-active="true" title="Register" class="text-danger">
              <form @submit.prevent="register">
                <div class="form-group">
                  <label class="control-label text-white">USP:</label>
                  <input v-model="usp" type="text" class="form-control" placeholder="Enter client USP" maxlength="260">
                  <label class="control-label text-white">Client name:</label>
                  <input v-model="name" type="text" class="form-control" placeholder="Enter name" maxlength="260" required>
                </div>
                <button type="submit" class="btn btn-lg btn-block btn-warning">Register</button>
              </form>
            </tab>
            <tab title="Log in" class="text-danger">
              <form @submit.prevent="login">
                <div class="form-group">
                  <label class="control-label text-white">Secret key:</label>
                  <input v-model="secretKey" type="text" class="form-control" placeholder="Enter secret key" required>
                </div>
                <button type="submit" class="btn btn-lg btn-block btn-warning">Log in</button>
              </form>
            </tab>
          </tabs>
        </div>
      </div>
    </div>

    <modal :visible="isModalVisible" title="Wallet has been created" action-btn="Log in" @close="closeModal" @submit="proceed">
      <div class="alert alert-warning" role="alert">Save the secret key in a safe place. You will need it to log in to the demo next time.</div>
      <div class="form-group">
        <label>USP:</label>
        <div><code>{{ usp }}</code></div>
        <label>Secret key:</label>
        <div><code>{{ keyPair.secretKey }}</code></div>
      </div>
    </modal>

    <spinner :visible="isSpinnerVisible"/>
  </div>
</template>


<script>
  import Tab from '../components/Tab.vue'
  import Tabs from '../components/Tabs.vue'
  import Modal from '../components/Modal.vue'
  import Spinner from '../components/Spinner.vue'

  module.exports = {
    components: {
      Tab,
      Tabs,
      Modal,
      Spinner
    },
    data() {
      return {
        name: '',
        usp: 'USP1',
        secretKey: '',
        keyPair: {},
        isModalVisible: false,
        isSpinnerVisible: false
      }
    },
    methods: {
      login() {
        if (!this.$validateHex(this.secretKey, 64)) {
          return this.$notify('error', 'Invalid secret key is passed')
        }

        this.isSpinnerVisible = true
        
        this.$store.commit('login', {
          publicKey: this.secretKey.substr(64),
          secretKey: this.secretKey
        })
        this.$store.commit('usp', this.usp)

        this.$nextTick(function() {
          this.$router.push({ name: 'user' })
        })
      },

      async register() {
        
        if (!this.name) {
          return this.$notify('error', 'The name is a required field')
        }

        this.isSpinnerVisible = true
        this.keyPair = this.$blockchain.generateKeyPair()

        try {
          await this.$blockchain.createWallet(this.keyPair, this.name)
          this.name = ''
          this.isSpinnerVisible = false
          this.isModalVisible = false
          this.$store.commit('login', this.keyPair)
          this.$store.commit('usp', this.usp)
          this.$nextTick(function() {
          this.$router.push({ name: 'user' })
        })
          
        } catch (error) {
          this.isSpinnerVisible = false
          this.$notify('error', error.toString())
        }
      },

      closeModal() {
        this.isModalVisible = false
      },

      proceed() {
        this.isModalVisible = false

        this.$store.commit('login', this.keyPair, this.usp)

        this.$nextTick(function() {
          this.$router.push({ name: 'user' })
        })
      }
    }
  }
</script>
