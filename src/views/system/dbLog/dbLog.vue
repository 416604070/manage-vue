<template>
    <div>
        <div class="header-item border-r">
            <div class="header-top t-h2">
                <span style="color: #000000;font-size: 2vh;">筛选条件</span>
            </div>
            <div style="height: 6vh;">
                <div class="search_div">
                    <span style="color: #000000;font-size: 1.6vh">操作类型：</span>
                    <el-dropdown @command="selectedType" style="font-size: 1.6vh">
                        <span class="el-dropdown-link">
                        {{selectType}}<i class="el-icon-arrow-down el-icon--right"></i>
                         </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item, index) in typeList" :command="item">{{item.name}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="search_div" style="margin: 1.3vh 1vw">
                    <span style="color: #000000;font-size: 1.6vh">操作人：</span>
                    <el-input v-model="name" placeholder="请输入操作人" @change="changName" clearable
                              style="width: 10vw"></el-input>
                </div>
                <div class="search_div" style="margin: 1.3vh 1vw">
                    <span style="color: #000000;font-size: 1.6vh">操作时间：</span>
                    <el-date-picker
                        v-model="startTime"
                        type="date"
                        @change="changStartTime"
                        placeholder="请选择开始时间">
                    </el-date-picker>
                    <span style="color: #000000;font-size: 1.6vh"> -- </span>
                    <el-date-picker
                        v-model="endTime"
                        type="date"
                        @change="changEndTime"
                        placeholder="请选择结束时间">
                    </el-date-picker>
                </div>
                <div class="search_div" style="margin: 1.6vh 1vw">
                    <el-button type="primary" size="small" @click="resetSearch">重置</el-button>
                </div>
            </div>
        </div>
        <div class="header-item border-r" style="margin-top: 2vh">
            <div class="header-top t-h2">
                <span style="color: #000000;font-size: 2vh;">数据列表</span>
                <div style="float: right;margin-right: 2vw;" v-if="pagePermission.SystemDbLogDelete && deleteDateList.length !== 0">
                    <span style="color: #000000;font-size: 1.6vh;">删除数据库操作日志：</span>
                    <el-dropdown @command="selectedDeleteDate" style="font-size: 1.6vh">
                        <span class="el-dropdown-link">
                        {{deleteDateTitle}}<i class="el-icon-arrow-down el-icon--right"></i>
                         </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item, index) in deleteDateList" :command="item">{{item.name}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                    <el-button type="primary" size="small" @click="deleteDbLog" style="margin-left: 1vw;">删除</el-button>
                </div>
            </div>
            <div>
                <el-table :data="dbLogList" :border="true" style="width: 100%" row-key="id" :row-class-name="$TableRowClassName" :empty-text="emptyText">
                    <el-table-column label="编号" align="center" width="80">
                        <template scope="scope">
                            <span v-text="scope.$index+1"></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="accountName" label="操作人" align="center" width="200"></el-table-column>
                    <el-table-column prop="createTime" label="操作日期" align="center" width="200"
                                     :formatter="$DateUtil.formatDateByTable"></el-table-column>
                    <el-table-column prop="typeName" label="操作类型" align="center" width="200"
                                     :formatter="$StringUtil.formatToStringByTable"></el-table-column>
                    <el-table-column prop="log" label="日志" align="left" :formatter="formatString"></el-table-column>
                </el-table>
            </div>
            <div>
                <div style="float: right; margin-right: 3vw; margin-top: 2vh;">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="[5, 10, 20, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "dbLog",
        data() {
            return {
                //页面按钮权限(权限url首字母大写,否则不能动态修改)
                pagePermission: {
                    SystemDbLogList: false,
                    SystemDbLogDelete: false,
                },
                //数据库操作日志数据
                dbLogList: [],
                //数据库操作日志数据总数
                total: 0,
                //当前选中页码
                currentPage: 1,
                //每页加载条数
                pageSize: 10,

                //数据库操作日志类型
                typeList: [],
                //选中数据库操作日志类型名称
                selectType: "全部分类",
                //选中数据库操作日志类型key
                selectedTypeKey: "",
                //操作人模糊查询
                name: "",
                //开始时间
                startTime: "",
                //结束时间
                endTime: "",
                //删除数据库日志选项列表
                deleteDateList: [],
                //删除数据库操作日志标题
                deleteDateTitle: "",
                //删除数据库操作日志周期
                deleteDateKey: "",

            }
        },
        computed: {
            //数据为空时描述
            emptyText() {
                if (this.pagePermission.SystemDbLogList) {
                    return "暂无数据"
                } else {
                    return "您无查看权限！"
                }
            },
        },
        async mounted() {
            //加载页面按钮权限
            await this.$GetAccountMenuPermission(this.pagePermission);
            //加载数据库操作类型
            this.loadTypeList();
            //加载数据库操作日志选项
            this.loadDeleteDateList();
            //加载数据库操作日志列表
            this.loadDbLog();
        },
        methods: {
            /**
             * @Description : 加载数据库操作日志选项
             * @Author : cheng fei
             * @CreateDate 2019/4/17 22:07
             */
            loadDeleteDateList() {
                this.$Http.doPostForForm(
                    this,
                    "system/dictionary/select",
                    {
                        parentKey: "SYSTEM_DB_LOG_DELETE_OPTION"
                    },
                    function (self, data) {
                        if (data && data.data) {
                            self.deleteDateList = data.data;
                            self.deleteDateTitle = self.deleteDateList[0].name;
                            self.deleteDateKey = self.deleteDateList[0].key;
                        }
                    }
                )
            },
            /**
             * @Description :
             * @Author : cheng fei
             * @CreateDate 2019/4/17 22:04
             * @Param item 删除类型
             */
            selectedDeleteDate(item) {
                this.deleteDateTitle = item.name;
                this.deleteDateKey = item.key
            },
            /**
             * @Description : 删除数据库操作日志
             * @Author : cheng fei
             * @CreateDate 2019/4/17 22:15
             */
            deleteDbLog() {
                this.$confirm('确认要删除数据库操作日志?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$Http.doPostForForm(
                        this,
                        "system/db/log/delete",
                        {
                            key: this.deleteDateKey
                        },
                        function (self, data) {
                            self.$message({
                                type: 'success',
                                message: '删除数据字典成功!'
                            });
                            //刷新数据
                            self.loadDbLog();
                        }
                    )
                }).catch(() => {

                });
            },
            /**
             * @Description : 加载数据库操作日志类型
             * @Author : cheng fei
             * @CreateDate 2019/4/17 0:54
             * @Param
             */
            loadTypeList() {
                this.$Http.doPostForForm(
                    this,
                    "system/dictionary/select",
                    {
                        parentKey: "SYSTEM_DB_LOG_TYPE"
                    },
                    function (self, data) {
                        if (data && data.data){
                            self.typeList = data.data
                        }
                        self.typeList.unshift({
                            key: "",
                            value: "",
                            name: "全部分类"
                        });
                    }
                )
            },
            /**
             * @Description : 选中数据库操作类型
             * @Author : cheng fei
             * @CreateDate 2019/4/17 1:42
             * @Param
             */
            selectedType(item) {
                this.selectType = item.name;
                this.selectedTypeKey = item.key;
                this.loadDbLog();
            },
            /**
             * @Description : 改变操作人
             * @Author : cheng fei
             * @CreateDate 2019/4/17 2:05
             * @Param
             */
            changName() {
                this.loadDbLog();
            },
            /**
             * @Description : 改变开始时间
             * @Author : cheng fei
             * @CreateDate 2019/4/17 2:18
             */
            changStartTime() {
                this.loadDbLog()
            },
            /**
             * @Description :改变结束时间
             * @Author : cheng fei
             * @CreateDate 2019/4/17 2:19
             */
            changEndTime() {
                let endTime = new Date(this.endTime);
                let startTime = new Date(this.startTime);
                if (startTime.getTime() > endTime.getTime()) {
                    this.$confirm("结束时间不能小于开始时间！", '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'warning',
                        showClose: true,
                    }).then(() => {
                    });
                } else {
                    this.loadDbLog();
                }
            },
            /**
             * @Description : 重置搜索
             * @Author : cheng fei
             * @CreateDate 2019/4/17 2:56
             * @Param
             */
            resetSearch() {
                this.selectType = "全部分类";
                this.selectedTypeKey = "";
                this.name = "";
                this.startTime = "";
                this.endTime = "";
                this.loadDbLog()
            },
            /**
             * @Description : 加载数据操作日志列表
             * @Author : cheng fei
             * @CreateDate 2019/4/17 0:20
             * @Param
             */
            loadDbLog() {
                if(this.pagePermission.SystemDbLogList){
                    this.$Http.doPostForForm(
                        this,
                        "system/db/log/list",
                        {
                            type: this.selectedTypeKey,
                            name: this.name,
                            startTime: this.$DateUtil.formatDateTimeForTimestamp(this.startTime, false, true),
                            endTime: this.$DateUtil.formatDateTimeForTimestamp(this.endTime, false, true),
                            page: this.currentPage,
                            pageSize: this.pageSize
                        },
                        function (self, data) {
                            self.dbLogList = data.data.rows;
                            self.total = data.data.count;
                        },
                        function (self) {

                        }
                    )
                } else {
                    this.emptyText = "您无查看权限！";
                }
            },
            /**
             * @Description : 修改每页加载条数
             * @Author : cheng fei
             * @CreateDate 2019/4/17 0:40
             * @Param pageSize 每页加载条数
             */
            handleSizeChange(pageSize) {
                this.pageSize = pageSize;
                this.loadDbLog();
            },
            /**
             * @Description : 修改加载页码
             * @Author : cheng fei
             * @CreateDate 2019/4/15 23:32
             * @Param page 页码
             */
            handleCurrentChange(page) {
                this.currentPage = page;
                this.loadDbLog();
            },
            /**
             * @Description : 格式化字符串
             * @Author : cheng fei
             * @CreateDate 2019/3/30 1:39
             * @Param
             */
            formatString(row, column) {
                let value = row;
                if (column.property.indexOf(".") !== -1) {
                    let propertys = column.property.split(".");
                    for (let i in propertys) {
                        value = value[propertys[i]]
                    }
                } else {
                    value = row[column.property]
                }
                return this.$StringUtil.formatToString(value);
            },
            /**
             * @Description : 格式化日期
             * @Author : cheng fei
             * @CreateDate 2019/3/30 1:39
             * @Param
             */
            formatDate(row, column) {
                let value = row;
                if (column.property.indexOf(".") !== -1) {
                    let propertys = column.property.split(".")
                    for (let i in propertys) {
                        value = value[propertys[i]]
                    }
                } else {
                    value = row[column.property]
                }
                return this.$DateUtil.formatDateTimeForTimestamp(value);
            },
        }
    }
</script>

<style lang="less" scoped>
    @import "dbLog.less";
    @import "../../../styles/commons.less";
</style>
