<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdOrder">新增订单</el-button>
            <el-button size="mini" type="primary" plain @click="modifyOrder">修改订单</el-button>
            <el-button size="mini" type="primary" plain @click="deleteOrder">删除订单</el-button>
        </el-button-group>
    </el-row>
     <normalTable :tableMd="20" :columns="columns"  :tableData="tableData" :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
       <!-- 创建用户 -->
    <el-dialog
        :visible.sync="formDialogVisible"
        :fullscreen="fullscreen"
        width="850px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">{{dialogTitle}}</div>
        <el-form ref="form" :inline="inline" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="地址：" prop="address">
                <el-input size="mini" v-model="form.address" clearable ></el-input>
            </el-form-item>
            <el-form-item label="卖家确定时间" prop="confirmDate">
              <el-date-picker size="mini"
                v-model="form.confirmDate"
                type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择确定时间">
              </el-date-picker>
            </el-form-item>  
            <el-form-item label="联系电话：" prop="contactPhone">
                <el-input size="mini" type="number" v-model="form.contactPhone" clearable ></el-input>
            </el-form-item>
            <el-form-item label="联系人：" prop="contactUser">
                <el-input size="mini"  v-model="form.contactUser" clearable ></el-input>
            </el-form-item>
            <el-form-item label="派送员：" prop="courierId">
                <el-input size="mini"  v-model="form.courierId" clearable ></el-input>
            </el-form-item>
            <el-form-item label="配送日期:" prop="distributionDate">
              <el-date-picker size="mini"
                v-model="form.distributionDate"
                type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择配送日期">
              </el-date-picker>
            </el-form-item> 
            <el-form-item label="订单号：" prop="orderCode">
                <el-input size="mini"  v-model="form.orderCode" clearable ></el-input>
            </el-form-item>
            <el-form-item label="订单状态：" prop="orderStatus">
                <el-select v-model="form.orderStatus" placeholder="请选择">
                    <el-option
                    v-for="item in orderStatusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="支付时间:" prop="payDate">
              <el-date-picker size="mini"
                v-model="form.payDate"
                type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择配送日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="实际支付：" prop="payFee">
                <el-input size="mini"  type="number" v-model="form.payFee" clearable ></el-input>
            </el-form-item>
            <el-form-item label="图片地址:" prop="imageUrl">
              <upload :fileList.sync="fileList" :buttonFlag="buttonFlag" :listType="listType" :limitFlieNumber='limitFlieNumber'></upload>
            </el-form-item> 
            <el-form-item label="收货日期:" prop="receivingDate">
              <el-date-picker size="mini"
                v-model="form.receivingDate"
                type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择收货日期">
              </el-date-picker>
            </el-form-item>  
            <el-form-item label="退款日期:" prop="refundDate">
              <el-date-picker size="mini"
                v-model="form.refundDate"
                type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择退款日期">
              </el-date-picker>
            </el-form-item> 
            <el-form-item label="请求退款日期:" prop="requiredRefundDate">
              <el-date-picker size="mini"
                v-model="form.requiredRefundDate"
                type="datetime" value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择请求退款日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="订总价：" prop="totalFee">
                <el-input size="mini" type="number" v-model="form.totalFee" clearable ></el-input>
            </el-form-item>
            <el-form-item label="运费：" prop="transFee">
                <el-input size="mini" type="number" v-model="form.transFee" clearable ></el-input>
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
import { createOrder,deleteOrder,getOrder,getOrderById,updateOrder } from '@/api/order'
import normalTable from '@/components/NormalTable'
import { _isMobile } from '@/utils/tool'
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
                prop: "address",
                text: "订单地址",
                field: "address",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "confirmDate",
                text: "卖家确定时间",
                field: "confirmDate",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "contactPhone",
                text: "联系电话",
                field: "contactPhone",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "contactUser",
                text: "联系人",
                field: "contactUser",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "courierId",
                text: "派送员",
                field: "courierId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "distributionDate",
                text: "配送日期",
                field: "distributionDate",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "orderCode",
                text: "订单号",
                field: "orderCode",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "orderStatus",
                text: "订单状态",
                field: "orderStatus",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "payDate",
                text: "支付时间",
                field: "payDate",
                sort: false,
                textStyle: "left"
            },
             {
                width: 120,
                prop: "payFee",
                text: "实际支付",
                field: "payFee",
                sort: false,
                textStyle: "left"
            },
             {
                width: 120,
                prop: "picUrl",
                text: "图片地址",
                field: "picUrl",
                sort: false,
                textStyle: "left",
                type:'picture'
            },
             {
                width: 120,
                prop: "receivingDate",
                text: "收货日期",
                field: "receivingDate",
                sort: false,
                textStyle: "left"
            },
             {
                width: 120,
                prop: "refundDate",
                text: "退款日期",
                field: "refundDate",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "requiredRefundDate",
                text: "请求退款日期",
                field: "requiredRefundDate",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "totalFee",
                text: "总价",
                field: "totalFee",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "transFee",
                text: "运费",
                field: "transFee",
                sort: false,
                textStyle: "left"
            },
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户',
        form:{
            address:'',
            confirmDate:'',
            contactPhone:'',
            contactUser:'',
            courierId:'',
            distributionDate:'',
            orderCode:'',
            orderStatus:'',
            payDate:'',
            payFee:'',
            picUrl:'',
            receivingDate:'',
            refundDate:'',
            requiredRefundDate:'',
            totalFee:'',
            transFee:''
        },
        rules:{
            address: [{ required: true, message: '请输入地址', trigger: 'blur' }],
            contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
            contactUser: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
            courierId: [{ required: true, message: '请输入派送员', trigger: 'blur' }],
            distributionDate: [{ required: true, message: '请选择配送日期', trigger: 'blur' }],
            orderCode: [{ required: true, message: '请输入订单号', trigger: 'blur' }],
            orderStatus:[{ required: true, message: '请选择订单状态', trigger: 'blur' }],
            payDate: [{ required: true, message: '请选择支付时间', trigger: 'blur' }],
            payFee:[{ required: true, message: '请输入实际支付', trigger: 'blur' }]
        },
        submitFlag:false,
        currentFlag:'',

        orderStatusOptions:[
            {
                value:'0',
                label:'未支付'
            },
            {
                value:'1',
                label:'已支付'
            },
            {
                value:'0',
                label:'未支付'
            },
            {
                value:'2',
                label:'订单确定'
            },
            {
                value:'3',
                label:'卖家已发货'
            },
            {
                value:'4',
                label:'派送中'
            },
            {
                value:'5',
                label:'待评价'
            },
            {
                value:'6',
                label:'交易成功'
            },
            {
                value:'7',
                label:'部分申请退款'
            },
            {
                value:'8',
                label:'申请退款'
            },
            {
                value:'9',
                label:'部分退款成功'
            },
            {
                value:'10',
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
  created(){
      this.getOrders();
      if(_isMobile()){
        this.fullscreen = true;
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
                    methods = createOrder;
                    msg = '创建成功'
                }
 
                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateOrder;
                    msg = "修改成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getOrders();
                    this.$refs.form.resetFields();
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
    createdOrder(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增订单';
    },
    modifyOrder(){
        if(!this.selectDataFliter('请选择一个订单进行修改','无法操作多订单，请选择一个订单')){
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
        this.dialogTitle = '修改订单';
    },
    deleteOrder(){
        if(!this.selectDataFliter('请选择一个订单进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该订单信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteOrder(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getOrders();   
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
        this.getOrders();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getOrders();
    },
      // 获取订单列表
    getOrders(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        getOrder(params).then((res)=>{
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



