import router from "./index";
import store from "../store/index";
import NProgress from "nprogress"; // Progress 进度条
import "nprogress/nprogress.css"; // Progress 进度条样式
import { MessageBox} from "element-ui";
import {asyncRouterMap} from "./index";
import * as types from "../store/mutation-types"
import axios from "../utils/http/axios"
import { checkHttpData } from "../utils/http/Http"


/**
 * @Description : 检测是否拥有路由权限是否有相应权限
 * @Author : cheng fei
 * @CreateDate 2019/5/16 15:57
 * @param routeAuthority
 * @param authority
 * @returns {boolean}
 */
function hasAuthority(routeAuthority, authority) {
    if (!authority){
        return true;
    }
    if (!routeAuthority || routeAuthority.length <= 0) {
        return false;
    }
    return routeAuthority.indexOf(authority) > -1;
}

/**
 * @Description : 判断拥有的路由权限中是否包含该路由
 * @Author : cheng fei
 * @CreateDate 2019/5/16 15:57
 * @param routeAuthority
 * @param route
 * @returns {boolean}
 */
function hasRouteAuthority(routeAuthority, route) {
    if (!route.meta || !route.meta.authority || routeAuthority.indexOf(route.meta.authority) > -1) {
        return true;
    }
    return false;
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param routeAuthority
 */
function filterAsyncRouter(asyncRouterMap, routeAuthority) {
    const accessedRouters = asyncRouterMap.filter(route => {
        if (hasRouteAuthority(routeAuthority, route)) {
            if (route.children && route.children.length) {
                route.children = filterAsyncRouter(route.children, routeAuthority);
            }
            return true;
        }
        return false;
    });
    return accessedRouters;
}

const whiteList = ["/login", "/401", "/404", "/500"]; // 不重定向白名单
router.beforeEach((to, from, next) => {
    // 开启Progress
    NProgress.start();
    if (whiteList.indexOf(to.path) !== -1) {
        // 在免登录白名单，直接进入
        next();
        return;
    }

    let token = store.getters.token;
    // 判断是否有token
    if (token) {
        if (to.path === "/login") {
            next({path: "/"});
            // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
            NProgress.done();
            return;
        }

        // 判断是否需要加载菜单访问权限
        let routeAuthority = store.getters.routeAuthority;
        if (token && !routeAuthority) {
            axios({
                url: "system/menu/account/authority",
                method: "POST",
                params: {}
            }).then((response)=>{
                let data = response.data;
                if (checkHttpData(data, to.path)) {
                    routeAuthority = !data.data ? [] : data.data;
                    store.commit(types.RECEIVE_ACCOUNT_ROUTE_AUTHORITY, routeAuthority);
                    // 生成可访问的路由表
                    let accessedRouters = filterAsyncRouter(asyncRouterMap, routeAuthority);
                    // 动态添加可访问路由表
                    router.addRoutes(accessedRouters);
                    // hack方法 确保addRoutes已完成
                    next({...to});
                    // 设置左边导航栏
                    store.commit(types.RECEIVE_ROUTERS, accessedRouters);
                    next();
                    return;
                }
            }).catch((error)=>{
                MessageBox.confirm("加载用户菜单权限异常,请重新登陆！", '错误', {
                    confirmButtonText: '确定',
                    showCancelButton: false,
                    type: 'error',
                    showClose: true,
                }).then(() => {
                    next({path: "/login",});
                })
            });
            return;
        }
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        if (hasAuthority(store.getters.routeAuthority, to.meta.authority)) {
            next();
            return;
        }
        next({
            path: "/401",
            query: {noGoBack: true}
        });
        NProgress.done(); // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
        return;
    }
    let redirect = to.fullPath;
    store.commit(types.RECEIVE_ACCOUNT_INFO, "");
    // 否则全部重定向到登录页
    next({
        path: "/login",
        query: {redirect: redirect}
    });
    // router在hash模式下 手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    NProgress.done();
});

router.afterEach(() => {
    // 结束Progress
    NProgress.done();
});
