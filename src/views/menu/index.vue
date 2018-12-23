<template>
  <div class="app-container">
    <el-row class="" :gutter="30" v-loading="loadingFlag">
      <el-col :md="4">
        <el-input class="filterInput"
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree 
          :data="menuList" :highlight-current='highlight' :default-expand-all='expandAll' 
          :props="defaultProps" @check="handleCheck" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="tree">
          <span slot-scope="{ node, data }">
            <svg-icon v-if="node.icon" :icon-class="node.icon" />
            <span class="menuSize">{{ node.label }}</span>
          </span>
        </el-tree>
      </el-col>
      <el-col :md="20">
          <el-row  type="flex" justify="start">
              <el-button-group>
                  <el-button size="mini" type="primary" plain @click="addMenu('0')">添加目录</el-button>
                  <el-button size="mini" type="primary" plain @click="addMenu('1')">添加子菜单或子按钮</el-button>
                  <el-button size="mini" type="primary" plain @click="modifyMenu">修改</el-button>
                  <el-button size="mini" type="primary" plain @click="deleteMenu">删除</el-button>
              </el-button-group>
          </el-row>
          <el-row class="contentBox">
              <el-col class="dialog-title">菜单信息</el-col>
              <el-form ref="modifyForm" :inline="true" :model="menuForm" :rules="modifyRule" label-width="90px" >
                <el-form-item label="菜单名称:" prop="name">
                  <el-input size="small" v-model="menuForm.name" placeholder="请输入名称" :disabled="normalFlag"></el-input>
                </el-form-item>
                <el-form-item label="排序:" >
                  <el-input size="small" type="number" v-model="menuForm.orderNum" placeholder="输入排序号"  :disabled="normalFlag"></el-input>
                </el-form-item>
                <el-form-item label="父菜单:" prop="parentId">
                  <el-select size="small" v-model="menuForm.parentId" placeholder="请选择"  :disabled="parentFlag">
                    <el-option
                      v-for="item in parentOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="授权:" >
                  <el-select v-model="menuForm.perms" filterable  :disabled="normalFlag" multiple placeholder="请选择">
                    <el-option-group
                      v-for="(group,idx) in permissionData"
                      :key="group.name+idx"
                      :label="group.name">
                      <el-option
                        v-for="(item,index) in group.children"
                        :key="item.permission+index"
                        :label="item.name"
                        :value="item.permission">
                      </el-option>
                    </el-option-group>
                  </el-select>
                </el-form-item>
                <el-form-item label="菜单路径:" prop="url">
                  <el-input size="small" v-model="menuForm.url" placeholder="输入菜单路径"  :disabled="normalFlag"></el-input>
                </el-form-item>
                <el-form-item label="组件名称:" prop="component">
                  <el-input size="small" v-model="menuForm.component" placeholder="输入组件名称"  :disabled="normalFlag"></el-input>
                </el-form-item>
                <el-form-item label="图标:" >
                  <el-select filterable size="small" v-model="menuForm.icon" placeholder="请选择图标"  :disabled="normalFlag">
                    <el-option
                      v-for="item in iconData"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                       <span style="float: left">{{ item.label }}</span>
                       <span style="float: right"><svg-icon :icon-class="item.value" /></span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <div class="bottonBox" v-if="!normalFlag">  
                  <el-form-item >
                    <el-button size="small" type="primary" @click="submitMenu('modifyForm')" >修改</el-button>
                    <el-button  size="small" @click="cancelSubmit">取消</el-button>
                  </el-form-item>
                </div>
              </el-form>
          </el-row>
      </el-col>
    </el-row>
    <!-- 创建用户 -->
    <el-dialog
        :visible.sync="createFormDialogVisible"
        :fullscreen="fullscreen"
        width="650px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">{{formTitle}}</div>
        <el-form ref="createForm" :inline="true" :model="createForm" :rules="modifyRule" label-width="90px">
            <el-form-item label="菜单名称:" prop="name">
              <el-input size="small" v-model="createForm.name" placeholder="请输入名称" ></el-input>
            </el-form-item>
            <el-form-item label="排序:" >
              <el-input size="small" type="number" v-model="createForm.orderNum" placeholder="输入排序号"  ></el-input>
            </el-form-item>
            <el-form-item label="父菜单:" prop="parentId">
              <el-select size="small" v-model="createForm.parentId" placeholder="请选择"  >
                <el-option
                  v-for="item in createParentOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="授权:" >
              <el-select v-model="createForm.perms" filterable   multiple  placeholder="请选择">
                <el-option-group
                  v-for="(group,idx) in permissionData"
                  :key="group.name+idx"
                  :label="group.name">
                  <el-option
                    v-for="(item,index) in group.children"
                    :key="item.permission+index"
                    :label="item.name"
                    :value="item.permission">
                  </el-option>
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单路径:" prop="url">
              <el-input size="small" v-model="createForm.url" placeholder="输入菜单路径"  ></el-input>
            </el-form-item>
            <el-form-item label="组件名称:" prop="component">
              <el-input size="small" v-model="createForm.component" placeholder="输入组件名称"  ></el-input>
            </el-form-item>
            <el-form-item label="图标:" >
              <el-select filterable size="small" v-model="createForm.icon" placeholder="请选择图标"  >
                <el-option
                  v-for="item in iconData"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right"><svg-icon :icon-class="item.value" /></span>
                </el-option>
              </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitMenu('createForm')" size="mini">确 定</el-button>
            <el-button @click="resetMenu('createForm')" size="mini" type="danger" >重 置</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import { getListMenu ,updateMenu ,deleteMenu ,createMenu} from '@/api/menu'
