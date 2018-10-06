<template>
  <div class="deliverytable-container">
    <el-table border size="mini" :data="tableData" cell-class-name="no-padding">
      <el-table-column
        type="selection"
        width="35">
      </el-table-column>
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
</style>