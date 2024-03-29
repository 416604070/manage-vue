import Vue from "vue";
import VueRouter from "vue-router";

if (process.env.NODE_ENV === "development") {
    Vue.use(VueRouter);
}

import { ROUTER_MODE } from "../config/app";

import Home from "../views/home/index.vue";

//账号管理
import Role from "../views/account/role/role"
import Account from "../views/account/account/account"

//系统设置
import Menu from "../views/system/menu/Menu";
import Permission from "../views/system/permission/Permission"
import Dictionary from "../views/system/dictionary/dictionary"
import DbLog from "../views/system/dbLog/dbLog"
import Api from "../views/system/api/Api"


const err401 = r =>
    require.ensure([], () => r(require("../views/error/err401.vue")), "home");
const err404 = r =>
    require.ensure([], () => r(require("../views/error/err404.vue")), "home");
const login = r =>
    require.ensure([], () => r(require("../views/login/index.vue")), "home");
const main = r =>
    require.ensure([], () => r(require("../views/home/main.vue")), "home");

// 注意 权限字段 authority （严格区分大小写）
export const constantRouterMap = [
    {
        path: "*",
        component: err404,
        hidden: true,
        meta : {
            authority : ''
        }
    },
    {
        path: "/401",
        component: err401,
        name: "401",
        hidden: true,
        meta : {
            authority : ''
        }
    },
    {
        path: "/404",
        component: err404,
        name: "404",
        hidden: true,
        meta : {
            authority : ''
        }
    },
    {
        path: "/500",
        component: err404,
        name: "500",
        hidden: true,
        meta : {
            authority : ''
        }
    },
    {
        path: "/login",
        component: login,
        name: "登录",
        hidden: true,
        meta : {
            authority : ''
        }
    },
    {
        path: "/",
        component: Home,
        redirect: "/readme",
        name: "首页",
        hidden: true,
        meta : {
            authority : ''
        }
    },
    {
        path: "/readme",
        component: Home,
        redirect: "/readme/main",
        icon: "shouye",
        name: "控制台",
        noDropdown: true,
        meta : {
            authority : ''
        },
        children: [
            {
                path: "main",
                component: main,
                meta : {
                    authority : ''
                }
            }
        ]
    },
];

export default new VueRouter({
    // mode: 'history', //后端支持可开
    mode: ROUTER_MODE,
    routes: constantRouterMap,
    strict: process.env.NODE_ENV !== "production"
});

export const asyncRouterMap = [
    {
        path: "/account",
        redirect: "system",
        component: Home,
        icon: "user-guanli",
        name: "账号管理",
        meta: {
            authority: '/account'
        },
        children: [
            {
                path: "account",
                component: Account,
                name: "账号管理",
                icon: "user-guanli",
                meta: {
                    authority: '/account/account'
                }
            },
            {
                path: "role",
                component: Role,
                name: "角色管理",
                icon: "jiaose",
                meta: {
                    authority: '/account/role'
                }
            },
        ]
    },
    {
        path: "/system",
        redirect: "system",
        component: Home,
        icon: "tongyong",
        name: "系统设置",
        meta: {
            authority: '/system'
        },
        children: [
            {
                path: "menu",
                component: Menu,
                name: "菜单设置",
                icon: "shezhi1",
                meta: {
                    authority: '/system/menu'
                }
            },
            {
                path: "permission",
                component: Permission,
                name: "权限管理",
                icon: "cloud-permissions",
                meta: {
                    authority: '/system/permission'
                }
            },
            {
                path: "dictionary",
                component: Dictionary,
                name: "数据字典",
                icon: "tiku",
                meta: {
                    authority: "/system/dictionary"
                }
            },
            {
                path: "db/log",
                component: DbLog,
                name: "数据库操作日志",
                icon: "gongyongquan1",
                meta: {
                    authority: '/system/db/log'
                }
            },
            {
                path: "api",
                component: Api,
                name: "接口文档",
                icon: "tiku",
                meta: {
                    authority: '/system/api'
                }
            },
        ]
    }
];
