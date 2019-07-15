// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
import App from './App'
import router from './router'
// import axios from 'axios'
// import 'element-ui/lib/theme-chalk/index.css'
// import { Pagination,
//   Dialog,
//   Menu,
//   Submenu,
//   MenuItem,
//   Input,
//   Radio,
//   Checkbox,
//   Select,
//   Option,
//   Button,
//   Table,
//   TableColumn,
//   DatePicker,
//   TimeSelect,
//   TimePicker,
//   Popover,
//   Tooltip,
//   Breadcrumb,
//   BreadcrumbItem,
//   Form,
//   FormItem,
//   Tabs,
//   Icon,
//   Loading,
//   MessageBox,
//   Message } from 'element-ui'

Vue.config.productionTip = false
Vue.prototype.$http = axios
// Vue.use(Pagination)
// Vue.use(Dialog)
// Vue.use(Menu)
// Vue.use(Submenu)
// Vue.use(MenuItem)
// Vue.use(Input)
// Vue.use(Radio)
// Vue.use(Checkbox)
// Vue.use(Select)
// Vue.use(Option)
// Vue.use(Button)
// Vue.use(Table)
// Vue.use(TableColumn)
// Vue.use(DatePicker)
// Vue.use(TimeSelect)
// Vue.use(TimePicker)
// Vue.use(Popover)
// Vue.use(Tooltip)
// Vue.use(Breadcrumb)
// Vue.use(BreadcrumbItem)
// Vue.use(Form)
// Vue.use(FormItem)
// Vue.use(Tabs)
// Vue.use(Icon)

// Vue.use(Loading.directive);

// Vue.prototype.$confirm = MessageBox.confirm;
// Vue.prototype.$message = Message;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
