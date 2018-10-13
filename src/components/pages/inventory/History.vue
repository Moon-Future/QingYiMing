<template>
  <div class="history-container" v-loading="loading">
    <search :showElements="showElements"></search>
    <div class="page-wrapper">
      <el-pagination
        background
        layout="prev, pager, next"
        :disabled="loading"
        :page-size="5"
        :total="total"
        :current-page="currentPage"
        @current-change="currentChange">
      </el-pagination>
    </div>
    <div class="delivery-wrapper" v-for="(data, i) in deliveryHistory" :key="i">
      <div class="operate">
        <el-button size="mini" type="primary" @click="print(i)">重新打印</el-button>
        <el-button size="mini" type="danger" @click="deleteOne(i)">删除</el-button>
      </div>
      <div ref="printWrapper">
        <div class="print-wrapper print-wrapper-border" :class="!printFlag ? 'time-mark' : ''">
          <div class="print-time" v-show="!printFlag">{{ data[0].createTime | timeFilter }}</div>
          <div class="delivery-title">襄阳情义明木业有限公司出库单</div>
          <div class="delivery-message">
            <div class="receive-company">收货单位: {{ data[0].custm }}</div>
            <div class="delivery-number">
              <span>送货日期: {{ new Date(data[0].time).getFullYear() }} 年 {{ new Date(data[0].time).getMonth() + 1 }} 月 {{ new Date(data[0].time).getDate() }} 日</span>
              <span>NO: {{ data[0].no | noFilter }}</span>
            </div>
          </div>
          <div class="delivery-table">
            <el-table size="mini" show-summary :summary-method="getSummaries" :data="data">
              <template v-for="(item, i) in field">
                <el-table-column :prop="item.prop" :label="item.label" :key="i" :width="item.width ? item.width : ''"></el-table-column>
              </template>
            </el-table>
          </div>
          <div class="delivery-footer">
            <div class="delivery-company">送货人: 情义明</div>
            <div class="receive-psn">收货人: </div>
            <div class="receive-time"><span>年</span><span>月</span><span>日</span></div>
            <div class="provider-company">供货单位（盖章）</div>
          </div>
        </div>
      </div>  
    </div>
    <div class="page-wrapper">
      <el-pagination
        background
        layout="prev, pager, next"
        :disabled="loading"
        :page-size="pageSize"
        :total="total"
        :current-page="currentPage"
        @current-change="currentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import Search from 'components/common/Search'
  import { dateFormat } from 'common/js/tool'
  import apiUrl from '@/serviceAPI.config.js'
  export default {
    data() {
      return {
        showElements: {
          time: true,
          searchBtn: true
        },
        deliveryHistory: [],
        field: [
          {prop: 'nun', label: '物料编码', 'width': '80'},
          {prop: 'name', label: '产品名称', width: '70'},
          {prop: 'model', label: '规格型号'},
          {prop: 'unit', label: '单位', width: '40'},
          {prop: 'qty', label: '数量', width: '50', input: true, noPadding: true},
          {prop: 'qtyR', label: '实收数量', width: '70', input: true},
          {prop: 'ptime', label: '生产日期', width: '80'},
          {prop: 'lot', label: '生产批次', input: true, width: '60'},
          {prop: 'remark', label: '备注', input: true, width: '50'}
        ],
        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: 5,
        printFlag: false
      }
    },
    created() {
      this.getDeliveryHistory()
    },
    methods: {
      getDeliveryHistory(pageNo = 1) {
        this.loading = true
        this.$http.post(apiUrl.getDeliveryHistory, {
          data: {pageNo}
        }).then(res => {
          if (res.data.code === 200) {
            this.loading = false
            this.deliveryHistory = res.data.message
            this.total = res.data.count
            for (let i = 0, len = this.deliveryHistory.length; i < len; i++) {
              let list = this.deliveryHistory[i]
              for (let j = 0; j < list.length; j++) {
                list[j].ptime = dateFormat(list[j].ptime, 'yyyy-MM-dd')
                list[j].time = dateFormat(list[j].time, 'yyyy-MM-dd')
              }
            }
          } else {
            this.loading = false
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.loading = false
          this.$message.error('服务器君傲娇啦😭')
        })
      },
      currentChange(pageNo) {
        this.currentPage = pageNo
        this.getDeliveryHistory(pageNo)
      },
      print(index) {
        this.printFlag = true
        this.$nextTick(() => {
          setTimeout(() => {
            const printHtml = this.$refs.printWrapper[index].innerHTML
            const app = document.getElementById('app')
            const printPanel = document.getElementById('printPanel')
            app.style.display = 'none'
            printPanel.innerHTML = printHtml
            window.print()
            printPanel.innerHTML = ''
            app.style.display = 'block'
            this.printFlag = false
          }, 50)
        })
      },
      deleteOne(index) {
        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let grp, ids = []
          this.deliveryHistory[index].forEach(ele => {
            grp = ele.grp
            ids.push(ele.id)
          })
          this.$http.post(apiUrl.deleteDelivery, {
            data: {grp, ids}
          }).then(res => {
            if (res.data.code === 200) {
              this.$message.success(res.data.message)
              this.deliveryHistory.splice(index, 1)
              if (this.deliveryHistory.length === 0 && Math.ceil(this.total / this.pageSize) === this.currentPage) {
                this.currentChange(this.currentPage - 1)
              } else {
                this.currentChange(this.currentPage)
              }
            }
          }).catch(err => {
            this.$message.error('服务器君傲娇啦😭')
          })
        }).catch(() => {

        })
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 4) {
            sums[index] = '合计';
            return;
          }
          if (index === 5) {
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              sums[index] += '';
            } else {
              sums[index] = '';
            }
          }
        });
        return sums;
      },
    },
    filters: {
      noFilter(no) {
        return no < 10 ? `0${no}` : no
      },
      timeFilter(time) {
        const currentTime = new Date().getTime()
        const diffTime = currentTime - time
        const oneMin = 60000, oneHour = 3600000, oneDay = 86400000
        let result
        if (diffTime < oneMin) {
          result = '刚刚'
        } else if (diffTime > oneMin && diffTime < oneHour) {
          result = Math.floor(diffTime / oneMin) + ' 分钟前'
        } else if (diffTime > oneHour && diffTime < oneDay) {
          result = '今天 ' + dateFormat(time, 'hh:mm')
        } else {
          result = dateFormat(time, 'yyyy-MM-dd hh:mm')
        }
        return result
      }
    },
    components: {
      Search
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';
  .history-container {
    .delivery-wrapper {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px dashed;
      .operate {
        display: flex;
      }
    }
    .page-wrapper {
      display: flex;
      justify-content: flex-end;
    }
  }
  .print-wrapper {
    position: relative;
    width: 22.3cm;
    height: 9.4cm;
    padding: 0.48cm 1.1cm 0.42cm 1.8cm;
    border: 1px solid $color-deepgray;
    margin-top: 10px;
    box-sizing: border-box;
    &.time-mark {
      overflow: hidden;
    }
    &.print-template {
      border: none;
    }
    .delivery-title {
      font-weight: bold;
      font-size: $font-size-large-xx;
      margin-bottom: 5px;
      text-align: center;
    }
    .delivery-message {
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      margin-bottom: 10px;
      .delivery-number span {
        margin-left: 10px;
      }
    }
    .delivery-footer {
      display: flex;
      margin-top: 10px;
      margin-bottom: 20px;
      justify-content: space-between;
      padding: 0 10px;
      .provider-company {
        margin-right: 100px;
      }
      .receive-time span {
        margin: 0 20px;
      }
    }
    .print-time {
      position: absolute;
      left: 0;
      top: 0;
      z-Index: 2;
      padding: 0 2em;
      font-size: 13px;
      line-height: 32px;
      background: orange;
      -webkit-transform-origin: right bottom;
      -moz-transform-origin: right bottom;
      transform-origin: right bottom;
      -webkit-transform: translate(-29.29%,-100%) rotate(-45deg);
      -moz-transform: translate(-29.29%,-100%) rotate(-45deg);
      transform: translate(-29.29%,-100%) rotate(-45deg);
      text-indent: 0;
    }
  }
</style>
