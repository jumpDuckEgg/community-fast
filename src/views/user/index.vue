<template>
  <div class="app-container">
      <div class="searchBox">
        <el-input
            size="mini"
            placeholder="请输入用户名"
            prefix-icon="el-icon-search"
            v-model="userName">
        </el-input>
        <el-button size="mini" type="primary" plain @click="searchUser"  >搜索</el-button>
        </div>
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdUser">新增用户</el-button>
            <el-button size="mini" type="primary" plain @click="resetPassword">重置密码</el-button>
            <el-button size="mini" type="primary" plain @click="modifyUser">修改用户</el-button>
            <el-button size="mini" type="primary" plain @click="deleteUser">删除</el-button>
        </el-button-group>
    </el-row>
    <normalTable :tableMd="20" :columns="columns"  :tableData="tableData" :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
    <!-- 创建用户 -->
    <el-dialog
        :visible.sync="createFormDialogVisible"
        :fullscreen="fullscreen"
        width="350px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">新增用户</div>
        <el-form ref="createForm"  :model="createForm" :rules="createRules" label-width="90px">
            <el-form-item label="用户名：" prop="userName">
                <el-input size="mini" v-model="createForm.userName" clearable ></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input size="mini" v-model="createForm.password"  :type="password1" ref="password1">
                    <i class="el-icon-view el-input__icon" slot="suffix" @click="showPass('password1')" ></i>
                </el-input>
            </el-form-item>
            <el-form-item label="电话：" prop="mobile">
                <el-input size="mini" type="number" v-model="createForm.mobile" clearable ></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input size="mini" v-model="createForm.email" clearable ></el-input>
            </el-form-item>
            <el-form-item label="角色权限：" >
                <el-select v-model="createForm.roleIdList"   collapse-tags multiple placeholder="请选择">
                    <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitUser(currentDialog)" size="mini" v-loading='submitFlag'>确 定</el-button>
            <el-button @click="resetUser(currentDialog)" size="mini" type="danger" v-loading='submitFlag'>重 置</el-button>
        </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog
        :visible.sync="modifyFormDialogVisible"
        :fullscreen="fullscreen"
        width="350px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">修改用户</div>
        <el-form ref="modifyForm"  :model="modifyForm" :rules="modifyRules" label-width="90px">
            <el-form-item label="用户名：" prop="userName">
                <el-input size="mini" v-model="modifyForm.userName" clearable ></el-input>
            </el-form-item>
            <el-form-item label="电话：" prop="mobile">
                <el-input size="mini" type="number" v-model="modifyForm.mobile" clearable ></el-input>
            </el-form-item>
            <el-form-item label="邮箱：" prop="email">
                <el-input size="mini" v-model="modifyForm.email" clearable ></el-input>
            </el-form-item>
            <el-form-item label="角色权限：" >
                <el-select v-model="modifyForm.roleIdList"  collapse-tags multiple placeholder="请选择">
                    <el-option
                    v-for="item in roleList"
                    :key="item.id"
                    :label="item.roleName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitUser(currentDialog)" size="mini" v-loading='submitFlag'>确 定</el-button>
            <el-button @click="resetUser(currentDialog)" size="mini" type="danger" v-loading='submitFlag'>重 置</el-button>
        </span>
    </el-dialog>


  </div>
</template>

<script>

import normalTable from '@/components/NormalTable'
import { getUserList , getUserInfo , deleteUser , modifyPassWord , createUser ,updateUser ,resetPassWord } from '@/api/user'
import { _isMobile } from '@/utils/tool'
import { getRoleList } from '@/api/role'

import { validateMobile , validateEmail } from '@/utils/validate'

