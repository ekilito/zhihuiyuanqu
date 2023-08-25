<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="params.name" clearable placeholder="请输入内容" class="search-main" @clear="clearSearch" />
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/addEnterprise')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table style="width: 100%" :data="exterpriseList">
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text" @click="addRent(scope.row.id)">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="editRent(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delExterprise(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页器 -->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :page-size="params.pageSize"
        @current-change="pageChange"
      />
    </div>
    <!-- 添加合同 -->
    <el-dialog
      title="添加合同"
      :visible="rentDialogVisible"
      width="580px"
      @close="closeDialog"
      @open="openDialog"
    >
      <!-- 表单区域 -->
      <div class="form-container">
        <!-- 表单模版 -->
        <div class="form-container">
          <el-form ref="addForm" :model="rentForm" :rules="rentRules" label-position="top">
            <el-form-item label="租赁楼宇" prop="buildingId">
              <el-select v-model="rentForm.buildingId" placeholder="请选择">
                <el-option
                  v-for="item in buildList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="租赁起止日期" prop="rentTime">
              <el-date-picker
                v-model="rentForm.rentTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
              />
            </el-form-item>
            <el-form-item label="租赁合同" prop="contractId">
              <!--
                 上传实现流程：
                   1. el-upload 打开本地文件  并且校验这个文件是否符合要求 - File
                   2. :http-request = 'upload'
                   3. 按照接口的要求格式 得到类型为FormData对象 new FormData()
                   4. 按照要求往 formData中添加字段数据 fd.append('字段名','字段值')
                   5. 调用上传接口
                   6. 拿到返回的文件地址和其有用的信息id 存入data中的响应式数据的位置 将来提交表单
              -->
              <el-upload
                action="#"
                :http-request="uploadHandle"
              >
                <el-button size="small" type="primary" plain>上传合同文件</el-button>
                <div slot="tip" class="el-upload__tip">支持扩展名：.doc .docx .pdf, 文件大小不超过5M</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button size="mini" type="primary" @click="confirmAdd">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getEnterpriseListAPI, delExterpriseAPI, uploadAPI, createRentAPI } from '@/api/enterprise'
import { getRentBuildListAPI } from '@/api/building'
export default {
  data() {
    return {
      exterpriseList: [], // 企业列表
      params: {
        name: '', // 增加字段name 搜索
        page: 1, // 默认显示第一页
        pageSize: 10 // 每页显示的条数
      },
      total: 0, // 总条数 接收接口的总条数
      buildList: [], // 楼宇
      rentDialogVisible: false, // 添加合同弹出的开关
      rentForm: {
        buildingId: null, // 楼宇id
        contractId: null, // 合同id
        contractUrl: '', // 合同Url
        enterpriseId: null, // 企业名称
        type: 0, // 合同类型
        rentTime: [] // 合同时间
      },
      rentRules: {
        buildingId: [
          { required: true, message: '请选择楼宇', trigger: 'change' }
        ],
        rentTime: [
          { required: true, message: '请选择租赁日期', trigger: 'change' }
        ],
        contractId: [
          { required: true, message: '请上传合同文件' }
        ]
      }
    }
  },

  mounted() {
    this.getExterpriseList()
  },
  methods: {
    // 获取公司列表
    async getExterpriseList() {
      const res = await getEnterpriseListAPI(this.params)
      this.exterpriseList = res.data.rows
      this.total = res.data.total
    },
    // 分页的逻辑
    pageChange(page) {
      // 更改参数
      this.params.page = page
      // 重新获取数据渲染
      this.getExterpriseList()
    },
    // 查询后调方法
    doSearch() {
      this.params.page = 1
      this.getExterpriseList()
    },
    // 点击x重新拉取全部企业
    clearSearch() {
      this.getExterpriseList()
    },
    // 编辑逻辑
    editRent(id) {
      this.$router.push({
        path: '/addenterprise',
        query: {
          id
        }
      })
    },
    delExterprise(id) {
      this.$confirm('确认删除该企业吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await delExterpriseAPI(id)
        this.getExterpriseList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    },
    // 打开
    async addRent(id) {
      this.rentDialogVisible = true
      // 把企业id存入表单对象
      this.rentForm.enterpriseId = id
    },
    // 关闭
    closeDialog() {
      this.rentDialogVisible = false
    },
    // 获取楼宇下拉列表
    async getBuildList() {
      // 作为下拉列表
      // 1. 单独的接口
      // 2. 使用table列表的接口 - {page:1,pageSize:100}
      // 获取楼宇下拉列表
      const res = await getRentBuildListAPI()
      this.buildList = res.data
    },
    // 弹窗打开的时候调用获取楼宇接口
    openDialog() {
      this.getBuildList()
    },
    // 上传合同
    async uploadHandle(fileData) {
      // 1. 处理FormData 拿到file对象
      const { file } = fileData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', 'contract') // 上传的类型
      // 2. 调用上传接口并赋值
      const res = await uploadAPI(formData)
      const { id, url } = res.data
      this.rentForm.contractId = id
      this.rentForm.contractUrl = url
      // 单独校验表单
      this.$refs.addForm.validate('contractId')
    },
    // 确认提交
    confirmAdd() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          const { buildingId, contractId, contractUrl, enterpriseId, type } = this.rentForm
          await createRentAPI({
            buildingId, contractId, contractUrl, enterpriseId, type,
            startTime: this.rentForm.rentTime[0],
            endTime: this.rentForm.rentTime[1]
          })
          // 更新列表
          this.getExterpriseList()
          // 关闭弹框
          this.rentDialogVisible = false
          // 重置一下数据（把数据清空 resetFileds + 手动清除）
          this.$refs.addForm.resetFields()
          this.rentForm = {
            buildingId: null, // 楼宇id
            contractId: null, // 合同id
            contractUrl: '', // 合同Url
            enterpriseId: null, // 企业名称
            type: 0, // 合同类型
            rentTime: [] // 合同时间
          }
          // 提示
          this.$message.success('添加合同成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
</style>
