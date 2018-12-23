<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar @modifyPassword="modifyPassword"/>
      <app-main/>
    </div>
    <!-- 修改密码 -->
    <el-dialog
        :visible.sync="passwordFormDialogVisible"
        :fullscreen="fullscreen"
        width="350px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">修改密码</div>
        <el-form ref="passwordForm"  :model="passwordForm" :rules="passwordRules" label-width="100px">
            <el-form-item label="旧密码：" prop="password">
                <el-input size="mini" v-model="passwordForm.password"  :type="password2" ref="password2">
                    <i class="el-icon-view el-input__icon" slot="suffix" @click="showPass('password2')"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="新密码：" prop="newPassword">
                <el-input size="mini" v-model="passwordForm.newPassword"  :type="password3" ref="password3">
                    <i class="el-icon-view el-input__icon" slot="suffix" @click="showPass('password3')"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="确认新密码：" prop="checkPassword">
                <el-input size="mini" v-model="passwordForm.checkPassword" :type="password4" ref="password4">
                    <i class="el-icon-view el-input__icon" slot="suffix" @click="showPass('password4')"></i>
                </el-input>
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
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { modifyPassWord } from '@/api/user'
import { _isMobile } from '@/utils/tool'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  data(){
    const validatCheckPass = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'));
        } else if (value !== this.passwordForm.newPassword) {
            callback(new Error('两次输入密码不一致!'));
        }  else {
            callback();
        }
    };
    return {
      passwordFormDialogVisible:false,
      fullscreen:false,
      currentDialog:'passwordForm',
      submitFlag:false,
      password2:'password',
      password3:'password',
      password4:'password',
      passwordForm:{
          newPassword:'',
          password:'',
          checkPassword:''
      },
      passwordRules: {
          newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
          password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
          checkPassword: [{ validator: validatCheckPass, trigger: 'blur' }]
      },
    }
  },
  created(){
    if(_isMobile()){
        this.fullscreen = true;
    }
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile',
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    },
    modifyPassword(){
      this.passwordFormDialogVisible = true;
    },
    beforeClose(done){
        this.$refs[this.currentDialog].resetFields();
        done();
    },
    resetUser(form){
        this.$refs[form].resetFields();
    },
    submitUser(formName) {
        this.$refs[formName].validate(valid => {
            if (valid) {
                let data;
                let methods;
                let msg;
                this.submitFlag = true;
                if(this.currentDialog == 'passwordForm'){
                    data = {
                        newPassword : this.passwordForm.newPassword,
                        password : this.passwordForm.password
                    }
                    methods = modifyPassWord;
                    msg = "修改密码成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.$refs[this.currentDialog].resetFields();
                    this[this.currentDialog +'DialogVisible'] = false;
                    this.$store.dispatch('LogOut').then(() => {
                      location.reload() // 为了重新实例化vue-router对象 避免bug
                    })
                }).finally(()=>{
                    this.submitFlag = false;
                })
                
            }
        })
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

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
