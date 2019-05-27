<template>
    <div>
        <div>
            <div class="table-left border-r">
                <div class="header-top">
                    <span style="color: #000000">菜单列表</span>
                </div>
                <div style="font-size: 16px" v-if="pagePermission.SystemPermissionList">
                    <el-tree ref="menuTree" :accordion="true" :props="menuTreeProps" :load="loadMenuTreeNode"
                             :data="menuTreeData" node-key="id" :empty-text="emptyText"
                             lazy :highlight-current="true" @node-click="clickMenuTreeNode">
                    </el-tree>
                </div>
                <div style="height: 50px; color: #909399; text-align:center; line-height: 50px" v-else>
                    {{emptyText}}
                </div>
            </div>
            <div class="table-right">
                <div class="header-top1">
                    <span style="color: #000000">权限列表</span>
                    <el-button class="btnbox-r fl-r" style="margin-top: 13px;margin-right: 2vw;" type="primary"
                               size="small" v-if="pagePermission.SystemPermissionSave"
                               @click="openOrClosePermissionListWindow(true)">新增
                    </el-button>
                </div>
                <div>
                    <el-table :data="permissionList" :border="true" style="width: 100%" row-key="id" :row-class-name="$TableRowClassName" :empty-text="emptyText">
                        <el-table-column label="编号" align="center" width="50">
                            <template scope="scope">
                                <span v-text="scope.$index+1"></span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="权限名称" align="center" width="100"></el-table-column>
                        <el-table-column prop="url" label="URL" align="center" width="150"></el-table-column>
                        <el-table-column prop="displayOrder" label="排序码" align="center" width="70"></el-table-column>
                        <el-table-column prop="remark" label="备注" align="center"
                                         :formatter="$StringUtil.formatToStringByTable"></el-table-column>
                        <el-table-column prop="createTime" label="创建时间" align="center"
                                         :formatter="$DateUtil.formatDateByTable" width="160"></el-table-column>
                        <el-table-column prop="createName" label="创建人" align="center"
                                         :formatter="$StringUtil.formatToStringByTable" width="100"></el-table-column>
                        <el-table-column prop="updateTime" label="修改时间" align="center"
                                         :formatter="$DateUtil.formatDateByTable" width="160"></el-table-column>
                        <el-table-column prop="updateName" label="修改人" align="center"
                                         :formatter="$StringUtil.formatToStringByTable" width="100"></el-table-column>
                        <el-table-column prop="status" label="状态" align="center" width="60">
                            <template slot-scope="scope">
                                <el-switch
                                    v-model="scope.row.status"
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    :disabled='!pagePermission.SystemPermissionUpdateStatus'
                                    @change="updatePermissionStatus(scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="150">
                            <template slot-scope="scope">
                                <el-button type="primary" size="mini" :disabled="!pagePermission.SystemPermissionUpdate"
                                           @click="openOrClosePermissionListWindow(true, scope.row)">
                                    编辑
                                </el-button>
                                <el-button type="danger" size="mini"  :disabled="!pagePermission.SystemPermissionDelete"
                                           @click="deletePermission(scope.row.id)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <!--表单-->
        <el-dialog :title="permissionForm.permissionFormTitle" :visible.sync="permissionForm.openOrClose" width="60%"
                   top="10vh">
            <el-form :model="permissionForm" :rules="permissionFormRules" ref="permissionForm">
                <el-form-item label="所属菜单：" prop="menuId">
                    <span>{{permissionForm.menuPath === "" ? "顶级菜单" : permissionForm.menuPath}}</span>
                    <br>
                    <el-button v-if="permissionForm.id !== ''" type="primary" size="small"
                               @click="openOrCloseUpdateMenuTreeWindow(true)">修改所属菜单
                    </el-button>
                    <input type="hidden" name="id" v-model="permissionForm.id"/>
                    <input type="hidden" name="menuID" v-model="permissionForm.menuId"/>
                </el-form-item>
                <el-form-item label="权限名称" prop="name">
                    <el-input type="text" v-model="permissionForm.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="URL" prop="url">
                    <el-input type="text" v-model="permissionForm.url" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="排序码" prop="displayOrder">
                    <el-input type="text" v-model="permissionForm.displayOrder" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input type="text" v-model="permissionForm.remark" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="openOrClosePermissionListWindow(false)">取消</el-button>
                <!--<el-button type="primary" @click.native="submitPermissionForm()" :loading="formLoading">提交</el-button>-->
                <el-button type="primary" @click.native="submitPermissionForm()">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog title="修改所属菜单" :visible.sync="menuTreeWindow" width="50%" top="15vh">
            <div>
                <div>父菜单:{{updateMenuPath}}</div>
            </div>
            <div>
                <el-tree ref="updateMenuTree" :accordion="true" :props="menuTreeProps"
                         :load="loadUpdateMenuTreeNode"
                         :data="updateMenuTreeDate"
                         :lazy="true" :highlight-current="true" @node-click="clickUpdateMenuNode">
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="openOrCloseUpdateMenuTreeWindow(false)">取消</el-button>
                <el-button type="primary" @click.native="submitUpdateMenu">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "Permission",
        data() {
            let _this = this;
            /**
             * @Description : 检测权限名称函数
             * @Author : cheng fei
             * @CreateDate 2019/3/31 18:30
             * @Param
             */
            let validateName = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    _this.$Http.doPostCheckParam(
                        _this,
                        "/system/permission/check/name",
                        {
                            menuId: _this.permissionForm.menuId,
                            name: _this.permissionForm.name,
                            excludeId: _this.permissionForm.id
                        },
                        function (self, data) {
                            if (data.data) {
                                callback()
                            } else {
                                callback("[ " + value + " ] 权限已存在!")
                            }
                        }
                    )
                } else {
                    callback("请输入权限名称!")
                }
            };
            /**
             * @Description : 检测权限URL函数
             * @Author : cheng fei
             * @CreateDate 2019/3/31 18:29
             * @Param
             */
            let validateURL = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    if ("#" === value) {
                        callback()
                    } else {
                        _this.$Http.doPostCheckParam(
                            _this,
                            "/system/permission/check/url",
                            {
                                excludeId: _this.permissionForm.id,
                                url: value
                            },
                            function (self, data) {
                                if (data.data) {
                                    callback()
                                } else {
                                    callback("url [ " + value + " ]已存在!")
                                }
                            }
                        )
                    }
                } else {
                    callback("请输入权限URL!")
                }
            };
            /**
             * @Description : 检测排序码
             * @Author : cheng fei
             * @CreateDate 2019/3/31 18:34
             * @Param
             */
            let validateDisplayOrder = function (rule, value, callback) {
                if (_this.$StringUtil.isNotBlank(value)) {
                    var re = /^[0-9]+$/;
                    if (re.test(value)) {
                        callback()
                    } else {
                        callback("排序码必须为正整数!")
                    }
                } else {
                    callback("排序码不能为空!")
                }
            };
            return {
                //页面按钮权限(权限url首字母大写,否则不能动态修改)
                pagePermission : {
                    SystemPermissionList : false,
                    SystemPermissionSave : false,
                    SystemPermissionUpdateStatus : false,
                    SystemPermissionUpdate : false,
                    SystemPermissionDelete : false
                },

                //菜单树属性设置
                menuTreeProps: {
                    label: 'name',
                    children: 'children',
                    isLeaf: 'hasChildren'
                },
                //菜单树数据
                menuTreeData: [],
                //选中的菜单树节点
                menuTreeLoadNode: null,
                //加载树的回调
                menuTreeNodeResolve: null,
                //选中菜单树节点data
                selectMenuTreeNode: "",
                //默认选中及节点
                defaultCheckedKeys: [],


                //权限列表
                permissionList: [],
                //权限表单
                permissionForm: {
                    //表单开关
                    openOrClose: false,
                    //表单名称
                    permissionFormTitle: "",
                    //id
                    id: "",
                    //所属菜单路径
                    menuPath: "",
                    //菜单ID
                    menuId: "",
                    //权限名称
                    name: "",
                    //url
                    url: "",
                    //排序码
                    displayOrder: "",
                    //备注
                    remark: "",
                    //更新时间
                    updateTime: "",
                },
                //权限表单验证
                permissionFormRules: {
                    menuId: [
                        {required: true, message: "权限所属菜单不能为空!", trigger: "blur"},
                    ],
                    name: [
                        {required: true, message: "权限名称不能为空!", trigger: "blur"},
                        {validator: validateName}
                    ],
                    url: [
                        {required: true, message: "权限URL不能为空!", trigger: "blur"},
                        {validator: validateURL}
                    ],
                    displayOrder: [
                        {required: true, message: "权限排序码不能为空!", trigger: "blur"},
                        {validator: validateDisplayOrder}
                    ]
                },

                //菜单树窗口开关
                menuTreeWindow: false,
                //修改后的父菜单路径
                updateMenuPath: "",
                updateMenuTreeDate: [],
                //修改菜单树的选中节点
                updateMenuNode: null
            }
        },
        computed : {
            //数据为空时描述
            emptyText(){
                if (this.pagePermission.SystemPermissionList) {
                    return "暂无数据"
                } else {
                    return "您无查看权限！"
                }
            }
        },
        mounted() {
            //获取页面按钮权限
            this.$GetAccountMenuPermission(this.pagePermission)
        },
        methods: {
            /**
             * @Description : 懒加载菜单树节点
             * @Author : cheng fei
             * @CreateDate 2019/3/30 0:29
             * @Param
             */
            loadMenuTreeNode(node, resolve) {
                let parentId = "";
                if (node.level === 0) {
                    parentId = 0;
                } else {
                    parentId = node.data.id;
                }
                this.$Http.doPostForForm(
                    this,
                    "system/menu/tree",
                    {
                        parentId: parentId,
                        status: true,
                    },
                    function (self, data) {
                        if (self.$ObjectUtil.isNotBlank(data.data)) {
                            for (let i in data.data) {
                                data.data[i].hasChildren = !data.data[i].hasChildren
                            }
                        }
                        let children = self.$ObjectUtil.isBlank(data.data) ? [] : data.data;
                        if (node.level === 0) {
                            resolve(children);
                            self.menuTreeData = children;
                            self.selectMenuTreeNode = self.menuTreeData[0];
                            self.$refs.menuTree.setCurrentKey(self.menuTreeData[0].id);
                            self.loadPermissionList();
                        } else {
                            self.$set(node.data, "children", children)
                        }
                        resolve(children)
                    }
                )
            },
            /**
             * @Description : 刷新树节点
             * @Author : cheng fei
             * @CreateDate 2019/4/3 0:35
             * @Param
             */
            refreshTreeNode() {
                let theChildren = this.menuTreeLoadNode.childNodes;
                theChildren.splice(0, theChildren.length);
                this.$Http.doPostForForm(
                    this,
                    "system/menu/tree",
                    {
                        parentId: this.menuTreeLoadNode.data.id
                    },
                    function (self, data) {
                        if (self.$ObjectUtil.isNotBlank(data.data)) {
                            for (let i in data.data) {
                                data.data[i].hasChildren = !data.data[i].hasChildren
                            }
                        }
                        let children = self.$ObjectUtil.isBlank(data.data) ? [] : data.data;
                        if (children.length > 0) {
                            self.menuTreeLoadNode.doCreateChildren(children);
                            self.menuTreeLoadNode.data.children = children;
                        }
                        if (self.menuTreeLoadNode.childNodes.length > 0) {
                            self.menuTreeLoadNode.isLeaf = false;
                            self.menuTreeLoadNode.expanded = true;
                        } else {
                            self.menuTreeLoadNode.isLeaf = true;
                        }
                    }
                )
            },
            /**
             * @Description : 点击菜单树节点
             * @Author : cheng fei
             * @CreateDate 2019/3/30 2:05
             * @Param
             */
            clickMenuTreeNode(data, node) {
                this.menuTreeLoadNode = node;
                this.selectMenuTreeNode = this.$ObjectUtil.isBlank(data) ? "" : data;
                if (node.expanded || node.childNodes.length === 0){
                    this.loadPermissionList();
                }
            },
            /**
             * @Description : 加载菜单列表
             * @Author : cheng fei
             * @CreateDate 2019/3/30 1:13
             * @Param
             */
            loadPermissionList() {
                if (this.pagePermission.SystemPermissionList) {
                    this.$Http.doPostForForm(
                        this,
                        "/system/permission/list",
                        {
                            menuId: this.selectMenuTreeNode.id
                        },
                        function (self, data) {
                            if (self.$ObjectUtil.isNotBlank(data.data)) {
                                self.permissionList = data.data;
                            } else {
                                self.permissionList = []
                            }
                        }
                    )
                }
            },
            /**
             * @Description : 开启添加菜单窗窗口
             * @Author : cheng fei
             * @CreateDate 2019/3/30 1:53
             * @Param
             */
            openOrClosePermissionListWindow(value, data) {
                if (value) {
                    //开启表单
                    if (this.$ObjectUtil.isNotBlank(data)) {
                        //修改权限
                        this.permissionForm.openOrClose = value;
                        this.permissionForm.permissionFormTitle = "修改菜单";
                        this.permissionForm.id = data.id;
                        this.permissionForm.menuId = data.menuId;
                        this.permissionForm.name = data.name;
                        this.permissionForm.url = data.url;
                        this.permissionForm.displayOrder = data.displayOrder;
                        this.permissionForm.remark = data.remark;
                        this.permissionForm.updateTime = data.updateTime;
                        this.permissionForm.menuPath = this.$TreeUtil.getAllParentNodePathById(data.menuId, this.menuTreeData, "id", "parentId", "children", "name", true);
                    } else {
                        //添加权限
                        this.permissionForm.permissionFormTitle = "添加菜单";
                        //判断是否是子菜单
                        if (!this.selectMenuTreeNode.hasChildren) {
                            //不是最底层子菜单,不能添加权限
                            this.$confirm("选中的菜单不是最底层子菜单,不能添加权限！", '提示', {
                                confirmButtonText: '确定',
                                showCancelButton: false,
                                type: 'warning',
                                showClose: true,
                            }).then(() => {
                            }).catch(() => {
                            });
                            return;
                        }
                        this.permissionForm.openOrClose = value;
                        this.permissionForm.menuId = this.selectMenuTreeNode.id;
                        //获取菜单地址
                        if (this.$ObjectUtil.isNotBlank(this.selectMenuTreeNode)) {
                            this.permissionForm.menuPath = this.$TreeUtil.getAllParentNodePathByNode(this.selectMenuTreeNode, this.menuTreeData, "id", "parentId", "children", "name", true);
                        }
                    }
                } else {
                    //关闭表单,重置数据
                    this.permissionForm.openOrClose = false;
                    this.permissionForm.permissionFormTitle = "";
                    this.permissionForm.menuPath = "";
                    this.permissionForm.id = "";
                    this.permissionForm.menuId = "";
                    this.permissionForm.name = "";
                    this.permissionForm.url = "";
                    this.permissionForm.displayOrder = "";
                    this.permissionForm.remark = "";
                    this.permissionForm.updateTime = "";
                    //重置验证
                    this.$refs["permissionForm"].resetFields();
                }
            },
            /**
             * @Description : 提交权限表单
             * @Author : cheng fei
             * @CreateDate 2019/3/31 18:43
             * @Param
             */
            submitPermissionForm() {
                this.$refs["permissionForm"].validate(valid => {
                    if (valid) {
                        let param = {
                            menuId: this.permissionForm.menuId,
                            name: this.permissionForm.name,
                            url: this.permissionForm.url,
                            displayOrder: this.permissionForm.displayOrder,
                            remark: this.permissionForm.remark
                        };
                        let url = "";
                        if (this.permissionForm.id === "") {
                            url = "system/permission/save";
                        } else {
                            url = "/system/permission/update";
                            param.id = this.permissionForm.id;
                            param.updateTime = this.$StringUtil.isBlank(this.permissionForm.updateTime) ? "" : this.$DateUtil.formatTimestampForDateTime(this.permissionForm.updateTime);
                        }
                        this.$Http.doPostForForm(
                            this,
                            url,
                            param,
                            function (self, data) {
                                self.$message({
                                    type: 'success',
                                    message: self.permissionForm.id === "" ? '新增权限成功!' : '修改权限成功!'
                                });
                                self.openOrClosePermissionListWindow(false);
                                self.loadPermissionList()
                            }
                        )
                    }
                })
            },
            /**
             * @Description : 修改权限状态
             * @Author : cheng fei
             * @CreateDate 2019/4/1 1:27
             * @Param id 菜单ID
             */
            updatePermissionStatus(permission) {
                let flag = true;
                if (!permission.status) {
                    this.$confirm('确认要禁用该权限,禁用后相关页面改功能不可用?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        flag = true
                    }).catch(() => {
                        flag = false;
                        permission.status = !permission.status
                    });
                }
                if (flag) {
                    this.$Http.doPostForForm(
                        this,
                        "system/permission/update/status",
                        {
                            id: permission.id,
                            status: permission.status,
                            updateTime: this.$StringUtil.isBlank(permission.updateTime) ? "" : this.$DateUtil.formatTimestampForDateTime(permission.updateTime)
                        },
                        function (self, data) {
                           self.loadPermissionList();
                        },
                        function () {
                            self.loadPermissionList();
                        }
                    )
                }
            },
            /**
             * @Description : 删除菜单
             * @Author : cheng fei
             * @CreateDate 2019/4/1 1:27
             * @Param id 菜单ID
             */
            deletePermission(id) {
                this.$confirm('确认要删除该权限?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$Http.doPostForForm(
                        this,
                        "system/permission/delete",
                        {
                            id: id
                        },
                        function (self, data) {
                            self.$message({
                                type: 'success',
                                message: '删除权限成功!'
                            });
                            self.loadPermissionList();
                        }
                    )
                }).catch(() => {
                });
            },
            /**
             * @Description : 开启/关闭修改权限所属菜单窗口
             * @Author : cheng fei
             * @CreateDate 2019/4/1 1:28
             * @Param
             */
            openOrCloseUpdateMenuTreeWindow(value) {
                this.menuTreeWindow = value;
                if (value) {
                    //开启
                } else {
                    //关闭
                    this.updateMenuNode = null;
                    this.updateMenuPath = "";
                }
            },
            /**
             * @Description : 提交修改父菜单
             * @Author : cheng fei
             * @CreateDate 2019/4/3 2:13
             * @Param
             */
            submitUpdateMenu() {
                if (!this.updateMenuNode.hasChildren) {
                    //不是最底层子菜单,不能添加权限
                    this.$confirm("选中的菜单不是最底层子菜单,不能添加权限！", '提示', {
                        confirmButtonText: '确定',
                        showCancelButton: false,
                        type: 'warning',
                        showClose: true,
                    }).then(() => {
                    }).catch(() => {
                    });
                    return;
                }
                this.permissionForm.menuPath = this.updateMenuPath;
                this.permissionForm.menuId = this.updateMenuNode.data.id;
                this.openOrCloseUpdateMenuTreeWindow(false)
            },
            /**
             * @Description : 加载修改所属菜单树节点
             * @Author : cheng fei
             * @CreateDate 2019/4/1 1:44
             * @Param
             */
            loadUpdateMenuTreeNode(node, resolve) {

                let parentId = "";
                if (node.level === 0) {
                    parentId = 0;

                } else {
                    parentId = node.data.id;
                }
                this.$Http.doPostForForm(
                    this,
                    "system/menu/tree",
                    {
                        parentId: node.data.id,
                        status: true,
                        excludeId: this.permissionForm.menuId
                    },
                    function (self, data) {
                        if (self.$ObjectUtil.isNotBlank(data.data)) {
                            for (let i in data.data) {
                                data.data[i].hasChildren = !data.data[i].hasChildren
                            }
                            if (node.level === 0) {
                                self.menuTreeData = data.data
                            } else {
                                self.$set(node.data, "children", data.data)
                            }
                            resolve(data.data)
                        } else {
                            self.updateMenuNode.loading = false;
                            self.updateMenuNode.isLeaf = true;
                            self.updateMenuNode.data.hasChildren = true;
                        }

                    }
                )
            },
            /**
             * @Description : 刷新修改父节点树节点
             * @Author : cheng fei
             * @CreateDate 2019/4/3 0:35
             * @Param
             */
            refreshUpdateTreeNode() {
                let theChildren = this.updateMenuNode.childNodes;
                theChildren.splice(0, theChildren.length);
                this.$Http.doPostForForm(
                    this,
                    "system/menu/tree",
                    {
                        parentId: this.updateMenuNode.data.id,
                        excludeId: this.permissionForm.id
                    },
                    function (self, data) {
                        if (self.$ObjectUtil.isNotBlank(data.data)) {
                            for (let i in data.data) {
                                data.data[i].hasChildren = !data.data[i].hasChildren
                            }
                        }
                        let children = self.$ObjectUtil.isBlank(data.data) ? [] : data.data;
                        if (children.length > 0) {
                            self.updateMenuNode.doCreateChildren(children);
                            self.updateMenuNode.data.children = children;
                        }
                        if (self.updateMenuNode.childNodes.length > 0) {
                            self.updateMenuNode.isLeaf = false;
                            self.updateMenuNode.expanded = true;
                        } else {
                            self.updateMenuNode.isLeaf = true;
                        }
                    }
                )
            },
            /**
             * @Description : 点击修改父菜单树节点
             * @Author : cheng fei
             * @CreateDate 2019/4/1 2:02
             * @Param
             */
            clickUpdateMenuNode(data, node) {
                this.updateMenuNode = node;
                this.updateMenuPath = this.$TreeUtil.getAllParentNodePathByNode(data, this.updateMenuTreeDate, "id", "parentId", "children", "name", true);
            },

            /**
             * @Description : 格式化字符串
             * @Author : cheng fei
             * @CreateDate 2019/3/30 1:39
             * @Param
             */
            formatString(row, column) {

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
    @import "./Permission.less";
    @import "../../../styles/commons.less";
</style>
