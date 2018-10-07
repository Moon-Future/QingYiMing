<template>
  <div class="table-container">
    <div class="btn-operate">
      <el-button type="primary" size="mini" v-show="!this.tableOptions.addFlag" @click="goAdd">新增</el-button>
      <el-button type="primary" size="mini" v-show="this.tableOptions.addFlag" @click="goBack">返回</el-button>
      <!-- <el-button type="danger" size="mini" @click="submitDelete(false)">删除</el-button> -->
    </div>
    <div class="table-sift" ref="tableSift" v-show="!this.tableOptions.addFlag">
      <el-table v-loading="loading" fit border size="mini" :data="dataSift" :max-height="height" @select="selectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <template v-for="(item, i) in fieldSift">
          <el-table-column :min-width="item.minWidth ? item.minWidth : ''" :prop="item.prop" :label="item.label" :key="i"></el-table-column>
        </template>
        <el-table-column width="150" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger" @click="submitDelete(true, scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-add" v-show="this.tableOptions.addFlag">
      <el-table border size="mini" :data="dataAdd" :max-height="`${height - 50}`" cell-class-name="no-padding">
        <el-table-column
          type="selection"
          width="35">
        </el-table-column>
        <template v-for="(item, i) in field">
          <el-table-column :prop="item.prop" :label="item.label" :key="i" :label-class-name="item.required ? 'field-required' : ''" v-if="item.input || item.select">
            <template slot-scope="scope">
              <el-input size="mini" v-if="item.input" v-model="scope.row[item.prop]" :placeholder="item.placeholder"></el-input>
              <el-select size="mini" v-if="item.select" v-model="scope.row[item.prop]" :filterable="item['allow-create'] || item.filterable" :allow-create="item['allow-create']" clearable :placeholder="item.placeholder">
                <el-option
                  v-for="option in item.options" :label="option.label" :value="option.value" :key="option.value">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :prop="item.prop" :label="item.label" :key="i" :label-class-name="item.required ? 'field-required' : ''" v-if="!item.input && !item.select">
          </el-table-column>
        </template>
        <el-table-column width="100" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="submitDelete(true, scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="btn-add" type="primary" size="medium" @click="addRow">新增</el-button>
      <el-button class="btn-submit" type="success" size="medium" v-show="!subWait" @click="submitAdd">提交</el-button>
      <el-button class="btn-submit" type="info" size="medium" v-show="subWait" :loading="true">提交中</el-button>
    </div>
  </div>
</template>

<script>
  import IconFont from 'components/common/Iconfont'
  import Search from 'components/common/Search'
  import apiUrl from '@/serviceAPI.config.js'
  export default {
    props: {
      tableOptions: {
        type: Object,
        default: {}
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        field: [],
        fieldSift: [],
        dataSift: [],
        dataAdd: [],
        height: 500,
        subWait: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        const windowH = window.innerHeight
        const offsetTop = this.$refs.tableSift.offsetTop
        this.height = windowH - offsetTop - 100
      })
      this.field = this.tableOptions.field
      this.fieldSift = this.tableOptions.fieldSift || this.tableOptions.field
    },
    methods: {
      goAdd() {
        this.$emit('goAdd')
      },
      goBack() {
        this.$emit('goBack')
      },
      addRow() {
        this.$emit('addRow')
      },
      handleEdit() {

      },
      submitDelete(flag, row, index) {
        this.$emit('submitDelete', {flag, row, index})
      },
      submitAdd() {
        this.$emit('submitAdd')
      },
      selectionChange() {
        console.log(arguments)
      }
    },
    watch: {
      tableOptions: {
        handler() {
          this.dataSift = this.tableOptions.dataSift
          this.dataAdd = this.tableOptions.dataAdd
          this.subWait = this.tableOptions.subWait
        },
        deep: true
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

  .table-container {
    .btn-operate {
      text-align: left;
      margin-bottom: 10px;
      button {
        margin: 0;
      }
    }
    .table-add {
      .btn-add {
        width: 100%;
      }
      .btn-submit {
        position: absolute;
        right: 0;
        margin: 10px;
      }
    }
  }
</style>
