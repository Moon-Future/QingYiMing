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
  import { dateFormat } from 'common/js/tool'
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
          fieldSift: [
            { prop: 'prdm', label: '产品名称' },
            { prop: 'model', label: '产品型号' },
            { prop: 'sentQty', label: '送货量' },
            { prop: 'custm', label: '客户' },
            { prop: 'sentTime', label: '送货日期'}
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
            this.tableOptions.dataSift.forEach(ele => {
                ele.sentTime = dateFormat(ele.sentTime, 'yyyy-MM-dd')
            })
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
