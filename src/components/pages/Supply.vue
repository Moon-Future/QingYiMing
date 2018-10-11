<template>
  <div class="unit-container">
    <base-table
      :loading="loading"
      :tableOptions="tableOptions"
      :userInfo="userInfo"
      @goBack="getSupply"
      @goAdd="getOptions"
      @delete="deleteRow"
      @update="updateRow"
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
            { prop: 'customer', label: '客户', required: true, options: [], select: true },
            { prop: 'product', label: '产品', required: true, options: [], select: true, key: 'model' },
            { prop: 'nun', label: '编码', input: true }
          ],
          fieldSift: [
            { prop: 'customer', label: '客户' },
            { prop: 'product', label: '产品名称' },
            { prop: 'model', label: '产品型号' },
            { prop: 'nun', label: '编码' },
            { prop: 'unit', label: '单位' }
          ],
          checkRepeat: {field: ['customer', 'product'], message: '客户对应产品重复'},
          dataSift: [],
          addTemplate: { customer: '', product: '', nun: '' },
          addApi: apiUrl.insertSupply,
          deleteApi: apiUrl.deleteSupply,
          updApi: apiUrl.updSupply
        },
        loading: false
      }
    },
    created() {
      this.getSupply()
      this.getOptions()
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
      getOptions() {
        this.tableOptions.fieldAdd[0].options = []
        this.tableOptions.fieldAdd[1].options = []
        this.$http.post(apiUrl.getOptions).then(res => {
          if (res.data.code === 200) {
            const customer = res.data.message.customer
            const product = res.data.message.product
            customer.forEach(ele => {
              this.tableOptions.fieldAdd[0].options.push({id: ele.id, name: ele.name})
            });
            product.forEach(ele => {
              this.tableOptions.fieldAdd[1].options.push({id: ele.id, name: ele.model})
            });
          }
        }).catch(err => {

        })
      },
      deleteRow(row) {
        this.tableOptions.dataSift.splice(row, 1)
      },
      updateRow({data, row}) {
        this.tableOptions.dataSift.splice(row, 1, data)
      }
    },
    components: {
      BaseTable
    }
  }
</script>
