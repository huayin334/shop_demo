<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        effect="dark"
        center
        :closable=false
        show-icon>
      </el-alert>

      <!--      步骤条区域-->
      <el-steps :active="activeIndex - 0" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--左侧tab栏-->
      <!--l-table要包裹在el-tabs外面-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
        <el-tabs v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addForm.goods_name" class="el-new-input"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input v-model="addForm.goods_price" type="number" class="el-new-input"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input v-model="addForm.goods_number" type="number" class="el-new-input"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input v-model="addForm.goods_weight" type="number" class="el-new-input"></el-input>
            </el-form-item>
            <el-form-item prop="" label="商品分类">
              <el-cascader
                class="input-new-tag"
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!--渲染表单的item项--动态参数-->
            <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
              <!--复选框组-->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!--渲染表单的item项--静态属性-->
            <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id" label-width="150px">
              <el-input v-model="item.attr_vals" class="el-new-input"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--图片上传---action表示上传的地址-->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handleSuccess"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器组件-->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮-->
            <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!--图片预览的对话框-->
    <el-dialog
      title="图片预览"
      :visible.sync="previewVisible"
      width="50%"
    >
      <img :src="previewPath" class="preview-img">
    </el-dialog>
  </div>
</template>

<script>
  //导入lodash，并且用下划线接收，官方推荐使用下划线接收
  import _ from "lodash";

  export default {
    data() {
      return {
        activeIndex: "0",
        //添加商品的表单数据对象
        addForm: {
          goods_name: "",
          goods_price: 0,
          goods_number: 0,
          goods_weight: 0,
          //商品所属的分类数组
          goods_cat: [],
          //  图片数组
          pics: [],
          //商品详情描述--富文本编辑器
          goods_introduce: "",
          attrs: []
        },
        //验证规则
        addFormRules: {
          goods_name: [
            {
              required: true, message: "请输入商品名称", trigger: "blur"
            }
          ], goods_price: [
            {
              required: true, message: "请输入商品价格", trigger: "blur"
            }
          ], goods_number: [
            {
              required: true, message: "请输入商品数量", trigger: "blur"
            }
          ], goods_weight: [
            {
              required: true, message: "请输入商品质量", trigger: "blur"
            }
          ]
        },
        //商品分类列表
        catelist: [],
        cateProps: {
          label: "cat_name",
          value: "cat_id",
          children: "children",
          expandTrigger: "hover"
        },
        //动态参数---列表数据
        manyTableData: [],
        //静态参数---列表数据
        onlyTableData: [],
        //上传的地址
        uploadUrl: "http://127.0.0.1:8888/api/private/v1/upload",
        //图片上传组件的headers请求头对象
        headerObj: {
          Authorization: window.sessionStorage.getItem("token")
        },
        //预览图片的地址
        previewPath: "",
        //控制预览图片的对话框的显示与隐藏
        previewVisible: false
      };
    },
    created() {
      this.getCateList();
    },
    methods: {
      //获取所有商品分类数据
      async getCateList() {
        const {data: res} = await this.$http.get("categories");
        if (res.meta.status !== 200) return this.$message.error("获取商品数据分类失败");
        this.catelist = res.data;
      },
      //级联选择器选中项发生变化时，会触发这个函数
      handleChange() {
        console.log(this.addForm.goods_cat);
        if (this.addForm.goods_cat.length !== 3) {
          //没有选中三级分类 清空数组
          this.addForm.goods_cat = [];
        } else {

        }
      },
      //切换标签之前的钩子 返回false时会阻止切换
      beforeTabLeave(activeName, oldActiveName) {
        // console.log("即将离开" + oldActiveName);
        // console.log("即将去往" + activeName);
        if (!this.addForm.goods_name) {
          this.$message.error("请先填写商品名称");
          return false;
        }
        if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
          this.$message.error("请先选择商品分类");
          return false;
        }
      },
      //点击左侧tab栏时触发
      async tabClicked() {
        //商品参数---三级数据的动态参数
        if (this.activeIndex === "1") {
          // console.log('动态参数面板');
          const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: "many"}});
          if (res.meta.status !== 200) return this.$message.error("获取失败");
          res.data.forEach(item => {
            // 将字符串转为数组 假如本来是空字符串 直接赋值空数组
            item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
          });
          this.manyTableData = res.data;
          // console.log(this.manyTableData.attr_vals);
          // console.log(this.manyTableData);
        } else if (this.activeIndex === "2") {
          //  商品属性---三级商品的静态属性
          const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: "only"}});
          if (res.meta.status !== 200) return this.$message.error("获取失败");
          this.onlyTableData = res.data;
        }
      },
      //处理移除图片的操作
      handleRemove(file) {
        //console.log(file);
        //1.获取将要删除的图片的临时地址
        const filePath = file.res.data.tmp_path;
        //2.从pics数组中，找到这个图片对应的索引值
        const i = this.addForm.pics.findIndex(x => {
          x.pic === filePath;
        });
        //3.调用数组的splice方法，把图片信息对象，从pics数组中移除
        this.addForm.pics.splice(i, 1);
      },
      //处理图片预览效果
      handlePreview(file) {
        //获取预览的图片的在线url地址
        this.previewPath = file.response.data.url;
        console.log(this.previewPath);
        this.previewVisible = true;
      },
      //监听图片上传成功的事件
      handleSuccess(res) {
        // console.log(res);
        //1.先拼接，得到图片信息对象
        const picInfo = {pic: res.data.tmp_path};
        //2.将图片对象，push到pics数组中
        this.addForm.pics.push(picInfo);
        console.log(this.addForm.pics);
      },
      //提交按钮
      add() {
        this.$refs.addFormRef.validate(async (valid) => {
          if (!valid) return this.$message.error("请填写必要的表单项目");
          console.log(valid);
          //执行添加的业务逻辑
          /*
          * 这里将goods_cat转成字符串，因为服务器要接收字符串类型的
          * 但是如果直接改addForm中的goods_cat，会造成级联选择器报错，级联选择器中的goods_cat必须为数组
          * 所以，引入了第三方插件库lodash，并且使用它的深拷贝功能
          *
          * 其实这里可以直接用JSON.parse(JSON.stringify(obj))来实现深拷贝....
          * 而且现在的级联选择器已经可以兼容字符串和数组了...不需要转
          *
          * */
          //深拷贝
          const form = _.cloneDeep(this.addForm);
          form.goods_cat = form.goods_cat.join(",");

          //处理动态参数
          this.manyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.join(",")
            };
            this.addForm.attrs.push(newInfo);
          });
          //  处理静态属性
          this.onlyTableData.forEach(item => {
            const newInfo = {
              attr_id: item.attr_id,
              //静态属性的attr_vals本来就是一个字符串
              attr_value: item.attr_vals
            };
            this.addForm.attrs.push(newInfo);
          });
          form.attrs = this.addForm.attrs;
          // console.log(this.addForm);
          console.log(form);

          //  发起请求--添加商品
          //  商品的名称，必须是唯一的
          const {data: res} = await this.$http.post("goods", form);
          if (res.meta.status !== 201) {
            console.log(res);
            return this.$message.error(`${res.meta.msg}添加商品失败`);
          }
          this.$message.success("添加商品成功");
          this.$router.push("/goods");
        });

      }

    },
    computed: {
      //三级分类---第三级的id
      cateId() {
        if (this.addForm.goods_cat.length === 3) {
          return this.addForm.goods_cat[2];
        }
        return null;
      }
    }
  }
  ;
</script>

<style scoped lang="less">
  .el-card {
    .el-alert {
      margin-bottom: 15px;
    }

    .el-step {
      margin-bottom: 25px;
    }

    .el-new-input {
      width: 500px;
    }

    .input-new-tag {
      width: 500px;
    }

    .el-checkbox {
      margin: 0 10px 0 0 !important;
    }

  }

  .preview-img {
    width: 100%;
  }

  .btnAdd {
    margin-top: 15px;
  }

</style>
