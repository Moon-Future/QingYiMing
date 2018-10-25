<template>
  <div class="order-container">
    <div class="btn-operate">
      <el-button v-if="userInfo && userInfo.root === 1" type="primary" size="mini" v-show="!this.addFlag" @click="goAdd">新增</el-button>
      <el-button type="primary" size="mini" v-show="this.addFlag" @click="goBack">返回</el-button>
    </div>
    <div class="table-add" v-show="this.addFlag">
      <el-table border size="mini" :data="dataAdd" :max-height="`${height - 50}`">
        <template v-for="(item, i) in fieldAdd">
          <el-table-column :prop="item.prop" :label="item.label" :key="i" :label-class-name="item.required ? 'field-required' : ''" v-if="item.input || item.select">
            <template slot-scope="scope">
              <el-input size="mini" v-if="item.input" v-model="scope.row[item.prop]" :placeholder="item.placeholder"></el-input>
              <el-select size="mini" v-if="item.select" v-model="scope.row[item.prop]" :filterable="item['allow-create'] || item.filterable" :allow-create="item['allow-create']" :placeholder="item.placeholder" @change="selectChange(scope.row[item.prop], item.prop, scope.row)">
                <el-option
                  v-for="option in item.options" :label="option.name" :value="option.id" :key="option.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :prop="item.prop" :label="item.label" :key="i" :label-class-name="item.required ? 'field-required' : ''" v-if="!item.input && !item.select">
          </el-table-column>
        </template>
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-button class="x"><i class="el-icon-circle-plus"></i></el-button>
          </template>
        </el-table-column>
        <el-table-column v-if="userInfo && userInfo.root === 1" width="100" label="操作">
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
          { prop: 'ord', label: '订单编号', required: true, input: true, placeholder: '输入订单编号' },
          { prop: 'customer', label: '客户', required: true, select: true, options: [] },
          { prop: 'product', label: '产品', required: true, select: true, options: [] },
          { prop: 'qty', label: '数量', required: true, input: true }
        ],
        dataAdd: [
          {ord: '', customer: '', product: '', qty: ''}
        ],
        customerProduct: {},
        addFlag: true,
        loading: false,
        total: 0
      }
    },
    created() {
      this.getOptions()
    },
    methods: {
      getOptions() {
        this.loading = true
        this.$http.post(apiUrl.getSupply).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            const message = res.data.message
            const customerOptions = []
            const productOptions = []
            message.forEach(ele => {
              if (!this.customerProduct[ele.cust]) {
                this.customerProduct[ele.cust] = []
                customerOptions.push({id: ele.cust, name: ele.customer})
              }
              this.customerProduct[ele.cust].push({id: ele.prd, name: ele.model})
            });
            this.fieldAdd[1].options = customerOptions
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
        this.getOptions(pageNo)
      },
      selectChange(cust, prop, row) {
        if (prop === 'customer') {
          row.product = ''
          this.fieldAdd[2].options = this.customerProduct[cust]
        }
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
