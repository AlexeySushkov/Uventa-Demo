<template>
  <div>
    <div class="container">
      <div class="row justify-content-sm-center">
        <div class="col-md-6 col-md-offset-3">
          <h1 class="mt-5 mb-4 text-white">Authorization</h1>
          <tabs>
            <tab :is-active="true" title="Log in" class="text-danger">
              <form @submit.prevent="login">
                <div class="form-group">
                  <label class="control-label text-white">Secret key:</label>
                  <input v-model="secretKey" type="text" class="form-control" placeholder="Enter secret key" required>
                </div>
                <button type="submit" class="btn btn-lg btn-block btn-warning">Log in</button>
              </form>
            </tab>
            <tab title="Register" class="text-danger">
              <form @submit.prevent="register">
                <div class="form-group">
                  <label class="control-label text-white">USP:</label>
                  <select v-model="usp">
                    <option v-for="usp_name in usp_names" :key="usp_name.value">
                      {{ usp_name.text }}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="control-label text-white">Client name:</label>
                  <input v-model="name" type="text" class="form-control" placeholder="Enter name" maxlength="260" required>
                </div>
                <button type="submit" class="btn btn-lg btn-block btn-warning">Register</button>
              </form>
            </tab>
            <tab title="Service" class="text-danger">
              <form @submit.prevent="get_free_space">
                <div class="form-group">
                  <label class="control-label text-white">Free space: {{ free_space }}</label>
                </div>
                <button type="get_free_space" class="btn btn-lg btn-block btn-warning">Get free space</button>
              </form>
              <form @submit.prevent="clear_logs">
                <div class="form-group">
                  <label class="control-label text-white"/>
                </div>
                <button type="clear_logs" class="btn btn-lg btn-block btn-warning">Clear logs</button>
              </form>
              <form @submit.prevent="usp_db_put">
                <div class="form-group">
                  <label class="control-label text-white"/>
                </div>
                <input v-model="usp_db.secretKey" type="text" class="form-control" placeholder="Enter secret key" required>
                <input v-model="usp_db.usp" type="text" class="form-control" placeholder="Enter usp" required>
                <button type="usp_db_put" class="btn btn-lg btn-block btn-warning">Put usp</button>
              </form>
              <form @submit.prevent="usp_db_get">
                <div class="form-group">
                  <label class="control-label text-white"/>
                </div>
                <button type="usp_db_get" class="btn btn-lg btn-block btn-warning">Get usp</button>
              </form>
              <ul class="list-group list-group-item-primary list-group-flush">
                <li class="list-group-item font-weight-bold">
                  <div class="row">
                    <div class="col-sm-4">secretKey</div>
                    <div class="col-sm-4">USP</div>
                  </div>
                </li>
                <li v-for="(item) in usp_db_list" :key="item.secretKey" class="list-group-item">
                  <div class="row">
                    <!--div class="col-sm-4">
                      <router-link :to="{ name: 'item', params: { usp: item.usp } }">{{ item.usp }}</router-link>
                    </div-->
                    <div class="col-sm-4"><code>{{ item.secretKey }}</code></div>
                    <div class="col-sm-4">{{ item.usp }}</div>
                  </div>
                </li>
              </ul>
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
  import axios from 'axios'
  const items = [
    { isActive: true, age: 40, first_name: 'Dickerson', last_name: 'Macdonald' },
    { isActive: false, age: 21, first_name: 'Larsen', last_name: 'Shaw' },
    { isActive: false, age: 89, first_name: 'Geneva', last_name: 'Wilson' },
    { isActive: true, age: 38, first_name: 'Jami', last_name: 'Carney' }
 ]
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
        usp: 'MTS',
        secretKey: '',
        keyPair: {},
        isModalVisible: false,
        isSpinnerVisible: false,
        free_space: 100500,
        usp_names: [
          { text: 'MTS', value: '1' },
          { text: 'TURKCELL', value: '2' },
          { text: 'Telefonica', value: '3' },
          { text: 'TIM', value: '4' }
        ],
        usp_db: {},
        usp_db_list: {},
        items: items
      }
    },
    methods: {

      usp_db_put() {
         console.log('usp_db_put')
         axios.post('/api/services/cryptocurrency/v1/usp', this.usp_db)
         .then(response => {
           this.$notify('success', 'usp_db_put - OK')
         })
         .catch(e => {
           this.$notify('error', 'usp_db_put - Error')
           this.errors.push(e)
         })
      },
      
      usp_db_get() {
         console.log('usp_db_get')
         axios.get('/api/services/cryptocurrency/v1/usp')
         .then(response => {
           this.$notify('success', 'usp_db_get - OK')
           this.usp_db_list = response.data
           })
         .catch(e => {
           this.$notify('error', 'usp_db_get - Error')
           this.errors.push(e)
         })
      },
      
      get_free_space() {
         var res = this.$blockchain.getFree(res)
         console.log('get_free_space');
         console.log(res);
         return this.$notify('success', 'get_free_space: '+res)
      },
      
      clear_logs() {
          console.log('clear_logs');
          return this.$notify('success', 'clear_logs')
      },

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

        this.$store.commit('login', this.keyPair)
        this.$store.commit('usp', this.usp)

        this.$nextTick(function() {
          this.$router.push({ name: 'user' })
        })
      }
    }
  }
</script>
