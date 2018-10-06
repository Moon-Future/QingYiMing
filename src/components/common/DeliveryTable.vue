<template>
  <div class="deliverytable-container">
    <el-table border size="mini" :data="tableData">
      <el-table-column
        type="selection"
        width="50">
      </el-table-column>
      <template v-for="(item, i) in field">
        <el-table-column :prop="item.prop" :label="item.label" :key="i" v-if="item.input">
          <template slot-scope="scope">
            <el-input size="mini" v-if="item.input" v-model="scope.row[item.prop]" :placeholder="item.placeholder"></el-input>
          </template>
        </el-table-column>
        <el-table-column :prop="item.prop" :label="item.label" :key="i" v-if="!item.input"></el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
  export default {
    props: {
      tableData: {
        type: Array,
        default: null
      },
      field: {
        type: Array,
        default: null
      }
    },
    data() {
      return {
      }
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
        .delivery-number span {
          margin-left: 10px;
        }
      }
    }
  }
</style>