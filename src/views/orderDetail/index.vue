<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdOrderDetail">新增订单详情</el-button>
            <el-button size="mini" type="primary" plain @click="modifyOrderDetail">修改订单详情</el-button>
            <el-button size="mini" type="primary" plain @click="deleteOrderDetail">删除订单详情</el-button>
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
            <el-form-item label="商户产品id："  prop="goodsShopId" >
                <el-select v-model="form.goodsShopId" placeholder="请选择">
                    <el-option
                    v-for="item in goodsShopOption"
                    :key="item.id"
                    :label="item.id"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单id：" prop="orderId">
                <el-input size="mini" v-model="form.orderId" clearable ></el-input>
            </el-form-item>
            <el-form-item label="图片地址:" prop="picUrl">
              <upload :fileList.sync="fileList" :buttonFlag="buttonFlag" :listType="listType" :limitFlieNumber='limitFlieNumber'></upload>
            </el-form-item> 
            <el-form-item label="单价：" prop="price">
                <el-input size="mini" type="number" v-model="form.price" clearable ></el-input>
            </el-form-item>
            <el-form-item label="数量：" prop="quantity">
                <el-input size="mini" type="number" v-model="form.quantity" clearable ></el-input>
            </el-form-item>
            <el-form-item label="订单明细状态：" prop="status" >
                <el-select v-model="form.status" placeholder="请选择">
                    <el-option
                    v-for="item in statusOption"
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
import { createOrderDetail,deleteOrderDetail,getOrderDetail,getOrderDetailById,updateOrderDetail } from '@/api/orderDetail'
import normalTable from '@/components/NormalTable'
import { _isMobile } from '@/utils/tool'
import { getGoodsShop } from '@/api/goods-shop'
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
                prop: "goodsShopId",
                text: "商户产品",
                field: "goodsShopId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "orderId",
                text: "订单id",
                field: "orderId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "picUrl",
                text: "图片地址",
                field: "picUrl",
                sort: false,
                textStyle: "left",
                type:'picture'
            },
            {
                width: 120,
                prop: "price",
                text: "单价",
                field: "price",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "quantity",
                text: "数量",
                field: "quantity",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "status",
                text: "订单明细状态",
                field: "status",
                sort: false,
                textStyle: "left"
            },
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户',
        form:{
            goodsShopId:'',
            orderId:'',
            picUrl:'',
            price:'',
            quantity:'',
            status:''
        },
        rules:{
            goodsShopId: [{ required: true, message: '请选择商户产品', trigger: 'blur' }],
            orderId: [{ required: true, message: '请输入订单id', trigger: 'blur' }],
            picUrl: [{ required: true, message: '请上传图片', trigger: 'blur' }],
            price: [{ required: true, message: '请输入单价', trigger: 'blur' }],
            quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
            status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        },
        submitFlag:false,
        currentFlag:'',

        goodsShopOption:[],
        statusOption:[
            {
                value:'0',
                label:'正常'
            },
            {
                value:'1',
                label:'申请退款'
            },
            {
                value:'2',
                label:'退款成功'
            }
        ],
        // 上传文件组件
        fileList:[],
        limitFlieNumber:1,
        listType:'text',
        buttonFlag:false,
        inline:true,
    }
  },
    components : {
    normalTable,
    upload
  },
  created(){
      this.getOrderDetails();
      this.getGoodsShops();
      if(_isMobile()){
        this.fullscreen = true;
    }
  },
   watch:{
    fileList:function (newValue,oldValue) {
        if(newValue.length!=0){
          if(!newValue[0].type){
              this.form.picUrl = newValue[0].response.data.url;
          }
        }else {
          this.form.picUrl = ''
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
                    methods = createOrderDetail;
                    msg = '创建成功'
                }
 
                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateOrderDetail;
                    msg = "修改成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getOrderDetails();
                    this.$refs.form.resetFields();
                    this.formDialogVisible= false;
                    this.currentFlag = '';
                    this.fileList = []
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
        this.fileList = []
    },
    beforeClose(done){
        for(var i in this.form){
            this.form[i] = ''
        }
        this.currentFlag = '';
        this.fileList = []
        done();
    },
    createdOrderDetail(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增订单详情';
    },
    modifyOrderDetail(){
        if(!this.selectDataFliter('请选择一个订单详情进行修改','无法操作多订单详情，请选择一个订单详情')){
            return false;
        }
        for(var i in this.multipleSelectData[0]){
            this.form[i] = this.multipleSelectData[0][i];
        }
        this.fileList.push({
          url:this.form.picUrl,
          type:'finish',
          name:"图片"
        });
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改订单详情';
    },
    deleteOrderDetail(){
        if(!this.selectDataFliter('请选择一个订单详情进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该订单详情信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteOrderDetail(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getOrderDetails();   
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
        this.getOrderDetails();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getOrderDetails();
    },
      // 获取订单详情列表
    getOrderDetails(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        getOrderDetail(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
    },
    getGoodsShops(){
        let params = {
            displayAll:1
        }
        getGoodsShop(params).then((res)=>{
            let data = res.data
            this.goodsShopOption = data.records;
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



