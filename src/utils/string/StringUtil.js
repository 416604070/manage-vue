/**
 * @Description : 字符串工具类
 * @Author : cheng fei
 * @CreateDate 2019/3/29 21:15
 */

import ObjectUtil from "../object/ObjectUtil"

const stringUtil = {
    /**
     * @Description : 判断字符串为空
     * @Author : cheng fei
     * @CreateDate 2019/3/29 21:15
     * @Param value value
     */
    isBlank: function (value) {
        return isBlank(value)
    },
    /**
     * @Description : 判断字符串不为空
     * @Author : cheng fei
     * @CreateDate 2019/3/29 21:15
     * @Param value value
     */
    isNotBlank(value) {
        return isNotBlank(value)
    },
    /**
     * @Description : 格式化字符串
     * @Author : cheng fei
     * @CreateDate 2019/3/29 21:14
     * @Param value value
     */
    formatToString(value){
        if (isBlank(value)){
            return "-"
        }else {
            return value
        }
    },
    /**
     * @Description : 格式化字符串(element表格字符串格式化)
     * @Author : cheng fei
     * @CreateDate 2019/4/21 23:53
     * @Param row 行数据
     * @Param column 列数据
     */
    formatToStringByTable(row, column){
        let value = row;
        if (ObjectUtil.isBlank(row) || ObjectUtil.isBlank(column) || isBlank(column.property)){
            return "";
        }
        if (column.property.indexOf(".") !== -1) {
            let propertys = column.property.split(".");
            for (let i in propertys) {
                value = value[propertys[i]]
            }
        } else {
            value = row[column.property]
        }
        if (isBlank(value)){
            return "-"
        }else {
            return value
        }
    }
};

/**
 * @Description : 判断字符串是否为空
 * @Author : cheng fei
 * @CreateDate 2019/4/22 0:11
 * @Param
 */
function isBlank(value) {
    return (value === null || value === undefined || value === "")
}
/**
 * @Description : 判断字符串是否不为空
 * @Author : cheng fei
 * @CreateDate 2019/4/22 0:12
 * @Param
 */
function isNotBlank(value) {
    return !(value === null || value === undefined || value === "")
}
export default  stringUtil
