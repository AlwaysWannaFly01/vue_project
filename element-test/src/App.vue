<template>
  <div id="app">
      <el-button primary="default" @click="show">按钮</el-button>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  methods: {
      show(){
          this.$message('提示')
      }
  },
}
</script>

<style>

</style>