export default {
  data() {
    const validateMobileRules = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入手机号'));
        } else if (!validateMobile(value)) {
            callback(new Error('手机格式错误!'));
        }  else {
            callback();
        }
    };
    const validateEmailRules = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入邮箱'));
        } else if (!validateEmail(value)) {
            callback(new Error('邮箱格式错误!'));
        }  else {
            callback();
        }
    };
    return {
        pageIndex:1,//页码
        pageSize:10,//页数
        userName:'',//默认为空
        total:0,//数据总数
        currentPage:1,//当前页数
        columns: [
            {
                width: 220,
                prop: "userName",
                text: "用户名",
                field: "userName",
                sort: false,
                textStyle: "left"
            },{
                width: 220,
                prop: "mobile",
                text: "手机号码",
                field: "mobile",
                sort: false,
                textStyle: "left"
            },{
                width: 220,
                prop: "email",
                text: "邮箱",
                field: "email",
                sort: false,
                textStyle: "left"
            },{
                width: 220,
                prop: "createDate",
                text: "创建时间",
                field: "createDate",
                sort: 'custom',
                textStyle: "left"
            }
        ],
        tableData:[],
        loading:false,//表格加载状态
        multipleSelectData:[],//选中数据
        operationFlag:true,//操作状态
        createForm:{
            userName:'',
            password:'',
            mobile:'',
            email:'',
            roleIdList:[]
        },
        modifyForm:{
            userName:'',
            mobile:'',
            email:'',
            roleIdList:[]
        },
        id:'',
        createRules: {
            userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
            password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
            mobile:  [{ validator: validateMobileRules, trigger: 'blur' }],
            email:  [{ validator: validateEmailRules, trigger: 'blur' }]
        },
        modifyRules: {
            userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
            mobile:  [{ validator: validateMobileRules, trigger: 'blur' }],
            email:  [{ validator: validateEmailRules, trigger: 'blur' }]
        },
        createFormDialogVisible:false,
        fullscreen:false,
        submitFlag:false,
        currentDialog:'',
        modifyFormDialogVisible:false,
        password1:'password',
        roleList:[]
    }
  },
  components : {
    normalTable
  },
  created(){
    this.getUsers();
    if(_isMobile()){
        this.fullscreen = true;
    }
    let data = {
        pageIndex:1,
        pageSize:100
    }
    getRoleList(data).then(res=>{
        this.roleList = res.data.records;
    })
  },
  methods: {
    createdUser(){
        this.createFormDialogVisible = true;
        this.currentDialog = 'createForm'
    },  
    beforeClose(done){
        this.$refs[this.currentDialog].resetFields();
        if(this[this.currentDialog +'DialogVisible']){
            this[this.currentDialog +'DialogVisible'] = false;
        }
        this.currentDialog = ''
        done();
    },
    resetUser(form){
        this.$refs[form].resetFields();
    },
    resetPassword(){
        if(!this.selectDataFliter('请选择一个用户进行修改','无法操作多用户，请选择一个用户')){
            return false;
        }
        this.$confirm("此操作将重置该用户密码, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let id ;
            id = this.multipleSelectData[0].id;
            let data = {
                userId:id
            }
            resetPassWord(data).then(res => {
                this.$message({
                    type: "success",
                    message: "重置密码成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getUsers();   
            });
        })
        .catch(() => {
            this.$message({
                type: "info",
                message: "已取消重置"
            });
        });
    },
    async modifyUser(){
        if(!this.selectDataFliter('请选择一个用户进行修改','无法操作多用户，请选择一个用户')){
            return false;
        }
        let resultData = await getUserInfo(this.multipleSelectData[0].id);
        this.id = this.multipleSelectData[0].id;
        this.currentDialog = 'modifyForm';
        this.modifyForm.userName = this.multipleSelectData[0].userName;
        this.modifyForm.mobile = this.multipleSelectData[0].mobile;
        this.modifyForm.email = this.multipleSelectData[0].email;
        this.modifyForm.roleIdList = resultData.data.roleIdList;
        this.modifyFormDialogVisible = true;
    },
    deleteUser(){
        if(!this.selectDataFliter('请选择一个用户进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该用户信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteUser(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getUsers();   
            });
        })
        .catch(() => {
            this.$message({
                type: "info",
                message: "已取消删除"
            });
        });
    },

    searchUser(){
        this.pageIndex = 1;
        this.getUsers();
    },
    
    multipleSelection(val){
        this.multipleSelectData = val;
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
    submitUser(formName) {
        this.$refs[formName].validate(valid => {
            if (valid) {
                let data;
                let methods;
                let msg;
                this.submitFlag = true;
                if(this.currentDialog == 'createForm'){
                    data = this.createForm;
                    methods = createUser;
                    msg = '创建成功'
                }
                if(this.currentDialog == 'passwordForm'){
                    data = {
                        newPassword : this.passwordForm.newPassword,
                        password : this.passwordForm.password
                    }
                    methods = modifyPassWord;
                    msg = "修改密码成功";
                }
                if(this.currentDialog == 'modifyForm'){
                    data = Object.assign({},this.multipleSelectData[0],this.modifyForm)
                    methods = updateUser;
                    msg = "修改信息成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    await this.getUsers();
                    this.$refs[this.currentDialog].resetFields();
                    this[this.currentDialog +'DialogVisible'] = false;
                }).finally(()=>{
                    this.submitFlag = false;
                })
                
            }
        })
    },
    // 获取用户列表
    getUsers(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            userName: this.userName
        }
        this.loading = true;
        getUserList(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
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
    // 密码显影
    showPass(passwords) {
        if (this[passwords] === "password") {
            this[passwords] = "";
        } else {
            this[passwords] = "password";
        }
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

