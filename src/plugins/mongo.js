import axios from 'axios'

const TRANSACTION_URL_USP = '/api/services/cryptocurrency/v1/usp'

module.exports = {
  install(Vue) {
    Vue.prototype.$mongo = {

      put_usp(publicKey, usp) {
        //console.log('put_usp:'+'   '+publicKey+'   '+usp)
        
        const usp_data = {
          publicKey,
          usp
        }
  
         axios.post(TRANSACTION_URL_USP, usp_data)
         .then(response => {
           // console.log('put_usp: success')
         })
         .catch(e => {
           // console.log('put_usp: error')
         })
      }, // put_usp
      
      get_usp(publicKey){
         var get_usp_var = '';
         var usp_db_list = {};

         axios.get(TRANSACTION_URL_USP)
         .then(response => {
           usp_db_list = response.data
           })
         .catch(e => {
         })

         for (var i=0, iLen=usp_db_list.length; i<iLen; i++) {
           if (usp_db_list[i].publicKey == publicKey) get_usp_var = usp_db_list[i].usp
           document.write(usp_db_list[i].publicKey+'   '+usp_db_list[i].usp)
          }
         //document.write(publicKey)
         document.write(get_usp_var)

         return get_usp_var;
      }, // get_usp
      

      get_usp_all(){
        return axios.get(TRANSACTION_URL_USP).then(response => response.data)
      },

      get_usp_all2(){
         var usp_db_list = {};

         axios.get(TRANSACTION_URL_USP)
         .then(response => response.data)
         .then(data => {
           usp_db_list = data
           document.write(data)
           })
         .catch(e => {
         })

         return usp_db_list;
      } // get_usp
      
    }
  }
}
