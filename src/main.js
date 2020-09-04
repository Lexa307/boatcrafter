import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
var bus = new Vue();
console.log(bus);
new Vue({
  render: h => h(App),
}).$mount('#app')
