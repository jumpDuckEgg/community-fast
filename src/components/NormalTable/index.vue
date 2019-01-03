<template>
  <div>
    <el-col class="table-box" :xs="24" :md="tableMd">
      <el-table v-loading="loading" :data="tableData" stripe size='mini' border @selection-change="handleSelectionChange" @sort-change='tableSort' @row-click="rowClick">
        <el-table-column type="selection" align="center" width="45"></el-table-column>
        <el-table-column :align="column.textStyle" header-align='center' show-overflow-tooltip :label="column.text" :prop="column.prop" v-for="(column,index) in columns" :key="index" :min-width="column.width" :sortable='column.sort'>
            <template slot-scope="scope">
                <span style="cursor:pointer" @click="handleClipboard(scope.row[column.field],$event)">
                    {{ scope.row[column.field] | filterFuns(column.filter) }}
                </span>
            </template>
        </el-table-column>
      </el-table>
      <el-pagination class="paginationBox" background layout="prev, pager,next,sizes,total" :current-page="currentPage"  :total="total" :page-sizes="[10, 15, 20,25]" :page-size="pageSize" @size-change="handleSizeChange" @current-change="handleCurrentChange">
        </el-pagination>
    </el-col>
  </div>
</template>

<script>
import clipboard from "@/utils/clipboard";
import filters from '@/utils/filter'
export default {
    name: "normal-table",
    props: {
        tableMd: {
            type: Number,
            default: '10'
        },
        loading: {
            type: Boolean,
            default: false
        },
        // 这是相应的字段展示(width:表示宽度;prop:用于升降序排序用的;text:列名称;field:列属性;sort:排序[true,false,'custom'];textStyle:对齐方式)
        columns: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 这是数据源
        tableData: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 数据条数
        total:{
            type: [Number,String],
            default: 0
        },
        // 页数
        pageSize:{
            type: [Number,String],
            default: 10
        },
        currentPage:{
            type: [Number,String],
            default: 1
        }
    },
    data() {
        return {
        };
    },
    created() {
    },
    filters:{
        filterFuns:function(val,filterName){
            if(filterName){
                return filters[filterName](val)
            }else {
                return val
            }
            
        }
    },
    methods: {
        handleClipboard(text, event) {
            clipboard(text, event);
        },
        handleSelectionChange(val) {
            this.$emit("multipleSelection",val);
        },
        tableSort(row) {
            let sortData = "";
            if (row.order == "descending") {
                sortData = row.prop + " desc";
            } else {
                sortData = row.prop;
            }
            this.$emit("sort", sortData);
        },
        handleSizeChange(val){
            this.$emit("handleSizeChange", val);
        },
        handleCurrentChange(val){
            this.$emit("handleCurrentChange", val);
        },
        rowClick(row, event, column){
            this.$emit('rowClick',row)
        }
    },
};
</script>
<style lang="scss" scoped>
.table-box {
    margin-top: 10px;
    max-width: 1666px;
}

.paginationBox {
    text-align: center;
    margin-top: 20px;
}
</style>

