<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdMethod">新增商户商品</el-button>
            <el-button size="mini" type="primary" plain @click="modifyMethod">修改商户商品</el-button>
            <el-button size="mini" type="primary" plain @click="deleteMethod">删除商户商品</el-button>
        </el-button-group>
    </el-row>
    <normalTable :tableMd="20" :columns="columns"  :tableData="tableData" :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
    <!-- 创建用户 -->
    <el-dialog
        :visible.sync="formDialogVisible"
        :fullscreen="fullscreen"
        width="800px" center  lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">{{dialogTitle}}</div>
        <el-form ref="form" :inline="inline" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="商品id："  prop="goodsId" >
                <el-select v-model="form.goodsId" placeholder="请选择">
                    <el-option
                    v-for="item in goodsList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品规格id："  prop="goodsSpecificationId" >
                <el-select v-model="form.goodsSpecificationId" placeholder="请选择">
                    <el-option
                    v-for="item in goodsSpecificationsOption"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="价格：" prop="price">
                <el-input size="mini" type="number" v-model="form.price" clearable ></el-input>
            </el-form-item>
            <el-form-item label="剩余数量：" prop="quantity">
                <el-input size="mini" type="number" v-model="form.quantity" clearable ></el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="remark">
                <el-input size="mini"  v-model="form.remark" clearable ></el-input>
            </el-form-item>
            <el-form-item label="商品规格id："  prop="shopId" >
                <el-select v-model="form.shopId" placeholder="请选择">
                    <el-option
                    v-for="item in shopOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态："  prop="status" >
                <el-select v-model="form.status" placeholder="请选择">
                    <el-option
                    v-for="item in statusOptions"
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
import { createGoodsShop,deleteGoodsShop,getGoodsShop,getGoodsShopById,updateGoodsShop } from '@/api/goods-shop'
import normalTable from '@/components/NormalTable'
import {  getGoods } from '@/api/goods'
import { getOwnShops } from '@/api/shop'
import { _isMobile } from '@/utils/tool'

export default {
  data() {
    return {
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
                prop: "goodsId",
                text: "产品id",
                field: "goodsId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "goodsSpecificationId",
                text: "产品规格id",
                field: "goodsSpecificationId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "price",
                text: "价格",
                field: "price",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "quantity",
                text: "剩余数量",
                field: "quantity",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "remark",
                text: "备注",
                field: "remark",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "shopId",
                text: "商户id",
                field: "shopId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "status",
                text: "状态",
                field: "status",
                sort: false,
                textStyle: "left",
                filter:'filterStatus'
            },
            {
                width: 220,
                prop: "totalQuantity",
                text: "总数",
                field: "totalQuantity",
                sort: false,
                textStyle: "left"
            }
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户',
        form:{
            goodsId:'',
            goodsSpecificationId:'',
            price:'',
            quantity:'',
            remark:'',
            shopId:'',
            status:''
        },
        rules:{
            goodsId: [{ required: true, message: '请选择商品', trigger: 'blur' }],
            goodsSpecificationId: [{ required: true, message: '请选择商品规格', trigger: 'blur' }],
            price: [{ required: true, message: '请输入价格', trigger: 'blur' }],
            quantity: [{ required: true, message: '请输入剩余数量', trigger: 'blur' }],
            shopId: [{ required: true, message: '请选择商户id', trigger: 'blur' }],
            status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        },
        submitFlag:false,
        currentFlag:'',

        goodsList:[],
        goodsSpecificationsOption:[],
        shopOptions:[],
        statusOptions:[
            {
                label:'待审核',
                value:0
            },
            {
                label:'审核通过',
                value:1
            },
            {
                label:'审核失败',
                value:2
            },
        ],
        modfiyOpen:false,
    }
  },
  components : {
    normalTable
  },
  watch : {
      'form.goodsId':function(newValue,oldValue){
          
          for (let index = 0; index < this.goodsList.length; index++) {
              if(this.goodsList[index].id == newValue){
                  if(this.goodsList[index].goodsSpecifications.length!=0){
                    if(this.modfiyOpen){
                        this.modfiyOpen = false
                    }else {
                        this.form.goodsSpecificationId = '';
                    }
                    this.goodsSpecificationsOption = this.goodsList[index].goodsSpecifications;
                  }else {
                    if(this.modfiyOpen){
                        this.modfiyOpen = false
                        this.form.goodsSpecificationId = 0
                    }else {
                        this.form.goodsSpecificationId = '';
                    }
                    this.goodsSpecificationsOption = [
                        {
                            id:0,
                            name:'无'
                        }
                    ];
                  }
                  
              }
          }
      }
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
                    methods = createGoodsShop;
                    msg = '创建成功'
                }

                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateGoodsShop;
                    msg = "修改成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getGoodsShops();
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
        this.dialogTitle = '新增商户商品';
    },
    modifyMethod(){
        if(!this.selectDataFliter('请选择一个商户商品进行修改','无法操作多商户商品，请选择一个商户商品')){
            return false;
        }
        for(var i in this.multipleSelectData[0]){
            this.form[i] = this.multipleSelectData[0][i];
        }
        this.modfiyOpen =true;
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改商户商品';
    },
    deleteMethod(){
         if(!this.selectDataFliter('请选择一个商户商品进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该商户商品信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteGoodsShop(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getGoodsShops();   
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
        this.getGoodsShops();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getGoodsShops();
    },
    getGoodsShops(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        getGoodsShop(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
    },
    getGoodsList(){
        let params = {
            displayAll:1
        }
 
        getGoods(params).then((res)=>{
            let data = res.data
            this.goodsList = data.records;
        }) 
    },
    getShops(){
        let query = {
            needAdmin:true
        }
        getOwnShops(query).then((res)=>{
            let data = res.data
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
      this.getGoodsShops();
      this.getGoodsList();
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



