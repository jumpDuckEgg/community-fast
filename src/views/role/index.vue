<template>
  <div class="app-container" v-loading="loadingFlag">
    <div class="searchBox">
        <el-input
            size="mini"
            placeholder="请输入角色名"
            prefix-icon="el-icon-search"
            v-model="roleName">
        </el-input>
        <el-button size="mini" type="primary" plain @click="searchRole"  >搜索</el-button>
    </div>
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdRole">新增角色</el-button>
            <el-button size="mini" type="primary" plain @click="modifyRole">修改角色</el-button>
            <el-button size="mini" type="primary" plain @click="showRole">查看权限</el-button>
            <el-button size="mini" type="primary" plain @click="deleteRole">删除</el-button>
        </el-button-group>
    </el-row>
    <normalTable :tableMd="16" :columns="columns"  :tableData="tableData" :loading="loading"  @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
    <!-- 创建用户 -->
    <el-dialog
        :visible.sync="createFormDialogVisible"
        :fullscreen="fullscreen"
        width="650px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">新增角色</div>
        <el-form ref="createForm"   :inline="true" :model="createForm" :rules="createRules" label-width="90px">
            <el-form-item label="角色名：" prop="roleName">
                <el-input size="mini" v-model="createForm.roleName" clearable ></el-input>
            </el-form-item>
            <el-form-item label="备注：" >
                <el-input size="mini" v-model="createForm.remark" clearable ></el-input>
            </el-form-item>
            <el-form-item label="菜单：" >
                <el-tree 
                node-key="id"
                 show-checkbox :data="menuList" :highlight-current='highlight' :default-expand-all='expandAll' 
                :props="defaultProps" :filter-node-method="filterNode" ref="createTree">
                    <span slot-scope="{ node, data }">
                        <svg-icon v-if="node.icon" :icon-class="node.icon" />
                        <span class="menuSize">{{ node.label }}</span>
                    </span>
                </el-tree>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitRole('createForm')" size="mini" v-loading='submitFlag'>确 定</el-button>
            <el-button @click="resetRole('createForm')" size="mini" type="danger" v-loading='submitFlag'>重 置</el-button>
        </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
        :visible.sync="modifyFormDialogVisible"
        :fullscreen="fullscreen"
        width="650px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">修改角色</div>
        <el-form ref="modifyForm"   :inline="true" :model="modifyForm" :rules="modifyRules" label-width="90px">
            <el-form-item label="角色名：" prop="roleName">
                <el-input size="mini" v-model="modifyForm.roleName" clearable ></el-input>
            </el-form-item>
            <el-form-item label="备注：" >
                <el-input size="mini" v-model="modifyForm.remark" clearable ></el-input>
            </el-form-item>
            <el-form-item label="菜单：" >
                <el-tree 
                node-key="id"
                 show-checkbox :data="modfiyMenuList" :highlight-current='highlight' :default-expand-all='expandAll' 
                :props="defaultProps"  :filter-node-method="filterNode" ref="modifyTree">
                    <span slot-scope="{ node, data }">
                        <svg-icon v-if="node.icon" :icon-class="node.icon" />
                        <span class="menuSize">{{ node.label }}</span>
                    </span>
                </el-tree>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitRole('modifyForm')" size="mini" v-loading='submitFlag'>确 定</el-button>
            <el-button @click="cancelRole('modifyForm')" size="mini" type="danger" v-loading='submitFlag'>取 消</el-button>
        </span>
    </el-dialog>
    <!-- 展示权限 -->
    <el-dialog
        :visible.sync="showDialogVisible"
        :fullscreen="fullscreen"
        width="650px" center lock-scroll :close-on-click-modal="false" 
        >
        <el-tree 
        node-key="id"
        show-checkbox :data="showMenuList" :highlight-current='highlight' :default-expand-all='expandAll' 
        :props="defaultProps" ref="showTree">
            <span slot-scope="{ node, data }">
                <svg-icon v-if="node.icon" :icon-class="node.icon" />
                <span class="menuSize">{{ node.label }}</span>
            </span>
        </el-tree>
    </el-dialog>
  </div>
</template>

