<template>
  <div class="order-container">
    <div class="btn-operate">
      <el-button v-if="userInfo && userInfo.root === 1" type="primary" size="mini" v-show="!this.addFlag" @click="goAdd">新增</el-button>
      <el-button type="primary" size="mini" v-show="this.addFlag" @click="goBack">返回</el-button>
    </div>
    <div class="table-sift" v-show="!this.addFlag">
      <el-table
        border
        v-loading="loading"
        :data="dataSift"
        :row-class-name="tableRowFinished"
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
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index)">编辑</el-button>
          </template>
        </el-table-column>
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
    <div class="table-add" v-show="this.addFlag">
      <table class="proto-table">
        <tr>
          <th class="field-required">订单编号</th>
          <th class="field-required">客户</th>
          <th class="field-required">产品</th>
          <th class="field-required">数量</th>
          <th width=50></th>
          <th>订单时间</th>
          <th width=100></th>
        </tr>
        <template v-for="(data, i) in dataAdd" >
          <tr :key="i">
            <td :rowspan="data.message.length + 1">
              <el-input size="mini" :readonly="updFlag" v-model="data.ord" placeholder="请输入订单编号"></el-input>
            </td>
            <td :rowspan="data.message.length + 1">
              <el-select size="mini" v-if="!updFlag"  v-model="data.cust" @change="changeCustomer(data.cust, data)">
                <el-option
                  v-for="option in customerOptions" :label="option.name" :value="option.id" :key="option.id">
                </el-option>
              </el-select>
              <template v-else>{{ data.cust | filterCustomer(customerMap) }}</template>
            </td>
            <td>
              <el-select size="mini" v-model="data.message[0].prd">
                <el-option
                  v-for="option in data.productOptions" :label="option.name" :value="option.id" :key="option.id">
                </el-option>
              </el-select>
            </td> 
            <td>
              <el-input
                v-model="data.message[0].qty"
                type="number" 
                size="mini" 
                placeholder="请输入订单数量"
                @blur="qtyBlur(data.message[0])"></el-input>
            </td> 
            <td></td>
            <td :rowspan="data.message.length + 1">
              <el-date-picker
                v-model="data.time"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                :clearable="false">
              </el-date-picker>
            </td>
            <td :rowspan="data.message.length + 1">
              <el-button size="mini" type="danger" @click="deleteRow(i)">删除</el-button>
            </td>
          </tr>
          <template>
            <tr v-for="index in data.message.length - 1" :key="`${i}_${index}`">
              <td>
                <el-select size="mini" v-model="data.message[index].prd">
                  <el-option
                    v-for="option in data.productOptions" :label="option.name" :value="option.id" :key="option.id">
                  </el-option>
                </el-select>
              </td> 
              <td>
                <el-input 
                  v-model="data.message[index].qty" 
                  type="number" 
                  size="mini" 
                  placeholder="请输入订单数量" 
                  @blur="qtyBlur(data.message[index])"></el-input>
              </td>
              <td><icon-font icon="icon-minus" @click.native="delPrdRow(data.message, index)"></icon-font></td>
            </tr>
          </template>
          <tr :key="`${i}_a`">
            <td colspan="2">
              <el-button class="btn-add" type="info" size="mini" @click="addPrdRow(data.message)">新增</el-button>
            </td>
            <td></td>
          </tr>
        </template>
      </table>
      <el-button class="btn-add" type="primary" size="medium" v-show="!updFlag" @click="addRow">新增</el-button>
      <el-button class="btn-submit" type="success" size="medium" v-show="!subWait" @click="submitAdd">提交</el-button>
      <el-button class="btn-submit" type="info" size="medium" v-show="subWait" :loading="true">提交中</el-button>
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
        siftMap: {},
        editMap: {},
        dataUpd: [],
        dataDel: [],
        dataAdd: [
          {ord: '', cust: '', message: [{prd: '', qty: ''}], productOptions: [], time: ''}
        ],
        customerProduct: {},
        customerOptions: [],
        customerMap: {},
        productMap: {},
        optionFlag: false,
        delAll: false,
        updFlag: false,
        addFlag: false,
        loading: false,
        subWait: false,
        total: 0,
        currentPage: 1,
        pageSize: 10,
        currentTime: new Date().getTime()
      }
    },
    created() {
      this.getOrder()
      if (!this.optionFlag) {
        this.optionFlag = true
        this.getOptions()
      }
    },
    methods: {
      getOrder(pageNo = 1) {
        this.siftMap = {}
        this.editMap = {}
        this.loading = true
        this.updFlag = false
        this.$http.post(apiUrl.getOrder, {
          data: {pageNo, pageSize: this.pageSize}
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            this.total = res.data.count
            this.dataSift = res.data.message
            this.dataSift.forEach((ele, index) => {
              ele.restQty = Number(ele.qty) - Number(ele.sentQty)
              if (this.siftMap[ele.ord] === undefined) {
                this.siftMap[ele.ord] = {rowIndex: index, num: 1}
                this.editMap[index] = [{
                  id: ele.id,
                  uuid: ele.uuid,
                  ord: ele.ord,
                  cust: ele.cust,
                  time: ele.time,
                  message: [{prd: ele.prd, qty: ele.qty, id: ele.id, sentQty: ele.sentQty}],
                  productOptions: [],
                  sentAll: ele.sentAll,
                  qtyAll: ele.qtyAll
                }]
              } else {
                this.siftMap[ele.ord].num += 1
                this.editMap[this.siftMap[ele.ord].rowIndex][0].message.push({prd: ele.prd, qty: ele.qty, id: ele.id, sentQty: ele.sentQty})
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
      getOptions() {
        this.loading = true
        this.$http.post(apiUrl.getSupply).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            const message = res.data.message
            message.forEach(ele => {
              if (!this.customerProduct[ele.cust]) {
                this.customerProduct[ele.cust] = []
                this.customerOptions.push({id: ele.cust, name: ele.custm})
                this.customerMap[ele.cust] = ele.custm
              }
              if (!this.productMap[ele.prd]) {
                this.productMap[ele.prd] = {model: ele.model, name: ele.prdm}
              }
              this.customerProduct[ele.cust].push({id: ele.prd, name: ele.model})
            });
          }
        }).catch(err => {
          this.loading = false
        })
      },
      goAdd(data) {
        this.addFlag = true
        this.delAll = false
        this.dataDel = []
        if (this.updFlag) {
          data[0].productOptions = this.customerProduct[data[0].cust]
          data[0].message.forEach(ele => {
            ele.prdm = this.productMap[ele.prd].name
            ele.model = this.productMap[ele.prd].model
          })
          this.dataAdd = data
          this.dataUpd = deepClone(data)
          this.dataUpd.forEach(ele => {
            ele.off = 1
          })
        } else {
          this.currentTime = new Date().getTime()
          this.dataAdd = [{ord: '', cust: '', message: [{prd: '', qty: ''}], productOptions: [], time: this.currentTime}]
        }
      },
      goBack() {
        this.addFlag = false
        this.updFlag = false
      },
      submitAdd() {
        if (this.subWait) {
          return
        }
        let ordMap = {}, subData = []
        if (this.delAll) {
          subData = this.dataUpd
        } else {
          subData = deepClone(this.dataAdd)
          for (let i = 0, len = subData.length; i < len; i++) {
            let data = subData[i]
            let message = data.message
            if (ordMap[data.ord]) {
              this.$message.error('存在相同订单编号')
              return
            }
            ordMap[data.ord] = true
            if (data.ord === '' || data.cust === '') {
              this.$message.error('* 为必填字段')
              return
            }
            data.custm = this.customerMap[data.cust]
            for (let j = 0; j < message.length; j++) {
              let prd = message[j].prd
              let qty = message[j].qty
              if (prd === '' || qty === '') {
                this.$message.error('* 为必填字段')
                return
              }
              message[j].model = this.productMap[prd].model
              message[j].prdm = this.productMap[prd].name
            }
            this.dataDel.forEach(ele => {
              message.splice(message.length, 1, ele)
            })
          }
        }
        this.$http.post(this.updFlag ? apiUrl.updOrder : apiUrl.insertOrder, {
          data: subData
        }).then(res => {
          if (res.data.code === 200) {
            this.addFlag = false
            this.updFlag = false
            this.currentChange(1)
            this.$message.success(res.data.message)
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          throw new Error(err)
        })
      },
      addRow() {
        this.dataAdd.push({ord: '', cust: '', message: [{prd: '', qty: ''}], productOptions: [], time: this.currentTime})
      },
      deleteRow(index) {
        this.dataAdd.splice(index, 1)
        this.delAll = true
      },
      updateRow({data, row}) {
        data.templatem = templateMap[data.template]
        this.tableOptions.dataSift.splice(row, 1, data)
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
      addPrdRow(row) {
        row.push({prd: '', qty: ''})
      },
      delPrdRow(row, index) {
        if (row[index].id) {
          let delData = deepClone(row[index])
          delData.off = 1
          this.dataDel.push(delData)
        }
        row.splice(index, 1)
      },
      qtyBlur(data) {
        if (data.sentQty !== undefined && Number(data.qty) < Number(data.sentQty)) {
          this.$message.error(`不得小于已送数量${data.sentQty}`)
          data.qty = ''
        }
      },
      handleEdit(index) {
        this.updFlag = true
        this.goAdd(deepClone(this.editMap[index]))
      },
      tableRowFinished({row, rowIndex}) {
        // if (row.finished === 1) {
        //   return 'finished-row'
        // }
      },
      spanMethod({ row, column, rowIndex, columnIndex }) {
        if (!this.siftMap[row.ord]) {
          return
        }
        if (this.siftMap[row.ord].rowIndex === rowIndex) {
          if ([0, 1, 7, 8].indexOf(columnIndex) !== -1) {
            return {
              rowspan: this.siftMap[row.ord].num,
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

  .btn-operate {
    text-align: left;
    margin-bottom: 10px;
    button {
      margin: 0;
    }
  }
  .table-add {
    .prd-message {
      margin: 3px 0;
      border-bottom: 1px solid;
      padding-bottom: 3px;
    }
    .btn-add {
      width: 100%;
    }
    .btn-submit {
      margin: 10px 0;
      display: flex;
      margin-left: auto;
    }
  }
  .page-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
</style>
