<template>
  <div class="delivery-qrcode-container">
    <div class="action-bar" v-if="!showAddForm && !editId">
      <el-button type="primary" icon="el-icon-plus" @click="openAddForm">新增</el-button>
    </div>

    <div class="add-form-wrapper" v-if="showAddForm">
      <!-- <h4>新增</h4> -->
      <el-form :model="addForm" :rules="rules" ref="addFormRef" label-width="120px" class="add-form">
        <el-form-item label="二维码产品" prop="qrcodeProductId">
          <el-select v-model="addForm.qrcodeProductId" placeholder="请选择二维码产品" style="width: 300px;" @change="onAddProductChange">
            <el-option v-for="item in qrcodeProductList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="versionNo">
          <el-input v-model="addForm.versionNo" placeholder="请输入版本号" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="序号1" prop="seq1">
          <el-input v-model="addForm.seq1" placeholder="请输入序号1" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="序号2" prop="seq2">
          <el-input v-model="addForm.seq2" placeholder="请输入序号2" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAddSubmit">保存</el-button>
          <el-button @click="cancelAdd">取消</el-button>
        </el-form-item>
      </el-form>
      <div class="preview-card">
        <label-card :data="{}" :isEdit="true" :qrcodeProductList="qrcodeProductList" :editForm="addForm"></label-card>
      </div>
    </div>

    <!-- 编辑表单（放在循环外，避免 ref 问题） -->
    <div class="edit-form-wrapper" v-if="editId" style="margin-bottom: 20px;">
      <el-form :model="editForm" :rules="rules" ref="editFormRef" label-width="120px" class="edit-form-inline">
        <el-form-item label="二维码产品" prop="qrcodeProductId">
          <el-select v-model="editForm.qrcodeProductId" placeholder="请选择二维码产品" style="width: 250px;" @change="onEditProductChange">
            <el-option v-for="p in qrcodeProductList" :key="p.id" :label="p.name" :value="p.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号" prop="versionNo">
          <el-input v-model="editForm.versionNo" placeholder="请输入版本号" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="序号1" prop="seq1">
          <el-input v-model="editForm.seq1" placeholder="请输入序号1" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item label="序号2" prop="seq2">
          <el-input v-model="editForm.seq2" placeholder="请输入序号2" style="width: 250px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleEditSubmit">保存</el-button>
          <el-button @click="cancelEdit">取消</el-button>
        </el-form-item>
      </el-form>
      <div class="preview-card">
        <label-card :data="editingItem || {}" :isEdit="true" :qrcodeProductList="qrcodeProductList" :editForm="editForm"></label-card>
      </div>
    </div>

    <div class="label-list" v-if="!showAddForm && !editId">
      <div v-for="(item, index) in listData" :key="item.id" class="label-wrapper" v-if="editId !== item.id">
        <label-card :data="item"></label-card>
        <div class="label-actions">
          <span style="font-size: 12px; margin-right: 10px;">{{ item.createTime }}</span>
          <el-button type="text" size="small" @click="printLabel(item)">打印</el-button>
          <el-button type="text" size="small" @click="openEditForm(item)">编辑</el-button>
          <el-button type="text" size="small" class="delete-btn" @click="handleDelete(item)">删除</el-button>
        </div>
      </div>
    </div>

    <el-pagination
      v-if="!showAddForm && total > 0"
      class="pagination"
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page.sync="currentPage"
      @current-change="handlePageChange">
    </el-pagination>
  </div>
</template>

