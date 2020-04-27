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
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width:100%"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" />
      <el-table-column label="书名" prop="name" align="center" width="150">
        <template slot-scope="{row : {titleWrapper}}">
          <span v-html="titleWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="作者" align="center" width="150">
        <template slot-scope="{row : { authorWrapper }}">
          <span v-html="authorWrapper" />
        </template>
      </el-table-column>
      <el-table-column label="出版社" prop="publisher" align="center" width="150" />
      <el-table-column label="分类" prop="categoryText" align="center" width="100" />
      <el-table-column label="语言" prop="language" align="center" />
      <el-table-column v-if="showCover" label="封面" width="150" align="center">
        <template slot-scope="{row:{ cover }}">
          <a :href="cover" target="_blank">
            <img :src="cover" style="width:120px;height:180px">
          </a>
        </template>
      </el-table-column>
      <el-table-column label="文件名" prop="fileName" align="center" width="100" />
      <el-table-column label="文件路径" prop="filePath" align="center" width="100">
        <template slot-scope="{row:{ filePath }}">
          <span>{{ filePath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面路径" prop="coverPath" align="center" width="100">
        <template slot-scope="{row:{ coverPath }}">
          <span>{{ coverPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="解压路径" prop="unzipPath" align="center" width="100">
        <template slot-scope="{row:{ unzipPath }}">
          <span>{{ unzipPath | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传人" prop="createUser" align="center" width="100">
        <template slot-scope="{row:{ createUser }}">
          <span>{{ createUser | valueFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传时间" prop="createDt" align="center" width="100">
        <template slot-scope="{row:{ createDt }}">
          <span>{{ createDt | timeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" width="120">
        <template slot-scope="{ row }">
          <el-button type="text" icon="el-icon-edit" @click="handleUpdate(row)" />
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total> 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import Pagination from "../../components/Pagination/index";
import waves from "../../directive/waves/waves";
import { getCategory, listBook } from "@/api/book";
import { parseTime } from "@/filters";
export default {
  components: {
    Pagination
  },
  directives: {
    waves
  },
  filters: {
    valueFilter(value) {
      return value || "无";
    },
    timeFilter(time) {
      return time ? parseTime(time, "{y} -{m}- {d} {h}:{i}") : "无";
    }
  },
  data() {
    return {
      listQuery: {},
      showCover: false,
      categoryList: [],
      tableKey: 0,
      listLoading: true,
      list: [],
      total: 0
    };
  },
  created() {
    this.parseQuery();
  },
  mounted() {
    this.getCategoryList();
    this.getList();
  },
  methods: {
    parseQuery() {
      const listQuery = {
        page: 1,
        pageSize: 20
      };
      this.listQuery = { ...listQuery, ...this.listQuery };
    },
    handleFilter() {
      console.log("handleFilter", this.listQuery);
      this.getList();
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
    },
    getList() {
      this.listLoading = true;
      listBook(this.listQuery)
        .then(response => {
          console.log(response);
          const { list, count } = response.data;
          this.list = list;
          this.total = count;
          this.listLoading = false;
          this.list.forEach(book => {
            book.titleWrapper = this.wrapperKeyword("title", book.title);
            book.authorWrapper = this.wrapperKeyword("author", book.author);
          });
          console.log(this.list);
        })
        .catch(err => {
          console.log(err);
        });
    },
    sortChange(data) {
      console.log("sortChange", data);
      const { prop, order } = data;
      this.sortBy(prop, order);
      this.handleFilter();
    },
    sortBy(prop, order) {
      if (order === "ascending") {
        this.listQuery.sort = `+${prop}`;
      } else {
        this.listQuery.sort = `-${prop}`;
      }
    },
    handleUpdate(row) {
      console.log("row", row);
      this.$router.push(`/book/edit/${row.fileName}`);
    },
    wrapperKeyword(k, v) {
      function highlight(value) {
        return `<span style = "color: salmon">${value}</span>`;
      }

      if (!this.listQuery[k]) {
        return v;
      } else {
        /* i => 表示不区分大小写  g => 表示全局性查询*/
        return v.replace(new RegExp(this.listQuery[k], "ig"), v =>
          highlight(v)
        );
      }
    }
  }
};
</script>

<style lang="scss">
</style>
