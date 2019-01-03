<template>
  <div class="app-container">
    <div class="searchBox">
        <el-input
            size="mini"
            placeholder="请输入日志产生人"
            v-model="createUserName">
        </el-input>
        <el-input
            size="mini"
            placeholder="请输入日志产生人id"
            v-model="createUserId">
        </el-input>
        <el-button size="mini" type="primary" plain @click="search"  >搜索</el-button>
    </div>
    <normalTable :tableMd="20" :columns="columns"  :tableData="tableData" :loading="loading" @multipleSelection="multipleSelection" :currentPage="currentPage" :pageSize="pageSize" :total="total"  @handleSizeChange="handleSizeChange" @handleCurrentChange="handleCurrentChange"></normalTable>
  </div>
</template>

<script>
import { getLogList } from '@/api/log'
import normalTable from '@/components/NormalTable'

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
        createUserName:'',
        createUserId:'',
        columns: [
            {
                width: 220,
                prop: "method",
                text: "方法",
                field: "method",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "ip",
                text: "ip地址",
                field: "ip",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "params",
                text: "参数",
                field: "params",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "operation",
                text: "操作",
                field: "operation",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "username",
                text: "操作用户",
                field: "username",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "createDate",
                text: "操作时间",
                field: "createDate",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "createUserName",
                text: "日志产生人",
                field: "createUserName",
                sort: false,
                textStyle: "left"
            },
            {
                width: 220,
                prop: "createUserId",
                text: "日志产生人id",
                field: "createUserId",
                sort: false,
                textStyle: "left"
            }
        ]
    }
  },
  components : {
    normalTable
  },
  methods: {
    search(){
        this.pageIndex = 1;
        this.getLogLists();
    },
    multipleSelection(val){
        this.multipleSelectData = val;
    },
    handleSizeChange(val){
        this.pageSize = val;
        this.pageIndex = 1;
        this.getLogLists();
    },
    handleCurrentChange(val){
        this.pageIndex = val;
        this.getLogLists();
    },
    getLogLists(){
        let params = {
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
            createUserName:this.createUserName,
            createUserId:this.createUserId
        }
        this.loading = true;
        getLogList(params).then((res)=>{
            let data = res.data
            this.tableData = data.records;
            this.total = Number(data.total);
            this.currentPage = data.current;
        }).finally(()=>{
            this.loading = false;
        })
    },
  },
  created(){
      this.getLogLists();
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
.searchBox {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .el-input{
        width: 200px;
        margin-right: 40px;
    }
}
</style>



