<template>
  <div class="delivery-container">
    <search 
      :showElements="showElements" 
      :customerOptions="customerOptions"
      @changeCustomer="changeCustomer">
    </search>
    <div class="delivery-content">
      <div class="select-table">
        <el-table border size="mini" :data="tableData" @selection-change="selectionChange">
          <el-table-column type="selection" width="35"></el-table-column>
          <el-table-column v-for="(item, i) in selectField" :prop="item.prop" :label="item.label" :key="i" :width="item.width ? item.width : ''"></el-table-column>
        </el-table>
      </div>
      <div class="print-wrapper">
        <div class="delivery-title">襄阳情义明木业有限公司出库单</div>
        <div class="delivery-message">
          <div class="receive-company">收货单位: {{ receiveCompany }}</div>
          <div class="delivery-number">
            <span>送货日期: {{ deliveryTime.getFullYear() }} 年 {{ deliveryTime.getMonth() + 1 }} 月 {{ deliveryTime.getDate() }} 日</span>
            <span>NO: {{ '03' }}</span>
          </div>
        </div>
        <div class="delivery-table">
          <el-table border size="mini" show-summary :summary-method="getSummaries" :data="selectData" cell-class-name="no-padding">
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
        <div class="delivery-footer">
          <div class="delivery-company">送货人: 情义明</div>
          <div class="receive-psn">收货人: </div>
          <div class="receive-time"><span>年</span><span>月</span><span>日</span></div>
          <div class="provider-company">供货单位（盖章）</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import IconFont from 'components/common/Iconfont'
  import Search from 'components/common/Search'
  import DeliveryTable from 'components/common/DeliveryTable'
  import apiUrl from '@/serviceAPI.config.js'
  import { dateFormat } from 'common/js/tool'
  export default {
    data() {
      return {
        showElements: {
          customer: {placeholder: '请选择出货单位'},
        },
        customerOptions: [],
        tableData: [],
        selectData: [],
        selectField: [
          {prop: 'name', label: '产品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'nun', label: '物料编码'}
        ],
        field: [
          {prop: 'nun', label: '物料编码'},
          {prop: 'name', label: '产品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'unit', label: '单位', width: '50'},
          {prop: 'qty', label: '数量', width: '50', input: true, noPadding: true},
          {prop: 'qtyReceive', label: '实收数量', width: '70', input: true},
          {prop: 'time', label: '生产日期', width: '90'},
          {prop: 'lot', label: '生产批次', input: true},
          {prop: 'mark', label: '备注', input: true}
        ],
        deliveryTime: new Date(),
        receiveCompany: ''
      }
    },
    created() {
      this.getOptions()
    },
    methods: {
      getOptions() {
        this.$http.post(apiUrl.getOptions, {
          data: {customer: true}
        }).then(res => {
          this.customerOptions = []
          if (res.data.code === 200) {
            const customer = res.data.message.customer
            customer.forEach(ele => {
              this.customerOptions.push({value: ele, label: ele})
            })
          }
        })
      },
      changeCustomer(customer) {
        this.receiveCompany = customer
        this.$http.post(apiUrl.getCustomer, {
          data: {customer}
        }).then(res => {
          if (res.data.code === 200) {
            this.tableData = res.data.message
            const productionTime = new Date(this.deliveryTime.getTime() - 7 * 24 * 60 * 60 * 1000)
            this.tableData.forEach(ele => {
              ele.time = dateFormat(productionTime, 'yyyy-MM-dd')
            })
          }
        }).catch(err => {

        })
      },
      selectionChange(data) {
        this.selectData = data
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
      }
    },
    components: {
      IconFont,
      Search,
      DeliveryTable
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .delivery-container {
    .delivery-content {
      display: flex;
      .select-table {

      }
      .print-wrapper {
        width: 22.3cm;
        height: 9.4cm;
        padding: 0.48cm 1.1cm 0.42cm 1.8cm;
        border: 1px solid $color-gray;
        margin: auto;
        box-sizing: border-box;
        .delivery-title {
          font-weight: bold;
          font-size: $font-size-large-x;
          margin-bottom: 10px;
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
    }
  }
</style>
