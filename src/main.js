// 解决Ie9
import "babel-polyfill";
// 全局过滤器
import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store/index";
import "./element";
import * as filters from "./filtres/index";

// 路由转跳过滤
import "./router/RouterIntercept";

import "./assets/icons/iconfont";
// svg组件
import IconSvg from "./components/common/IconSvg.vue";

//应用配置文件
import config from "./config/Config"

//时间工具
import DateUtil from "./utils/date/DateUtil"

//字符串工具
import StringUtil from "./utils/string/StringUtil"
import ObjectUtil from "./utils/object/ObjectUtil"

//http 工具
import http from "./utils/http/Http"

//tree
import TreeUtil from "./utils/tree/TreeUtil"

//密码处理
import PasswordUtil from "./utils/passwrod/PasswordUtil"

import * as types from "./store/mutation-types";

//页面菜单权限工具
import { getAccountMenuPermission } from "./utils/permission/PermissionUtil"

//element表格行样式
import { tableRowClassName } from "./utils/table/ElementTableUtil"

//判断是否是PC端
import { isPC } from "./utils/system/SystemUtil"

//Confirm
import { Confirm } from "./utils/confirm/ConfirmUtil"

// 注册全局组件（register global）
Vue.component("icon-svg", IconSvg);
Vue.prototype.$Config = config;
Vue.prototype.$DateUtil = DateUtil;
Vue.prototype.$StringUtil = StringUtil;
Vue.prototype.$ObjectUtil = ObjectUtil;
Vue.prototype.$Http = http;
Vue.prototype.$TreeUtil = TreeUtil;
Vue.prototype.$PasswordUtil = PasswordUtil;
Vue.prototype.$Types = types;
Vue.prototype.$GetAccountMenuPermission = getAccountMenuPermission;
Vue.prototype.$TableRowClassName = tableRowClassName;
Vue.prototype.$IsPC = isPC;
Vue.prototype.$confirm = Confirm;




// 注册全局实用程序过滤器（register global utility filters）.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
