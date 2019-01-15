<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdBoard">新增公告栏</el-button>
            <el-button size="mini" type="primary" plain @click="modifyBoard">修改公告栏</el-button>
            <el-button size="mini" type="primary" plain @click="deleteBoard">删除公告栏</el-button>
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
            <el-form-item label="公告栏名字：" prop="name">
                <el-input size="mini" v-model="form.name" clearable ></el-input>
            </el-form-item>
            <el-form-item label="公告内容：" prop="content">
                <el-input size="mini"  v-model="form.content" clearable ></el-input>
            </el-form-item>
            <el-form-item label="公告栏位置："  prop="position" >
                <el-select v-model="form.position" placeholder="请选择">
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
            <el-button type="primary" @click="submitForm()" size="mini" v-loading='submitFlag'>确 定</el-button>
            <el-button @click="resetForm()" size="mini" type="danger" v-loading='submitFlag'>重 置</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { createBoard,deleteBoard,getBoard,getBoardById,updateBoard } from '@/api/board'
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
                text: "公告栏名字",
                field: "name",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "content",
                text: "公告内容",
                field: "content",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "position",
                text: "公告栏位置",
                field: "position",
                sort: false,
                textStyle: "left",
                filter:'filterBoardType'
            }
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户',
        options:[
            {
            value:0,
            label:'首页'
            },
            {
            value:1,
            label:'市场'
            },
        ],
        form:{
            name:'',
            content:'',
            position:'',
        },
        rules:{
            name: [{ required: true, message: '请输入公告栏名字', trigger: 'blur' }],
            content: [{ required: true, message: '请输入公告内容', trigger: 'blur' }],
            position: [{ required: true, message: '请输入公告栏位置', trigger: 'blur' }]
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
                    methods = createBoard;
                    msg = '创建成功'
                }

                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateBoard;
                    msg = "修改成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getBoards();
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
    createdBoard(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增公告栏';
    },
    modifyBoard(){
        if(!this.selectDataFliter('请选择一个公告栏进行修改','无法操作多公告栏，请选择一个公告栏')){
            return false;
        }
        for(var i in this.multipleSelectData[0]){
            this.form[i] = this.multipleSelectData[0][i];
        }
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改公告栏';
    },
    deleteBoard(){
         if(!this.selectDataFliter('请选择一个公告栏进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该公告栏信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteBoard(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getBoards();   
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
        this.getBoards();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getBoards();
    },
    getBoards(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        getBoard(params).then((res)=>{
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
      this.getBoards();
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



