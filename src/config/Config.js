/**
 * 系统配置
 */
const config = {

    /**
     * appKey 前后端各一份,验证身份使用
     */
    appKey : "fb98ab9159f51fd0",

    /**
     * 后端服务地址
     */
    // serverUrl : "http://localhost:8080/",
    serverUrl : "http://112.74.183.118:8080/",
    // serverUrl : "https://manage.service.chengfei.top/",

    /**
     * 请求超时时间
     */
    overtime : 10000,

    /**
     * token请求头
     */
    tokenHeader : "TOKEN",

    /**
     * 请求超时请求头
     */
    overTimeHeader : "OVER_TIME",

    /**
     * 鉴权请求头
     */
    signHeader : "SIGN",

    //超级管理员账号
    administrator : 'admin',
    //移动端系统
    MobileTerminalSystem : ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"],

};

export default config;
