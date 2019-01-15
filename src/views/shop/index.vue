<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdShop">新增商家</el-button>
            <el-button size="mini" type="primary" plain @click="modifyShop">修改商家</el-button>
            <el-button size="mini" type="primary" plain @click="deleteShop">删除商家</el-button>
        </el-button-group>
    </el-row>
    <normalTable :tableMd="20" :columns="columns"  :tableData="tableData" :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
    <!-- 创建用户 -->
    <el-dialog
        :visible.sync="formDialogVisible"
        :fullscreen="fullscreen"
        width="760px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">{{dialogTitle}}</div>
        <el-form ref="form" :inline="inline" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="店铺名字：" prop="name">
                <el-input size="mini" v-model="form.name" clearable ></el-input>
            </el-form-item>
            <el-form-item label="商家地址：" prop="address">
                <el-input size="mini" v-model="form.address" clearable ></el-input>
            </el-form-item>
            <el-form-item label="营业执照编码：" prop="businessCode">
                <el-input size="mini"  v-model="form.businessCode" clearable ></el-input>
            </el-form-item>
            <el-form-item label="营业时间：" prop="startDate">
              <el-time-picker size="mini"
                v-model="form.startDate"
                arrow-control value-format="hh:mm:ss"
                placeholder="选择营业时间">
              </el-time-picker>
            </el-form-item>  
            <el-form-item label="营业结束时间：" prop="endDate">
              <el-time-picker size="mini"
                v-model="form.endDate"
                arrow-control value-format="hh:mm:ss"
                placeholder="选择营业结束时间">
              </el-time-picker>
            </el-form-item>
            <el-form-item label="状态：" prop="level">
                <el-input size="mini" type="number" v-model="form.status" clearable ></el-input>
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseUrl">
              <upload :fileList.sync="fileList" :buttonFlag="buttonFlag" :listType="listType" :limitFlieNumber='limitFlieNumber'></upload>
            </el-form-item> 
            <el-form-item label="logo地址" prop="logoUrl">
              <upload2 :fileList.sync="fileList2" :buttonFlag="buttonFlag2" :listType="listType2" :limitFlieNumber='limitFlieNumber2'></upload2>
            </el-form-item> 
            <el-form-item label="等级：" prop="level">
                <el-input size="mini" type="number" v-model="form.level" clearable ></el-input>
            </el-form-item>
            <el-form-item label="分数：" prop="score">
                <el-input size="mini"  type="number"  v-model="form.score" clearable ></el-input>
            </el-form-item>
            <el-form-item label="包装分数：" prop="scorePack">
                <el-input size="mini"  type="number"  v-model="form.scorePack" clearable ></el-input>
            </el-form-item>
            <el-form-item label="口味分数：" prop="scoreTaste">
                <el-input size="mini"   type="number" v-model="form.scoreTaste" clearable ></el-input>
            </el-form-item>
            <el-form-item label="用户id：" prop="ownUserId">
                <el-select size="mini" filterable  v-model="form.ownUserId" placeholder="请选择">
                    <el-option 
                    v-for="item in userOptions"
                    :key="item.id" filterable
                    :label="item.userName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="标签：">
                <el-tag  :key="index"   v-for="(tag,index) in form.label"    closable    :disable-transitions="false"    @close="handleClose(tag)">
                {{tag}}
                </el-tag>
                <el-input  class="input-new-tag"   v-if="inputVisible"  v-model="inputValue"  ref="saveTagInput"    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm()" size="mini" v-loading='submitFlag'>确 定</el-button>
            <el-button @click="resetForm()" size="mini" type="danger" v-loading='submitFlag'>重 置</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { createShop,deleteShop,getShop,getShopById,updateShop } from '@/api/shop'
import normalTable from '@/components/NormalTable'
import { _isMobile } from '@/utils/tool'
import { getUserList } from '@/api/user'
import upload from '@/components/UpLoad'

