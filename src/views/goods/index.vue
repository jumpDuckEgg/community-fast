<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdGoods">新增商品</el-button>
            <el-button size="mini" type="primary" plain @click="modifyGoods">修改商品</el-button>
            <el-button size="mini" type="primary" plain @click="deleteGoods">删除商品</el-button>
            <el-button size="mini" type="primary" plain @click="showGoods">查看商品</el-button>
        </el-button-group>
    </el-row>
    <normalTable :tableMd="20" :columns="columns"  :tableData="tableData" :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
    <!-- 创建用户 -->
    <el-dialog
        :visible.sync="formDialogVisible"
        :fullscreen="fullscreen"
        width="880px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">{{dialogTitle}}</div>
        <el-form ref="form"  :inline="inline" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="商品名字：" prop="name">
                <el-input size="mini" v-model="form.name" clearable ></el-input>
            </el-form-item>
            <el-form-item label="商品类型：" prop="type">
                <el-select v-model="form.type" placeholder="请选择">
                    <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="归属店铺id："  prop="shopId" >
                <el-select v-model="form.shopId" placeholder="请选择">
                    <el-option
                    v-for="item in shopOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类id："  prop="categoryId" >
                <el-cascader
                    :options="categoryOptions"
                    v-model="selectedOptions"
                    :props="categoryProps"  change-on-select
                    @change="handleChange">
                </el-cascader>
            </el-form-item>
            <el-form-item label="计量单位："  prop="measurementId" >
                <el-select v-model="form.measurementId" placeholder="请选择">
                    <el-option
                    v-for="item in measurementOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="描述：" prop="description">
                <el-input size="mini" v-model="form.description" clearable ></el-input>
            </el-form-item>
            <el-form-item label="介绍：" prop="introduce">
                <el-input size="mini" v-model="form.introduce" clearable ></el-input>
            </el-form-item>
            <el-form-item label="logo:" prop="logoUrl">
              <upload :fileList.sync="fileList" :buttonFlag="buttonFlag" :listType="listType" :limitFlieNumber='limitFlieNumber'></upload>
            </el-form-item> 
            <el-form-item label="标签：">
                <el-tag  :key="index"   v-for="(tag,index) in form.labels"    closable    :disable-transitions="false"    @close="handleClose(tag)">
                {{tag}}
                </el-tag>
                <el-input  class="input-new-tag"   v-if="inputVisible"  v-model="inputValue"  ref="saveTagInput"    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                >
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </el-form-item>
            <el-form-item label="规格类型：" v-if="form.type">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="addGoodsSpecification">添加</el-button>
                <el-row v-for="(item,index) in form.goodsSpecifications" :key="index" >
                    <el-form :inline="inline"> 
                        <el-form-item label="规格图片">
                            <upload :fileList.sync="item.fileList"  :listType="goodsSpecificationsListType" ></upload>
                        </el-form-item>
                        <el-form-item label="规格名字">
                            <el-input size="mini" v-model="item.name" clearable ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="deleteGoodsSpecification(item,index)"></el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm()" size="mini" v-loading='submitFlag'>确 定</el-button>
            <el-button @click="resetForm()" size="mini" type="danger" v-loading='submitFlag'>重 置</el-button>
        </span>
    </el-dialog>
    <el-dialog :visible.sync="detailDialogVisible"
        :fullscreen="fullscreen"
        width="880px" center lock-scroll :close-on-click-modal="false">
        <el-row>
             <normalTable  :columns="detailColumns"  :tableData="detailTableData"  :opeanPagination="opeanPagination"      ></normalTable>
        </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { createGoods,deleteGoods,getGoods,getGoodsById,updateGoods } from '@/api/goods'
