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
            <el-table-column type="selection" width="40"></el-table-column>
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
              <span v-show="template !== 3">NO:{{ no }}</span>
            </div>
          </div>
          <div class="delivery-table" v-show="!printFlag">
            <el-table :border="!hasSelected" size="mini" :show-summary="sumFlag" :summary-method="getSummaries" :data="selectData" :class="{morePadding: template === 3}" :key="receiveCompany">
              <template v-for="(item, i) in field">
                <el-table-column :prop="item.prop" :label="item.label" :key="i" v-if="item.input" :width="item.width ? item.width : ''" height="100">
                  <template slot-scope="scope">
                    <template v-if="item.tooltip">
                      <el-tooltip :content="`不得大于${scope.row.restQty}`" placement="right" effect="dark">
                        <el-input size="mini" :type="item.type" v-if="item.input" v-model="scope.row[item.prop]" :placeholder="item.placeholder" @blur="ordQtyBlur(scope.row)"></el-input>
                      </el-tooltip>
                    </template>
                    <template v-else>
                      <el-input size="mini" :type="item.type" v-if="item.input" v-model="scope.row[item.prop]" :placeholder="item.placeholder"></el-input>
                    </template>
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
            <table style="width: 740px" :class="{morePadding: template === 3}">
              <tr>
                <th v-for="(item, i) in field" :key="i" :width="item.printWidth ? item.printWidth : ''">{{ item.label }}</th>
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

    <el-dialog
      title="请确认"
      :visible.sync="dialogVisible"
      width="40%"
      append-to-body
      :close-on-click-modal="false"
      :show-close="false">
      <div class="dialog-title">是 否 保 存 数 据 ?</div>
      <div class="dialog-info">若 无 操 作，5 秒 后 自 动 保 存 ！！！</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSave">不 保 存</el-button>
        <el-button type="primary" @click="saveDelivery">保 存</el-button>
      </span>
    </el-dialog>
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
        maxRow: 9,
        counter: {number: 1},
        loading: false,
        dialogVisible: false
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
      window.addEventListener('beforeunload', this.windowUnload)
    },
    destroyed() {
      console.log('-------destroyed')
      window.removeEventListener('beforeunload', this.windowUnload)
    },
    methods: {
      windowUnload(event) {
        // 打印后若刷新或关闭页面，则默认保存
        console.log('------------windowUnload', this.afterPrint)
        if (!this.afterPrint) return
        event.preventDefault()
        console.log('保存--')
        this.saveDelivery()
      },
      print() {
        this.deliveryTime = new Date()
        if (this.selectData.length === 0) {
          this.$message.error('请先选择数据')
          return
        }
        this.printFlag = true
        this.$nextTick(() => {
          setTimeout(() => {
            // 打印后
            this.afterPrint = true
            const printHtml = this.$refs.printWrapper.innerHTML
            const app = document.getElementById('app')
            const printPanel = document.getElementById('printPanel')
            app.style.display = 'none'
            printPanel.innerHTML = printHtml
            window.print()
            printPanel.innerHTML = ''
            app.style.display = 'block'
            this.printFlag = false
            this.dialogVisible = true
            // const confirm = this.$confirm('是否保存数据？10 秒后默认保存！！！', '请确认', {
            //   confirmButtonText: '保存',
            //   cancelButtonText: '不保存',
            //   confirmButtonClass: 'confirm-button',
            //   cancelButtonClass: 'cancel-button',
            //   closeOnClickModal: false,
            //   closeOnPressEscape: false,
            //   showClose: false,
            //   type: 'info'
            // }).then(() => {
            //   this.saveDelivery()
            // }).catch(() => {
            //   console.log(222)
            // })

            // 若5秒没操作，则默认保存
            this.afterPrintTimer = setTimeout(() => {
              console.log('5s自动保存')
              this.saveDelivery()
            }, 5000)
          }, 50)
        })
      },
      cancelSave() {
        this.afterPrint = false
        this.dialogVisible = false
        clearTimeout(this.afterPrintTimer)
        this.$message.info('未保存！')
      },
      saveDelivery() {
        this.afterPrint = false
        this.dialogVisible = false
        clearTimeout(this.afterPrintTimer)
        this.$http.post(apiUrl.saveDelivery, {
          data: {counter: this.counter, deliveryData: this.dataFormat(this.selectData)}
        }).then(res => {
          this.$message.success('保存成功！')
          this.counter.number += 1
          if (this.template === 3) {
            this.selectData = []
            this.tableData = []
            this.changeCustomer(this.selectCustomerMap)
            this.listShowFlag = false
          } else {
            this.$refs.listTable.clearSelection()
          }
        }).catch(err => {
          this.$message.error('保存失败！')
          console.log(err)
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
        this.deliveryTime = new Date()
        this.selectCustomerMap = {customerId, customer}
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
        this.deliveryTime = new Date()
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
      ordQtyBlur(row) {
        if (!/^[0-9]*$/.test(row.qty) || Number(row.qty) > Number(row.restQty)) {
          this.$message.error(`输入有误，只能为数字且不得大于${row.restQty}`)
          row.qty = ''
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
        let deliveryTime = this.deliveryTime
        this.selectData.forEach(ele => {
          const data = {
            prd: ele.prd, prdm: ele.prdm, cust: ele.cust, custm: ele.custm,
            model: ele.model, nun: ele.nun || '', unit: ele.unit, unitm: ele.unitm,
            qty: ele.qty || '', qtyR: ele.qtyR || '', sentQty: ele.sentQty || 0, ordQty: ele.ordQty || 0,
            ptime: ele.ptime && new Date(ele.ptime).getTime() || 0,
            lot: ele.lot || '', remark: ele.remark || '', time: deliveryTime.getTime(),
            no: this.counter.number, counter: this.counter.id, ord: ele.ord || '', template: this.template,
            ordId: ele.id || '', ordUuid: ele.uuid || '', ordTemplate: this.template === 3 ? true : false,
            qtyAll: ele.qtyAll || 0, sentAll: ele.sentAll || 0
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
    padding: 0.2cm 1.1cm 0.42cm 1.8cm;
    border: 1px solid $color-deepgray;
    margin-top: 10px;
    box-sizing: border-box;
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
  }
  .dialog-title {
    margin-bottom: 20px;
    font-weight: bold;
    font-size: 26px;
  }
  .dialog-info {
    color: red;
    font-weight: bold;
    font-size: 26px;
  }
</style>
