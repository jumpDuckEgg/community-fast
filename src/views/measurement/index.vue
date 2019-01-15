<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdMethod">新增计量单位</el-button>
            <el-button size="mini" type="primary" plain @click="modifyMethod">修改计量单位</el-button>
            <el-button size="mini" type="primary" plain @click="deleteMethod">删除计量单位</el-button>
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
            <el-form-item label="计量单位名字：" prop="name">
                <el-input size="mini" v-model="form.name" clearable ></el-input>
            </el-form-item>
            <el-form-item label="最小的值：" prop="minValue">
                <el-input size="mini" type="number"  v-model="form.minValue" clearable ></el-input>
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
import { createMeasurement,deleteMeasurement,getMeasurement,getMeasurementById,updateMeasurement } from '@/api/measurement'
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
                text: "计量单位名字",
                field: "name",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "minValue",
                text: "最小的值",
                field: "minValue",
                sort: false,
                textStyle: "left"
            }
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户',
        form:{
            name:'',
            minValue:'',
        },
        rules:{
            name: [{ required: true, message: '请输入计量单位名字', trigger: 'blur' }],
            minValue: [{ required: true, message: '请输入最小的值', trigger: 'blur' }]
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
                    methods = createMeasurement;
                    msg = '创建成功'
                }

                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateMeasurement;
                    msg = "修改成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getMeasurements();
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
    createdMethod(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增计量单位';
    },
    modifyMethod(){
        if(!this.selectDataFliter('请选择一个计量单位进行修改','无法操作多计量单位，请选择一个计量单位')){
            return false;
        }
        for(var i in this.multipleSelectData[0]){
            this.form[i] = this.multipleSelectData[0][i];
        }
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改计量单位';
    },
    deleteMethod(){
         if(!this.selectDataFliter('请选择一个计量单位进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该计量单位信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteMeasurement(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getMeasurements();   
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
        this.getMeasurements();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getMeasurements();
    },
    getMeasurements(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        getMeasurement(params).then((res)=>{
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
      this.getMeasurements();
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



