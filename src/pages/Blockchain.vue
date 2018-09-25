<template>
  <div>
    <navbar/>

    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <div class="card mt-5">
            <div class="card-header d-flex justify-content-between">
              Latest blockchain blocks
              <div class="custom-control custom-checkbox">
                <input id="skip-empty-blocks" v-model="isSkipEmpty" class="custom-control-input" type="checkbox" @change="skipChange">
                <label class="custom-control-label" for="skip-empty-blocks">Skip empty blocks</label>
              </div>
            </div>
            <ul class="list-group list-group-flush">
              <li class="list-group-item font-weight-bold">
                <div class="row">
                  <div class="col-sm-4">Block height</div>
                  <div class="col-sm-4">Transactions count</div>
                  <div class="col-sm-4">Blockchain state hash</div>
                </div>
              </li>
              <li v-for="(block) in blocks" :key="block.height" class="list-group-item">
                <div class="row">
                  <div class="col-sm-4">
                    <router-link :to="{ name: 'block', params: { height: block.height } }">{{ block.height }}</router-link>
                  </div>
                  <div class="col-sm-4">{{ block.tx_count }}</div>
                  <div class="col-sm-4">{{ block.state_hash }}</div>
                </div>
              </li>
            </ul>
            <div class="card-body text-center">
              <a href="#" class="btn btn-primary" @click.prevent="loadMore">Load older blocks</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <spinner :visible="isSpinnerVisible"/>
  </div>
</template>

<script>
  import Navbar from '../components/Navbar.vue'
  import Spinner from '../components/Spinner.vue'

  module.exports = {
    components: {
      Navbar,
      Spinner
    },
    data() {
      return {
        isSpinnerVisible: false,
        blocks: [],
        isSkipEmpty: true
      }
    },
    methods: {
      async loadBlocks(latest) {
        this.isSpinnerVisible = true

        try {
          var data;
          if (this.isSkipEmpty) {
            data = await this.$blockchain.getBlocksSkipEmpty(latest)
          } else {
            data = await this.$blockchain.getBlocks(latest)
          }
          this.blocks = this.blocks.concat(data.blocks)
          this.isSpinnerVisible = false
        } catch (error) {
          this.isSpinnerVisible = false
          this.$notify('error', error.toString())
        }
      },

      loadMore() {
        this.loadBlocks(this.blocks[this.blocks.length - 1].height - 1)
      }
    },
    mounted() {
      this.$nextTick(function() {
        this.loadBlocks()
      })
    }
  }
</script>
