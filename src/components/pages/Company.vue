<template>
  <div class="unit-container">
    <base-table
      :loading="loading"
      :tableOptions="tableOptions"
      @goBack="getCompany"
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
            { prop: 'name', label: '名称', required: true, input: true, placeholder: '输入公司名称' },
            { prop: 'alias', label: '简称', input: true, placeholder: '输入公司简称' }
          ],
          checkRepeat: {field: ['name'], message: '名称重复'},
          dataSift: [],
          addTemplate: { name: '', alias: '' },
          addApi: apiUrl.insertCompany,
          deleteApi: apiUrl.deleteCompany
        },
        loading: false
      }
    },
    created() {
      this.getCompany()
    },
    methods: {
      getCompany() {
        this.loading = true
        this.$http.post(apiUrl.getCompany).then(res => {
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
