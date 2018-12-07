<template>
  <div class="search-container" v-if="showElements">
    <div class="search-condition">
      <el-select 
        v-model="customerId"
        :filterable="showElements && showElements.customer && (showElements.customer.filterable || showElements.customer['allow-create'])"
        :allow-create="showElements && showElements.customer && showElements.customer['allow-create']"
        clearable
        :placeholder="showElements && showElements.customer && showElements.customer.placeholder" 
        v-if="showElements && showElements.customer"
        @change="changeCustomer">
        <el-option
          v-for="item in customerOptions" :label="item.label" :value="item.value" :key="item.value">
        </el-option>
      </el-select>
      <el-select
        v-model="productId" 
        :filterable="showElements && showElements.product && (showElements.product.filterable || showElements.product['allow-create'])"
        :allow-create="showElements && showElements.product && showElements.product['allow-create']"
        clearable
        :placeholder="showElements && showElements.product && showElements.product.placeholder" 
        v-if="showElements && showElements.product"
        @change="changeProduct">
        <el-option
          v-for="item in productOptions" :label="item.label" :value="item.value" :key="item.value">
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
        :picker-options="pickerOptions"
        @change="changeTime">
      </el-date-picker>
    </div>
    <div class="search-btn" v-if="showElements && showElements.searchBtn">
      <el-button @click="search">查询</el-button>
      <el-button v-if="showElements.export" @click="exportToExcel">导出Excel</el-button>
    </div>
    <div class="file-link" v-show="false">
      <a :href="fileLink" target="_blank" download="情义明出货数据.xlsx" ref="downloadLink"></a>
    </div>
  </div>
</template>

<script>
  import apiUrl from '@/serviceAPI.config.js'
  export default {
    props: {
      showElements: {
        type: Object,
        default: null
      },
      customerOptions: {
        type: Array,
        default: null
      },
      productOptions: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
        customerId: '',
        productId: '',
        time: '',
        fileLink: '',
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
        this.search()
      },
      changeProduct() {
        this.search()
      },
      changeTime() {
        this.search()
      },
      search() {
        this.$emit('search', {customerId: this.customerId, productId: this.productId, time: this.time})
      },
      exportToExcel() {
        let time = this.time
        if (time) {
          time.forEach((ele, index)=> {
            ele = new Date(ele).getTime()
            time.splice(index, 1, ele)
          })
        }
        this.$http.post(apiUrl.getInventoryOut, {
          data: {pageNo: 1, cust: this.customerId, prd: this.productId, time, export: true}
        }).then(res => {
          if (res.data.code === 200) {
            this.fileLink = res.data.fileLink
            this.$nextTick(() => {
              this.$refs.downloadLink.click()
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .search-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    .search-condition {
      .search-input {
        width: initial;
      }
    }
    .search-btn {
      // position: absolute;
      // right: 10px;
    }
  }
</style>
