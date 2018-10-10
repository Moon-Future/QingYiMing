<template>
  <div class="unit-container">
    <base-table
      :loading="loading"
      :tableOptions="tableOptions"
      :userInfo="userInfo"
      @goBack="getUnit"
      @delete="deleteRow"
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
      }
    },
    data() {
      return {
        tableOptions: {
          fieldAdd: [
            { prop: 'name', label: '名称', required: true, input: true, placeholder: '输入单位名称' },
            { prop: 'sign', label: '符号', input: true, placeholder: '输入单位符号' }
          ],
          checkRepeat: {field: ['name'], message: '名称重复'},
          dataSift: [],
          addTemplate: { name: '', sign: '' },
          addApi: apiUrl.insertUnit,
          deleteApi: apiUrl.deleteUnit
        },
        loading: false
      }
    },
    created() {
      this.getUnit()
    },
    methods: {
      getUnit() {
        this.loading = true
        this.$http.post(apiUrl.getUnit).then(res => {
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
