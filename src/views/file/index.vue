<template>
  <div class="app-container">
      <el-row  type="flex" justify="start">
        <el-button-group>
        <el-button size="mini" type="primary" plain @click="modifyConfig">修改</el-button>
        </el-button-group>
    </el-row>
      <el-row class="contentBox">
              <el-col class="dialog-title">文件上传配置</el-col>
              <el-form ref="configForm" :inline="true" :model="configForm" :rules="configRule" label-width="120px" >
                <el-form-item label="服务器选择:"  >
                    <el-select v-model="type" :disabled="normalFlag"  placeholder="请选择">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <template v-if="type== '2'">
                    <el-form-item label="访问密钥id:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.aliyunAccessKeyId" placeholder="请输入访问密钥id" ></el-input>
                    </el-form-item>
                    <el-form-item label="访问密钥密码:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.aliyunAccessKeySecret" placeholder="请输入访问密钥密码" ></el-input>
                    </el-form-item>
                    <el-form-item label="空间名称:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.aliyunBucketName" placeholder="请输入空间名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="域名名称:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.aliyunDomain" placeholder="请输入域名名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="端点:"  >
                        <el-input size="small" v-model="configForm.aliyunEndPoint" placeholder="请输入端点名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="前缀:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.aliyunPrefix" placeholder="请输入前缀名称" ></el-input>
                    </el-form-item>
                </template>
                 <template v-if="type== '3'">
                     <el-form-item label="appId:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.qcloudAppId" placeholder="请输入appId" ></el-input>
                    </el-form-item>
                    <el-form-item label="空间名称:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.qcloudBucketName" placeholder="请输入空间名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="域名名称:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.qcloudDomain" placeholder="请输入域名名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="端点:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.qcloudPrefix" placeholder="请输入端点" ></el-input>
                    </el-form-item>
                    <el-form-item label="区域:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.qcloudRegion" placeholder="请输入区域" ></el-input>
                    </el-form-item>
                    <el-form-item label="密钥id:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.qcloudSecretId" placeholder="请输入密钥id" ></el-input>
                    </el-form-item>
                    <el-form-item label="密钥密码:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.qcloudSecretKey" placeholder="请输入密钥密码" ></el-input>
                    </el-form-item>
                </template>
                 <template v-if="type== '1'">
                     <el-form-item label="AccessKey:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.qiniuAccessKey" placeholder="请输入AccessKey" ></el-input>
                    </el-form-item>
                    <el-form-item label="空间名称:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.qiniuBucketName" placeholder="请输入空间名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="域名名称:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.qiniuDomain" placeholder="请输入域名名称" ></el-input>
                    </el-form-item>
                    <el-form-item label="端点:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.qiniuPrefix" placeholder="请输入端点" ></el-input>
                    </el-form-item>
                    <el-form-item label="SecretKey:"  >
                        <el-input size="small" :disabled="normalFlag" v-model="configForm.SecretKey" placeholder="请输入SecretKey" ></el-input>
                    </el-form-item>
                </template>
                <div class="bottonBox"  v-if="!normalFlag">  
                  <el-form-item >
                    <el-button size="small" type="primary"  @click="saveConfig"  >修改</el-button>
                    <el-button  size="small"  >取消</el-button>
                  </el-form-item>
                </div>
              </el-form>
          </el-row>
  </div>
</template>

<script>
import { getConfig ,saveConfig } from '@/api/file'

export default {
  data() {
    return {
        type:'',
        configForm:{
            type:'',
            aliyunAccessKeyId:'',
            aliyunAccessKeySecret:'',
            aliyunBucketName:'',
            aliyunDomain:'',
            aliyunEndPoint:'',
            aliyunPrefix:'',
            qcloudAppId:'',
            qcloudBucketName:'',
            qcloudDomain:'',
            qcloudPrefix:'',
            qcloudRegion:'',
            qcloudSecretId:'',
            qcloudSecretKey:'',
            qiniuAccessKey:'',
            qiniuBucketName:'',
            qiniuDomain:'',
            qiniuPrefix:'',
            qiniuSecretKey:''
        },
        normalFlag:true,
        configRule:{},
        // 服务选择项
        options:[
            {
                value: 1,
                label: '七牛云'
            },
            {
                value: 2,
                label: '阿里云'
            },
            {
                value: 3,
                label: '腾讯云'
            }
        ]
    }
  },
  created(){
      this.getConfigData();
  },
 
  watch:{

  },
  methods: {
      saveConfig(){
          this.configForm.type = this.type;
          saveConfig(this.configForm).then(res=>{
              this.$message({
                  type:'success',
                  message:'修改成功'
              });
              this.getConfigData();
          }).finally(()=>{
              this.normalFlag = true;
          })
      },
       getConfigData(){
            getConfig().then(res=>{
                this.type = res.data.type;
                for(let i in this.configForm){
                    this.configForm[i] = res.data[i];
                }
            })
        },
 
        modifyConfig(){
            this.normalFlag = false;
        }
  }
}
</script>

<style lang="scss" scoped>
.contentBox {
  margin-top: 20px;
  border: 1px solid #b3d8ff;
  padding:20px 10px;
  padding-bottom: 0;
  border-radius: 6px;
}
.dialog-title {
    border-left-width: 4px;
    border-left-color: deepskyblue;
    border-left-style: solid;
    padding-left: 10px;
    margin-bottom: 20px;
}
.bottonBox {
  text-align: center;
}
</style>



