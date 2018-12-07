<template>
  <div class="supply-container">
    <search :showElements="showElements" :customerOptions="customerOptions" :productOptions="productOptions" @search="search"></search>
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
  import Search from 'components/common/Search'
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
        showElements: {
          product: {'filterable': true, placeholder: '请选择或输入产品名'},
          customer: {'filterable': true, placeholder: '请选择或输入客户'},
          time: true,
          searchBtn: true,
          export: true
        },
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
        customerOptions: [],
        productOptions: [],
        loading: false,
        total: 0,
        oneday: 24 * 60 * 60 * 1000,
        condition: {
          cust: '',
          prd: '',
          time: ''
        }
      }
    },
    created() {
      this.getInventoryOut()
      this.getOptions()
    },
    methods: {
      getInventoryOut(pageNo = 1) {
        this.loading = true
        const cust = this.condition.cust
        const prd = this.condition.prd
        const time = this.condition.time
        this.$http.post(apiUrl.getInventoryOut, {
          data: {pageNo, cust, prd, time}
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
      getOptions() {
        this.customerOptions = []
        this.productOptions = []
        this.$http.post(apiUrl.getOptions).then(res => {
          if (res.data.code === 200) {
            const customer = res.data.message.customer
            const product = res.data.message.product
            customer.forEach(ele => {
              this.customerOptions.push({value: ele.id, label: ele.name})
            });
            product.forEach(ele => {
              this.productOptions.push({value: ele.id, label: ele.model})
            });
          }
        }).catch(err => {

        })
      },
      currentChange(pageNo) {
        this.getInventoryOut(pageNo)
      },
      search(conditions) {
        this.condition.cust = conditions.customerId
        this.condition.prd = conditions.productId
        const time = conditions.time
        if (time) {
          time.forEach((ele, index)=> {
            ele = new Date(ele).getTime()
            ele = index === 1 ? ele + this.oneday - 1 : ele 
            time.splice(index, 1, ele)
          })
        }
        this.condition.time = time
        this.getInventoryOut()
      }
    },
    components: {
      Search,
      BaseTable
    }
  }
</script>
