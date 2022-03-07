<template>
  <div>
    <!-- 这是帖子管理 -->
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>实名认证审核</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
         <!--搜索框-->
         <el-col :span="4">
            <el-input placeholder="输入要查询的学号"
            v-model="queryInfo.query"
              clearable
              @clear="getRealList">
          </el-input>
         </el-col>
        <el-col :span="4">
          <el-button type="primary"
                     @click="getRealList">搜索</el-button>
          <el-button @click="reset_Search">重置</el-button>
        </el-col>
      </el-row> 
      <!-- 用户列表区域 -->
      <el-table :data="realList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户ID" prop="ID"></el-table-column>
        <el-table-column label="手机号码" prop="Mobile"></el-table-column>
        <el-table-column label="实名状态" prop="IsReal">
          <template slot-scope="scope">
             <el-switch
              v-model="scope.row.IsReal" @change="userRealChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="角色" prop="Role"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
             <el-tooltip class="item" effect="dark" content="审核" placement="top">
                    <el-button type="primary" icon="el-icon-edit" circle size="middle" @click="dialogVisible = true"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.currentPage"
                     :page-sizes="[10, 30, 50, 100]"
                     :page-size="queryInfo.pageSize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="50%"
        @close="vifyDialogClosed">
        <el-form :model="ruleForm" :rules="vifyRules" ref="ruleFormRef" label-width="70px">
        <el-form-item label="学号" prop="vifystudent_num">
          <el-input v-model="ruleForm.vifystudent_num" placeholder="请输入您的学号"></el-input>
        </el-form-item>
          <el-form-item label="认证状态" prop="region">
            <el-select v-model="ruleForm.region" placeholder="请选择认证状态">
              <el-option label="认证成功" value="成功"></el-option>
              <el-option label="认证失败" value="失败"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="vifyUser">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        // 页数
        currentPage: 1,
        // 每页的数据 
        pageSize: 10
      },
      userid: '',
      isReal: '',
      realList: [],
      // 总数据条数
      total: 0,
      dialogVisible: false,
      // 审核信息的表单数据
      ruleForm: {
        vifystudent_num: '',
        region: '',
      },
      // 添加表单验证规则对象
      vifyRules: {
        vifystudent_num: [
          { required: true, message: '请输入您的学号', trigger: 'blur'},
          { min: 9, max: 9, message: '学号的长度必须为九位', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    // 生命周期函数内调用这个方法  获取列表
    this.getRealList()
  },
  methods: {
    // 获取需要认证的用户列表
    async getRealList() {
      this.recordList = []
      const { data: res } = await this.$http.post(
        'admin/getlist?{this.queryInfo.query}'
        // this.queryInfo
      )
      console.log(res.data.data)
      if (res.code !== 200) {
        return this.$Message.error('获取信息失败')
      }
        this.realList = res.data.data
        this.total = res.data.data.length
        this.userid = res.data.data.ID
        this.isReal = res.data.data.IsReal
    },
    // 监听搜索框重置
    reset_Search() {
      //  先重置输入框  再发起数据请求,获取最新的列表
      // this.queryInfo.searchCondition.id = ''
      // this.queryInfo.searchCondition.state = ''
      // this.queryInfo.searchCondition.userId = ''
      // this.queryInfo.searchCondition.approveId = ''
      this.queryInfo.query = ''
      this.getRealList()
    },
    // 监听pageSize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getRealList()
    },
  // 监听 页码值 改变事件
    handleCurrentChange(newPage) {
      this.queryInfo.currentPage = newPage
      this.getRealList()
    },
    // 监听 switch 状态的改变
    async userRealChange(userinfo) {
      // 改变他的状态进行向后端反馈信息解决他的实名
     const {data : res} = await this.$http.get(`admin/change/${userinfo.ID}/${userinfo.IsReal}`)
      if (res.code !== 200) {
        userinfo.isReal = !userinfo.isReal
        return this.$message.error('更新用户状态失败!')
      }
      this.$$message.Success('更新状态成功')
    },
    // 监听 添加审核对话框的关闭事件
    vifyDialogClosed() {
      this.$refs.ruleFormRef.resetFields()
    },
    // 点击按钮弹出数据进行二次验证
    vifyUser() {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return 
        const { data: res } = await this.$http.post('/admin/authenticationuser', this.ruleForm)
        if (res.code != 200) return this.$message.error('审核失败')
        this.$message.Success('审核成功')
        this.dialogVisible = false
        this.getRealList()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.more_icon {
  margin: 0;
  padding: 0;
  li {
    text-align: center;
    float: left;
    list-style: none;
    height: 20px;
    margin: 4px;
    font-size: 12px;
    line-height: 20px;
    font-style: normal;
    color: #666;
    > i.iconfont {
      line-height: 20px;
      margin: 0 2px;
      font-size: 12px;
      color: #666;
    }
  }
}

// 审核的图片
.review_img {
  width: 20%;
}
.el-dialog {
  .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 45%;
    }
  }
}
</style>