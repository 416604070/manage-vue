/**
 * @Description : 账号状态
 * @Author : cheng fei
 * @CreateDate 2019/5/13 11:20
 */

import * as types from "../mutation-types";
import {constantRouterMap} from "../../router";
import { setAccountInfo, removeAccountInfo } from "../../utils/account/AccountUtil";
import {getAccountId, getAccountUsername, getToken, getAccountName} from "../../utils/account/AccountUtil"


// initial state
const state = {
    // id
    accountId: getAccountId(),
    // 用户名
    username: getAccountUsername(),
    //姓名
    name: getAccountName(),
    // 登录token
    token: getToken(),
    //是否弹出登录超时弹框
    isAlertLoginOverTime : true,
    // 路由权限列表
    routeAuthority: "",
    //路由列表
    routers: constantRouterMap
};

// getters
const getters = {
    accountId: state => state.accountId,
    username: state => state.username,
    name: state => state.name,
    token: state => state.token,
    isAlertLoginOverTime : state => state.isAlertLoginOverTime,
    routeAuthority: state => state.routeAuthority,
    routers: state => state.routers
};

// actions
const actions = {
    /*// 用户名登录
    loginName({commit}, userInfo) {
        Http.doPostForForm(null,'','',)
        const userName = userInfo.userName ? userInfo.userName.trim() : "";
        const pwd = userInfo.pwd ? userInfo.pwd : "";
        return new Promise((resolve, reject) => {
            loginName(userName, pwd)
                .then(response => {
                    if (response.code) {
                        Message({
                            message: response.message,
                            type: "error",
                            duration: 5 * 1000
                        });
                    } else {
                        let data = response.data;
                        commit(types.RECEIVE_ADMIN_ID, data.id);
                        commit(types.RECEIVE_ADMIN_TOKEN, data.token);
                        commit(types.RECEIVE_ADMIN_AUTH_RULES, []);
                    }
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    },
    userInfo({commit}) {
        return new Promise((resolve, reject) => {

            userInfo().then(response => {
                const data = response.data || {};
                commit(types.RECEIVE_ADMIN_NAME, data.username);
                commit(types.RECEIVE_ADMIN_AVATAR, data.avatar);
                commit(types.RECEIVE_ADMIN_AUTH_RULES, data.authRules);
                resolve(data);
            }).catch(error => {
                reject(error);
            });
        });
    },
    // 登出
    loginOut({commit}) {
        return new Promise((resolve, reject) => {
            logout().then(() => {
                commit(types.RECEIVE_ADMIN_ID, "");
                commit(types.RECEIVE_ADMIN_TOKEN, "");
                commit(types.RECEIVE_ADMIN_AUTH_RULES, []);
                resolve();
            }).catch(error => {
                reject(error);
            });
        });
    },

    // 前端 登出
    fedLogout({commit}) {
        return new Promise(resolve => {
            commit(types.RECEIVE_ADMIN_ID, "");
            commit(types.RECEIVE_ADMIN_TOKEN, "");
            commit(types.RECEIVE_ADMIN_AUTH_RULES, []);
            resolve();
        });
    },
    //过滤路由列表
    filterRouter({commit}, data) {
        const {accessedRouters} = data;
        if (accessedRouters && accessedRouters.length > 0) {
            commit(types.RECEIVE_ROUTERS, accessedRouters);
        }
    }*/
};

// mutations
const mutations = {
    //更新用户数据
    [types.RECEIVE_ACCOUNT_INFO](state, accountInfo) {
        if (accountInfo){
            setAccountInfo(accountInfo);
            if (accountInfo.token){
                state.token = accountInfo.token
            }
            if (accountInfo.account) {
                const  account = accountInfo.account;
                if (account.id){
                    state.accountId = account.id;
                }
                if (account.username) {
                    state.username = account.username;
                }
                if (account.name){
                    state.name = account.name;
                }
                state.isAlertLoginOverTime = true;
            }
        } else {
            state.token = "";
            state.accountId = "";
            state.username = "";
            state.name = "";
            removeAccountInfo();
        }

    },
    //更新是否弹出登录超时弹框
    [types.RECEIVE_IS_ALERT_LOGIN_OVER_TIME] (state, isAlertLoginOverTime) {
        state.isAlertLoginOverTime = isAlertLoginOverTime;
    },
    //更新用路由权限
    [types.RECEIVE_ACCOUNT_ROUTE_AUTHORITY](state, routeAuthority) {
        state.routeAuthority = routeAuthority;
    },
    //更新用户路由列表
    [types.RECEIVE_ROUTERS](state, routers) {
        const tempRm = constantRouterMap.concat(routers);
        state.routers = JSON.parse(JSON.stringify(tempRm));
    }
};

export default {
    state,
    getters,
    mutations
};