<script>
import { getListMenu } from '@/api/menu'
import { getRoleList ,createRole ,deleteRole ,getRoleInfo ,updateRole } from '@/api/role'
import { _isMobile } from '@/utils/tool'
import normalTable from '@/components/NormalTable'
export default {
  data() {
    return {
        currentDialog:'',
        loadingFlag:false,
        createFormDialogVisible:false,
        modifyFormDialogVisible:false,
        showDialogVisible:false,
        fullscreen:false,
        submitFlag:false,
        createForm:{
            roleName:'',
            remark:'',
            menuIdList:[]
        },
        createRules: {
            roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
        },
        modifyForm:{
            id:'',
            roleName:'',
            remark:'',
            menuIdList:[]
        },
        modifyRules: {
            roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
        },
        pageIndex:1,
        pageSize:10,
        roleName:'',
        currentPage:1,
        total:0,
        tableData:[],
        highlight:true,
        expandAll:false,
        menuList:[],
        modfiyMenuList:[],
        showMenuList:[],
        filterText: '',
        defaultProps: {
            children: 'list',
            label: 'name'
        },
        loading:false,//表格加载状态
        multipleSelectData:[],
        columns: [
            {
                width: 220,
                prop: "roleName",
                text: "角色名",
                field: "roleName",
                sort: false,
                textStyle: "left"
            },{
                width: 220,
                prop: "remark",
                text: "备注",
                field: "remark",
                sort: false,
                textStyle: "left"
            }
        ],
    }
  },
  components : {
    normalTable
  },
  created(){
    this.getRoles();
    let allData = {
        type :'all'
    }
    // 获取全部菜单
    getListMenu(allData).then((res)=>{
        this.menuList = res.data;
        this.modfiyMenuList = res.data;
        this.showMenuList = res.data;
    });
    if(_isMobile()){
        this.fullscreen = true;
    }
  },
  methods: {
    cancelRole(){
        this[this.currentDialog +'DialogVisible'] = false;
        this.currentDialog = ''
    },
    resetRole(formName){
      this.$refs[formName].resetFields();
    },
    beforeClose(done){
        this.$refs[this.currentDialog].resetFields();
        if(this[this.currentDialog +'DialogVisible']){
            this[this.currentDialog +'DialogVisible'] = false;
        }
        this.currentDialog = ''
    },
    filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
    },
      // 获取用户列表
    getRoles(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            roleName: this.roleName
        }
        this.loading = true;
        getRoleList(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
    },
    searchRole(){
        this.pageIndex = 1;
        this.getRoles();
    },
    handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        this.getUsers();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getUsers();
    },
    multipleSelection(val){
        this.multipleSelectData = val;
    },

    createdRole(){
        this.currentDialog = 'createForm'
        this.createFormDialogVisible = true;
    },
    async showRole(){
        if(!this.selectDataFliter('请选择一个角色进行查看','无法操作多角色，请选择一个角色')){
            return false;
        }  
        let menuInfo = await getRoleInfo(this.multipleSelectData[0].id);
        setTimeout(()=>{
            this.$refs.showTree.setCheckedKeys([]);
            this.$refs.showTree.setCheckedKeys(menuInfo.data.menuIdList)
        },10)
        this.showDialogVisible = true
        
    },
    async modifyRole(){
        if(!this.selectDataFliter('请选择一个角色进行修改','无法操作多角色，请选择一个角色')){
            return false;
        }  
        let menuInfo = await getRoleInfo(this.multipleSelectData[0].id);
        this.modifyForm.id = this.multipleSelectData[0].id;
        this.currentDialog = 'modifyForm';
        this.modifyForm.roleName = this.multipleSelectData[0].roleName;
        this.modifyForm.remark = this.multipleSelectData[0].remark;
        this.modifyForm.menuIdList = menuInfo.data.menuIdList;
        this.menuIdList = menuInfo.data.menuIdList;
        this.modifyFormDialogVisible =true;
        setTimeout(()=>{
            this.$refs.modifyTree.setCheckedKeys([]);
            this.$refs.modifyTree.setCheckedKeys(menuInfo.data.menuIdList)
        },10)
        
    },
    deleteRole(){
        if(!this.selectDataFliter('请选择一个角色进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该角色信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteRole(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.roleName  = '';
                this.getRoles();   
            });
        })
        .catch(() => {
            this.$message({
                type: "info",
                message: "已取消删除"
            });
        });
    },
    submitRole(formName){
        this.$refs[formName].validate(valid => {
                if (valid) {
                    let data;
                    let methods;
                    let message;
                    this.loadingFlag = true;
                    if(formName =='createForm'){
                        data = this.createForm;
                        if(this.$refs.createTree.getCheckedKeys()){
                            data.menuIdList = this.$refs.createTree.getCheckedKeys();
                        }else {
                            data.menuIdList = []
                        }
                        methods = createRole;
                        message = '创建成功';
                    }
                    if(formName =='modifyForm'){
                        data = this.modifyForm
                        if(this.$refs.modifyTree.getCheckedKeys()){
                            data.menuIdList = this.$refs.modifyTree.getCheckedKeys();
                        }else {
                            data.menuIdList = []
                        }
                        methods = updateRole;
                        message = '修改成功';
                    }
                    methods(data).then(async (res)=>{
                    this.$message({
                        type:'success',
                        message:message
                    });
                    this.pageIndex = 1;
                    this.roleName = '';
                    this.getRoles();
                    if(formName =='createForm'){
                        this.resetRole('createForm');
                        this.createFormDialogVisible = false;
                    }
                    if(formName =='modifyForm'){
                        this.resetRole('modifyForm');
                        this.modifyFormDialogVisible = false;
                    }
                    }).finally(()=>{
                        this.loadingFlag = false;
                    })
                }
            }
        )
    },
    // 提醒
    selectDataFliter(noSelectMsg,overSelectMsg){
        if(noSelectMsg && this.multipleSelectData.length == 0){
            this.$message({
                message: noSelectMsg,
                type: 'error'
            });
            return false;
        }
        if(overSelectMsg && this.multipleSelectData.length != 1){
            this.$message({
                message: overSelectMsg,
                type: 'warning'
            });
            return false;
        }
        return true;
    },
    // 过滤菜单
    filterMenu(data,list){
        data.forEach((element)=>{
            element.disabled = true
            if(element.list){
                this.filterMenu(element.list,list)
            }
        })
    }

  }
  
}
</script>

<style lang="scss" scoped>
.searchBox {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        .el-input{
            width: 200px;
            margin-right: 40px;
        }
    }
    .buttonBox {
        margin-bottom: 10px;
    }
    .dialog-title {
        border-left-width: 4px;
        border-left-color: deepskyblue;
        border-left-style: solid;
        padding-left: 10px;
        margin-bottom: 20px;
    }
</style>