import { ICON_JSON } from '@/utils/icon'
import { _isMobile } from '@/utils/tool'
import { getPermission } from '@/api/public'
export default {
  watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      },
      selectData(val) {
          this.normalFlag = true;
          this.parentFlag = true;
      }
    },
  data() {
    return {
      formTitle:'添加目录',
      fullscreen:false,
      createFormDialogVisible:false,
      iconData:[],
      loadingFlag:false,
      normalFlag:true,
      parentFlag:true,
      componentFlag:true, 
      expandAll:true,
      selectData:{},
      highlight:true,
      menuList:[],
      filterText: '',
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      menuForm:{
          name:'',
          orderNum:'',
          parentId:'',
          perms:[],
          url:'',
          component:'',
          icon:''
      },
      createForm:{
          name:'',
          orderNum:0,
          parentId:'',
          perms:[],
          url:'',
          component:'',
          icon:'',
          type:''
      },
      modifyRule:{
        name: [{ required: true, message: '请输入菜单名', trigger: 'blur' }],
        parentId: [{ required: true, message: '请选择父菜单', trigger: 'blur' }],
        url: [{ required: true, message: '请输入路径', trigger: 'blur' }],
        component: [{ required: true, message: '请输入组件', trigger: 'blur' }],
      },
      parentOptions: [],
      createParentOptions:[],
      rootParentOptions:[{
        id:'0',
        name:'无'
      }],
      checkedData:[],
      permissionData:[],

    }
  },
  created(){
    this.iconData = ICON_JSON;
    let allData = {
      type :'all'
    }
    // 获取全部菜单
    getListMenu(allData).then((res)=>{
      this.menuList = res.data;
    });
    if(_isMobile()){
        this.fullscreen = true;
    }
    // 获取权限
    getPermission().then((res)=>{
      this.permissionData = res.data;
    })
  },
  methods: {
      handleChange(value) {
        console.log(value);
      },
     async handleNodeClick(data) {
        this.selectData = data;
        if(this.selectData.type == 0){
            this.parentOptions = this.rootParentOptions;
        }
        if(this.selectData.type == 1){
           await this.getTypeMenu('0','edit');
        }
        if(this.selectData.type == 2){
           await this.getTypeMenu('1','edit');
        }
        this.menuForm.name = data.name;
        this.menuForm.component = data.component;
        this.menuForm.orderNum = data.orderNum;
        this.menuForm.url = data.url;
        this.menuForm.perms = data.perms?data.perms.split(','):[];
        this.menuForm.parentId = data.parentId;
        this.menuForm.icon = data.icon;
        
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.name.indexOf(value) !== -1;
      },
      getTypeMenu(type,status){
        let data = {
          type : type
        }
        // 获取类别菜单
        getListMenu(data).then((res)=>{
          if(status == 'edit') {
            this.parentOptions = res.data;
          }
          if(status == 'create') {
            this.createParentOptions = res.data;
            
          }
        });
      },
      modifyMenu(){
        console.log(this.selectData)
        if(!this.selectData.id){
          this.$message({
            type:'warning',
            message:'请从左边选择一个菜单进行编辑'
          })
          return false;
        }
        if(this.selectData.type != 0){
          this.parentFlag = false;
        }else {
          this.parentFlag = true;
        }
        if(this.normalFlag){
          this.normalFlag = false;
        }
      },
       submitMenu(formName){
         this.$refs[formName].validate(valid => {
            if (valid) {
                let data;
                let methods;
                let message;
                this.loadingFlag = true;
                if(formName =='createForm'){
                    data = this.createForm;
                    data.perms = data.perms.join(",")
                    methods = createMenu;
                    message = '创建成功';
                }
                if(formName =='modifyForm'){
                    data = Object.assign({},this.selectData,this.menuForm);
                    data.perms = data.perms.join(",")
                    methods = updateMenu;
                    message = '修改成功';
                }
                methods(data).then(async (res)=>{
                  this.$message({
                    type:'success',
                    message:message
                  });
                  if(formName =='createForm'){
                    this.resetMenu('createForm');
                    this.createFormDialogVisible = false;
                  }
                  if(formName =='modifyForm'){
                    this.normalFlag = true;
                    this.parentFlag = true;
                    this.resetSelectData();
                  }
                  let allData = {
                    type :'all'
                  }
                  // 获取全部菜单
                  getListMenu(allData).then((res)=>{
                    this.menuList = res.data;
                  });
                }).finally(()=>{
                  this.loadingFlag = false;
                })
            }
        })
        
      },
      cancelSubmit(){
        this.normalFlag = true;
        this.parentFlag = true;
        for(var i in this.menuForm){
          this.menuForm[i] = this.selectData[i];
        }
      },
      handleCheck(data, checkedData) {
        this.checkedData = checkedData.checkedNodes;
      },
      deleteMenu(){
        if(!this.selectData.id){
          this.$message({
            type:'warning',
            message:'请从左边选择一个菜单进行删除'
          })
          return false;
        }
        this.$confirm("此操作将永久删除该菜单信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            deleteMenu(this.selectData.id).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                for(var i in this.menuForm){
                  this.menuForm[i]=''
                }
                this.resetSelectData();
            });
        })
        .catch(() => {
            this.$message({
                type: "info",
                message: "已取消删除"
            });
        });

      },
      resetSelectData(){
        this.selectData = {};
        let allData = {
          type :'all'
        }
        // 获取全部菜单
        getListMenu(allData).then((res)=>{
          this.menuList = res.data;
        })
      },
    beforeClose(done){
        this.$refs.createForm.resetFields();
        done();
    },
    resetMenu(formName){
      this.$refs[formName].resetFields();
      this[formName].perms = []
    },
    addMenu(type){
      if(type == 0){
        this.formTitle = '添加目录';
        this.createParentOptions = this.rootParentOptions;
        this.createForm.type=0;
      }
      if(type == 1){
        if(this.selectData.type == 2){
         this.$message({
           type:'error',
           message:'无法添加按钮子级'
         })
         return false;
        }
        if(this.selectData.type == 0){
          this.formTitle = "添加菜单";
          this.createForm.type=1;
          this.getTypeMenu('0','create');
        }
        if(this.selectData.type == 1){
          this.formTitle = '添加按钮';
          this.createForm.type=2;
          this.getTypeMenu('1','create');
        }

      }
      this.createFormDialogVisible = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.filterInput {
  margin-bottom: 20px;
}
.contentBox {
  margin-top: 20px;
  border: 1px solid #b3d8ff;
  padding:20px 10px;
  padding-bottom: 0;
  border-radius: 6px;
}
.bottonBox {
  text-align: center;
}
.menuSize {
  font-size: 15px;
}
.dialog-title {
    border-left-width: 4px;
    border-left-color: deepskyblue;
    border-left-style: solid;
    padding-left: 10px;
    margin-bottom: 20px;
}
</style>



