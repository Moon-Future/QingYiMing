<template>
  <div class="supply-container">
    <base-table
      :loading="loading"
      :tableOptions="tableOptions"
      :userInfo="userInfo"
      :total="total"
      @goBack="getInventoryIn"
      @goAdd="getOptions"
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
      }
    },
    data() {
      return {
        tableOptions: {
          fieldAdd: [
            { prop: 'prd', label: '产品', required: true, options: [], select: true, key: 'model' },
            { prop: 'qty', label: '库存数量', required: true, input: true, type: 'number', placeholder: '输入库存数量' },
            { prop: 'sentQty', label: '已送数量', input: true, type: 'number', placeholder: '输入已送数量' }
          ],
          fieldSift: [
            { prop: 'prdm', label: '产品名称' },
            { prop: 'model', label: '产品型号' },
            { prop: 'qty', label: '库存数量' },
            { prop: 'sentQty', label: '已送数量' }
          ],
          checkRepeat: {field: ['prd'], message: '产品重复'},
          dataSift: [],
          addTemplate: { prd: '', prdm: '', qty: '', sentQty: '' },
          addApi: apiUrl.insertInverntoy,
          deleteApi: apiUrl.deleteInventory,
          updApi: apiUrl.updInventory,
          onlySift: true
        },
        loading: false,
        total: 0
      }
    },
    created() {
      this.getInventoryIn()
      this.getOptions()
    },
    methods: {
      getInventoryIn(pageNo = 1) {
        this.loading = true
        this.$http.post(apiUrl.getInventoryIn, {
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
      getOptions() {
        this.tableOptions.fieldAdd[0].options = []
        this.$http.post(apiUrl.getOptions).then(res => {
          if (res.data.code === 200) {
            const product = res.data.message.product
            product.forEach(ele => {
              this.tableOptions.fieldAdd[0].options.push({id: ele.id, name: ele.model})
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
      },
      currentChange(pageNo) {
        this.getInventoryIn(pageNo)
      }
    },
    components: {
      BaseTable
    }
  }
</script>
