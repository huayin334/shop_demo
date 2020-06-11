<template>
  <div>
    <!-- 面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--    卡片视图区域-->
    <el-card>
      <!--搜索和添加商品-->
      <div class="search">
        <el-input
          clearable
          placeholder="请输入内容"
          v-model="inputSearch"
          clearable
          @click="deleteQuery"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchGoods"
          ></el-button>
        </el-input>
        <el-button type="primary" @click="goAddpage">添加商品</el-button>
      </div>
      <!--商品列表-->
      <el-table :data="goodsData" stripe border>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="630px"></el-table-column>
        <el-table-column label="商品价值(元)" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="150px"></el-table-column>
        <el-table-column label="操作" prop="">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle
                       @click="delGoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 底部分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryData.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>


  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        queryData: {
          query: "",
          //当前第几页
          pagenum: 1,
          //每一页显示多少条
          pagesize: 10
        },
        //商品列表
        goodsData: [],
        //  商品名称列表
        goodsNameList: [],
        //  输入框文字
        inputSearch: "",
        //  总条数
        total: 0,
        //添加商品的对话框
        addGoodsdialogVisible: false,
        // 添加的商品对象
        queryAddData: {
          goods_name: "",
          goods_cat: [],
          goods_price: "",
          goods_number: "",
          goods_weight: ""
        },
        formLabelWidth: "150"
      };
    },
    created() {
      this.getGoodsList();
    },
    methods: {
      //打开时，请求表格数据
      async getGoodsList() {
        const {data: res} = await this.$http.get("/goods", {params: this.queryData});
        if (res.meta.status !== 200) return this.$message.error("获取失败");

        // console.log(res.data);
        res.data.goods.forEach(item => {
          item.add_time = this.toDate(item.add_time);
        });
        // console.log(res.data);
        this.total = res.data.total;

        this.goodsData = res.data.goods;
        // console.log(this.goodsData);

      },
      //  时间戳转日期
      toDate(dates) {
        dates = new Date(dates);
        let year = dates.getFullYear();
        let mon = dates.getMonth() + 1;
        mon = mon > 9 ? mon : `0${mon}`;
        let date = dates.getDate();
        date = date > 9 ? date : `0${date}`;
        let hour = dates.getHours();
        hour = hour > 9 ? hour : `0${hour}`;
        let min = dates.getMinutes();
        min = min > 9 ? min : `0${min}`;
        let sec = dates.getSeconds();
        sec = sec > 9 ? sec : `0${sec}`;

        return `${year}-${mon}-${date} ${hour}:${min}:${sec}`;
      },
      //  搜索内容
      searchGoods() {
        this.queryData.query = this.inputSearch;
        this.getGoodsList();
      },
      //  清空搜索框
      deleteQuery() {
        this.inputSearch = "";
        this.queryData.query = this.inputSearch;
        this.getGoodsList();
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        this.queryData.pagesize = val;
        this.getGoodsList();
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.queryData.pagenum = val;
        this.getGoodsList();
      },
      goAddpage() {
      this.$router.push('/goods/add')
      },
      //删除商品
      async delGoods(id) {
        const confirmResult = await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).catch(err => err);
        if (confirmResult !== "confirm") return this.$message.info("已取消删除");
        const {data: res} = await this.$http.delete(`goods/${id}`);
        // console.log(res)
        if (res.meta.status!== 200) return this.$message.info("已取消删除");
        this.$message.success("删除成功");
        this.getGoodsList();
      }

    },
    watch: {
      //监听输入框的内容是否发生改变 假如改变重新请求并渲染数据
      inputSearch: function () {
        this.queryData.query = this.inputSearch;
        this.getGoodsList();
      }
    }

  };
</script>

<style scoped lang="less">
  .el-card {
    .search {
      display: flex;
      justify-content: flex-start;

      .el-input {
        width: 500px;
        margin-right: 10px;
      }

      .el-button {
        height: 40px;
      }
    }

    .el-table {
      font-size: 13px !important;

    }

  }

  .num {
    width: 100px !important;
    margin-right: 20px;
  }

  .num-box {
    display: flex;
  }
</style>
