import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './plugins/element.js'


/* 导入全局样式表 */
import './assets/css/global.css'
import './assets/css/font_lcuwsu5jg6/iconfont.css'
// 导入树形格
import TreeTable from 'vue-table-with-tree-grid'

import axios from 'axios'

axios.defaults.baseURL = '/u/v1/'

axios.interceptors.request.use(config => {
  /* 给请求头里面添加一个属性 Authorization 并将其值设置为token令牌*/
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})


// Vue.prototype.HOST='/api'
// 配置axios
Vue.prototype.$http = axios




// 阻止启动生产消息
Vue.config.productionTip = false


Vue.component('tree-table', TreeTable)

// 定义一个全局过滤器start   将后台传过来的身份数字转为对应的身份
Vue.filter('admin_type_Format', function(type) {
  const ts = type
  switch (ts) {
    case 10:
      // 代码块
      return '普通会员'
    case 20:
      // 代码块
      return '服务人员'
    case 30:
      return '校园组织'
    case 35:
      return '公益组织'
    case 40:
      return '校园社团'
    case 50:
      return '管理员'
  }
})
/* 身份的过滤器end */

// 定义一个全局过滤器start 将后台的传过来的举报类型数字转为对应的举报
Vue.filter('report_type_format', function(type) {
  const ts = type
  switch (ts) {
    case 1:
      return '商品'
    case 2:
      return '留言'
    case 3:
      return '评价'
    case 4:
      return '帖子'
    case 5:
      return '需求'
  }

})
// end


// 定义一个全局过滤器 start 区分处理结果
Vue.filter('report_result_format', function(result) {
  const res = result
  switch (res) {
    case 1:
      return '举报失败'
    case 2:
      return '处理中'
    case 3:
      return '警告并删除相关内容'
    case 4:
      return '冻结账号'
  }
})

// 定义一个全局过滤器 商品交易方式
Vue.filter('tradeType', function(type) {
  const ty = type
  switch (ty) {
    case 10:
      return '正常交易'
    case 20:
      return '公益捐赠'
  }
})
// 定义一个全局过滤器  订单的交易方式
Vue.filter('orderTradeType', function(type) {
  const ty = type
  switch (ty) {
    case 10:
      return '正常交易'
    case 20:
      return '公益捐赠'
    case 30:
      return '公益捐赠'
  }
})
/*10:订单超时 20:取消订单 30:删除订单 40:等待支付 50:交易成功 */
Vue.filter('orderState', function(state) {
  const temp = state
  switch (temp) {
    case 10:
      return '订单超时'
    case 20:
      return '取消订单'
    case 30:
      return '删除订单'
    case 40:
      return '等待支付'
    case 50:
      return '交易成功'
    case 100:
      return '资金已捐赠';
  }
})
// 定义一个全局过滤器  切割时间   动态的添加一个p标签 
Vue.filter('timeSplit', function(time, i) {
  let t1 = time.split(' ')
  if (i === 'day') {
    return t1[0]
  }
  if (i === 'second') {
    return t1[1]
  }
})

// 定义一个全局过滤器 实名审核 获取认证类型 
Vue.filter('certificationType', function(type) {
  if (type == 1) {
    return '一卡通认证'
  } else if (type == 2) {
    return '身份证认证'
  } else {
    return '其他'
  }
})

// 定义一个全局过滤器 实名审核 获取认证状态
Vue.filter('certificationState', function(state) {
  if (state == 1) {
    return '认证中'
  } else if (state == 2) {
    return '认证成功'
  } else {
    return '认证失败'
  }
})
// 保留数字精度
Vue.filter('savePrecision', function(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
})

// 全局注册树形table表格
Vue.component('tree-table', TreeTable)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')