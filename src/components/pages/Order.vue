<template>
  <div class="order-container">
    <div class="btn-operate">
      <el-button v-if="userInfo && userInfo.root === 1" type="primary" size="mini" v-show="!this.addFlag" @click="goAdd">新增</el-button>
      <el-button type="primary" size="mini" v-show="this.addFlag" @click="goBack">返回</el-button>
    </div>
    <div class="table-sift" v-show="!this.addFlag">
      
    </div>
    <div class="table-add" v-show="this.addFlag">
      <table class="proto-table">
        <tr>
          <th class="field-required">订单编号</th>
          <th class="field-required">客户</th>
          <th class="field-required">产品</th>
          <th class="field-required">数量</th>
          <th width=50></th>
          <th width=100></th>
        </tr>
        <template v-for="(data, i) in dataAdd" >
          <tr :key="i">
            <td :rowspan="data.message.length + 1">
              <el-input size="mini" v-model="data.ord" placeholder="请输入订单编号"></el-input>
            </td>
            <td :rowspan="data.message.length + 1">
              <el-select size="mini" v-model="data.customer" @change="changeCustomer(data.customer, data)">
                <el-option
                  v-for="option in customerOptions" :label="option.name" :value="option.id" :key="option.id">
                </el-option>
              </el-select>
            </td>
            <td>
              <el-select size="mini" v-model="data.message[0].product">
                <el-option
                  v-for="option in data.productOptions" :label="option.name" :value="option.id" :key="option.id">
                </el-option>
              </el-select>
            </td> 
            <td>
              <el-input type="number" size="mini" v-model="data.message[0].qty" placeholder="请输入订单数量"></el-input>
            </td> 
            <td></td>
            <td :rowspan="data.message.length + 1">
              <el-button size="mini" type="danger" @click="deleteRow(i)">删除</el-button>
            </td>
          </tr>
          <template>
            <tr v-for="index in data.message.length - 1" :key="`${i}_${index}`">
              <td>
                <el-select size="mini" v-model="data.message[index].product">
                  <el-option
                    v-for="option in data.productOptions" :label="option.name" :value="option.id" :key="option.id">
                  </el-option>
                </el-select>
              </td> 
              <td>
                <el-input type="number" size="mini" v-model="data.message[index].qty" placeholder="请输入订单数量"></el-input>
              </td>
              <td><icon-font icon="icon-minus" @click.native="delPrdRow(data.message, index)"></icon-font></td>
            </tr>
          </template>
          <tr :key="`${i}_a`">
            <td colspan="2">
              <el-button class="btn-add" type="info" size="mini" @click="addPrdRow(data.message)">新增</el-button>
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
  import apiUrl from '@/serviceAPI.config.js'
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
        dataAdd: [
          {ord: '', customer: '', message: [{product: '', qty: ''}], productOptions: []}
        ],
        customerProduct: {},
        customerOptions: [],
        customerMap: {},
        productMap: {},
        optionFlag: false,
        addFlag: false,
        loading: false,
        subWait: false,
        total: 0
      }
    },
    created() {

    },
    methods: {
      getOrder() {
        this.$http.post(apiUrl.getOrder).then(res => {

        }).catch(err => {
          
        })
      },
      getOptions() {
        this.loading = true
        this.$http.post(apiUrl.getSupply).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            const message = res.data.message
            message.forEach(ele => {
              if (!this.customerProduct[ele.cust]) {
                this.customerProduct[ele.cust] = []
                this.customerOptions.push({id: ele.cust, name: ele.customer})
                this.customerMap[ele.cust] = ele.customer
              }
              if (!this.productMap[ele.prd]) {
                this.productMap[ele.prd] = {model: ele.model, name: ele.product}
              }
              this.customerProduct[ele.cust].push({id: ele.prd, name: ele.model})
            });
          }
        }).catch(err => {
          this.loading = false
        })
      },
      goAdd() {
        this.addFlag = true
        if (!this.optionFlag) {
          this.optionFlag = true
          this.getOptions()
        }
      },
      goBack() {
        this.addFlag = false
        this.dataAdd = [{ord: '', customer: '', message: [{product: '', qty: ''}], productOptions: []}]
      },
      submitAdd() {
        if (this.subWait) {
          return
        }
        let ordMap = {}
        for (let i = 0, len = this.dataAdd.length; i < len; i++) {
          let data = this.dataAdd[i]
          let message = data.message
          if (ordMap[data.ord]) {
            this.$message.error('存在相同订单编号')
            return
          }
          ordMap[data.ord] = true
          if (data.ord === '' || data.customer === '') {
            this.$message.error('* 为必填字段')
            return
          }
          data.custm = this.customerMap[data.customer]
          for (let j = 0; j < message.length; j++) {
            let product = message[j].product
            let qty = message[j].qty
            if (product === '' || qty === '') {
              this.$message.error('* 为必填字段')
              return
            }
            message[j].model = this.productMap[product].model
            message[j].name = this.productMap[product].name
          }
        }
        this.$http.post(apiUrl.insertOrder, {
          data: this.dataAdd
        }).then(res => {
          if (res.data.code === 200) {

          } else {
            this.$message.success(res.data.message)
          }
        }).catch(err => {
          throw new Error(err)
        })
      },
      addRow() {
        this.dataAdd.push({ord: '', customer: '', message: [{product: '', qty: ''}], productOptions: []})
      },
      deleteRow(index) {
        this.dataAdd.splice(index, 1)
      },
      updateRow({data, row}) {
        data.templatem = templateMap[data.template]
        this.tableOptions.dataSift.splice(row, 1, data)
      },
      currentChange(pageNo) {
        this.getOptions(pageNo)
      },
      changeCustomer(cust, row) {
        row.productOptions = this.customerProduct[cust]
        row.message.forEach(ele => {
          ele.product = ''
        })
      },
      addPrdRow(row) {
        row.push({product: '', qty: ''})
      },
      delPrdRow(row, index) {
        row.splice(index, 1)
      }
    },
    components: {
      IconFont
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
      margin: 10px 0;
      display: flex;
      margin-left: auto;
    }
  }
  .page-wrapper {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }
</style>
