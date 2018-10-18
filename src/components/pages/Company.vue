<template>
  <div class="unit-container">
    <base-table
      :loading="loading"
      :tableOptions="tableOptions"
      :userInfo="userInfo"
      :total="total"
      @goBack="getCompany"
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
  import { templateOptions, templateMap } from 'common/js/template'
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
          fieldSift: [
            { prop: 'name', label: '名称'},
            { prop: 'alias', label: '简称'},
            { prop: 'templatem', label: '货运单模板'}
          ],
          fieldAdd: [
            { prop: 'name', label: '名称', required: true, input: true, placeholder: '输入公司名称' },
            { prop: 'alias', label: '简称', input: true, placeholder: '输入公司简称' },
            { prop: 'template', label: '货运单模板', required: true, select: true, options: templateOptions}
          ],
          checkRepeat: {field: ['name'], message: '名称重复'},
          dataSift: [],
          addTemplate: { name: '', alias: '' },
          addApi: apiUrl.insertCompany,
          deleteApi: apiUrl.deleteCompany,
          updApi: apiUrl.updCompany
        },
        loading: false,
        total: 0
      }
    },
    created() {
      this.getCompany()
    },
    methods: {
      getCompany(pageNo = 1) {
        this.loading = true
        this.$http.post(apiUrl.getCompany, {
          data: {pageNo}
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            this.tableOptions.dataSift = res.data.message
            this.tableOptions.dataSift.forEach(ele => {
              ele.templatem = templateMap[ele.template]
            })
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
        data.templatem = templateMap[data.template]
        this.tableOptions.dataSift.splice(row, 1, data)
      },
      currentChange(pageNo) {
        this.getCompany(pageNo)
      }
    },
    components: {
      BaseTable
    }
  }
</script>
