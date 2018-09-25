<template>
  <div>
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
</style>
