import Config from "../../config/Config"
/**
 * @Description : 判断是否是PC端
 * @Author : cheng fei
 * @CreateDate 2019/5/26 20:52
 * @returns {boolean}
 * @constructor
 */
export function isPC() {
    const userAgentInfo = navigator.userAgent;
    const Agents = Config.MobileTerminalSystem;
    let flag = true;
    for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
