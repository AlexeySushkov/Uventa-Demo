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
                <div class="form-group">
                  <label class="control-label text-white">Client phone:</label>
                  <input v-model="phone" type="text" class="form-control" placeholder="Enter phone number" maxlength="260">
                </div>
                <button type="submit" class="btn btn-lg btn-block btn-warning">Register</button>
              </form>
            </tab>
            <tab title="Service" class="text-danger">
              <form @submit.prevent="get_usps">
                <label class="control-label text-white">First get TURKCELL and Telefonica USP:</label>
                <button type="get_free_space" class="btn btn-lg btn-block btn-warning">Get</button>
              </form>
              <form @submit.prevent="create_usps">
                <label class="control-label text-white">If empty create TURKCELL and Telefonica USP:</label>
                <button type="get_free_space" class="btn btn-lg btn-block btn-warning">Create</button>
                <div class="form-group">
                  <label class="control-label text-white">TURKCELL publicKey: {{ keyPairTURKCELL.publicKey }}</label>
                </div>
                <div class="form-group">
                  <label class="control-label text-white">TURKCELL privateKey: {{ keyPairTURKCELL.secretKey }}</label>
                </div>
                <div class="form-group">
                  <label class="control-label text-white">Telefonica publicKey: {{ keyPairTelefonica.publicKey }}</label>
                </div>
                <div class="form-group">
                  <label class="control-label text-white">Telefonica privateKey: {{ keyPairTelefonica.secretKey }}</label>
                </div>
              </form>
              <!--form @submit.prevent="get_free_space">
                <div class="form-group">
                  <label class="control-label text-white">Free space: {{ free_space }}</label>
                </div>
                <button type="get_free_space" class="btn btn-lg btn-block btn-warning">Get free space</button>
              </form-->
              <!--form @submit.prevent="clear_logs">
                <div class="form-group">
                  <label class="control-label text-white"/>
                </div>
                <button type="clear_logs" class="btn btn-lg btn-block btn-warning">Clear logs</button>
              </form-->
              <form @submit.prevent="put_unlim_tokens">
                <div class="form-group">
                  <label class="control-label text-white"/>
                </div>
                <input v-model="secretKey4Unlim" type="text" class="form-control" placeholder="Enter secret key" required>
                <input v-model="UnlimTokensVolume" type="text" class="form-control" placeholder="Enter tokens amount" required>
                <button type="put_unlim_tokens" class="btn btn-lg btn-block btn-warning">Add Tokens</button>
              </form>
              <!--form @submit.prevent="usp_db_put">
                <div class="form-group">
                  <label class="control-label text-white"/>
                </div>
                <input v-model="usp_db.secretKey" type="text" class="form-control" placeholder="Enter secret key" required>
                <input v-model="usp_db.usp" type="text" class="form-control" placeholder="Enter usp" required>
                <button type="usp_db_put" class="btn btn-lg btn-block btn-warning">Put usp</button>
              </form-->
              <!--form @submit.prevent="usp_db_get">
                <div class="form-group">
                  <label class="control-label text-white"/>
                </div>
                <button type="usp_db_get" class="btn btn-lg btn-block btn-warning">Get usp</button>
              </form-->
              <!--ul class="list-group list-group-item-primary list-group-flush">
                <li class="list-group-item font-weight-bold">
                  <div class="row">
                    <div class="col-sm-4">secretKey</div>
                    <div class="col-sm-4">USP</div>
                  </div>
                </li>
                <li v-for="(item) in usp_db_list" :key="item.publicKey" class="list-group-item">
                  <div class="row">
                    <div class="col-sm-4"><code>{{ item.publicKey }}</code></div>
                    <div class="col-sm-4">{{ item.usp }}</div>
                  </div>
                </li>
              </ul-->
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
        phone: '',
        usp: 'MTS',
        secretKey: '',
        keyPair: {},
        keyPairTURKCELL: {},
        keyPairTelefonica: {},
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
        secretKey4Unlim: '',
        UnlimTokensVolume: 999900,
        keyPair4Unlim: {}
      }
    },
    methods: {
      
      
      async put_unlim_tokens() {
        
        this.keyPair4Unlim.secretKey = this.secretKey4Unlim;
        this.keyPair4Unlim.publicKey = this.secretKey4Unlim.substr(64);

        const seed = this.$blockchain.generateSeed()
        try {
          await this.$blockchain.addFunds(this.keyPair4Unlim, this.UnlimTokensVolume, seed)
          this.$notify('success', 'Add tokens transaction has been written into the blockchain')
        } catch (error) {
          this.$notify('error', error.toString())
        }
      },
      
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
      
      async usp_db_get() {
        this.usp_db_list = await this.$mongo.get_usp_all()
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
          
          //this.usp_db.privateKey=this.keyPair.privateKey
          //this.usp_db.usp=this.usp
          //this.usp_db_put()
          
          this.$mongo.put_usp(this.keyPair.publicKey, this.usp)
          this.$mongo.put_phone(this.keyPair.publicKey, this.phone)
          
          this.$nextTick(function() {
          this.$router.push({ name: 'user' })
        })
          
        } catch (error) {
          this.isSpinnerVisible = false
          this.$notify('error', error.toString())
        }
      },

      async get_usps() {

          var usp_db_list = await this.$mongo.get_usp_all()
          
          for (var i=0, iLen=usp_db_list.length; i<iLen; i++) {
           if (usp_db_list[i].usp == 'TURKCELL_USP')
           {
//              document.write(usp_db_list[i].usp)
              this.keyPairTURKCELL = this.$blockchain.generateKeyPair()
              this.keyPairTURKCELL.secretKey = "" 
              this.keyPairTURKCELL.publicKey = usp_db_list[i].publicKey 
           }
           else
           if (usp_db_list[i].usp == 'Telefonica_USP')
           {
//              document.write(usp_db_list[i].usp)
              this.keyPairTelefonica = this.$blockchain.generateKeyPair()
              this.keyPairTelefonica.secretKey = ""
              this.keyPairTelefonica.publicKey = usp_db_list[i].publicKey 
           }
          }
      },

      async create_usps() {
        
        this.isSpinnerVisible = true
        
        // TURKCELL
        this.keyPairTURKCELL = this.$blockchain.generateKeyPair()
        try {
          await this.$blockchain.createWallet(this.keyPairTURKCELL, "TURKCELL_USP")
          this.isSpinnerVisible = false
          this.isModalVisible = false
          this.$mongo.put_usp(this.keyPairTURKCELL.publicKey, "TURKCELL_USP")
          this.secretKey4Unlim = this.keyPairTURKCELL.secretKey
          this.put_unlim_tokens();
        } catch (error) {
          this.isSpinnerVisible = false
          this.$notify('error', error.toString())
        }
        
        // Telefonica
        this.keyPairTelefonica = this.$blockchain.generateKeyPair()
        try {
          await this.$blockchain.createWallet(this.keyPairTelefonica, "Telefonica_USP")
          this.isSpinnerVisible = false
          this.isModalVisible = false
          this.$mongo.put_usp(this.keyPairTelefonica.publicKey, "Telefonica_USP")
          this.secretKey4Unlim = this.keyPairTelefonica.secretKey
          this.put_unlim_tokens();
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
