<template>
  <div class="supply-container">
    <base-table
      :loading="loading"
      :tableOptions="tableOptions"
      :userInfo="userInfo"
      :total="total"
      @goBack="getInventoryOut"
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
            { prop: 'qty', label: '现库存量', required: true, input: true, type: 'number', placeholder: '输入库存数量' },
            { prop: 'sentQty', label: '累计已送量', input: true, type: 'number', placeholder: '输入已送数量' }
          ],
          fieldSift: [
            { prop: 'prdm', label: '产品名称' },
            { prop: 'model', label: '产品型号' },
            { prop: 'qty', label: '现库存量' },
            { prop: 'sentQty', label: '累计已送量' }
          ],
          dataSift: [],
          onlySift: true
        },
        loading: false,
        total: 0
      }
    },
    created() {
      this.getInventoryOut()
    },
    methods: {
      getInventoryOut(pageNo = 1) {
        this.loading = true
        this.$http.post(apiUrl.getInventoryOut, {
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
      currentChange(pageNo) {
        this.getInventoryIn(pageNo)
      }
    },
    components: {
      BaseTable
    }
  }
</script>
