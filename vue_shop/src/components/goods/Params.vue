<!--
 * @Author: your name
 * @Date: 2020-03-30 19:37:47
 * @LastEditTime: 2020-03-31 12:02:50
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /studyCode/vue_shop/src/components/goods/Params.vue
 -->
<!--TODO：代办-->
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 警告提示 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tabs标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数的面板 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加参数
          </el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(scope.row,i)" :disable-transitions="true">
                  {{item}}
                </el-tag>
                <!--输入文本框-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--添加tag按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 新增标签</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑
                </el-button>
                <el-button
                  size="mini"
                  icon="el-icon-delete"
                  type="danger"
                  @click="showDelDialog(scope.row.attr_id)"
                >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加属性的面板 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible = true"
          >添加属性
          </el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" closable @close="handleClose(scope.row,i)" :disable-transitions="true">
                  {{item}}
                </el-tag>
                <!--输入文本框-->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!--添加tag按钮-->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ 新增标签</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  icon="el-icon-edit"
                  type="primary"
                  @click="showEditDialog(scope.row.attr_id)"
                >编辑
                </el-button
                >
                <el-button size="mini" icon="el-icon-delete" type="danger"
                           @click="showDelDialog(scope.row.attr_id)"
                >删除
                </el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框-公用一个对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数的表单 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数的对话框-公用一个对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 修改参数的表单 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
    <!--删除按钮-对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="delDialogVisible"
      width="30%"
    >
      <span>确定要删除吗？</span>
      <span slot="footer" class="dialog-footer">
    <el-button @click="delDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="delAttr">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        //商品分类列表
        catelist: [],
        //级联选择器的配置对象
        cateProps: {
          value: "cat_id",
          label: "cat_name",
          children: "children",
          expandTrigger: "hover"
        },
        //级联选择器双向绑定的数据
        selectedCateKeys: [],
        //被激活的页签名称
        activeName: "many",
        //动态属性的数据
        manyTableData: [],
        //静态属性的数据
        onlyTableData: [],
        //控制添加动态框的显示与隐藏
        addDialogVisible: false,
        //添加参数的表单数据对象
        addForm: {},
        //添加表单的验证规则对象
        addFormRules: {
          attr_name: [
            {
              required: "true",
              message: "请输入参数",
              trigger: "blur"
            }
          ]
        },
        //控制修改动态框的显示与隐藏
        editDialogVisible: false,
        //修改参数的表单数据对象
        editForm: {},
        //修改表单的验证规则对象
        editFormRules: {
          attr_name: [
            {
              required: "true",
              message: "请输入参数",
              trigger: "blur"
            }
          ]
        },
        delDialogVisible: false,
        delAttrId: "",
        inputVisible: false,
        //文本框输入的内容
        inputValue: ""
      };
    },
    created() {
      this.getCateList();
    },
    methods: {
      //获取所有的商品分类
      async getCateList() {
        const {data: res} = await this.$http.get("categories");
        if (res.meta.status !== 200) return this.$message.error("获取失败");
        this.catelist = res.data;
        //console.log(this.catelist)
      },
      // 级联选择框选择项发生变化，会触发这个函数
      handleChange() {
        this.getParamsData();
      },
      // tab页签点击事件的处理函数
      handleTabClick() {
        //   console.log(this.activeName)
        this.getParamsData();
      },
      // 动态和静态属性的表格
      async getParamsData() {
        //  console.log(this.selectedCateKeys)
        // 只允许选择三级分类
        if (this.selectedCateKeys.length !== 3) {
          this.selectedCateKeys = [];
          //把下面的表格也清空
          this.manyTableData = [];
          this.onlyTableData = []
        } else {
          // 根据所选id和当前所处的面板，获取对应的参数
          const {data: res} = await this.$http.get(
            `categories/${this.cateId}/attributes`,
            {
              params: {sel: this.activeName}
            }
          );
          if (res.meta.status !== 200) return this.$message.error("获取失败");
          // console.log(res.data);
          this.$message.success("获取成功");
          res.data.forEach(item => {
            //用空格分割字符串 转换为数组
            //判断是否为空 若为空直接返回空数组
            item.attr_vals = item.attr_vals ? item.attr_vals.split(",") : [];
            //  循环的时候顺便给data绑定inputVisible和inputValue
            //  这样每一行的tag新增标签都是一个独特的tag标签，不会互相影响
            //  控制文本框的显示与隐藏
            item.inputVisible = false;
            //  控制文本框中输入的值
            item.inputValue = "";

          });
          console.log(res.data);
          if (this.activeName === "many") {
            this.manyTableData = res.data;
            //   console.log(this.manyTableData)
          } else {
            this.onlyTableData = res.data;
            // console.log(this.onlyTableData)
          }
        }
      },
      // 监听添加对话框的关闭事件
      addDialogClosed() {
        // 重置表单
        this.$refs.addFormRef.resetFields();
      },
      // 确定按钮
      addParams() {
        // 表单的预验证
        this.$refs.addFormRef.validate(async valid => {
          if (!valid) return console.log("失败");
          console.log(this.cateId);
          console.log(this.addForm.attr_name);
          console.log(this.activeName);

          const {data: res} = await this.$http.post(
            `categories/${this.cateId}/attributes`,
            {
              attr_name: this.addForm.attr_name,
              attr_sel: this.activeName
            }
          );
          console.log(res);
          if (res.meta.status !== 201) return this.$message.error("添加参数失败");
          this.$message.success("添加参数成功");
          this.getParamsData();
          this.addDialogVisible = false;
        });
      },
      // 编辑动态或者静态参数
      async showEditDialog(attr_id) {
        this.editDialogVisible = true;
        const {data: res} = await this.$http.get(
          `categories/${this.cateId}/attributes/${attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200) return this.$message.error("获取失败");
        console.log(res.data.attr_name);
        // 将获取到的数据，展示在表单中
        this.editForm = res.data;
      },
      // 监听编辑参数的对话框的关闭事件
      editDialogClosed() {
        // 重置表单
        this.$refs.editFormRef.resetFields();
      },
      // 点击确定按钮修改参数
      editParams() {
        //  表单的预验证
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return;
          const {data: res} = await this.$http.put(
            `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
            {
              attr_name: this.editForm.attr_name,
              attr_sel: this.activeName
            }
          );
          if (res.meta.status !== 200) return this.$message.error("更新失败");
          this.$message.success("更新成功");
          // 刷新表格
          this.getParamsData();
          //关闭对话框
          this.editDialogVisible = false;
        });
      },
      //删除按钮
      showDelDialog(delAttrId) {
        this.delAttrId = delAttrId;
        this.delDialogVisible = true;
      },
      //确定删除
      async delAttr() {
        const {data: res} = await this.$http.delete(`categories/${this.cateId}/attributes/${this.delAttrId}`);
        if (res.meta.status !== 200) return this.$message.error("删除失败");
        this.$message.success("删除成功");
        this.delDialogVisible = false;
        this.getParamsData();
        this.delAttrId = "";
      },
      //控制新添加tag的input框和btn切换
      showInput(row) {
        row.inputVisible = true;
        //让文本框自动获取焦点
        //$nextTick当页面的元素被重新渲染时，才会调用回调函数
        //因为input被渲染出来的时候，才能获取到input元素
        this.$nextTick(() => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
      //文本框失去了焦点或者按下enter都会触发
      async handleInputConfirm(row) {
        //去除头尾空格 trim不会改变原字符串
        let inputValue = row.inputValue.trim();
        if (inputValue.length === 0) {
          row.inputVisible = false;
          row.inputValue = "";
          return 0;
        }
        /*
        * 输入的内容需要做后续处理
        * 将输入的值加入到attr_vals数组中
        * */
        row.attr_vals.push(inputValue);
        //关闭input，并且input的值设为空
        row.inputValue = "";
        row.inputVisible = false;
        this.saveAttrVals(row);
      },
      async saveAttrVals(row) {
        //发起网络请求，保存这次操作
        const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          //将数组转为字符串
          attr_vals: row.attr_vals.join(",")
        });
        if (res.meta.status !== 200) {
          return this.$message.error("修改失败");
        } else {
          this.$message.success("修改成功");
        }
      },
      //关闭tag标签,删除对应的参数
      handleClose(row, i) {
        console.log(row);
        row.attr_vals.splice(i, 1);
        // this.getParamsData();
        // this.$message.success("删除成功");
        this.saveAttrVals(row);
      }
    },


    //计算属性
    computed: {
      //如果按钮需要被禁用 返回true
      isBtnDisabled() {
        if (this.selectedCateKeys.length !== 3) {
          return true;
        } else {
          return false;
        }
      }
      ,
      //   当前选中的三级分类的id
      cateId() {
        if (this.selectedCateKeys.length === 3) {
          return this.selectedCateKeys[2];
        } else {
          return null;
        }
      }
      ,
      // 动态计算标题的文本
      titleText() {
        if (this.activeName === "many") {
          return "动态参数";
        } else {
          return "静态属性";
        }
      }
    }
  }
  ;
</script>

<style lang="less" scoped>
  .cat_opt {
    margin: 15px 0;

    .el-cascader {
      margin: 0 15px;
      width: 400px;
    }
  }

  .el-table {
    margin-top: 15px;
  }

  .el-tag {
    margin: 5px;
  }

  /*控制输入框的长度*/
  .input-new-tag {
    width: 120px;
  }
</style>
