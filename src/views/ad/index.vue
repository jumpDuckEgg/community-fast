<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdAd">新增广告</el-button>
            <el-button size="mini" type="primary" plain @click="modifyAd">修改广告</el-button>
            <el-button size="mini" type="primary" plain @click="deleteAd">删除广告</el-button>
        </el-button-group>
    </el-row>
    <normalTable :tableMd="20" :columns="columns"  :tableData="tableData" :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
    <!-- <upload :fileList.sync="fileList" :listType="listType" :limitFlieNumber='limitFlieNumber'></upload> -->
    <!-- 创建用户 -->
    <el-dialog
        :visible.sync="formDialogVisible"
        :fullscreen="fullscreen" 
        width="800px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">{{dialogTitle}}</div>
        <el-form ref="form"  :inline="inline" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="广告名字：" prop="name">
                <el-input size="mini" v-model="form.name" clearable ></el-input>
            </el-form-item>
            <el-form-item label="广告内容：" prop="content">
                <el-input size="mini"  v-model="form.content" clearable ></el-input>
            </el-form-item>
            <el-form-item label="广告位ID："  prop="adPositionId" >
                <el-select size="mini" v-model="form.adPositionId" placeholder="请选择">
                    <el-option 
                    v-for="item in adPositionOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开始时间" prop="startTime">
              <el-date-picker size="mini"
                v-model="form.startTime"
                type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择开始时间">
              </el-date-picker>
            </el-form-item>  
            <el-form-item label="结束时间" prop="endTime">
              <el-date-picker size="mini"
                v-model="form.endTime"
                type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="上传广告图片" prop="imageUrl">
              <upload :fileList.sync="fileList" :buttonFlag="buttonFlag" :listType="listType" :limitFlieNumber='limitFlieNumber'></upload>
            </el-form-item>  
            <el-form-item label="超链接" >
                <el-input size="mini" v-model="form.link" clearable ></el-input>
            </el-form-item>
            <el-form-item label="广告类型："  prop="mediaType" >
                <el-select size="mini" v-model="form.mediaType" placeholder="请选择">
                    <el-option 
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm()" size="mini" :disabled="buttonFlag" v-loading='submitFlag'>确 定</el-button>
            <el-button @click="resetForm()" size="mini" type="danger" :disabled="buttonFlag" v-loading='submitFlag'>重 置</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { createAd,deleteAd,getAd,getAdById,updateAd } from '@/api/ad'
import { getAdPosition } from '@/api/adPosition'
import normalTable from '@/components/NormalTable'
import { _isMobile } from '@/utils/tool'
import upload from '@/components/UpLoad'

export default {
  data() {
    return {
      inline:true,
      // 上传文件组件
      fileList:[],
      limitFlieNumber:1,
      listType:'text',
      buttonFlag:false,
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
                prop: "adPositionId",
                text: "广告位id",
                field: "adPositionId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "name",
                text: "名字",
                field: "name",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "content",
                text: "内容",
                field: "content",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "startTime",
                text: "开始时间",
                field: "startTime",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "endTime",
                text: "结束时间",
                field: "endTime",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "imageUrl",
                text: "图片地址",
                field: "imageUrl",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "mediaType",
                text: "广告类型",
                field: "mediaType",
                sort: false,
                textStyle: "left"
            }
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户',
        adPositionOptions:[],
        options:[
            {
            value:0,
            label:'图片'
            }
        ],
        form:{
            adPositionId:'',
            content:'',
            name:'',
            startTime:'',
            endTime:'',
            imageUrl:'',
            link:'',
            mediaType:'',
        },
        rules:{
            adPositionId: [{ required: true, message: '请选择广告位', trigger: 'blur' }],
            content: [{ required: true, message: '请输入广告位内容', trigger: 'blur' }],
            name: [{ required: true, message: '请输入名字', trigger: 'blur' }],
            startTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
            endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
            mediaType: [{ required: true, message: '请选择广告类型', trigger: 'blur' }],
            imageUrl: [{ required: true, message: '图片地址不能为空', trigger: 'blur' }],
        },
        submitFlag:false,
        currentFlag:''
    }
  },
  components : {
    normalTable,
    upload
  },
  watch:{
    fileList:function (newValue,oldValue) {
        if(newValue.length!=0){
          if(!newValue[0].type){
              this.form.imageUrl = newValue[0].response.data.url;
          }
        }else {
          this.form.imageUrl = ''
        }
    }
  },
  methods: {
    submitForm(){
        this.$refs.form.validate(valid => {
            if (valid) {
                let data = this.form;
                let methods;
                let msg;
                this.submitFlag = true;
                if(this.currentFlag == 'create'){
                    methods = createAd;
                    msg = '创建成功'
                }

                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateAd;
                    msg = "修改成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getAds();
                    this.$refs.form.resetFields();
                    this.resetForm();
                    this.formDialogVisible= false;
                    this.currentFlag = '';
                    this.fileList = [];
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
    },
    beforeClose(done){
        for(var i in this.form){
            this.form[i] = ''
        }
        this.currentFlag = '';
        done();
    },
    createdAd(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增广告';
    },
    modifyAd(){
        if(!this.selectDataFliter('请选择一个广告进行修改','无法操作多广告，请选择一个广告')){
            return false;
        }
        for(var i in this.form){
            this.form[i] = this.multipleSelectData[0][i];
        }
        this.fileList.push({
          imageUrl:this.form.imageUrl,
          type:'finish'
        });
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改广告';
    },
    deleteAd(){
         if(!this.selectDataFliter('请选择一个广告进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该广告信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteAd(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getAds();   
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
        this.getAds();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getAds();
    },
    getAds(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        getAd(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
    },
    getAdPositions(){
        let params = {
            pageIndex: 1,
            pageSize: 100
        }
        getAdPosition(params).then((res)=>{
            let data = res.data
            this.adPositionOptions = data.records;
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
      this.getAds();
      this.getAdPositions();
      if(_isMobile()){
        this.fullscreen = true;
    }
  },
}
</script>

<style lang="scss" scoped>

</style>