<script>
  import apiUrl from '@/serviceAPI.config.js'
  import LabelCard from 'components/common/LabelCard'
  import { dateFormat } from '@/common/js/tool'
  export default {
    components: {
      LabelCard
    },
    props: {
      userInfo: {
        type: Object,
        default: null
      },
      mobileFlag: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        listData: [],
        total: 0,
        currentPage: 1,
        pageSize: 4,
        loading: false,
        showAddForm: false,
        editId: null,
        editingItem: null,
        qrcodeProductList: [],
        addForm: {
          qrcodeProductId: null,
          versionNo: 'A0',
          seq1: '01',
          seq2: '0001'
        },
        editForm: {
          id: null,
          qrcodeProductId: null,
          versionNo: '',
          seq1: '01',
          seq2: '0001'
        },
        rules: {
          qrcodeProductId: [{ required: true, message: '请选择二维码产品', trigger: 'change' }],
          versionNo: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
          seq1: [{ required: true, message: '请输入序号1', trigger: 'blur' }],
          seq2: [{ required: true, message: '请输入序号2', trigger: 'blur' }]
        }
      }
    },
    created() {
      this.getList()
      this.getQrcodeProductList()
    },
    methods: {
      getList() {
        this.loading = true
        this.$http.post(apiUrl.getDeliveryQrcode, {
          data: { pageNo: this.currentPage, pageSize: this.pageSize }
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            this.listData = res.data.message
            this.total = res.data.count
            this.listData.forEach(item => {
              item.createTime = dateFormat(item.createTime, 'yyyy-MM-dd hh:mm')
            })
          }
        }).catch(() => {
          this.loading = false
        })
      },
      getQrcodeProductList() {
        this.$http.post(apiUrl.getQrcodeProduct, {
          data: { pageNo: 1, pageSize: 1000 }
        }).then(res => {
          if (res.data.code === 200) {
            this.qrcodeProductList = res.data.message
          }
        })
      },
      openAddForm() {
        this.showAddForm = true
        this.addForm = {
          qrcodeProductId: null,
          versionNo: 'A0',
          seq1: '01',
          seq2: '0001'
        }
      },
      cancelAdd() {
        this.showAddForm = false
      },
      onAddProductChange() {
        // 触发计算属性更新
      },
      onEditProductChange() {
        // 触发计算属性更新
      },
      generateQrContent(product, form) {
        if (!product || !form.versionNo) return ''
        const productCode = product.code
        const vendorCode = '170710'
        const versionNo = form.versionNo
        const now = new Date()
        const year = String(now.getFullYear()).slice(2)
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const dateStr = year + month + '01'
        const seq1 = form.seq1 || '01'
        const seq2 = form.seq2 || '0001'
        return `${productCode}*${vendorCode}*${versionNo}*${dateStr}*${seq1}*${seq2}`
      },
      handleAddSubmit() {
        this.$refs.addFormRef.validate((valid) => {
          if (!valid) return
          const selectedProduct = this.qrcodeProductList.find(p => p.id === this.addForm.qrcodeProductId)
          const qrContent = this.generateQrContent(selectedProduct, this.addForm)
          const data = {
            ...this.addForm,
            qrContent
          }
          this.$http.post(apiUrl.insertDeliveryQrcode, { data }).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
              this.showAddForm = false
              this.getList()
            } else {
              this.$message.error(res.data.message)
            }
          })
        })
      },
      openEditForm(item) {
        this.editId = item.id
        this.editingItem = item
        this.editForm = {
          id: item.id,
          qrcodeProductId: item.qrcodeProductId,
          versionNo: item.versionNo,
          seq1: item.seq1,
          seq2: item.seq2
        }
      },
      cancelEdit() {
        this.editId = null
        this.editingItem = null
      },
      handleEditSubmit() {
        this.$nextTick(() => {
          if (!this.$refs.editFormRef) return
          this.$refs.editFormRef.validate((valid) => {
            if (!valid) return
            const selectedProduct = this.qrcodeProductList.find(p => p.id === this.editForm.qrcodeProductId)
            const qrContent = this.generateQrContent(selectedProduct, this.editForm)
            const data = {
              ...this.editForm,
              qrContent
            }
            this.$http.post(apiUrl.updDeliveryQrcode, { data }).then(res => {
              if (res.data.code === 200) {
                this.$message.success(res.data.message)
                this.editId = null
                this.editingItem = null
                this.getList()
              } else {
                this.$message.error(res.data.message)
              }
            })
          })
        })
      },
      handleDelete(item) {
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post(apiUrl.deleteDeliveryQrcode, { data: { id: item.id } }).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
              this.getList()
            }
          })
        }).catch(() => {})
      },
      handlePageChange(page) {
        this.currentPage = page
        this.getList()
      },
      printLabel(item) {
        console.log(item)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .delivery-qrcode-container {
    padding: 10px;
  }

  .action-bar {
    margin-bottom: 15px;
  }

  .add-form-wrapper,
  .edit-form-wrapper {
    margin-bottom: 30px;
    padding: 20px;
    display: flex;
    gap: 30px;
    align-items: flex-start;
    h4 {
      margin: 0 0 15px;
      width: 100%;
    }
  }

  .add-form,
  .edit-form-inline {
    flex: 0 0 350px;
  }

  .preview-card {
    flex: 0 0 140mm;
  }

  .label-list {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
  }

  .label-wrapper {
    width: 140mm;
  }

  .label-actions {
    text-align: right;
    padding: 8px 0;
    .delete-btn {
      color: #f56c6c;
    }
  }

  .pagination {
    margin-top: 20px;
    text-align: right;
  }
</style>
