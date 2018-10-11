<template>
  <div class="history-container">
    <search :showElements="showElements"></search>
    <div class="delivery-wrapper" v-for="(data, i) in deliveryHistory" :key="i">
      <div class="operate">
        <el-button size="mini" type="primary" >重新打印</el-button>
        <el-button size="mini" type="danger" >修改</el-button>
      </div>
      <div class="print-wrapper print-wrapper-border">
        <div class="delivery-title">襄阳情义明木业有限公司出库单</div>
        <div class="delivery-message">
          <div class="receive-company">收货单位: {{ data[0].custm }}</div>
          <div class="delivery-number">
            <span>送货日期: {{ new Date(data[0].time).getFullYear() }} 年 {{ new Date(data[0].time).getMonth() + 1 }} 月 {{ new Date(data[0].time).getDate() }} 日</span>
            <span>NO: {{ data[0].no | noFilter() }}</span>
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
      }
    },
    created() {
      this.getDeliveryHistory()
    },
    methods: {
      getDeliveryHistory() {
        this.$http.post(apiUrl.getDeliveryHistory).then(res => {
          if (res.data.code === 200) {
            this.deliveryHistory = res.data.message
            for (let i = 0, len = this.deliveryHistory.length; i < len; i++) {
              let list = this.deliveryHistory[i]
              for (let j = 0; j < list.length; j++) {
                list[j].ptime = dateFormat(list[j].ptime, 'yyyy-MM-dd')
                list[j].time = dateFormat(list[j].time, 'yyyy-MM-dd')
              }
            }
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error('服务器君傲娇啦😭')
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
        font-size: $font-size-large;
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
    }
  }
</style>
