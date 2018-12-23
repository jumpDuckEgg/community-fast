<template>
  <div class="app-container">
    <el-row class="buttonBox" type="flex" justify="start">
        <el-button-group>
            <el-button size="mini" type="primary" plain @click="modifyMessage">修改</el-button>
        </el-button-group>
    </el-row>
    <normalTable :tableMd="20" :columns="columns"  :tableData="tableData" :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
  </div>
</template>

<script>
import normalTable from '@/components/NormalTable'
import { findMessage,findMessageById,updateMessage } from '@/api/message';
export default {
  data() {
    return {    
        pageIndex:1,//页码
        pageSize:10,//页数
        total:0,//数据总数
        currentPage:1,//当前页数
        loading:false,//加载标志
        tableData:[],//留言数据
        multipleSelectData:[],//选中数据
        columns:[
            {
                width: 220,
                prop: "companyName",
                text: "公司名",
                field: "companyName",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "content",
                text: "内容",
                field: "content",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "feedType",
                text: "反馈类型",
                field: "feedType",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "mobile",
                text: "手机",
                field: "mobile",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "status",
                text: "状态",
                field: "status",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "userId",
                text: "会员id",
                field: "userId",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "userName",
                text: "会员名称",
                field: "userName",
                sort: false,
                textStyle: "left"
            },
        ]
    }
  },
  components : {
    normalTable
  },
  created(){
      this.getMessages();
  },
  methods: {
      // 获取留言列表
    getMessages(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize
        }
        this.loading = true;
        findMessage(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
    },
    //表格选中
    multipleSelection(val){
        this.multipleSelectData = val;
    },
    handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        this.getMessages();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getMessages();
    },
    modifyMessage(){
        if(!this.selectDataFliter('请选择一个用户进行修改','无法操作多用户，请选择一个用户')){
            return false;
        }
         
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
</style>



