<template>
  <div class="upload-container">
    <el-upload :action="action" :headers="headers">请上传</el-upload>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      action: `${process.env.VUE_APP_BASE_API}/book/upload`
    };
  },
  computed: {
    headers() {
      return {
        Authorization: `Bearer ${getToken()}`
      };
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
