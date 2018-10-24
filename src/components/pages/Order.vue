<template>
  <div class="order-container">
    <div class="btn-operate">
      <el-button v-if="userInfo && userInfo.root === 1" type="primary" size="mini" v-show="!this.addFlag" @click="goAdd">新增</el-button>
      <el-button type="primary" size="mini" v-show="this.addFlag" @click="goBack">返回</el-button>
    </div>
    <div class="table-add" v-show="this.addFlag">
      <el-table border size="mini" :data="dataAdd" :max-height="`${height - 50}`">
        <el-table-column label="订单编号" prop="ord"></el-table-column>
        <el-table-column label="客户" prop="customer"></el-table-column>
        <el-table-column label="产品">
          <template slot-scope="scope">
            <div v-for="(item, i) in scope.row.product" :key="i">{{ item.name }}</div>
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
  import BaseTable from 'components/common/BaseTable'
  import apiUrl from '@/serviceAPI.config.js'
  import { templateOptions, templateMap } from 'common/js/template'
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
          { prop: 'customer', label: '客户'},
          { prop: 'templatem', label: '货运单模板'}
        ],
        fieldAdd: [
          { prop: 'name', label: '名称', required: true, input: true, placeholder: '输入公司名称' },
          { prop: 'alias', label: '简称', input: true, placeholder: '输入公司简称' },
          { prop: 'template', label: '货运单模板', required: true, select: true, options: templateOptions}
        ],
        dataAdd: [
          {ord: '112233', customer: 'ba', product: [{name: 'W'}, {name: 'E'}]}
        ],
        addFlag: true,
        loading: false,
        total: 0
      }
    },
    created() {
      this.getCompany()
    },
    methods: {
      getCompany(pageNo = 1) {
        this.loading = true
        this.$http.post(apiUrl.getCompany, {
          data: {pageNo}
        }).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            this.tableOptions.dataSift = res.data.message
            this.tableOptions.dataSift.forEach(ele => {
              ele.templatem = templateMap[ele.template]
            })
            this.total = res.data.count
          }
        }).catch(err => {
          this.loading = false
        })
      },
      deleteRow(row) {
        this.tableOptions.dataSift.splice(row, 1)
      },
      updateRow({data, row}) {
        data.templatem = templateMap[data.template]
        this.tableOptions.dataSift.splice(row, 1, data)
      },
      currentChange(pageNo) {
        this.getCompany(pageNo)
      }
    },
    components: {
      BaseTable
    }
  }
</script>

<style lang="scss" scoped>
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
  .page-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
</style>
