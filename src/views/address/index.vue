<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="createdAddress">新增用户住址</el-button>
            <el-button size="mini" type="primary" plain @click="modifyAddress">修改用户住址</el-button>
            <el-button size="mini" type="primary" plain @click="deleteAddress">删除用户住址</el-button>
        </el-button-group>
    </el-row>
    <normalTable :tableMd="20" :columns="columns"  :tableData="tableData" :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
    <!-- 创建用户 -->
    <el-dialog
        :visible.sync="formDialogVisible"
        :fullscreen="fullscreen" 
        width="800px" center lock-scroll :close-on-click-modal="false" :before-close="beforeClose"
        >
        <div class="dialog-title">{{dialogTitle}}</div>
        <el-form ref="form"  :inline="inline" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="联系人：" prop="contactUser">
                <el-input size="mini" v-model="form.contactUser" clearable ></el-input>
            </el-form-item>
            <el-form-item label="用户id：" >
                <el-select size="mini" filterable  v-model="form.userId" placeholder="请选择">
                    <el-option 
                    v-for="item in userOptions"
                    :key="item.id"
                    :label="item.userName"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="联系电话：" prop="contactPhone">
                <el-input size="mini"  v-model="form.contactPhone" clearable ></el-input>
            </el-form-item>
            <el-form-item label="是否默认："  prop="defaultx" >
                <el-select size="mini" v-model="form.defaultx" placeholder="请选择">
                    <el-option 
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="小区ID："  prop="neighbourhoodId" >
                <el-select size="mini" v-model="form.neighbourhoodId" placeholder="请选择">
                    <el-option 
                    v-for="item in neighbourhoodPositionOptions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="区域id："  prop="regionId">
                <el-cascader
                    :options="regionPositionOptions"
                    v-model="selectedOptions"
                    :props="parentIdProps"  
                    @change="handleChange">
                </el-cascader>
            </el-form-item>
           
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm()" size="mini"   v-loading='submitFlag'>确 定</el-button>
            <el-button @click="resetForm()" size="mini" type="danger"   v-loading='submitFlag'>重 置</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import { createAddress,deleteAddress,getAddress,getAddressById,updateAddress } from '@/api/address'
import { getNeighbourhood } from '@/api/neighbourhood'
import { getRegion } from '@/api/region'
import { getUserList } from '@/api/user'
import normalTable from '@/components/NormalTable'
import { _isMobile } from '@/utils/tool'
import filters from '@/utils/filter'

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
                prop: "contactUser",
                text: "联系人",
                field: "contactUser",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "address",
                text: "地址",
                field: "address",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "userId",
                text: "用户id",
                field: "userId",
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
                prop: "defaultx",
                text: "是否默认",
                field: "defaultx",
                sort: false,
                textStyle: "left",
                filter:'filterBoolean'
            },
            {
                width: 120,
                prop: "neighbourhoodId",
                text: "小区id",
                field: "neighbourhoodId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 120,
                prop: "regionId",
                text: "地区id",
                field: "regionId",
                sort: false,
                textStyle: "left"
            }
        ],
        fullscreen:false,
        formDialogVisible:false,
        dialogTitle:'新增用户地址',
        regionPositionOptions:[],
        neighbourhoodPositionOptions:[],
        userOptions:[],
        options:[
            {
                value:false,
                label:'否'
            },
            {
                value:true,
                label:'是'
            }
        ],
        form:{
            contactUser:'',
            contactPhone:'',
            defaultx:'',
            neighbourhoodId:'',
            regionId:'',
            userId:'',
        },
        rules:{
            contactUser: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
            contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
            defaultx: [{ required: true, message: '请选择是否默认', trigger: 'blur' }],
            neighbourhoodId: [{ required: true, message: '请选择小区id', trigger: 'blur' }],
            regionId: [{ required: true, message: '请选择地区id', trigger: 'blur' }],
        },
        submitFlag:false,
        currentFlag:'',
        parentIdProps:{
            value:'id',
            label:'name'
        },
        selectedOptions:[],
    }
  },
  components : {
    normalTable
  },
 
  methods: {
    handleChange(value) {
        this.form.regionId = value[value.length-1]
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
                    methods = createAddress;
                    msg = '创建成功'
                }

                if(this.currentFlag == 'modify'){
                    data.id = this.multipleSelectData[0].id;
                    methods = updateAddress;
                    msg = "修改成功";
                }
                methods(data).then((res)=>{
                    this.$message({
                        message:msg,
                        type:'success'
                    });
                }).then(async ()=>{
                    this.pageIndex = 1;
                    await this.getAddresss();
                    this.$refs.form.resetFields();
                    this.resetForm();
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
        this.selectedOptions = [];
    },
    beforeClose(done){
        for(var i in this.form){
            this.form[i] = ''
        }
        this.selectedOptions = [];
        this.currentFlag = '';
        done();
    },
    createdAddress(){
        this.currentFlag = 'create'
        this.formDialogVisible = true;
        this.dialogTitle = '新增用户住址';
    },
    modifyAddress(){
        if(!this.selectDataFliter('请选择一个用户住址进行修改','无法操作多用户住址，请选择一个用户住址')){
            return false;
        }
        for(var i in this.form){
            this.form[i] = this.multipleSelectData[0][i];
        }
        this.selectedOptions.push(this.multipleSelectData[0].regionId);
        this.currentFlag = 'modify';
        this.formDialogVisible = true;
        this.dialogTitle = '修改用户住址';
    },
    deleteAddress(){
         if(!this.selectDataFliter('请选择一个用户住址进行修改')){
            return false;
        }
        this.$confirm("此操作将永久删除该用户住址信息, 是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
        })
        .then(() => {
            let ids = [];
            this.multipleSelectData.map((value, index) => {
                ids.push(value.id);
            });
            deleteAddress(ids).then(res => {
                this.$message({
                    type: "success",
                    message: "删除成功!"
                });
            })
            .then(() => {
                this.pageIndex = 1;
                this.getAddresss();   
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
        this.getAddresss();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getAddresss();
    },
    getAddresss(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        getAddress(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
    },
    getRegions(){
        let params = {
            displayAll:1
        }
        getRegion(params).then((res)=>{
            let data = res.data
            // 属性配置信息
            let attributes = {
                id: 'id',
                parentId: 'parentId',
            };
            this.regionPositionOptions = filters.toTreeData(data.records,attributes);
        }) 
    },
    getNeighbourhoods(){
        let params = {
            displayAll:1
        }
        getNeighbourhood(params).then((res)=>{
            let data = res.data
            this.neighbourhoodPositionOptions = data.records;
        }) 
    },
    getUsers(){
        let params = {
            displayAll:1
        }
        getUserList(params).then((res)=>{
            let data = res.data
            this.userOptions = data.records;
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
      this.getAddresss();
      this.getRegions();
      this.getNeighbourhoods();
      this.getUsers();
      if(_isMobile()){
        this.fullscreen = true;
    }
  },
}
</script>

<style lang="scss" scoped>

</style>



