<template>
  <div class="delivery-container">
    <search 
      :showElements="showElements" 
      :customerOptions="customerOptions"
      @changeCustomer="changeCustomer">
    </search>
    <div class="delivery-content">
      <div class="select-table">
        <el-popover
          :value="listShowFlag"
          @hide="hideList"
          placement="right"
          trigger="click">
          <el-table 
            ref="listTable" 
            border 
            size="mini" 
            max-height="300"
            :data="tableData"
            key="listTable1"
            v-if="template !== 3" 
            v-loading="loading" 
            @selection-change="selectionChange" 
            @select="select" 
            @select-all="selectAll">
            <el-table-column type="selection" width="35"></el-table-column>
            <el-table-column v-for="(item, i) in selectField" :prop="item.prop" :label="item.label" :key="i" :width="item.width ? item.width : ''"></el-table-column>
          </el-table>
          <el-table 
            border 
            size="mini" 
            max-height="300" 
            :data="tableData" 
            key="listTable2"
            v-if="template === 3" 
            v-loading="loading"
            :span-method="spanMethod"
            :cell-style="cellStyle">
            <template v-for="(item, i) in selectField">
              <el-table-column v-if="!item.checkBox" :width="item.width ? item.width : ''" :prop="item.prop" :label="item.label" :key="i">
              </el-table-column>
              <el-table-column v-if="item.checkBox" :width="item.width ? item.width : ''" :prop="item.prop" :label="item.label" :key="i">
                <template slot-scope="scope">
                  <el-checkbox v-model="scope.row[item.prop]" @change="selectOrder(scope.row)"></el-checkbox>
                </template>
              </el-table-column>
            </template>
          </el-table>
          <el-button type="primary" slot="reference">物料清单</el-button>
        </el-popover>
        <el-button slot="reference" @click="print">打印 <icon-font icon="icon-dayinji"></icon-font></el-button>
      </div>
      <div ref="printWrapper">
        <div class="print-wrapper"
          :class="{'print-wrapper-border': hasSelected, 'has-sum-table': !sumFlag}">
          <div class="delivery-title">襄阳情义明木业有限公司出库单</div>
          <div class="delivery-message">
            <div class="receive-company">收货单位：{{ receiveCompany }}</div>
            <div class="delivery-number">
              <span>送货日期：{{ deliveryTime.getFullYear() }} 年 {{ deliveryTime.getMonth() + 1 }} 月 {{ deliveryTime.getDate() }} 日</span>
              <span>NO:{{ no }}</span>
            </div>
          </div>
          <div class="delivery-table" v-show="!printFlag">
            <el-table :border="!hasSelected" size="mini" :show-summary="sumFlag" :summary-method="getSummaries" :data="selectData" :key="receiveCompany">
              <template v-for="(item, i) in field">
                <el-table-column :prop="item.prop" :label="item.label" :key="i" v-if="item.input" :width="item.width ? item.width : ''">
                  <template slot-scope="scope">
                    <el-input size="mini" v-if="item.input" v-model="scope.row[item.prop]" :placeholder="item.placeholder"></el-input>
                  </template>
                </el-table-column>
                <el-table-column :prop="item.prop" :label="item.label" :key="i" v-if="!item.input" :width="item.width ? item.width : ''"></el-table-column>
              </template>
            </el-table>
          </div>
          <div class="delivery-table" v-if="printFlag">
            <!-- <el-table size="mini" show-summary :summary-method="getSummaries" :data="selectData">
              <template v-for="(item, i) in fieldPrint">
                <el-table-column :prop="item.prop" :label="item.label" :key="i" :width="item.width ? item.width : ''" :min-width="item.minWidth ? item.minWidth : ''"></el-table-column>
              </template>
            </el-table> -->
            <table style="width: 740px">
              <tr>
                <th v-for="(item, i) in field" :key="i">{{ item.label }}</th>
              </tr>
              <tr v-for="(data, i) in selectData" :key="i">
                <td v-for="(item, j) in field" :key="j">{{ data[item.prop] }}</td>
              </tr>
              <tr v-if="sumFlag">
                <td v-for="(data, i) in summaryData" :key="i">{{ data }}</td>
              </tr>
            </table>
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
  </div>
