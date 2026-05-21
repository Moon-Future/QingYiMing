<template>
  <div class="history-container" v-loading="loading">
    <search 
      :showElements="showElements" 
      :customerOptions="customerOptions"
      @changeCustomer="changeCustomer"
      @search="search">
    </search>
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
        <!-- <el-button size="mini" type="primary" @click="edit(data)">编辑</el-button> -->
        <el-button size="mini" type="danger" v-if="cust[data[0].cust] === data[0].id" @click="deleteOne(i)">删除</el-button>
      </div>
      <div ref="printWrapper">
        <div class="print-wrapper print-wrapper-border"
          :class="{'time-mark': !printFlag, 'has-sum-table': !templateDelivery[data[0].template].sumFlag, 'template-4': data[0].template === 4}">
          <div class="print-time" v-show="!printFlag">{{ data[0].createTime | timeFilter }}</div>
          <template v-if="data[0].template !== 4">
            <div class="delivery-title">襄阳情义明木业有限公司出库单</div>
            <div class="delivery-message">
              <div class="receive-company">收货单位：{{ data[0].custm }}</div>
              <div class="delivery-number">
                <span>送货日期：{{ new Date(data[0].time).getFullYear() }} 年 {{ new Date(data[0].time).getMonth() + 1 }} 月 {{ new Date(data[0].time).getDate() }} 日</span>
                <span v-show="data[0].template !== 3">NO:{{ data[0].no | noFilter }}</span>
              </div>
            </div>
            <div class="delivery-table" v-show="!printFlag">
              <el-table size="mini" :show-summary="templateDelivery[data[0].template].sumFlag" :summary-method="getSummaries" :data="data" :class="{'morePadding': data[0].template === 3}">
                <el-table-column v-for="(item, i) in templateDelivery[data[0].template].history" :prop="item.prop" :label="item.label" :key="i" :width="item.width ? item.width : ''"></el-table-column>
              </el-table>
            </div>
            <div class="delivery-table" v-show="printFlag">
              <table style="width: 740px;" :class="{'morePadding': data[0].template === 3}">
                <tr>
                  <th v-for="(item, i) in templateDelivery[data[0].template].history" :width="item.printWidth ? item.printWidth : ''" :key="i">{{ item.label }}</th>
                </tr>
                <tr v-for="(trData, i) in data" :key="i">
                  <td v-for="(item, j) in templateDelivery[data[0].template].history" :key="j">{{ trData[item.prop] }}</td>
                </tr>
                <tr v-if="templateDelivery[data[0].template].sumFlag">
                  <td v-for="(item, i) in templateDelivery[data[0].template].history" :key="i">{{ data | summaryFilter(item, i) }}</td>
                </tr>
              </table>
            </div>
            <div class="delivery-footer">
              <div class="delivery-company">送货人: 情义明</div>
              <div class="receive-psn">收货人: </div>
              <div class="receive-time"><span>年</span><span>月</span><span>日</span></div>
              <div class="provider-company">供货单位（盖章）</div>
            </div>
          </template>
          <template v-else>
            <div class="delivery-title">襄阳情义明木业有限公司送货单</div>
            <div class="delivery-message delivery-message-alt">
              <div class="message-row">客户名称：{{ data[0].custm }}</div>
              <div class="message-row">送货地址：{{ data[0].address || getCustomerAddress(data[0].cust) }}</div>
            </div>
            <div class="delivery-table" v-show="!printFlag">
              <table class="signature-table">
                <tr>
                  <th v-for="(item, i) in templateDelivery[data[0].template].history" :width="item.printWidth ? item.printWidth : ''" :key="i">{{ item.label }}</th>
                </tr>
                <tr v-for="(trData, i) in data" :key="i">
                  <td v-for="(item, j) in templateDelivery[data[0].template].history" :key="j">{{ trData[item.prop] }}</td>
                </tr>
                <tr>
                  <td colspan="9" class="signature-row">
                    <div class="signature-item">发货人： &nbsp;&nbsp;陈强</div>
                    <div class="signature-item">供方盖章：</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="9" class="signature-row">收货人签字确认：</td>
                </tr>
                <tr>
                  <td colspan="9" class="signature-row">收货人盖章：</td>
                </tr>
              </table>
            </div>
            <div class="delivery-table" v-show="printFlag">
              <table style="width: 740px" class="signature-table">
                <tr>
                  <th v-for="(item, i) in templateDelivery[data[0].template].history" :width="item.printWidth ? item.printWidth : ''" :key="i">{{ item.label }}</th>
                </tr>
                <tr v-for="(trData, i) in data" :key="i">
                  <td v-for="(item, j) in templateDelivery[data[0].template].history" :key="j">{{ trData[item.prop] }}</td>
                </tr>
                <tr>
                  <td colspan="9" class="signature-row">
                    <div class="signature-item">发货人： &nbsp;&nbsp;陈强</div>
                    <div class="signature-item">供方盖章：</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="9" class="signature-row">收货人签字确认：</td>
                </tr>
                <tr>
                  <td colspan="9" class="signature-row">收货人盖章：</td>
                </tr>
              </table>
            </div>
          </template>
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
  import { templateDelivery } from 'common/js/template'
  export default {
    data() {
      return {
        showElements: {
          time: true,
          searchBtn: true,
          customer: {
            placeholder: '请选择客户',
            clearable: true
          }
        },
        customerOptions: [],
        customer: '-1',
        deliveryHistory: [],
        templateDelivery: templateDelivery,
        companyMap: {},
        loading: false,
        total: 0,
        currentPage: 1,
        pageSize: 5,
        printFlag: false,
        cust: {},
      }
    },
    created() {
      this.getDeliveryHistory()
      this.getCompany()
    },
    methods: {
      edit(data) {
        console.log(data)
      },
      getDeliveryHistory(pageNo = 1) {
        this.loading = true
        this.$http.post(apiUrl.getDeliveryHistory, {
          data: {pageNo, customer: this.customer}
        }).then(res => {
          if (res.data.code === 200) {
            this.loading = false
            this.deliveryHistory = res.data.message
            this.total = res.data.count
            this.cust = res.data.cust
            for (let i = 0, len = this.deliveryHistory.length; i < len; i++) {
              let list = this.deliveryHistory[i]
              for (let j = 0; j < list.length; j++) {
                if (list[j].ptime) {
                  list[j].ptime = dateFormat(list[j].ptime, 'yyyy-MM-dd')
                }
                if (list[j].time) {
                  list[j].time = dateFormat(list[j].time, 'yyyy-MM-dd')
                }
                list[j].name = list[j].prdm
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
      getCompany() {
        this.$http.post(apiUrl.getCompany, {
          data: {type: 0}
        }).then(res => {
          this.customerOptions = []
          this.companyMap = {}
          if (res.data.code === 200) {
            const customer = res.data.message
            customer.forEach(ele => {
              this.customerOptions.push({value: ele.id, label: ele.name})
              this.companyMap[ele.id] = {name: ele.name, address: this.getFirstAddress(ele.address)}
            })
          }
        })
      },
      getCustomerAddress(customerId) {
        return (this.companyMap[customerId] && this.companyMap[customerId].address) || ''
      },
      getFirstAddress(address) {
        if (!address) {
          return ''
        }
        return String(address).split(/[,，\n]/).map(ele => ele.trim()).filter(ele => ele)[0] || ''
      },
      search({customerId, productId, time}) {
        
      },
      changeCustomer({customerId, customer}) {
        this.customer = customerId == '' ? '-1' : customerId
        this.currentChange(1)
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
          let grp, counter, no, cust, template, ids = []
          this.deliveryHistory[index].forEach(ele => {
            grp = ele.grp
            counter = ele.counter
            no = ele.no
            cust = ele.cust
            template = ele.template
            ids.push(ele.id)
          })
          this.$http.post(apiUrl.deleteDelivery, {
            data: {grp, ids, counter, no, cust, template, deliveryData: this.deliveryHistory[index]}
          }).then(res => {
            if (res.data.code === 200) {
              this.cust[cust] = res.data.cust
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
        const sumIndex = templateDelivery[data[0].template].sumIndex
        const sums = [];
        columns.forEach((column, index) => {
          if (index === sumIndex - 1) {
            sums[index] = '合计';
            return;
          }
          if (index === sumIndex) {
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
        } else if (diffTime > oneHour && diffTime < oneDay && new Date().getDate() === new Date(time).getDate()) {
          result = '今天 ' + dateFormat(time, 'hh:mm')
        } else {
          result = dateFormat(time, 'yyyy-MM-dd hh:mm')
        }
        return result
      },
      summaryFilter(data, field, index) {
        let sums = ''
        let sumIndex = templateDelivery[data[0].template].sumIndex
        let prop = templateDelivery[data[0].template].history[sumIndex].prop
        data.forEach(ele => {
          if (ele[prop] !== '' && !isNaN(ele[prop])) {
            sums = Number(sums) + Number(ele[prop])
          }
        })

        if (index === sumIndex) {
          return sums
        } else if (index === sumIndex - 1) {
          return '合计'
        } else {
          return ''
        }
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
    padding: 0.2cm 1.1cm 0.42cm 1.8cm;
    border: 1px solid $color-deepgray;
    margin-top: 10px;
    box-sizing: border-box;
    &.template-4 {
      min-height: 9.4cm;
      height: initial;
    }
    &.time-mark {
      overflow: hidden;
    }
    &.print-template {
      border: none;
    }
    .delivery-title {
      font-weight: bold;
      font-size: 30px;
      margin-bottom: 5px;
      text-align: center;
    }
    .delivery-message {
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      margin-top: 5px;
      margin-bottom: 5px;
      .delivery-number span {
        margin-left: 10px;
      }
      &.delivery-message-alt {
        display: block;
        padding: 0;
        margin: 0;
        .message-row {
          margin-bottom: 4px;
          text-align: left;
        }
      }
    }
    .delivery-footer {
      display: flex;
      margin-top: 5px;
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
