<template>
  <el-form ref="postForm" v-model="postForm">
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
        <el-col :span="24">2</el-col>
        <el-col :span="24">2</el-col>
      </el-row>
    </div>
  </el-form>
</template>

<script>
/* eslint-disable */
import Sticky from "@/components/Sticky";
import Warning from "./Warning";

export default {
  props: {
    isEdit: Boolean
  },
  components: {
    Sticky,
    Warning
  },
  data() {
    return {
      loading: false,
      postForm: {
        status: "deleted"
        // status: "draft",
      }
    };
  },
  methods: {
    showGuide() {
      console.log("show guide");
    },
    submitForm() {
      console.log("submitForm");
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }
};
</script>
<style lang="scss" scoped>
.detail-container {
  padding: 40px 50px 20px;
}
</style>
