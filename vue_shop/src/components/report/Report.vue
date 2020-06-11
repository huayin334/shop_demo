<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域-->
    <el-card>
      <div class="chart">122</div>
    </el-card>
  </div>
</template>

<script>
  import echarts from "echarts";

  export default {

    data() {
      return {};
    },
    created() {
    },
    //此时页面上的元素已经被渲染完毕了
    mounted() {
      let myChart = echarts.init(document.querySelector(".chart"));
      // 指定配置项和数据
      let option = {
        color: ["#2f89cf"],
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: "0%",
          top: "10%",
          right: "0%",
          bottom: "4%",
          containLabel: true
        },
        xAxis: [{
          type: "category",
          data: ["旅游行业", "金融行业", "IT行业", "洗脚行业", "吃饭行业", "捡垃圾", "外卖行业"],
          axisTick: {
            alignWithLabel: true
          },
          axisLabel: {
            color: "#9ea4bb",
            fontSize: "9"
          },
          // 不显示坐标轴的线 x轴的那条黑线
          axisLine: {
            show: false

          }
        }],
        yAxis: [{
          type: "value",
          axisLabel: {
            color: "rgba(255,255,255,.6)",
            fontSize: "12"
          },
          // y轴线条的颜色
          axisLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)",
              width: 2
            }

          },
          // y轴分割线的颜色
          splitLine: {
            lineStyle: {
              color: "rgba(255,255,255,.1)"
            }
          }
        }],
        series: [{
          name: "直接访问",
          type: "bar",
          barWidth: "35%",
          data: [10, 52, 200, 334, 390, 330, 220],
          itemStyle: {
            barBorderRadius: 5
          }
        }]
      };
      // 把配置项给实例对象
      myChart.setOption(option);
      // 让图表自适应屏幕
      window.addEventListener("resize", function () {
        myChart.resize();
      });
    },
    methods: {}
  };
</script>

<style lang='less' scoped>
  .chart {
    width: 400px;
    height: 400px;
  }
</style>
