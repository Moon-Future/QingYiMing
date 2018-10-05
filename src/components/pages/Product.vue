<template>
  <div class="product-container">
    <div class="search-wrapper">
      <div class="search-condition">
        <el-select v-model="prdName" filterable clearable placeholder="请选择或输入产品名">
          <el-option
            v-for="item in options" :label="item.label" :value="item.value" :key="item.value">
          </el-option>
        </el-select>
        <el-date-picker
          v-model="time"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
        <el-input class="search-input" placeholder="查询供应商"></el-input>
      </div>
      <div class="search-btn">
        <el-button>查询</el-button>
      </div>
    </div>
    <div class="product-operate">
      <el-button type="primary" size="mini">新增</el-button>
    </div>
    <div class="product-table" ref="productTable">
      <el-table border :data="prdData" :height="height">
        <el-table-column prop="name" label="产品"></el-table-column>
        <el-table-column prop="unit" label="单位"></el-table-column>
        <el-table-column prop="qty" label="数量"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import { prdData } from 'common/js/data'
  export default {
    data() {
      return {
        options: [
          {
            value: '1',
            label: '免熏蒸复合托盘系列1'
          },
          {
            value: '2',
            label: '免熏蒸复合托盘系列2'
          },
          {
            value: '3',
            label: '免熏蒸复合托盘系列3'
          },
          {
            value: '4',
            label: '免熏蒸复合托盘系列4'
          }
        ],
        prdName: '',
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
        prdData: [],
        height: 500
      }
    },
    mounted() {
      this.$nextTick(() => {
        const windowH = window.innerHeight
        const offsetTop = this.$refs.productTable.offsetTop
        this.height = windowH - offsetTop - 100
        this.prdData = prdData
      })
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .product-container {
    .search-wrapper {
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
    .product-operate {
      text-align: left;
      margin-bottom: 10px;
    }
    .product-table {
      th {
        font-weight: bold;
      }
    }
  }
</style>
