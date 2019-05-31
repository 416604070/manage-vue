<template>
    <!--<ElUpload></ElUpload>-->
    <el-upload
        class="upload-demo"
        action=""
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :http-request="fnUploadRequest"
        :file-list="fileList2"
        list-type="picture">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
</template>

<script>
    // import ElUpload from "../../components/File/ElUpload";
    import { createUUID } from '../../utils/UUID/UUIDUtil'
    import OSS from 'ali-oss'
    export default {
        name: "file",
       /* components: {
            ElUpload
        },*/
        data() {
            return {
                fileList2: [
                    {
                        name: 'food.jpeg',
                        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                    }, {
                        name: 'food2.jpeg',
                        url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                    }
                ],
            }
        },
        mounted() {

        },
        methods: {
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            async fnUploadRequest (option) {
                console.log("fnUploadRequest");
                try {
                    let vm = this;
                    let OSS = require('ali-oss');
                    let fs = require('fs');
                    let client = new OSS(this.$Config.aliyunOss);
                    vm.disabled = true;
                    // 获取OSS配置信息
                    const file = option.file;
                    const fileName = file.name;
                    const point = fileName.lastIndexOf('.');
                    let suffix = fileName.substr(point);
                    let newFileName = createUUID()+ suffix;

                    // 分片上传文件
                    let ret = await client.multipartUpload(newFileName, file, {
                        progress: async function (p) {
                            let e = {};
                            e.percent = p * 100;
                            option.onProgress(e)
                        }
                    });
                    console.log(ret);
                    if (ret.res.statusCode === 200) {
                        // option.onSuccess(ret)
                        return ret
                    } else {
                        vm.disabled = false;
                        option.onError('上传失败')
                    }
                } catch (error) {
                    console.error(error);
                    this.disabled = false;
                    option.onError('上传失败');
                    this.$error(error.message)
                }
            },
        },
    }
</script>

<style scoped>

</style>
