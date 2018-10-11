<template>
  <div>
    <!--header class="header">
      <hr class="mt-5 mb-5">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <ul class="list-unstyled text-white">
              <li>Uventa Platform: <a href="http://uventa.io/" target="_blank">uventa.io</a></li>
              <li>Contact: <a href="mailto:uventa.systems@gmail.com" target="_blank">uventa.systems@gmail.com</a></li>
            </ul>
            <img src="images/Logo - v8.1.png" class="float-fluid" alt="">
          </div>
        </div>
      </div>
    </header-->    
    <router-view/>
    <footer class="pb-4 hr">
      <hr class="mt-5 mb-5">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <ul class="list-unstyled text-white">
              <li>Uventa Platform: <a href="http://uventa.io/" target="_blank">uventa.io</a></li>
              <li>Contact: <a href="mailto:uventa.systems@gmail.com" target="_blank">uventa.systems@gmail.com</a></li>
            </ul>
            <img src="images/Uventa - Logo v9.1.png" class="float-fluid" alt="">
            <img src="images/Logo - v8.1.png" class="float-fluid" alt="">
          </div>
        </div>
      </div>
    </footer>
    <div>
      <vue-up/>
    </div>
  </div>
</template>

<style>
  body {
    background-color: #2e2e2e;
  }
  
  input:invalid {
    box-shadow: none;
  }

  code {
    word-break: break-all;
    word-wrap: break-word;
  }
  /*header style*/
  .header{
    position: relative;
    /*background-image: url('http://18.213.163.232:8285/images/headerback.jpg');*/

    background-size: cover;
    background-position: center;
}



</style>