import normalTable from '@/components/NormalTable'
import { getOwnShops } from '@/api/shop'
import { getCategory } from '@/api/category'
import { getMeasurement } from '@/api/measurement'
import { _isMobile } from '@/utils/tool'
import upload from '@/components/UpLoad'
import filters from '@/utils/filter'
export default {
  data() {
    return {
        // 查看商品
        detailDialogVisible:false,
        detailTableData:[],
        detailColumns:[
            {
                width: 220,
                prop: "name",
                text: "规格名字",
                field: "name",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "picUrl",
                text: "图片地址",
                field: "picUrl",
                sort: false,
                textStyle: "center",
                type:'picture'
            }
        ],   
        opeanPagination:false,



        inline:true,
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
                prop: "categoryId",
                text: "分类id",
                field: "categoryId",
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
                width: 120,
                prop: "description",
                text: "描述",
                field: "description",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "introduce",
                text: "介绍",
                field: "introduce",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "labels",
                text: "标签",
                field: "labels",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "logoUrl",
                text: "logo",
                field: "logoUrl",
                sort: false,
                textStyle: "center",
                type:'picture'
            },
            {
                width: 120,
                prop: "measurementId",
                text: "计量单位",
                field: "measurementId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "shopId",
                text: "归属店铺",
                field: "shopId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "type",
                text: "类型",
                field: "type",
                sort: false,
                textStyle: "center",
                filter:'filterGoodsType'
            }
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户',
        categoryOptions:[],
        categoryProps:{
            value:'id',
            label:'name'
        },
        selectedOptions:[],
        measurementOptions:[],
        shopOptions:[],
        typeOptions:[
            {
                value:0,
                label:'SKU'
            },
            {
                value:1,
                label:'POA'
            }
        ],
        form:{
            name:'',
            type:'',
            categoryId:'',
            measurementId:'',
            description:'',
            introduce:'',
            logoUrl:'',
            labels:[],
            shopId:'',
            goodsSpecifications:[],
        },
        rules:{
            name: [{ required: true, message: '请输入商品名字', trigger: 'blur' }],
            type: [{ required: true, message: '请选择商品属性', trigger: 'blur' }],
            categoryId: [{ required: true, message: '请选择分类id', trigger: 'blur' }],
            measurementId: [{ required: true, message: '请选择计量单位', trigger: 'blur' }],
            logoUrl: [{ required: true, message: '请上传logo图片', trigger: 'blur' }],
            shopId: [{ required: true, message: '请选择归属店铺', trigger: 'blur' }],
        },
        submitFlag:false,
        currentFlag:'',
        // 上传文件组件
        fileList:[],
        limitFlieNumber:1,
        listType:'text',
        buttonFlag:false,
        
        goodsSpecificationsListType:'picture',
        inputVisible: false,
        inputValue: ''
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
              this.form.logoUrl = newValue[0].response.data.url;
          }
        }else {
          this.form.logoUrl = ''
        }
    },
    'form.type':function(newValue,oldValue){
        if(newValue == 0){
            this.form.goodsSpecifications = []
        }
    }
  },
  methods: {
      
    addGoodsSpecification(){
        this.form.goodsSpecifications = this.form.goodsSpecifications?this.form.goodsSpecifications:[];
        this.form.goodsSpecifications.push({
            fileList:[],
            name:'',
            picUrl:''
        })
    },
    deleteGoodsSpecification(item,index){
        this.form.goodsSpecifications.splice(index,1);
    },
    handleChange(value) {
        this.form.categoryId = value[value.length-1]
    },
      filterData(data){
        // 属性配置信息
        let attributes = {
            id: 'id',
            parentId: 'parentId',
        };
        this.categoryOptions = filters.toTreeData(data,attributes);
    },
      //标签组件
    handleClose(tag) {
        this.form.labels.splice(this.form.labels.indexOf(tag), 1);
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
            this.form.labels.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
    },
    //
    submitForm(){
        this.$refs.form.validate(valid => {
            if (valid) {

                let flag = true;
                if(this.form.type == 1 && this.form.goodsSpecifications.length == 0){
                    this.$message({
                        type:'error',
                        message:'至少要选择一个规格'
                    });
                    return false;
                }
                this.form.goodsSpecifications.forEach((ele,index)=>{
                    if(ele.fileList.length == 0 ){
                        this.$message({
                            type:'error',
                            message:`请上传第${index+1}个规格图片`
                        })
                        flag = false
                    }else {
                        if(!ele.fileList[0].type){
                            ele.picUrl = ele.fileList[0].response.data.url;
                        }   
                    }
                    if(ele.name == ''){
                        this.$message({
                            type:'error',
                            message:`请输入第${index+1}个规格名字`
                        })
                        flag = false
                    }
                });
                
                if(flag == false){
                    return false
                }

                let data = {};
                for(let key in this.form){
                    data[key] = this.form[key]
                }
                if(data.type == 0 && data.goodsSpecifications && data.goodsSpecifications.length == 0  ){
                    delete data.goodsSpecifications;
                }
                if(data.type == 1 && data.goodsSpecifications && data.goodsSpecifications.length != 0 ){
                    data.goodsSpecifications.forEach(ele=>{
                        delete ele.fileList;
                    })
                }
                let methods;
                let msg;
                this.submitFlag = true;
                if(this.currentFlag == 'create'){
                    methods = createGoods;
                    msg = '创建成功'
                }

                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateGoods;
                    msg = "修改成功";
                }
                let template = [];
                data.labels.forEach(ele=>{
                    template.push(ele)
                })
                data.labels = template.join(',');
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getGoodss();
                    this.$refs.form.resetFields();
                    this.resetForm();
                    this.formDialogVisible= false;
                    this.currentFlag = '';
                    this.fileList = [];
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
        this.fileList = [];
        this.selectedOptions = [];
    },
    beforeClose(done){
        for(var i in this.form){
            this.form[i] = ''
        }
        this.fileList = [];
        this.currentFlag = '';
        this.selectedOptions = [];
        done();
    },
    createdGoods(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增商品';
    },
   async modifyGoods(){
        if(!this.selectDataFliter('请选择一个商品进行修改','无法操作多商品，请选择一个商品')){
            return false;
        }
        let temp = this.multipleSelectData[0];
        for(var i in temp){
            // console.log(temp[i])
            this.form[i] = temp[i];
        }
        this.fileList.push({
          url:this.form.logoUrl,
          type:'finish',
          name:'图片'
        });
        if(this.form.goodsSpecifications&&this.form.goodsSpecifications.length>0){
            this.form.goodsSpecifications.forEach(ele=>{
                ele.fileList = []
                ele.fileList.push({
                    url:ele.picUrl,
                    type:'finish',
                    name:'图片'
                });
            })
        }
        this.form.labels = temp.labels? temp.labels.split(","):[];
        console.log(temp)
        let options = temp.categoryRoot.split(',').reverse();
        if(options[0] == '0'){
            options.shift();
            options.push(temp.categoryId)
        }
        console.log(options)
        this.selectedOptions = options;
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改商品';
    },
    deleteGoods(){
         if(!this.selectDataFliter('请选择一个商品进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该商品信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteGoods(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getGoodss();   
            });
        })
        .catch(() => {
            this.$message({
                type: "info",
                message: "已取消删除"
            });
        });
    },
    showGoods(){
        if(!this.selectDataFliter('请选择一个商品进查看','无法操作多商品，请选择一个商品')){
            return false;
        }
        let temp = this.multipleSelectData[0];
        this.detailDialogVisible = true;
        this.detailTableData = temp.goodsSpecifications;
    },
    multipleSelection(val){
        this.multipleSelectData = val;
    },
    handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        this.getGoodss();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getGoodss();
    },
    getGoodss(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        getGoods(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
    },
    getCategorys(){
        let params = {
            displayAll:1
        }
        getCategory(params).then((res)=>{
            let data = res.data
            this.filterData(data.records)
        })
    },
    getMeasurements(){
        let params = {
            displayAll:1
        }
        getMeasurement(params).then((res)=>{
            let data = res.data
            this.measurementOptions = data.records;
        })
    },
    getShops(){
        let query = {
            needAdmin:true
        }
        getOwnShops(query).then((res)=>{
            let data = res.data
            console.log(data)
            this.shopOptions = data;
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
      this.getGoodss();
      this.getCategorys();
      this.getMeasurements();
      this.getShops();
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



