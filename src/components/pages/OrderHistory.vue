<template>
  <div class="order-container">
    <div class="btn-operate">
      <el-button v-if="userInfo && userInfo.root === 1" type="primary" size="mini" v-show="!this.addFlag" @click="goAdd">新增</el-button>
      <el-button type="primary" size="mini" v-show="this.addFlag" @click="goBack">返回</el-button>
    </div>
    <div class="table-add" v-show="this.addFlag">
      <el-table border size="mini" :data="dataAdd">
        <el-table-column label="订单编号" prop="ord">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.ord"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="客户" prop="customer">
          <template slot-scope="scope">
            <el-select size="mini" v-model="scope.row.customer" @change="changeCustomer">
              <el-option
                v-for="option in customerOptions" :label="option.name" :value="option.id" :key="option.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="产品" prop="message">
          <template slot-scope="scope">
            <div v-for="(msg, i) in scope.row.message" class="prd-message">
              <el-select size="mini" v-model="msg.product">
                <el-option
                  v-for="option in productOptions" :label="option.name" :value="option.id" :key="option.id">
                </el-option>
              </el-select>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="数量" prop="qty">
          <template slot-scope="scope">
            <div v-for="(msg, i) in scope.row.message" class="prd-message">
              <el-input size="mini" v-model="msg.qty"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <div v-for="(msg, i) in scope.row.message" class="prd-message">
              <icon-font icon="icon-minus" @click.native="delPrdRow"></icon-font>
            </div>
          </template>
        </el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <icon-font icon="icon-plus" @click.native="addPrdRow(scope.row)"></icon-font>
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
  import IconFont from 'components/common/Iconfont'
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
          {ord: '', customer: '', message: [{product: '', qty: ''}]}
        ],
        customerProduct: {},
        customerOptions: [],
        productOptions: [],
        addFlag: true,
        loading: false,
        subWait: false,
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
            const productOptions = []
            message.forEach(ele => {
              if (!this.customerProduct[ele.cust]) {
                this.customerProduct[ele.cust] = []
                this.customerOptions.push({id: ele.cust, name: ele.customer})
              }
              this.customerProduct[ele.cust].push({id: ele.prd, name: ele.model})
            });
          }
        }).catch(err => {
          this.loading = false
        })
      },
      goAdd() {

      },
      goBack() {

      },
      addRow() {

      },
      submitAdd() {

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
      changeCustomer(cust) {
        this.productOptions = this.customerProduct[cust]
      },
      addPrdRow(row) {
        row.message.push({produc: '', qty: ''})
      }
    },
    components: {
      IconFont,
      BaseTable
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';

  .btn-operate {
    text-align: left;
    margin-bottom: 10px;
    button {
      margin: 0;
    }
  }
  .table-add {
    .prd-message {
      margin: 3px 0;
      border-bottom: 1px solid;
      padding-bottom: 3px;
    }
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
