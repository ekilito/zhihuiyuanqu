<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">一体杆名称：</div>
      <el-input
        v-model="params.poleName"
        clearable
        placeholder="请输入一体杆名称"
        class="search-main"
      />
      <div class="search-label">一体杆编号：</div>
      <el-input
        v-model="params.poleNumber"
        clearable
        placeholder="请输入一体杆编号"
        class="search-main"
      />
      <div class="search-label">运行状态：</div>
      <el-select v-model="params.poleStatus" placeholder="请选择运行状态">
        <el-option label="全部" value="" />
        <el-option label="正常" value="0" />
        <el-option label="异常" value="1" />
      </el-select>
      <el-button type="primary" @click="refer">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="addRod('add')">添加一体杆</el-button>
      <el-button @click="delRods">批量删除</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table
        style="width: 100%"
        :data="rodList"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column type="index" label="序号" />
        <el-table-column label="一体杆名称" prop="poleName" />
        <el-table-column label="一体杆编号" prop="poleNumber" />
        <el-table-column label="一体杆IP" prop="poleIp" />
        <el-table-column label="安装区域" prop="areaName" />
        <el-table-column label="一体杆类型" prop="poleType">
          <template #default="scope">
            {{ scope.row.poleType === 'export' ? '出口' : '入口' }}
          </template>
        </el-table-column>
        <el-table-column label="运行状态" prop="poleStatus">
          <template #default="scope">
            {{ scope.row.poleStatus ? '异常' : '正常' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              @click="editRod('edit', scope.row.id)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="text"
              @click="delRod(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- //  弹出框 -->
      <el-dialog
        :title="handleRodType"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose"
      >
        <el-form ref="rodForm" :model="rodForm" :rules="rodRules">
          <el-form-item label="一体杆名称" prop="poleName">
            <el-input
              v-model="rodForm.poleName"
              placeholder="请输入一体杆名称"
            />
          </el-form-item>
          <el-form-item label="一体杆编号" prop="poleNumber">
            <el-input
              v-model="rodForm.poleNumber"
              placeholder="请输入一体杆编号"
            />
          </el-form-item>
          <el-form-item label="一体杆IP" prop="poleIp">
            <el-input v-model="rodForm.poleIp" placeholder="请输入一体杆IP" />
          </el-form-item>
          <el-form-item label="关联区域" prop="areaId">
            <el-select v-model="rodForm.areaId" placeholder="请选择关联区域">
              <el-option
                v-for="ele in areaList"
                :key="ele.areaId"
                :label="ele.areaName"
                :value="ele.areaId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="一体杆类型" prop="poleType">
            <el-select
              v-model="rodForm.poleType"
              placeholder="请选择一体杆类型"
            >
              <el-option label="入口" value="入口" />
              <el-option label="出口" value="出口" />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="form-container" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmRod">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- //  页码表 -->
    <div class="page-container">
      <el-pagination
        :current-page="params.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="params.pageSize"
        layout="total , prev, pager, next, sizes , jumper"
        :total="total"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import {
  getRodListAPI,
  areaRodAPI,
  addRodAPI,
  delRodAPI,
  editRodAPI
} from '@/api/rod'

export default {
  name: 'RodManage',
  data() {
    return {
      rodList: [], // 一体杆列表
      areaList: [], // 关联区域
      selectList: [], // 选择的列表
      params: {
        page: 1,
        pageSize: 10,
        poleName: '',
        poleNumber: '',
        poleStatus: ''
      },
      total: 0,
      dialogVisible: false,
      rodType: 'add', // 类型 添加/编辑
      // 表单
      rodForm: {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        poleType: '',
        areaId: null
      },
      // 表单规则
      rodRules: {
        poleName: [
          { required: true, message: '请输入一体杆名称', trigger: 'blur' }
        ],
        poleNumber: [
          { required: true, message: '请输入一体杆编号', trigger: 'blur' }
        ],
        poleIp: [
          { required: true, message: '请输入一体杆IP', trigger: 'blur' }
        ],
        poleType: [
          { required: true, message: '请选择一体杆类型', trigger: 'blur' }
        ],
        areaId: [{ required: true, message: '请选择关联区域', trigger: 'blur' }]
      }

    }
  },
  computed: {
    handleRodType() {
      if (this.rodType === 'add') {
        return '增加一体杆'
      } else {
        return '编辑一体杆'
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 初始化页面列表
    async initData() {
      const res = await getRodListAPI(this.params)
      // console.log(res)
      this.rodList = res.data.rows
      this.total = res.data.total
    },
    //  增加一体杆
    async addRod(val) {
      // 切换类型
      this.rodType = val
      //  获取下拉列表
      const res = await areaRodAPI()
      // console.log(res)
      this.areaList = res.data
      this.dialogVisible = true
    },
    // 编辑一体杆
    async editRod(val, id) {
      // 切换类型
      this.rodType = val
      this.dialogVisible = true
      //  获取下拉列表
      const res = await areaRodAPI()
      // console.log(res)
      this.areaList = res.data
      const obj = this.rodList.find(ele => ele.id === id)
      // console.log(obj)
      // 数据回填
      this.rodForm = {
        poleName: obj.poleName,
        poleNumber: obj.poleNumber,
        poleIp: obj.poleIp,
        poleType: obj.poleType === 'export' ? '出口' : '入口',
        areaId: obj.areaId,
        id: id
      }
    },
    //  删除一体杆
    delRod(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delRodAPI(id)
          this.initData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //  批量删除一体杆
    async delRods() {
      // console.log(arr)
      if (this.selectList.length < 0) return
      const selectId = this.selectList.map(ele => ele.id).join(',')
      console.log(selectId)
      this.$confirm('您确定要删除这些文件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await delRodAPI(selectId)
          this.initData()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //   确定按钮
    confirmRod() {
      this.$refs.rodForm.validate(async valid => {
        if (valid) {
          if (this.rodType === 'add') {
            await addRodAPI(this.rodForm)
            this.$message.success('添加成功')
          } else {
            await editRodAPI({ ...this.rodForm })
            this.$message.success('编辑成功')
          }
          // 关闭弹窗
          this.handleClose()
          //   重新渲染页面
          this.initData()
        }
      })
    },
    //  处理页码
    handleSizeChange(val) {
      this.params.pageSize = val
      this.initData()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      this.params.page = val
      this.initData()
      // console.log(`当前页: ${val}`)
    },
    // 关闭弹窗时做神马
    handleClose() {
      this.rodForm = {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        poleType: '',
        areaId: null
      }
      this.$refs.rodForm.resetFields()
      this.dialogVisible = false
    },
    //  多选框选择的内容
    selectionChange(val) {
      this.selectList = val
    },
    // 搜索框查找
    async refer() {
      this.initData()
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
  border-bottom: 1px solid rgb(237, 237, 237, 0.9);
  padding-bottom: 20px;

  .search-label {
    width: 100px;
    margin-left: 10px;
  }

  .el-button {
    width: 80px;
    margin-left: 20px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
.create-container {
  margin: 10px 0px;
}
.page-container {
  padding: 4px 0px;
  text-align: right;
}
.form-container {
  padding: 0px 80px;
}
</style>
