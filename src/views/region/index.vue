<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdRegion">新增区域</el-button>
            <el-button size="mini" type="primary" plain @click="modifyRegion">修改区域</el-button>
            <el-button size="mini" type="primary" plain @click="deleteRegion">删除区域</el-button>
        </el-button-group>
    </el-row>
    <TreeTable :treeStructure="true" :columns="columns" :dataSource="optionsData"></TreeTable>
     <normalTable :tableMd="20" :columns="columns"  :tableData="tableData" :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
       <!-- 创建用户 -->
    <el-dialog
        :visible.sync="formDialogVisible"
        :fullscreen="fullscreen"
        width="350px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">{{dialogTitle}}</div>
        <el-form ref="form"  :model="form" :rules="rules" label-width="120px">
            
            <el-form-item label="区域名字：" prop="name">
                <el-input size="mini" v-model="form.name" clearable ></el-input>
            </el-form-item>
            <el-form-item label="父级区域："  prop="parentId">
                <el-cascader
                    :options="optionsData"
                    v-model="selectedOptions"
                    :props="parentIdProps"  change-on-select
                    @change="handleChange">
                </el-cascader>
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
import { createRegion,deleteRegion,getRegion,getRegionById,updateRegion } from '@/api/region'
import normalTable from '@/components/NormalTable'
import { _isMobile } from '@/utils/tool'
import filters from '@/utils/filter'
import TreeTable from "@/components/treetable/vue/treegrid.vue";

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
                prop: "id",
                text: "区域id",
                field: "id",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "name",
                text: "区域名字",
                field: "name",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "parentId",
                text: "父级区域",
                field: "parentId",
                sort: false,
                textStyle: "left"
            },
 
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户',
        parentIdProps:{
            value:'id',
            label:'name'
        },
        selectedOptions:[],
        form:{
            name:'',
            parentId:''
        },
        rules:{
            name: [{ required: true, message: '请输入区域名字', trigger: 'blur' }],
            parentId: [{ required: true, message: '请选择父级区域', trigger: 'blur' }],
        },
        submitFlag:false,
        currentFlag:'',
        optionsData:[]
    }
  },
    components : {
    normalTable,
    TreeTable
  },
  created(){
      this.getRegions();
      this.getRegionsToOptions();
      if(_isMobile()){
        this.fullscreen = true;
    }
  },

  methods: {
    filterData(data){
        // 属性配置信息
        let attributes = {
            id: 'id',
            parentId: 'parentId',
        };
       
        this.optionsData = filters.toTreeData(data,attributes);
        this.optionsData.unshift({
            id:"0",
            name:'无'
        })
      
    },
    handleChange(value) {
        this.form.parentId = value[value.length-1]
    },
    submitForm(){
        this.$refs.form.validate(valid => {
            if (valid) {
                let data = this.form;
                let methods;
                let msg;
                this.submitFlag = true;
                if(this.currentFlag == 'create'){
                    methods = createRegion;
                    msg = '创建成功'
                }
 
                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateRegion;
                    msg = "修改成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getRegions();
                    await this.getRegionsToOptions();
                    this.$refs.form.resetFields();
                    this.formDialogVisible= false;
                    this.currentFlag = '';
                    this.selectedOptions = [];
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
        this.selectedOptions = []
    },
    beforeClose(done){
        for(var i in this.form){
            this.form[i] = ''
        }
        this.selectedOptions = []
        this.currentFlag = '';
        done();
    },
    createdRegion(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增区域';
    },
    modifyRegion(){
        if(!this.selectDataFliter('请选择一个区域进行修改','无法操作多区域，请选择一个区域')){
            return false;
        }
        for(var i in this.form){
            this.form[i] = this.multipleSelectData[0][i];
        }
        this.selectedOptions.push(this.multipleSelectData[0].parentId);
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改区域';
    },
    deleteRegion(){
        if(!this.selectDataFliter('请选择一个区域进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该区域信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteRegion(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getRegions();   
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
        this.getRegions();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getRegions();
    },
      // 获取区域列表分页
    getRegions(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            parentId:0
        }
        this.loading = true;
        getRegion(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
    },
    // 获取所有数据
    getRegionsToOptions(){
        let params = {
            displayAll:1
        }
        getRegion(params).then((res)=>{
            let data = res.data
            let template = [];
            data.records.forEach(ele=>{
                template.push(ele)
            })
            this.filterData(template)
        }) 
    },
    // 获取某个父级下的子集
    async getRegionsByParentId(id){
        let params = {
            displayAll:1
        }
        let result = await getRegion(params);
        let data = result.data;
         return data;
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



