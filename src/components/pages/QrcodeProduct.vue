<template>
  <div class="qrcode-product-container">
    <base-table
      :loading="loading"
      :tableOptions="tableOptions"
      :userInfo="userInfo"
      :total="total"
      @goBack="getQrcodeProduct"
      @delete="deleteRow"
      @update="updateRow"
      @currentChange="currentChange"
      >
    </base-table>
  </div>
</template>

<script>
  import BaseTable from 'components/common/BaseTable'
  import apiUrl from '@/serviceAPI.config.js'
  export default {
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
        tableOptions: {
          fieldAdd: [
            { prop: 'name', label: '名称', required: true, input: true, placeholder: '输入名称' },
            { prop: 'code', label: '编码', required: true, input: true, placeholder: '输入编码' },
            { prop: 'partNo', label: '料号', input: true, placeholder: '输入料号' },
            { prop: 'size', label: '尺寸', input: true, placeholder: '输入尺寸' },
            { prop: 'weight', label: '重量', input: true, placeholder: '输入重量' }
          ],
          fieldSift: [
            { prop: 'name', label: '名称' },
            { prop: 'code', label: '编码' },
            { prop: 'partNo', label: '料号' },
            { prop: 'size', label: '尺寸' },
            { prop: 'weight', label: '重量' }
          ],
          checkRepeat: {field: ['code'], message: '编码重复'},
          dataSift: [],
          addTemplate: { name: '', code: '', partNo: '', size: '', weight: '' },
          addApi: apiUrl.insertQrcodeProduct,
          deleteApi: apiUrl.deleteQrcodeProduct,
          updApi: apiUrl.updQrcodeProduct
        },
        loading: false,
        total: 0
      }
    },
    computed: {
      mobile() {
        return this.mobileFlag
      }
    },
    created() {
      this.getQrcodeProduct()
    },
    methods: {
      getQrcodeProduct(pageNo = 1) {
        this.loading = true
        this.$http.post(apiUrl.getQrcodeProduct, {
          data: {pageNo}
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            this.tableOptions.dataSift = res.data.message
            this.total = res.data.count
          }
        }).catch(err => {
          this.loading = false
        })
      },
      deleteRow(row) {
        this.tableOptions.dataSift.splice(row, 1)
      },
      updateRow({data, row}) {
        this.tableOptions.dataSift.splice(row, 1, data)
      },
      currentChange(pageNo) {
        this.getQrcodeProduct(pageNo)
      }
    },
    components: {
      BaseTable
    }
  }
</script>