</template>

<script>
  import IconFont from 'components/common/Iconfont'
  import Search from 'components/common/Search'
  import apiUrl from '@/serviceAPI.config.js'
  import { dateFormat, deepClone } from 'common/js/tool'
  import { templateDelivery } from 'common/js/template'
  export default {
    data() {
      return {
        showElements: {
          customer: {placeholder: '请选择出货单位'},
        },
        customerOptions: [],
        customerMap: {},
        orderMap: {},
        template: 1,
        tableData: [],
        selectData: [],
        selectField: [],
        field: [],
        sumFlag: false,
        sumIndex: 0,
        deliveryTime: new Date(),
        receiveCompany: '',
        printFlag: false,
        listShowFlag: false,
        maxRow: 8,
        counter: {number: 1},
        loading: false
      }
    },
    computed: {
      hasSelected() {
        return this.selectData.length === 0 ? false : true
      },
      no() {
        return this.counter.number < 10 ? `0${this.counter.number}` : this.counter.number
      },
      summaryData() {
        let sums = ''
        let prop = this.field[this.sumIndex].prop
        let result = []
        this.selectData.forEach(ele => {
          if (ele[prop] !== '' && !isNaN(ele[prop])) {
            sums = Number(sums) + Number(ele[prop])
          }
        })
        for (let i = 0, len = this.field.length; i < len; i++) {
          if (i === this.sumIndex) {
            result.push(sums)
          } else if (i === this.sumIndex - 1) {
            result.push('合计')
          } else {
            result.push('')
          }
        }
        return result
      }
    },
    created() {
      this.getCompany()
    },
    methods: {
      print() {
        if (this.selectData.length === 0) {
          this.$message.error('请先选择数据')
          return
        }
        this.printFlag = true
        this.$nextTick(() => {
          setTimeout(() => {
            const printHtml = this.$refs.printWrapper.innerHTML
            const app = document.getElementById('app')
            const printPanel = document.getElementById('printPanel')
            app.style.display = 'none'
            printPanel.innerHTML = printHtml
            window.print()
            printPanel.innerHTML = ''
            app.style.display = 'block'
            this.printFlag = false
            this.$confirm('是否已打印？', '请确认', {
              confirmButtonText: '已打印',
              cancelButtonText: '未打印',
              closeOnClickModal: false,
              closeOnPressEscape: false,
              showClose: false,
              type: 'info'
            }).then(() => {
              this.$http.post(apiUrl.saveDelivery, {
                data: {counter: this.counter, deliveryData: this.dataFormat(this.selectData)}
              }).then(res => {
                this.counter.number += 1
                this.$refs.listTable.clearSelection()
              }).catch(err => {

              })
            }).catch(() => {
            })
          }, 50)
        })
      },
      getCompany() {
        this.$http.post(apiUrl.getCompany, {
          data: {type: 0}
        }).then(res => {
          this.customerOptions = []
          if (res.data.code === 200) {
            const customer = res.data.message
            customer.forEach(ele => {
              this.customerOptions.push({value: ele.id, label: ele.name})
              this.customerMap[ele.id] = {name: ele.name, template: ele.template}
            })
          }
        })
      },
      changeCustomer({customerId, customer}) {
        const template = this.customerMap[customerId].template
        this.template = template
        this.selectField = templateDelivery[template].selectField
        this.field = templateDelivery[template].field
        this.sumIndex = templateDelivery[template].sumIndex
        this.sumFlag = templateDelivery[template].sumFlag
        this.receiveCompany = customer
        this.loading = true
        this.listShowFlag = true
        this.selectData = []
        this.$http.post(this.template !== 3 ? apiUrl.getSupply : apiUrl.getOrder, {
          data: {customerId}
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            if (this.template !== 3) {
              this.tableData = res.data.message.supplyList
              const productionTime = new Date(this.deliveryTime.getTime() - 7 * 24 * 60 * 60 * 1000)
              this.tableData.forEach(ele => {
                ele.ptime = dateFormat(productionTime, 'yyyy-MM-dd')
              })
            } else {
              this.orderMap = {}
              this.tableData = res.data.message.orderList
              this.tableData.forEach((ele, index) => {
                ele.restQty = Number(ele.qty) - Number(ele.sentQty)
                if (this.orderMap[ele.ord] === undefined) {
                  this.orderMap[ele.ord] = {rowIndex: index, num: 1}
                } else {
                  this.orderMap[ele.ord].num += 1
                }
              })
            }
            const number = res.data.message.number
            number[0].number = Number(number[0].number) + 1
            this.counter = number[0]
          }
        }).catch(err => {

        })
      },
      hideList() {
        this.listShowFlag = false
      },
      selectionChange(data) {
        this.selectData = data
      },
      select(selection, row) {
        if (this.selectData.length === this.maxRow + 1) {
          this.$refs.listTable.toggleRowSelection(row, false);
          this.$message(`最多可选 ${this.maxRow} 条`)
        }
      },
      selectAll(selection) {
        const len = selection.length
        if (len > this.maxRow) {
          for (let i = len - 1; i >= this.maxRow; i--) {
            this.$refs.listTable.toggleRowSelection(selection[i], false);
            selection.splice(i, 1)
          }
        }
      },
      selectOrder(row) {
        const selectData = deepClone(row)
        if (row.checked === true) {
          selectData.ordQty = selectData.qty
          selectData.qty = ''
          this.selectData.push(selectData)
        } else {
          for (let i = 0, len = this.selectData.length; i < len; i++) {
            if (this.selectData[i].id === selectData.id) {
              this.selectData.splice(i, 1)
              break
            }
          }
        }
      },
      getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === this.sumIndex - 1) {
            sums[index] = '合计';
            return;
          }
          if (index === this.sumIndex) {
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
      spanMethod({ row, column, rowIndex, columnIndex }) {
        if (!this.orderMap[row.ord]) {
          return
        }
        if (this.orderMap[row.ord].rowIndex === rowIndex) {
          if ([0].indexOf(columnIndex) !== -1) {
            return {
              rowspan: this.orderMap[row.ord].num,
              colspan: 1
            }
          }
        } else {
          if ([0].indexOf(columnIndex) !== -1) {
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
      dataFormat() {
        let result = []
        this.selectData.forEach(ele => {
          const data = {
            prd: ele.prd, prdm: ele.prdm, cust: ele.cust, custm: ele.custm,
            model: ele.model, nun: ele.nun || '', unit: ele.unit, unitm: ele.unitm,
            qty: ele.qty || '', qtyR: ele.qtyR || '', ptime: ele.ptime && new Date(ele.ptime).getTime() || '',
            lot: ele.lot || '', remark: ele.remark || '', time: this.deliveryTime.getTime(),
            no: this.counter.number, counter: this.counter.id, ord: ele.ord || '', template: this.template,
            idOrd: ele.id || '', uuidOrd: ele.uuid || ''
          }
          result.push(data)
        })
        return result
      }
    },
    components: {
      IconFont,
      Search
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .delivery-container {
    .delivery-content {
      .select-table {
        text-align: left;
      }
    }
  }
  .print-wrapper {
    width: 22.3cm;
    height: 9.4cm;
    padding: 0.48cm 1.1cm 0.42cm 1.8cm;
    border: 1px solid $color-deepgray;
    margin-top: 10px;
    box-sizing: border-box;
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
      margin-top: 10px;
      margin-bottom: 5px;
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
  }
</style>
