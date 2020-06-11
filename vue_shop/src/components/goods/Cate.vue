<!--
 * @Author: your name
 * @Date: 2020-03-29 15:14:53
 * @LastEditTime: 2020-03-30 19:30:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /studyCode/vue_shop/src/components/goods/Cate.vue
 -->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
          >添加分类
          </el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treetable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
            style="color:lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color:red"> </i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag
            v-else-if="scope.row.cat_level === 1"
            size="mini"
            type="success">二级
          </el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" size="mini" icon="el-icon-edit"
          >编辑
          </el-button
          >
          <el-button type="danger" size="mini" icon="el-icon-delete"
          >删除
          </el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCatedialogVisible"
      width="50%"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFromRules"
        ref="addCateFromRef"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:">
          <!-- 级联选择器 -->
          <el-cascader
            clearable
            change-on-select
            expand-trigger="hover"
            v-model="selectedKeys"
            :options="parentCateList"
            :props="cascaderProps"
            @change="parentCateChanged"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogClosed">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        //查询条件
        queryInfo: {
          type: 3,
          //默认第一页
          pagenum: 1,
          //每一页显示多少条数据
          pagesize: 5
        },
        //商品分类的数据列表，默认为空
        catelist: [],
        //总条数
        total: 0,
        // 为table指定列的定义
        columns: [
          {
            label: "分类名称",
            prop: "cat_name"
          },
          {
            label: "是否有效",
            //表示将当前列定义为模版列
            type: "template",
            // 表示当前这一列使用模版名称
            template: "isok"
          },
          {
            label: "排序",
            //表示将当前列定义为模版列
            type: "template",
            // 表示当前这一列使用模版名称
            template: "order"
          },
          {
            label: "操作",
            //表示将当前列定义为模版列
            type: "template",
            // 表示当前这一列使用模版名称
            template: "opt"
          }
        ],
        // 控制添加分类对话框的显示与隐藏
        addCatedialogVisible: false,
        // 添加分类的表单对象
        addCateForm: {
          // 将要添加分类的名称
          cat_name: "",
          // 父级分类的id
          cat_pid: 0,
          // 分类等级
          cat_level: 0
        },
        formLabelWidth: "120px",
        // 添加分类表单的验证规则对象
        addCateFromRules: {
          cat_name: [
            {required: true, message: "请输入分类名称", trigger: "blur"}
          ]
        },
        // 父级分类的列表
        parentCateList: [],
        // 指定级联选择器配置对象
        cascaderProps: {
          value: "cat_id",
          label: "cat_name",
          children: "children",
          expandTrigger: "hover"
        },
        // 选中的父级分类的id数组
        selectedKeys: []
      };
    },
    created() {
      //获取商品数据
      this.getCateList();
    },
    methods: {
      //获取商品分类数据
      async getCateList() {
        const {data: res} = await this.$http.get("categories", {
          params: this.queryInfo
        });
        if (res.meta.status !== 200) return this.$message.error("获取失败");
        this.$message.success("获取数据成功");
        // 把数据列表赋值给catelist
        this.catelist = res.data.result;
        this.total = res.data.total;
      },
      // 监听pagesize改变
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize;
        // 刷新页面
        this.getCateList();
      },
      // 监听pagenum的改变
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage;
        // 刷新页面
        this.getCateList();
      },
      showAddCateDialog() {
        // 获取父级分类的数据列表
        this.getParentCateList();
        this.addCatedialogVisible = true;
      },
      // 获取父级分类的数据列表
      async getParentCateList() {
        const {data: res} = await this.$http.get("categories", {
          params: {type: 2}
        });
        if (res.meta.status !== 200) return this.$message.error("获取数据失败");
        this.$message.success("获取数据成功");
        this.parentCateList = res.data;
        console.log(this.parentCateList);
      },
      // 选择项发生变化触发这个函数
      parentCateChanged() {
        // console.log(this.selectedKeys)
        // 大于0表示选中了父级分类 反之没有选中任何父级分类
        if (this.selectedKeys.length > 0) {
          // console.log(this.selectedKeys[this.selectedKeys.length - 1])
          // 父级分类的id
          this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
            ];
          // 为当前分类等级赋值
          this.addCateForm.cat_level = this.selectedKeys.length;
          return;
        } else {
          // 父id为0，代表没有父id
          this.addCateForm.cat_pid = 0;
          // 等级为0 代表是一级分类
          this.addCateForm.cat_level = 0;
        }
      },
      // 点击确定按钮，添加新的分类
      addCate() {
        // console.log(this.addCateForm)
        this.$refs.addCateFromRef.validate(async valid => {
          if (!valid) return;
          const {data: res} = await this.$http.post(
            "categories",
            this.addCateForm
          );
          if (res.meta.status !== 201) {
            return this.$message.error("添加失败");
          } else {
            this.getCateList();
            this.addCateDialogClosed();
            this.$message.success("添加分类成功");
          }
        });
      },
      // 监听对话框的关闭事件
      addCateDialogClosed() {
        // 关闭对话框
        this.addCatedialogVisible = false;
        //清空表单数据
        this.$refs.addCateFromRef.resetFields();
        // 清空级联选择器;
        this.selectedKeys = [];
        this.addCateForm.cat_level = 0;
        this.addCateForm.cat_pid = 0;
      }
    }
  };
</script>

<style lang="less" scoped>
  .treetable {
    margin-top: 10px;
  }

  .el-cascader {
    width: 100%;
    overflow: hidden;
  }
</style>
