<template>
  <div class="delivery-container">
    <search 
      :showElements="showElements" 
      :customerOptions="customerOptions"
      @changeCustomer="changeCustomer">
    </search>
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
        <delivery-table :tableData="tableData" :field="field"></delivery-table>
      </div>
      <div class="delivery-footer">
        <div class="delivery-company">送货人: 情义明</div>
        <div class="receive-psn">收货人: </div>
        <div class="receive-time"><span>年</span><span>月</span><span>日</span></div>
        <div class="provider-company">供货单位（盖章）</div>
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
        field: [
          {prop: 'nun', label: '物料编码'},
          {prop: 'name', label: '产品名称'},
          {prop: 'model', label: '规格型号'},
          {prop: 'unit', label: '单位'},
          {prop: 'qty', label: '数量', input: true, placeholder: '数量'},
          {prop: 'qtyReceive', label: '实收数量', input: true, placeholder: '实收数量'},
          {prop: 'time', label: '生产日期'},
          {prop: 'lot', label: '生产批次', input: true, placeholder: '生产批次'},
          {prop: 'mark', label: '备注', input: true, placeholder: '备注'}
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
              this.customerOptions.push({value: ele.customer, label: ele.customer})
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
    .print-wrapper {
      width: 80%;
      border: 1px solid $color-gray;
      padding: 20px 150px;
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
</style>