export default {
  data() {
    return {
        pageIndex:1,//页码
        pageSize:10,//页数
        total:0,//数据总数
        currentPage:1,//当前页数
        loading:false,//表格状态
        tableData:[],//表格数据
        multipleSelectData:[],//选中数据
        columns: [
            {
                width: 220,
                prop: "name",
                text: "店铺名字",
                field: "name",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "ownUserId",
                text: "用户id",
                field: "ownUserId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "address",
                text: "店铺地址",
                field: "address",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "businessCode",
                text: "营业执照编码",
                field: "businessCode",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "startDate",
                text: "营业时间",
                field: "startDate",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "endDate",
                text: "营业结束时间",
                field: "endDate",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "businessLicenseUrl",
                text: "营业执照",
                field: "businessLicenseUrl",
                sort: false,
                textStyle: "center",
                type:'picture'
            },
            {
                width: 120,
                prop: "status",
                text: "状态",
                field: "status",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "logoUrl",
                text: "logo地址",
                field: "logoUrl",
                sort: false,
                textStyle: "center",
                type:'picture'
            },
            {
                width: 120,
                prop: "label",
                text: "标签",
                field: "label",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "level",
                text: "等级",
                field: "level",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "score",
                text: "分数",
                field: "score",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "scorePack",
                text: "包装分数",
                field: "scorePack",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "scoreTaste",
                text: "口味分数",
                field: "scoreTaste",
                sort: false,
                textStyle: "left"
            }
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户',
        inline:true,
        form:{
            name:'',
            address:'',
            businessCode:'',
            startDate:'',
            endDate:'',
            businessLicenseUrl:'',
            logoUrl:'',
            level:'',
            score:'',
            scorePack:'',
            scoreTaste:'',
            ownUserId:'',
            label:[],
            status:''
        },
        rules:{
            name: [{ required: true, message: '请输入商家名字', trigger: 'blur' }],
            address: [{ required: true, message: '请输入商家地址', trigger: 'blur' }],
            businessCode: [{ required: true, message: '请输入营业执照编码', trigger: 'blur' }],
            startDate: [{ required: true, message: '请选择营业时间', trigger: 'blur' }],
            endDate: [{ required: true, message: '请选择营业结束时间', trigger: 'blur' }],
            businessLicenseUrl: [{ required: true, message: '请上传营业执照', trigger: 'blur' }],
            logoUrl: [{ required: true, message: '请上传商家logo', trigger: 'blur' }],
            level: [{ required: true, message: '请输入等级', trigger: 'blur' }],
            score: [{ required: true, message: '请输入分数', trigger: 'blur' }],
            scorePack: [{ required: true, message: '请输入包装等级', trigger: 'blur' }],
            scoreTaste: [{ required: true, message: '请输入口味分数', trigger: 'blur' }],
            ownUserId: [{ required: true, message: '请选择用户id', trigger: 'blur' }],
            status: [{ required: true, message: '请输入状态', trigger: 'blur' }],
        },
        submitFlag:false,
        currentFlag:'',
        // 上传文件组件
        fileList:[],
        limitFlieNumber:1,
        listType:'picture',
        buttonFlag:false,
        fileList2:[],
        limitFlieNumber2:1,
        listType2:'picture',
        buttonFlag2:false,

        userOptions:[],
        inputVisible: false,
        inputValue: ''
    }
  },
  components : {
    normalTable,
    upload,
    upload2:upload,
  },
   watch:{
    fileList:function (newValue,oldValue) {
        if(newValue.length!=0){
          if(!newValue[0].type){
              this.form.businessLicenseUrl = newValue[0].response.data.url;
          }
        }else {
          this.form.businessLicenseUrl = ''
        }
    },
    fileList2:function (newValue,oldValue) {
        if(newValue.length!=0){
          if(!newValue[0].type){
              this.form.logoUrl = newValue[0].response.data.url;
          }
        }else {
          this.form.logoUrl = ''
        }
    }
  },
  methods: {
    //标签组件
    handleClose(tag) {
        this.form.label.splice(this.form.label.indexOf(tag), 1);
    },

    showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
        });
    },

    handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
            this.form.label.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
    },
    //
    submitForm(){
        this.$refs.form.validate(valid => {
            if (valid) {
                let data = {};
                for(let key in this.form){
                    data[key] = this.form[key]
                }
                let methods;
                let msg;
                this.submitFlag = true;
                if(this.currentFlag == 'create'){
                    methods = createShop;
                    msg = '创建成功'
                }

                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateShop;
                    msg = "修改成功";
                }
                let template = [];
                data.label.forEach(ele=>{
                    template.push(ele)
                })
                data.label = template.join(',');
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getShops();
                    this.$refs.form.resetFields();
                    this.resetForm();
                    this.formDialogVisible= false;
                    this.currentFlag = '';
                    this.fileList = [];
                    this.fileList2 = [];
                }).finally(()=>{
                    this.submitFlag = false;
                })
            }
        })
    },
    resetForm(){
        for(var i in this.form){
            this.form[i] = ''
        }
        this.fileList = [];
        this.fileList2 = [];
    },
    beforeClose(done){
        for(var i in this.form){
            this.form[i] = ''
        }
        this.fileList = [];
        this.fileList2 = [];
        this.currentFlag = '';
        done();
    },
    createdShop(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增商家';
    },
    modifyShop(){
        if(!this.selectDataFliter('请选择一个商家进行修改','无法操作多商家，请选择一个商家')){
            return false;
        }
        for(var i in this.multipleSelectData[0]){
            this.form[i] = this.multipleSelectData[0][i];
        }
        console.log(this.form.businessLicenseUrl)
        this.fileList.push({
          url:this.form.businessLicenseUrl,
          type:'finish',
          name:'图片'
        });
        this.fileList2.push({
          url:this.form.logoUrl,
          type:'finish',
          name:'图片'
        });
        this.form.label =  this.multipleSelectData[0].label.split(",");
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改商家';
    },
    deleteShop(){
         if(!this.selectDataFliter('请选择一个商家进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该商家信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteShop(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getShops();   
            });
        })
        .catch(() => {
            this.$message({
                type: "info",
                message: "已取消删除"
            });
        });
    },
    multipleSelection(val){
        this.multipleSelectData = val;
    },
    handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        this.getShops();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getShops();
    },
    getShops(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        getShop(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
    },
    getUsers(){
        let params = {
            displayAll:1
        }
        getUserList(params).then((res)=>{
            let data = res.data
            this.userOptions = data.records;
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

  },
  created(){
      this.getShops();
      this.getUsers();
      if(_isMobile()){
        this.fullscreen = true;
    }
  },
  
}
</script>

<style lang="scss" scoped>
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



