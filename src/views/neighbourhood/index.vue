<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdNeighbourhood">新增小区</el-button>
            <el-button size="mini" type="primary" plain @click="modifyNeighbourhood">修改小区</el-button>
            <el-button size="mini" type="primary" plain @click="deleteNeighbourhood">删除小区</el-button>
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
            <el-form-item label="地址：" prop="address">
                <el-input size="mini" v-model="form.address" clearable ></el-input>
            </el-form-item>
            <el-form-item label="小区编码：" prop="code">
                <el-input size="mini" v-model="form.code" clearable ></el-input>
            </el-form-item>
            <el-form-item label="小区名字：" prop="name">
                <el-input size="mini" v-model="form.name" clearable ></el-input>
            </el-form-item>
            <el-form-item label="经度："  >
                <el-input size="mini" v-model="form.x" clearable ></el-input>
            </el-form-item>
            <el-form-item label="纬度：" >
                <el-input size="mini" v-model="form.y" clearable ></el-input>
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
import { createNeighbourhood,deleteNeighbourhood,getNeighbourhood,getNeighbourhoodById,updateNeighbourhood } from '@/api/neighbourhood'
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
                prop: "address",
                text: "小区地址",
                field: "address",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "code",
                text: "小区编码",
                field: "code",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "name",
                text: "小区名字",
                field: "name",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "x",
                text: "经度",
                field: "x",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "y",
                text: "纬度",
                field: "y",
                sort: false,
                textStyle: "left"
            },
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户',
        form:{
            address:'',
            code:'',
            name:'',
            x:'',
            y:''
        },
        rules:{
            address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
            code: [{ required: true, message: '请输入小区编码', trigger: 'blur' }],
            name: [{ required: true, message: '请输入小区名字', trigger: 'blur' }],
        },
        submitFlag:false,
        currentFlag:''
    }
  },
    components : {
    normalTable
  },
  created(){
      this.getNeighbourhoods();
      if(_isMobile()){
        this.fullscreen = true;
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
                    methods = createNeighbourhood;
                    msg = '创建成功'
                }
 
                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateNeighbourhood;
                    msg = "修改成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getNeighbourhoods();
                    this.$refs.form.resetFields();
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
    createdNeighbourhood(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增小区';
    },
    modifyNeighbourhood(){
        if(!this.selectDataFliter('请选择一个小区进行修改','无法操作多小区，请选择一个小区')){
            return false;
        }
        for(var i in this.form){
            this.form[i] = this.multipleSelectData[0][i];
        }
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改小区';
    },
    deleteNeighbourhood(){
        if(!this.selectDataFliter('请选择一个小区进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该小区信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteNeighbourhood(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getNeighbourhoods();   
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
        this.getNeighbourhoods();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getNeighbourhoods();
    },
      // 获取小区列表
    getNeighbourhoods(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        getNeighbourhood(params).then((res)=>{
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
  }
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



