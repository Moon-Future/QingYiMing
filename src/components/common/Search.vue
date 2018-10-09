<template>
  <div class="search-container" v-if="showElements">
    <div class="search-condition">
      <el-select 
        v-model="customerId"
        @change="changeCustomer"
        :filterable="showElements && showElements.customer && (showElements.customer.filterable || showElements.customer['allow-create'])"
        :allow-create="showElements && showElements.customer && showElements.customer['allow-create']"
        clearable
        :placeholder="showElements && showElements.customer && showElements.customer.placeholder" 
        v-if="showElements && showElements.customer">
        <el-option
          v-for="item in customerOptions" :label="item.label" :value="item.value" :key="item.value">
        </el-option>
      </el-select>
      <el-select
        v-model="prdName" 
        :filterable="showElements && showElements.product && (showElements.product.filterable || showElements.product['allow-create'])"
        :allow-create="showElements && showElements.product && showElements.product['allow-create']"
        clearable
        :placeholder="showElements && showElements.product && showElements.product.placeholder" 
        v-if="showElements && showElements.product">
        <el-option
          v-for="item in prdOptions" :label="item.label" :value="item.value" :key="item.value">
        </el-option>
      </el-select>
      <el-date-picker
        v-if="showElements && showElements.time"
        v-model="time"
        type="daterange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions">
      </el-date-picker>
    </div>
    <div class="search-btn" v-if="showElements && showElements.searchBtn">
      <el-button>查询</el-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      showElements: {
        type: Object,
        default: null
      },
      customerOptions: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        customerId: '',
        prdName: '',
        prdOptions: [],
        time: '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    methods: {
      changeCustomer() {
        let customer
        for (let i = 0, len = this.customerOptions.length; i < len; i++) {
          if (this.customerOptions[i].value === this.customerId) {
            customer = this.customerOptions[i].label
            break
          }
        }
        this.$emit('changeCustomer', {customerId: this.customerId, customer})
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .search-container {
    display: flex;
    margin-bottom: 10px;
    .search-condition {
      .search-input {
        width: initial;
      }
    }
    .search-btn {
      position: absolute;
      right: 10px;
    }
  }
</style>
