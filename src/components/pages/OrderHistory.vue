<template>
  <div class="orderhistory-container">
    <div class="table-sift" >
      <el-table
        border
        v-loading="loading"
        :data="dataSift"
        :span-method="spanMethod"
        :cell-style="cellStyle">
        <template v-for="(item, i) in fieldSift">
          <el-table-column v-if="item.prop === 'finished'" :min-width="item.minWidth ? item.minWidth : ''" :prop="item.prop" :label="item.label" :key="i">
            <template slot-scope="scope">
              <icon-font :icon="scope.row.finished === 1 ? 'icon-finished' : ''"></icon-font>
            </template>
          </el-table-column>
          <el-table-column v-else :min-width="item.minWidth ? item.minWidth : ''" :prop="item.prop" :label="item.label" :key="i"></el-table-column>
        </template>
      </el-table>
      <div class="page-wrapper">
        <el-pagination
          background
          layout="prev, pager, next"
          :disabled="loading"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="currentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import IconFont from 'components/common/Iconfont'
  import { dateFormat, deepClone } from 'common/js/tool'
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
        fieldSift: [
          { prop: 'ord', label: '订单编号'},
          { prop: 'custm', label: '客户'},
          { prop: 'model', label: '产品'},
          { prop: 'qty', label: '数量', minWidth: '35'},
          { prop: 'sentQty', label: '已送数量', minWidth: '40'},
          { prop: 'restQty', label: '待送数量', minWidth: '40'},
          { prop: 'finished', label: '完成', minWidth: '25'},
          { prop: 'time', label: '订单日期', minWidth: '45'}
        ],
        dataSift: [],
        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: 10
      }
    },
    created() {
      this.siftMap = {}
      this.getOrderHistory()
    },
    methods: {
      getOrderHistory(pageNo = 1) {
        this.$http.post(apiUrl.getOrderHistory, {
          data: {pageNo, pageSize: this.pageSize}
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            this.total = res.data.count
            this.dataSift = res.data.message
            this.dataSift.forEach((ele, index) => {
              ele.restQty = Number(ele.qty) - Number(ele.sentQty)
              if (this.siftMap[ele.ord + ele.cust] === undefined) {
                this.siftMap[ele.ord + ele.cust] = {rowIndex: index, num: 1}
              } else {
                this.siftMap[ele.ord + ele.cust].num += 1
              }
              ele.time = dateFormat(ele.time, 'yyyy-MM-dd')
            })
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.loading = false
        })
      },
      currentChange(pageNo) {
        this.currentPage = pageNo
        this.getOrder(pageNo)
      },
      changeCustomer(cust, row) {
        row.productOptions = this.customerProduct[cust]
        row.message.forEach(ele => {
          ele.product = ''
        })
      },
      spanMethod({ row, column, rowIndex, columnIndex }) {
        if (!this.siftMap[row.ord + row.cust]) {
          return
        }
        if (this.siftMap[row.ord + row.cust].rowIndex === rowIndex) {
          if ([0, 1, 7, 8].indexOf(columnIndex) !== -1) {
            return {
              rowspan: this.siftMap[row.ord + row.cust].num,
              colspan: 1
            }
          }
        } else {
          if ([0, 1, 7, 8].indexOf(columnIndex) !== -1) {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        }
      },
      cellStyle({row, column, rowIndex, columnIndex}) {
        if (columnIndex === 3) {
          return 'color: blue'
        } else if (columnIndex === 4) {
          return 'color: #00CC33'
        } else if (columnIndex === 5) {
          return 'color: red'
        }
      },
    },
    filters: {
      filterCustomer(cust, customerMap) {
        return customerMap[cust]
      }
    },
    components: {
      IconFont
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .page-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
</style>
