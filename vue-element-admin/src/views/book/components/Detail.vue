<template>
  <el-form ref="postForm" :model="postForm" :rules="rules">
    <!-- 不能写成 v-model的形式，要写:model;否则表单验证不生效 -->
    <Sticky :class-name="'sub-navbar ' + postForm.status">
      <el-button v-if="!isEdit" @click="showGuide">显示帮助</el-button>
      <el-button
        v-loading="loading"
        type="success"
        style="margin-left:10px"
        @click="submitForm"
      >{{ isEdit?'编辑电子书':'新增电子书' }}</el-button>
    </Sticky>
    <div class="detail-container">
      <el-row>
        <Warning />
        <el-col :span="24">
          <EbookUpload
            :file-list="fileList"
            :disabled="isEdit"
            @onSuccess="onUploadSuccess"
            @onRemove="onUploadRemove"
          />
        </el-col>
        <el-col :span="24">
          <el-form-item prop="title">
            <MdInput v-model="postForm.title" :maxlength="100" name="name" required>书名</MdInput>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="author" label="作者：" :label-width="labelWidth">
                <el-input v-model="postForm.author" placeholder="作者" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="publisher" label="出版社：" :label-width="labelWidth">
                <el-input v-model="postForm.publisher" placeholder="出版社" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="language" label="语言：" :label-width="labelWidth">
                <el-input v-model="postForm.language" placeholder="语言" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="rootFile" label="根文件：" :label-width="labelWidth">
                <el-input v-model="postForm.rootFile" placeholder="根文件" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="filePath" label="文件路径：" :label-width="labelWidth">
                <el-input v-model="postForm.filePath" placeholder="文件路径" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="unzipPath" label="解压路径：" :label-width="labelWidth">
                <el-input v-model="postForm.unzipPath" placeholder="解压路径" disabled />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="coverPath" :label-width="labelWidth" label="封面路径：">
                <el-input
                  v-model="postForm.coverPath"
                  placeholder="封面路径"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="originalName" :label-width="labelWidth" label="文件名称：">
                <el-input
                  v-model="postForm.originalName"
                  placeholder="文件名称"
                  style="width: 100%"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item prop="cover" :label-width="labelWidth" label="封面：">
                <a v-if="postForm.cover" :href="postForm.cover" target="_blank">
                  <img :src="postForm.cover" class="preview-img">
                </a>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label-width="labelWidth" label="目录：">
                <div
                  v-if="postForm.contents && postForm.contents.length > 0"
                  class="contents-wrapper"
                >
                  <el-tree :data="contentsTree" @node-click="onContentClick" />
                </div>
                <span v-else>无</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
/* eslint-disable */
import Sticky from "@/components/Sticky";
import Warning from "./Warning";
import EbookUpload from "@/components/EbookUpload";
import MdInput from "@/components/MDinput";
import { createBook } from "@/api/book";
// const defaultForm = {
//   title: "",
//   author: "",
//   publisher: "",
//   language: "",
//   rootFile: "",
//   cover: "",
//   url: "",
//   originalName: "",
//   contents: [],
//   fileName: "",
//   coverPath: "",
//   filePath: "",
//   unzipPath: ""
// };
const fields = {
  title: "书名",
  author: "作者",
  publisher: "出版社",
  language: "语言"
};
export default {
  props: {
    isEdit: Boolean
  },
  components: {
    Sticky,
    Warning,
    EbookUpload,
    MdInput
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error(fields[rule.field] + "必须填写"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      postForm: {
        status: "deleted",
        // status: "draft",
        title: "",
        author: "",
        publisher: "",
        language: ""
      },
      fileList: [],
      labelWidth: "120px",
      contentsTree: [],
      rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }]
      }
    };
  },
  methods: {
    showGuide() {
      console.log("show guide");
    },
    submitForm() {
      console.log("submitForm");
      if (!this.loading) {
        this.loading = true;
        this.$refs.postForm.validate((valid, fields) => {
          console.log(valid, fields);
          if (valid) {
            console.log(this.postForm);
            // const book = {...this.postForm}
            /* 前拷贝 */
            const book = Object.assign({}, this.postForm);
            /* 将无用的字段删除 */
            // delete book.contents;
            console.log(book);
            if (!this.isEdit) {
              createBook(book)
                .then(res => {
                  console.log(res);
                  const { msg } = res;
                  this.$notify({
                    title: "操作成功",
                    message: msg,
                    type: "success",
                    duration: 2000
                  });
                  this.loading = false;
                  // this.setDefault();
                })
                .catch(err => {
                  this.loading = false;
                  console.log(err);
                });
            } else {
              // updateBook(book)
            }
          } else {
            const message = fields[Object.keys(fields)[0]][0].message;
            this.$message({
              message,
              type: "error"
            });
            this.loading = false;
          }
        });
      }
    },
    onUploadSuccess(data) {
      console.log("onUploadSuccess", data);
      this.setData(data);
    },
    onUploadRemove() {
      console.log("onUploadRemove");
      this.setDefault();
    },
    setData(data) {
      // debugger;
      const {
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        contentsTree,
        fileName,
        coverPath,
        filePath,
        unzipPath
      } = data;
      this.postForm = {
        ...this.postForm,
        title,
        author,
        publisher,
        language,
        rootFile,
        cover,
        url,
        originalName,
        contents,
        fileName,
        coverPath,
        filePath,
        unzipPath
      };
      this.contentsTree = contentsTree;
    },
    onContentClick(data) {
      console.log(data);
      if (data.text) {
        window.open(data.text);
      }
    },
    setDefault() {
      // this.postForm = Object.assign({}, defaultForm);
      this.contentsTree = [];
      this.fileList = [];
      this.$refs.postForm.resetFields()
    }
  }
};
</script>
<style lang="scss" scoped>
.detail-container {
  padding: 40px 50px 20px;
  .preview-img {
    width: 200px;
    height: 270px;
  }
}
</style>
