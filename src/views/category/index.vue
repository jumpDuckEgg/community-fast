<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdCategory">新增分类</el-button>
            <el-button size="mini" type="primary" plain @click="modifyCategory">修改分类</el-button>
            <el-button size="mini" type="primary" plain @click="deleteCategory">删除分类</el-button>
        </el-button-group>
    </el-row>
    <TreeTable @findChildren="findChildren" :changeFlag.sync="changeFlag" :treeStructure="true" :columns="columns" :dataSource="tableData"  :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></TreeTable>
       <!-- 创建用户 -->
    <el-dialog
        :visible.sync="formDialogVisible"
        :fullscreen="fullscreen"
        width="800px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">{{dialogTitle}}</div>
        <el-form ref="form" :inline="inline" :model="form" :rules="rules" label-width="120px">
            
            <el-form-item label="分类名字：" prop="name">
                <el-input size="mini" v-model="form.name" clearable ></el-input>
            </el-form-item>
            <el-form-item label="父级分类："  prop="parentId">
                <el-cascader
                    :options="optionsData"
                    v-model="selectedOptions"
                    :props="parentIdProps"  change-on-select
                    @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item label="分类介绍：">
                <el-input size="mini" v-model="form.description" clearable ></el-input>
            </el-form-item>
            <el-form-item label="分类关键词："  prop="keywords">
                <el-input size="mini" v-model="form.keywords" clearable ></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="iconUrl">
              <upload :fileList.sync="fileList" :buttonFlag="buttonFlag" :listType="listType" :limitFlieNumber='limitFlieNumber'></upload>
            </el-form-item> 
            <el-form-item label="分类主图" prop="imgUrl">
              <upload2 :fileList.sync="fileList2" :buttonFlag="buttonFlag2" :listType="listType2" :limitFlieNumber='limitFlieNumber2'></upload2>
            </el-form-item> 
            <el-form-item label="显示在首页："  prop="keywords">
                 <el-select v-model="form.showIndex" placeholder="请选择">
                    <el-option
                    v-for="item in showOptions" size="mini"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="排序" >
                <el-input size="mini" type="number" v-model="form.sortOrder" clearable ></el-input>
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
import { createCategory,deleteCategory,getCategory,getCategoryById,updateCategory } from '@/api/category'
import { _isMobile } from '@/utils/tool'
import filters from '@/utils/filter'
import TreeTable from "@/components/treetable/vue/treegrid.vue";
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
                prop: "id",
                text: "分类id",
                field: "id",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "name",
                text: "分类名字",
                field: "name",
                sort: false,
                textStyle: "left"
            },
            // {
            //     width: 120,
            //     prop: "parentId",
            //     text: "父级分类",
            //     field: "parentId",
            //     sort: false,
            //     textStyle: "left"
            // },   
            {
                width: 120,
                prop: "description",
                text: "分类描述",
                field: "description",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "keywords",
                text: "分类关键字",
                field: "keywords",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "showIndex",
                text: "是否显示在主页",
                field: "showIndex",
                sort: false,
                textStyle: "left",
                filter:'filterBoolean'
            },
            {
                width: 120,
                prop: "sortOrder",
                text: "排序",
                field: "sortOrder",
                sort: false,
                textStyle: "left"
            },
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增分类',
        parentIdProps:{
            value:'id',
            label:'name'
        },
        selectedOptions:[],
        showOptions:[
            {
            value: 0,
            label: '否'
            },
            {
            value: 1,
            label: '是'
            }
        ],
        inline:true,
        form:{
            name:'',
            parentId:'',
            description:'',
            keywords:'',
            showIndex:'',
            sortOrder:0,
            iconUrl:'',
            imgUrl:''
        },
        rules:{
            name: [{ required: true, message: '请输入分类名字', trigger: 'blur' }],
            parentId: [{ required: true, message: '请选择父级分类', trigger: 'blur' }],
            keywords:[{ required: true, message: '请输入关键字', trigger: 'blur' }],
            showIndex:[{ required: true, message: '请选择显示', trigger: 'blur' }],
            iconUrl:[{ required: true, message: '请上传图标', trigger: 'blur' }],
            imgUrl:[{ required: true, message: '请上传分类主图', trigger: 'blur' }],
        },
        submitFlag:false,
        currentFlag:'',
        optionsData:[],
        changeFlag:false,
        // 上传文件组件
        fileList:[],
        limitFlieNumber:1,
        listType:'text',
        buttonFlag:false,
        fileList2:[],
        limitFlieNumber2:1,
        listType2:'text',
        buttonFlag2:false,
        
    }
  },
  components : {
    TreeTable,
    upload,
    upload2:upload
  },
  watch:{
    fileList:function (newValue,oldValue) {
        if(newValue.length!=0){
          if(!newValue[0].type){
              this.form.iconUrl = newValue[0].response.data.url;
          }
        }else {
          this.form.iconUrl = ''
        }
    },
    fileList2:function (newValue,oldValue) {
        if(newValue.length!=0){
          if(!newValue[0].type){
              this.form.imgUrl = newValue[0].response.data.url;
          }
        }else {
          this.form.imgUrl = ''
        }
    }
  },
  created(){
      this.getCategorys();
      this.getCategorysToOptions();
      if(_isMobile()){
        this.fullscreen = true;
    }
  },

  methods: {
    setChildrenData(data,id,root){
        root.forEach((ele)=>{
            if(ele.id == id){
                if(data.length>0){
                    ele.children = data;
                    ele.childrenFlag = true;
                }else {
                    ele.childrenFlag = false;
                }
                return false;  
            }
            if(ele.children&&ele.children.length>0){
                this.setChildrenData(data,id,ele.children)
            }
        })
    },
    async findChildren(id){
        
        let childrenData = await this.getCategorysByParentId(id);
        this.setChildrenData(childrenData,id,this.tableData);
        this.changeFlag = true;
    },
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
                let data = {};
                for(let key in this.form){
                    data[key] = this.form[key]
                }
                let methods;
                let msg;
                this.submitFlag = true;
                if(this.currentFlag == 'create'){
                    methods = createCategory;
                    msg = '创建成功'
                }
 
                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateCategory;
                    msg = "修改成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getCategorys();
                    await this.getCategorysToOptions();
                    
                    this.$refs.form.resetFields();
                    this.formDialogVisible= false;
                    this.currentFlag = '';
                    this.selectedOptions = [];
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
        this.selectedOptions = [];
        this.fileList2 = [];
        this.fileList = [];
    },
    beforeClose(done){
        for(var i in this.form){
            this.form[i] = ''
        }
        this.selectedOptions = [];
        this.fileList2 = [];
        this.fileList = [];
        this.currentFlag = '';
        done();
    },
    createdCategory(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增分类';
    },
    modifyCategory(){
        if(!this.selectDataFliter('请选择一个分类进行修改','无法操作多分类，请选择一个分类')){
            return false;
        }
        for(var i in this.multipleSelectData[0]){
            this.form[i] = this.multipleSelectData[0][i];
        }
        this.fileList.push({
          url:this.form.iconUrl,
          type:'finish',
          name:'图片'
        });
        this.fileList2.push({
          url:this.form.imgUrl,
          type:'finish',
          name:'图片'
        });
        let options = this.multipleSelectData[0].root.split(',').reverse();
        if(options[0] == '0' &&options.length!=1){
            options.shift();
        }
        this.selectedOptions = options;
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改分类';
    },
    deleteCategory(){
        if(!this.selectDataFliter('请选择一个分类进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该分类信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteCategory(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getCategorys(); 
                this.getCategorysToOptions();  
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
        this.getCategorys();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getCategorys();
    },
      // 获取分类列表分页
    getCategorys(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            parentId:0
        }
        this.loading = true;
        getCategory(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.changeFlag = true;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
    },
    // 获取所有数据
    getCategorysToOptions(){
        let params = {
            displayAll:1
        }
        getCategory(params).then((res)=>{
            let data = res.data
            let template = [];
            data.records.forEach(ele=>{
                template.push(ele)
            })
            this.filterData(template)
        }) 
    },
    // 获取某个父级下的子集
    async getCategorysByParentId(id){
        let params = {
            displayAll:1,
            parentId:id
        }
        let result = await getCategory(params);
        let data = result.data.records;
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



