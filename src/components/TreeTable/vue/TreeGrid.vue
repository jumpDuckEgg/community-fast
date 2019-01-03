<template>
    <div>
        <el-table v-loading='loading' :data="data" border :row-style="showTr" stripe size='mini' border @selection-change="handleSelectionChange" @sort-change='tableSort'>
            <el-table-column type="selection" align="center" width="45"></el-table-column>
            <el-table-column :label="column.text" v-for="(column,index) in columns" :key="index" :prop="column.prop" :sortable='column.sort' :width="column.width?column.width:''" header-align='center' :align="column.textAlign" show-overflow-tooltip>
                <template slot-scope="props">
                    <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in props.row._level" :key='levelIndex' class="ms-tree-space"></span>
                    <template v-if="toggleIconShow(index,props.row)">
                        <i v-if="!props.row._expanded" class="el-icon-arrow-right" aria-hidden="true" @click="toggle(props.$index)"></i>
                        <i v-if="props.row._expanded" class="el-icon-arrow-down" aria-hidden="true" @click="toggle(props.$index)"></i>
                    </template>
                    <span v-else-if="index===0" class="ms-tree-space"></span>
                        {{ props.row[column.field] }}
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import Utils from "../utils/index.js";
//  import Vue from 'vue'
export default {
    name: "tree-grid",
    props: {
        // 该属性是确认父组件传过来的数据是否已经是树形结构了，如果是，则不需要进行树形格式化
        treeStructure: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        loading: {
            type: Boolean,
            default: function() {
                return false;
            }
        },
        // 这是相应的字段展示
        columns: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 这是数据源
        dataSource: {
            type: Array,
            default: function() {
                return [];
            }
        },
        // 是否默认展开所有树
        defaultExpandAll: {
            type: Boolean,
            default: function() {
                return false;
            }
        }
    },
    data() {
        return {};
    },
    computed: {
        // 格式化数据源
        data: function() {
            let me = this;
            if (me.treeStructure) {
                let data = Utils.MSDataTransfer.treeToArray(
                    me.dataSource,
                    null,
                    null,
                    me.defaultExpandAll
                );
                return data;
            }
            return me.dataSource;
        }
    },
    filters: {
        
    },
    methods: {
        // 显示行
        showTr: function(rowData, index) {
            let row = rowData.row;
            let show = row._parent
                ? row._parent._expanded && row._parent._show
                : true;

            row._show = show;

            return show ? "" : "display:none;";
        },
        // 展开下级
        toggle: function(trIndex) {
            // console.log("我点击了" + trIndex);
            let me = this;
            let record = me.data[trIndex];
            // console.log("record:", record);
            record._expanded = !record._expanded;
        },
        // 显示层级关系的空格和图标
        spaceIconShow(index) {
            let me = this;
            if (me.treeStructure && index === 0) {
                return true;
            }
            return false;
        },
        // 点击展开和关闭的时候，图标的切换
        toggleIconShow(index, record) {
            let me = this;
            if (
                me.treeStructure &&
                index === 0 &&
                record.children &&
                record.children.length > 0
            ) {
                return true;
            }
            return false;
        },
        handleSelectionChange(val) {
            this.$emit("multipleSelection", val);
        },
        tableSort(row) {
            let sortData = "";
            if (row.order == "descending") {
                sortData = row.prop + " desc";
            } else {
                sortData = row.prop;
            }
            // console.log(sortData)
            this.$emit("sort", sortData);
        },
        showFileList(data) {
            this.$emit("fileList", data);
        }
    }
};
</script>
<style scoped>
.ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: "Glyphicons Halflings";
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 15px;
    height: 14px;
}
.ms-tree-space::before {
    content: "";
}
table td {
    line-height: 26px;
}
</style>
