<template>
  <div class="order-container">
    <div class="btn-operate">
      <el-button v-if="userInfo && userInfo.root === 1" type="primary" size="mini" v-show="!this.addFlag" @click="goAdd">新增</el-button>
      <el-button type="primary" size="mini" v-show="this.addFlag" @click="goBack">返回</el-button>
    </div>
    <div class="table-add" v-show="this.addFlag">
      <table>
        <tr>
          <th>订单编号</th>
          <th>客户</th>
          <th>产品</th>
          <th>数量</th>
          <th width=50></th>
          <th width=100></th>
        </tr>
        <template v-for="(data, i) in dataAdd" >
          <tr :key="i">
            <td :rowspan="data.message.length + 1">
              <el-input size="mini" v-model="data.ord"></el-input>
            </td>
            <td :rowspan="data.message.length + 1">
              <el-select size="mini" v-model="data.customer" @change="changeCustomer">
                <el-option
                  v-for="option in customerOptions" :label="option.name" :value="option.id" :key="option.id">
                </el-option>
              </el-select>
            </td>
            <td>
              <el-select size="mini" v-model="data.message[0].product">
                <el-option
                  v-for="option in productOptions" :label="option.name" :value="option.id" :key="option.id">
                </el-option>
              </el-select>
            </td> 
            <td>
              <el-input size="mini" v-model="data.message[0].qty"></el-input>
            </td> 
            <td><icon-font icon="icon-minus" @click.native="delPrdRow"></icon-font></td>
            <td :rowspan="data.message.length + 1">
              <el-button size="mini" type="danger">删除</el-button>
            </td>
          </tr>
          <template>
            <tr v-for="index in data.message.length - 1" :key="`${index}_j`">
              <td>
                <el-select size="mini" v-model="data.message[index].product">
                  <el-option
                    v-for="option in productOptions" :label="option.name" :value="option.id" :key="option.id">
                  </el-option>
                </el-select>
              </td> 
              <td>
                <el-input size="mini" v-model="data.message[index].qty"></el-input>
              </td>
              <td><icon-font icon="icon-minus" @click.native="delPrdRow"></icon-font></td>
            </tr>
          </template>
          <tr :key="`${i}_i`">
            <td colspan="2">
              <el-button class="btn-add" type="info" size="mini" @click="addRow">新增</el-button>
            </td>
          </tr>
        </template>
      </table>
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
          {ord: '', customer: '', message: [{product: '', qty: ''}, {product: '', qty: ''}]},
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
