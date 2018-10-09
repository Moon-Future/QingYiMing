<template>
  <div class="unit-container">
    <base-table
      :loading="loading"
      :tableOptions="tableOptions"
      @goBack="getSupply"
      @delete="deleteRow"
      >
    </base-table>
  </div>
</template>

<script>
  import BaseTable from 'components/common/BaseTable'
  import apiUrl from '@/serviceAPI.config.js'
  export default {
    data() {
      return {
        tableOptions: {
          fieldAdd: [
            { prop: 'customer', label: '客户', required: true, options: [], select: true },
            { prop: 'product', label: '产品', required: true, options: [], select: true },
            { prop: 'nun', label: '编码', input: true }
          ],
          checkRepeat: {field: ['customer', 'product'], message: '客户对应产品重复'},
          dataSift: [],
          addTemplate: { customer: '', product: '', nun: '' },
          addApi: apiUrl.insertSupply,
          deleteApi: apiUrl.deleteSupply
        },
        loading: false
      }
    },
    created() {
      this.getSupply()
    },
    methods: {
      getSupply() {
        this.loading = true
        this.$http.post(apiUrl.getSupply).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            this.tableOptions.dataSift = res.data.message
          }
        }).catch(err => {
          this.loading = false
        })
      },
      deleteRow(row) {
        this.tableOptions.dataSift.splice(row, 1)
      }
    },
    components: {
      BaseTable
    }
  }
</script>
