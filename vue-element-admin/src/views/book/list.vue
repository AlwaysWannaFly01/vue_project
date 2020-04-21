<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.title"
        placeholder="书名"
        style="width:200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-input
        v-model="listQuery.author"
        placeholder="作者"
        style="width:200px"
        class="filter-item"
        clearable
        @keyup.enter.native="handleFilter"
        @clear="handleFilter"
        @blur="handleFilter"
      />
      <el-select
        v-model="listQuery.category"
        placeholder="分类"
        clearable
        class="filter-item"
        @change="handleFilter"
      >
        <el-option
          v-for="item in categoryList"
          :key="item.value"
          :value="item.value"
          :label="item.label + '(' + item.num +')'"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        style="margin-left:10px"
        @click="handleFilter"
      >查询</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        style="margin-left:10px"
        @click="handleCreate"
      >新增</el-button>
      <el-checkbox
        v-model="showCover"
        class="filter-item"
        style="margin-left:10px"
        @click="changeShowCover"
      >显示封面</el-checkbox>
    </div>
    <el-table />
    <pagination :total="0" />
  </div>
</template>

<script>
import Pagination from "../../components/Pagination/index";
import waves from "../../directive/waves/waves";
import { getCategory } from "@/api/book";
export default {
  components: {
    Pagination
  },
  directives: {
    waves
  },
  data() {
    return {
      listQuery: {
        title: ""
      },
      showCover: false,
      categoryList: []
    };
  },
  mounted() {
    this.getCategoryList();
  },
  methods: {
    handleFilter() {
      console.log("handleFilter", this.listQuery);
    },
    handleCreate() {
      this.$router.push("/book/create");
    },
    changeShowCover(value) {
      this.showCover = value;
    },
    getCategoryList() {
      getCategory()
        .then(response => {
          if (response.code === 0) {
            this.categoryList = response.data;
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }
};
</script>

<style lang="scss">
</style>
