<template>
  <div class="product-container">
    <search :showElements="showElements"></search>
    <base-table
      :loading="loading"
      :tableOptions="tableOptions"
      :userInfo="userInfo"
      :total="total"
      @goBack="getProduct"
      @goAdd="goAdd"
      @delete="deleteRow"
      @update="updateRow"
      @currentChange="currentChange"
      >
    </base-table>
  </div>
</template>

<script>
  import Search from 'components/common/Search'
  import BaseTable from 'components/common/BaseTable'
  import apiUrl from '@/serviceAPI.config.js'
  export default {
    props: {
      userInfo: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        showElements: {
          product: {'allow-create': true, placeholder: '请选择或输入产品名'},
          time: true,
          searchBtn: true
        },
        tableOptions: {
          fieldAdd: [
            { prop: 'name', label: '名称', required: true, input: true, placeholder: '输入产品名' },
            { prop: 'model', label: '型号', required: true, input: true, placeholder: '输入产品型号' },
            { prop: 'unit', label: '单位', required: true, select: true, options: [], key: 'unitm'}
          ],
          fieldSift: [
            { prop: 'name', label: '名称' },
            { prop: 'model', label: '型号' },
            { prop: 'unitm', label: '单位' }
          ],
          checkRepeat: {field: ['model'], message: '型号重复'},
          dataSift: [],
          addTemplate: { name: '木托盘', model: '', unit: '' },
          addApi: apiUrl.insertProduct,
          deleteApi: apiUrl.deleteProduct,
          updApi: apiUrl.updProduct
        },
        loading: false,
        total: 0
      }
    },
    created() {
      this.getProduct()
      this.goAdd()
    },
    methods: {
      getProduct(pageNo = 1) {
        this.loading = true
        this.$http.post(apiUrl.getProduct, {
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
      goAdd() {
        this.$http.post(apiUrl.getUnit).then(res => {
          if (res.data.code === 200) {
            this.tableOptions.fieldAdd[2].options = res.data.message
          }
        })
      },
      currentChange(pageNo) {
        this.getProduct(pageNo)
      }
    },
    components: {
      Search,
      BaseTable
    }
  }
</script>
