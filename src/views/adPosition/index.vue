<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdAdPosition">新增广告位</el-button>
            <el-button size="mini" type="primary" plain @click="modifyAdPosition">修改广告位</el-button>
            <el-button size="mini" type="primary" plain @click="deleteAdPosition">删除广告位</el-button>
        </el-button-group>
    </el-row>
    <normalTable :tableMd="20" :columns="columns"  :tableData="tableData" :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
    <!-- 创建用户 -->
    <el-dialog
        :visible.sync="formDialogVisible"
        :fullscreen="fullscreen"
        width="350px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">{{dialogTitle}}</div>
        <el-form ref="form"  :model="form" :rules="rules" label-width="120px">
            <el-form-item label="广告位名称：" prop="name">
                <el-input size="mini" v-model="form.name" clearable ></el-input>
            </el-form-item>
            <el-form-item label="广告位描述：" prop="description">
                <el-input size="mini"  v-model="form.description" clearable ></el-input>
            </el-form-item>
            <el-form-item label="高度："  prop="height" >
                <el-input size="mini" type="number" v-model="form.height" clearable ></el-input>
            </el-form-item>
            <el-form-item label="宽度："  prop="width">
                <el-input size="mini" type="number" v-model="form.width" clearable ></el-input>
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
import { createAdPosition,deleteAdPosition,getAdPosition,getAdPositionById,updateAdPosition } from '@/api/adPosition'
import normalTable from '@/components/NormalTable'
import { _isMobile } from '@/utils/tool'

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
                text: "广告位名字",
                field: "name",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "description",
                text: "广告位描述",
                field: "description",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "height",
                text: "高度",
                field: "height",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "width",
                text: "宽度",
                field: "width",
                sort: false,
                textStyle: "left"
            },
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户',
        form:{
            name:'',
            description:'',
            height:'',
            width:''
        },
        rules:{
            name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
            description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
            height: [{ required: true, message: '请输入高度', trigger: 'blur' }],
            width: [{ required: true, message: '请输入宽度', trigger: 'blur' }],
        },
        submitFlag:false,
        currentFlag:''
    }
  },
  components : {
    normalTable
  },
  methods: {
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
                    methods = createAdPosition;
                    msg = '创建成功'
                }

                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateAdPosition;
                    msg = "修改成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getAdPositions();
                    this.$refs.form.resetFields();
                    this.resetForm();
                    this.formDialogVisible= false;
                    this.currentFlag = '';
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
    createdAdPosition(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增广告位';
    },
    modifyAdPosition(){
        if(!this.selectDataFliter('请选择一个广告位进行修改','无法操作多广告位，请选择一个广告位')){
            return false;
        }
        for(var i in this.multipleSelectData[0]){
            this.form[i] = this.multipleSelectData[0][i];
        }
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改广告位';
    },
    deleteAdPosition(){
         if(!this.selectDataFliter('请选择一个广告位进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该广告位信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteAdPosition(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getAdPositions();   
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
        this.getAdPositions();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getAdPositions();
    },
    getAdPositions(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        getAdPosition(params).then((res)=>{
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

  },
  created(){
      this.getAdPositions();
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



