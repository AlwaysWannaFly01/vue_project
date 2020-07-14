<template>
  <div id="One">
    One
    <button @click="click">多页面跳转到Two页面</button>
    <!-- <a href= "two.html">链接跳转到Two页面</a> -->
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: "One",
  methods: {
    click() {
      // this.$router.push({path: "/two", query: {id: 12}})
      // const new2 = this.$router.resolve({ name: "/two", params: { id: 1 } });
      // console.log(new2);
      // window.open(new2.location.name, "_blank");

      //在新窗口打开
      const { href } = this.$router.resolve({
        path: "/two",
        query: {
          id:22
        }
      });
      window.open(href, "_blank");
    }
  }
};
</script>

<style>
</style>
