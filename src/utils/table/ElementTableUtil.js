import StringUtil from "../string/StringUtil"
/**
 * @Description : element表格行样式工具类
 * @Author : cheng fei
 * @CreateDate 2019/5/23 17:12
 */
export function tableRowClassName({row}) {
    if (StringUtil.isBlank(row) || StringUtil.isBlank(row.status)){
        return 'success-row';
    } else {
        if (row.status) {
            return 'success-row';
        } else {
            return 'warning-row';
        }
    }
}
