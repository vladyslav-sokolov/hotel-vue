import Vue from 'vue'
import Vuetify from 'vuetify'
import './plugins/vuetify'
import App from './App';
import router from './router';
import store from './store';

Vue.use(Vuetify)

// carousel
import 'owl.carousel/dist/assets/owl.carousel.css';

// oauth
import ApiService from './services/api.service'
import { TokenService } from './services/storage.service'
ApiService.mountnetworkInterceptor() // global network error handler
if (TokenService.getToken()) {
  ApiService.setHeader()
  ApiService.mount401Interceptor()  // access token expired handler
}

// progress bar
import NProgress from "nprogress"
import '../node_modules/nprogress/nprogress.css'
NProgress.configure({ showSpinner: false });

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
