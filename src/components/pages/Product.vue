<template>
  <div class="product-container">
    <search :showElements="showElements"></search>
    <base-table
      :loading="loading"
      :tableOptions="tableOptions"
      @goBack="getProduct"
      @goAdd="goAdd"
      >
    </base-table>
  </div>
</template>

<script>
  import Search from 'components/common/Search'
  import BaseTable from 'components/common/BaseTable'
  import apiUrl from '@/serviceAPI.config.js'
  export default {
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
            { prop: 'unit', label: '单位', required: true, select: true, options: []}
          ],
          checkRepeat: {field: ['model'], message: '型号重复'},
          dataSift: [],
          addTemplate: { name: '木托盘', model: '', unit: '' },
          addApi: apiUrl.insertProduct,
          deleteApi: apiUrl.deleteProduct
        },
        loading: false
      }
    },
    created() {
      this.getProduct()
    },
    methods: {
      getProduct() {
        this.loading = true
        this.$http.post(apiUrl.getProduct).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            this.tableOptions.dataSift = res.data.message
          }
        }).catch(err => {
          this.loading = false
        })
      },
      goAdd() {
        this.$http.post(apiUrl.getUnit).then(res => {
          if (res.data.code === 200) {
            this.tableOptions.fieldAdd[2].options = res.data.message
          }
        })
      }
    },
    components: {
      Search,
      BaseTable
    }
  }
</script>
