<template>
  <div>
    <navbar/>

    <div class="container">

      <div class="row">
        <div class="col-md-6">
          <div class="card mt-5">
            <div class="card-header"><strong>[Case3]</strong></div>
            <div class="card-header"><strong>Get Music</strong></div>
            <div class="card-body">
              <form @submit.prevent="BuyMusic">
                
                <div class="form-group">
                  <div v-for="usp_music in usp_musics" :key="usp_music.id" class="form-check form-check-inline">
                    <label class="form-check-label">
                      <input :id="usp_music.id" :value="usp_music.text" :checked="usp_music_name == usp_music.text" v-model="usp_music_name" class="form-check-input" type="radio">
                      {{ usp_music.text }}
                    </label>
                  </div>
                  <!--div class="form-group">
                    <label class="col-sm-4"><strong>USP:</strong> {{ usp_music_privateKey }} </label>
                  </div-->

                  <div class="form-group">
                    <select v-model="music_track_name" multiple>
                      <option v-for="music_name in (usp_music_name == 'TURKCELL') ? musics_TURKCELL : musics_Telefonica" :value="music_name.id" :key="music_name.id">
                        Name: {{ music_name.text }}  (Price TT: {{ music_name.price }}, USD: {{ music_name.price/10 }})
                      </option>
                    </select>
                  </div>
                  <!--div class="form-group">
                    <label class="col-sm-12"><strong>Your choice: </strong> {{ music_track_name }} </label>
                  </div-->
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

  var usp_musics_var = [
          { id: '1', text: 'TURKCELL', privateKey: '936a4c7f9bf2bf94ca1000735b7d900915d33a9835efb82bb937dd2c131ba8dea88033f45347107f4542615e1edca332c71187bd65c43084580e864dc040aa9c' },
          { id: '2', text: 'Telefonica', privateKey: '2a4c6afff5b954e9c82f4c7b13d3bb12676539513f8f0d9d21696a268263ad9deb194dfcc165f1439502124325676bf827c1499a1d3a1be8869765f05f2cb79b' },
        ]
  var musics_TURKCELL_var = [
          { text: 'The Beatles - All You Need Is Love', id: '1', price: '1', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+All+You+Need+Is+Love.mp3' },
          { text: 'The Beatles - Hey Jude',             id: '2', price: '2', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+Hey+Jude.mp3' },
          { text: 'The Beatles - Let It Be',            id: '3', price: '3', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+Let+It+Be.mp3' }
        ]
  var musics_Telefonica_var = [
          { text: 'The Beatles - All You Need Is Love', id: '1', price: '2', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+All+You+Need+Is+Love.mp3' },
          { text: 'The Beatles - Hey Jude',             id: '2', price: '4', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+Hey+Jude.mp3' },
          { text: 'The Beatles - Let It Be',            id: '3', price: '6', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+Let+It+Be.mp3' }
        ]

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

        usp_music_name: 'TURKCELL',
        usp_music_privateKey: '',
        music_track_price: 0,
        music_track_name: '0',
        music_track_path: '',
        keyPair4Music: {},

        isSpinnerVisible: false,
        usp_musics: [
          { id: '1', text: 'TURKCELL', privateKey: '936a4c7f9bf2bf94ca1000735b7d900915d33a9835efb82bb937dd2c131ba8dea88033f45347107f4542615e1edca332c71187bd65c43084580e864dc040aa9c' },
          { id: '2', text: 'Telefonica', privateKey: '2a4c6afff5b954e9c82f4c7b13d3bb12676539513f8f0d9d21696a268263ad9deb194dfcc165f1439502124325676bf827c1499a1d3a1be8869765f05f2cb79b' },
        ],
        
        musics_TURKCELL: [
          { text: 'The Beatles - All You Need Is Love', id: '1', price: '1', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+All+You+Need+Is+Love.mp3' },
          { text: 'The Beatles - Hey Jude',             id: '2', price: '2', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+Hey+Jude.mp3' },
          { text: 'The Beatles - Let It Be',            id: '3', price: '3', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+Let+It+Be.mp3' }
        ],
        musics_Telefonica: [
          { text: 'The Beatles - All You Need Is Love', id: '1', price: '2', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+All+You+Need+Is+Love.mp3' },
          { text: 'The Beatles - Hey Jude',             id: '2', price: '4', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+Hey+Jude.mp3' },
          { text: 'The Beatles - Let It Be',            id: '3', price: '6', path: 'https://s3.amazonaws.com/telcotoken/The+Beatles+-+Let+It+Be.mp3' }
        ],
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
          // this.balance_USD = this.balance / 10
          // this.balance_EUR = this.balance / 8.7
          this.transactions = data.transactions
          this.isSpinnerVisible = false
        } catch (error) {
          this.isSpinnerVisible = false
          this.$notify('error', error.toString())
        }
      },

      async BuyMusic() {
//        document.write('Hello World');

        if (this.music_track_name == 0)
        {
          this.$notify('error', 'No track was selected')
          return
        }

        for (var i = 0; i < usp_musics_var.length; i++) {
          if (usp_musics_var[i].text == this.usp_music_name) {
            this.usp_music_privateKey = usp_musics_var[i].privateKey
//            document.write(usp_musics_var[i].text)
          }
        }

        for (var i = 0; i < musics_TURKCELL_var.length; i++) {
          if ((i+1) == this.music_track_name) {
            if (this.usp_music_name == 'TURKCELL') {
               this.music_track_price = musics_TURKCELL_var[i].price
               this.music_track_path = musics_TURKCELL_var[i].path
            }
            else
            {
               this.music_track_price = musics_Telefonica_var[i].price
               this.music_track_path = musics_Telefonica_var[i].path
            }
          }
        }
        
//        document.write(this.music_track_name+'   '+this.music_track_price+'   '+this.music_track_path + '   ' + this.usp_music_privateKey)

        this.keyPair4Music.secretKey = this.usp_music_privateKey;
        this.keyPair4Music.publicKey = this.usp_music_privateKey.substr(64);

        this.isSpinnerVisible = true
        const seed = this.$blockchain.generateSeed()
        try {
          await this.$blockchain.transfer(this.keyPair, this.keyPair4Music.publicKey, this.music_track_price, seed)
          const data = await this.$blockchain.getWallet(this.keyPair.publicKey)
          this.balance = data.wallet.balance
          this.transactions = data.transactions
          this.isSpinnerVisible = false
          this.$notify('success', 'Transaction has been written into the blockchain. Start download the track')
          var novoForm = window.open(this.music_track_path);
        } catch (error) {
          this.isSpinnerVisible = false
          this.$notify('error', error.toString())
        }
        
        // var link = document.createElement('a')
        // link.setAttribute('href','https://s3.amazonaws.com/telcotoken/alizee.mp3')
        // link.setAttribute('download','download')
        // var onload=link.click()
      }
    },
    mounted() {
      this.$nextTick(function() {
        this.loadUser()
      })
    }
  }
</script>
