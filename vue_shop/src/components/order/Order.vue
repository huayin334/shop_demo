<template>
  <div class="bg">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区-->
    <el-card class="cd">
      <!--搜索框-->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--商品列表-->
      <el-table
        :data="orderList"
        :header-cell-style="tableHeaderColor"
        :row-style="tableRowStyle">
        style="width: 100%" stripe>
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column label="订单编号" prop="order_number" width="300"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay ==='1'" type="success">已付款</el-tag>
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="100"></el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="300"></el-table-column>
        <el-table-column label="操作" prop="order_pay">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button type="success" icon="el-icon-location" size="mini" @click="showProgressbox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--  分页区域-->
      <el-pagination
        class="feny"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5,10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!--修改地址的对话框-->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      @close="addressDialogClosed"
      width="50%">
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"
                       :props="{ expandTrigger: 'hover' }"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addressVisible = false">取 消</el-button>
    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
  </span>
    </el-dialog>

    <!--展示物流进度的对话框-->
    <el-dialog
      title="物流提示"
      :visible.sync="progressVisible"
      width="50%"
    >
      <el-timeline :reverse="false">
        <el-timeline-item
          v-for="(activity, index) in progressDataList"
          :key="index"
          :color="'#46a0fc'"
          :timestamp="activity.time">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      <span slot="footer" class="dialog-footer">

  </span>
    </el-dialog>

  </div>
</template>

<script>
  import cityData from "./citydata";

  export default {
    data() {
      return {
        queryInfo: {
          query: "",
          pagenum: 1,
          pagesize: 5
        },
        //商品列表
        orderList: [],
        total: 0,
        addressVisible: false,
        addressForm: {
          address1: [],
          address2: ""
        },
        addressFormRules: {
          address1: [{
            required: true,
            message: "请选择省市区/县",
            trigger: "blur"
          }], address2: [{
            required: true,
            message: "请填写详细地址",
            trigger: "blur"
          }]
        },
        cityData,
        progressVisible: false,
        //物流进度
        progressDataList: []

      };
    },
    created() {
      this.getOrderList();
    },
    methods: {
      async getOrderList() {
        const {data: res} = await this.$http.get(`orders`, {params: this.queryInfo});
        if (res.meta.status !== 200) return this.$message.error("获取列表失败");
        // console.log(res);
        res.data.goods.forEach(item => {
          // console.log(item.create_time);
          item.create_time = this.toDate(item.create_time + 1000);
        });
        this.orderList = res.data.goods;
        this.total = res.data.total;
        this.$message.success("获取成功");
      },
      //  时间戳转日期
      toDate(dates) {
        dates = new Date(dates);
        let year = dates.getFullYear();
        //注意：此处的str.padStart(),前面必须是字符串，我这里本来是数组
        let mon = (dates.getMonth() + 1 + "").padStart(2, "0");
        let date = (dates.getDate() + "").padStart(2, "0");
        let hour = (dates.getHours() + "").padStart(2, "0");
        let min = (dates.getMinutes() + "").padStart(2, "0");
        let sec = (dates.getSeconds() + "").padStart(2, "0");
        return `${year}-${mon}-${date} ${hour}:${min}:${sec}`;
      },
      //pagesize发生改变时触发--每条页数
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        this.getOrderList();
      },
      //pagenum发生改变时触发--当前页数
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        this.getOrderList();
      },
      //展示修改地址的对话框
      showBox() {
        this.addressVisible = true;
      },
      //关闭对话框，清空表单
      addressDialogClosed() {
        this.$refs.addressFormRef.resetFields();
      },
      async showProgressbox() {
        const {data: res} = await this.$http.get(`/kuaidi/1106975712662`);
        if (res.meta.status !== 200) return this.$message.error("获取物流失败");
        console.log(res);
        this.progressDataList = res.data;
        this.progressVisible = true;
      },
      // 修改table tr行的背景色
      tableRowStyle({row, rowIndex}) {
        return {
          "background-color": "#283962",
          "color": "#d6c572"
        };
      },
      // 修改table header的背景色
      tableHeaderColor({row, column, rowIndex, columnIndex}) {
        if (rowIndex === 0) {
          return "background-color: #283962;color: #fff;font-weight: 500;";
        }
      }
    }
  };
</script>

<style lang='less' scoped>
  .el-cascader {
    width: 100%;
  }

  .el-row {
    background-color: #293a61;
  }

  .el-col-8 {
    background-color: #293a61;
  }

  .cd, .bg, .el-main {
    background-color: #2a3b60 !important;
    color: #fef0f0;
  }

  .current-row > td {
    background: rgba(0, 158, 250, 0.219) !important;
  }

  .el-main {
    background-color: #293a61 !important;
  }

  .feny {
    /*background-color: #449ad7!important;*/
  }

  .el-breadcrumb {
    padding: 15px 0 0 10px;
  }

  /*内联元素居中*/
  .text {
    text-align: center; //内联元素水平居中
    line-height: 100px; //垂直居中 和父元素高度设为一样
  }

  /*  块状元素居中*/
  .box {
    width: 100px; //有固定高度
    margin: 0 auto; //水平居中
  }

  /*块状元素水平垂直居中*/
  .box1 {
    position: absolute;
    width: 300px;
    height: 300px;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .box2 {
    position: absolute;
    width: 500px;
    height: 300px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: pink; /*方便看效果*/
  }
/*  flex布局 父元素*/
  .div{
    display: flex;
    justify-content: center;//水平
    align-items: center;//垂直
  }
</style>
