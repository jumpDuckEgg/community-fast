<template>
  <div class="upload">
    <el-row class="material" justify type="flex">
      <el-col>
        <el-upload :disabled="uploadFlag" :action="uploadUrl"  :list-type="listType" :headers="headData" :on-change="handleChange" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :limit="limitFlieNumber" :on-success="handleSuccess" :file-list="fileList" :before-upload="beforeUpload" :on-exceed="handleExceed" :on-progress="handleProgress" :on-error="handleError">
          <el-button size="small" type="primary" v-if="listType != 'picture-card'">点击上传</el-button>
          <i class="el-icon-plus" v-if="listType == 'picture-card'"></i>
        </el-upload>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import SERVER from "@/api/config";
export default {
    name: "upload",
    props: {
        fileList: {
            type: Array,
            default: function(){
                return []
            }
        },
        limitFlieNumber: {
            type: Number,
            default: 1
        },
        buttonFlag: {
            type: Boolean,
            default: false
        },
        listType: {
            type:String,
            default:'text' //text/picture/picture-card
        }

    },
    data() {
        return {
            uploadUrl: "",
            headData: {},
            uploadFlag:false
        };
    },
    created() {
        let url = SERVER.BASE_URL + "/sys/oss/upload";
        this.uploadUrl = url;

        this.headData = { token: `${getToken()}` };
    },
    methods: {
        handleProgress() {
            this.uploadFlag = true;
            this.$emit("update:buttonFlag", true);
        },
        handleSuccess(response, file, fileList) {
            if(response.code!=200){
                this.$message({
                    type:'error',
                    message: response.msg
                })
            }else {
                this.$message({
                    type:'success',
                    message:'上传成功'
                })
            }
            
            this.uploadFlag = false;
            this.$emit("update:fileList", fileList);
            this.$emit("update:buttonFlag", false);
        },
        handleRemove(file, fileList) {
             this.$emit("update:fileList", fileList);
        },
 
        handleExceed(files, fileList) {
            this.$message.warning(
                `当前限制选择 ${this.limitFlieNumber} 个文件，本次选择了 ${
                    files.length
                } 个文件，共选择了 ${files.length + fileList.length} 个文件`
            );
        },
        handleChange(file, fileList){
             
        },
        beforeRemove(file, fileList) {
            // return this.$confirm(`确定移除 ${file.name}？`);
            // 文件移除的时候触发的方法
        },
        beforeUpload(file) {
            return true;
        },
        handleError(err, file, fileList){
            this.$message({
                type:'error',
                message:JSON.stringify(err)
            })
            this.uploadFlag = false;
        }
    }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'scoped>
.upload {
    //   margin: 20px 0;
}
</style>