<template>
  <div class="customer-container">
    <search :showElements="showElements"></search>
    <v-table
      :tableOptions="tableOptions"
      @goAdd="goAdd"
      @goBack="goBack"
      @addRow="addRow"
      @submitDelete="submitDelete"
      @submitAdd="submitAdd"
      >
    </v-table>
  </div>
</template>

<script>
  import IconFont from 'components/common/Iconfont'
  import Search from 'components/common/Search'
  import vTable from 'components/common/Table'
  import apiUrl from '@/serviceAPI.config.js'
  export default {
    data() {
      return {
        showElements: {
          customer: {'allow-create': true, placeholder: '请选择或输入客户'},
          product: true,
          time: true,
          searchBtn: true
        },
        customerOptions: {},
        prdOptions: {},
        tableOptions: {
          field: [
            { prop: 'customer', label: '客户', required: true, select: true, 'allow-create': true, options: [], placeholder: '请选择或输入客户名' },
            { prop: 'model', label: '型号', required: true, select: true, options: [], placeholder: '请选择产品' },
            { prop: 'nun', label: '编码', input: true, placeholder: '输入产品编码' }
          ],
          fieldSift: [
            { prop: 'customer', label: '客户' },
            { prop: 'name', label: '产品名称' },
            { prop: 'model', label: '型号' },
            { prop: 'nun', label: '编码' },
            { prop: 'unit', label: '单位' }
          ],
          dataSift: [],
          dataAdd: [
            {  customer: '', name: '木托盘', model: '', nun: '', unit: '' }
          ],
          subWait: false,
          addFlag: false
        }
      }
    },
    created() {
      this.getCustomer()
    },
    methods: {
      getCustomer() {
        this.$http.post(apiUrl.getCustomer, {

        }).then(res => {
          if (res.data.code === 200) {
            this.tableOptions.dataSift = res.data.message
          }
        }).catch(err => {

        })
      },
      goAdd() {
        this.tableOptions.addFlag = true
        this.tableOptions.dataAdd = [
          {
            customer: '',
            model: '',
            nun: ''
          }
        ]
        this.$http.post(apiUrl.getOptions).then(res => {
          this.customerOptions = {}
          this.prdOptions = {}
          this.tableOptions.field[0].options = []
          this.tableOptions.field[1].options = []
          if (res.data.code === 200) {
            const customer = res.data.message.customer
            const product = res.data.message.product
            customer.forEach(ele => {
              this.tableOptions.field[0].options.push({value: ele._id, label: ele.customer})
              this.customerOptions[ele._id] ? false : this.customerOptions[ele._id] = ele.customer
            })
            product.forEach(ele => {
              this.tableOptions.field[1].options.push({value: ele._id, label: ele.model})
              this.prdOptions[ele._id] ? false : this.prdOptions[ele._id] = ele
            })
          }
        })
      },
      goBack() {
        this.tableOptions.addFlag = false
        this.getCustomer()
      },
      addRow() {
        this.tableOptions.dataAdd.push({
          customer: '',
          model: '',
          nun: ''
        })
      },
      handleEdit() {

      },
      submitDelete({flag, row, index}) {

      },
      submitAdd() {
        if (this.tableOptions.subWait) {
          return
        }
        this.tableOptions.subWait = true

        const check = this.checkData()
        if (check !== true) {
          this.$message({
            type: 'error',
            message: check
          })
          this.tableOptions.subWait = false
          return
        }

        this.tableOptions.dataAdd.forEach(ele => {
          if (this.customerOptions[ele.customer]) {
            ele.customerId = ele.customer
            ele.customer = this.customerOptions[ele.customer]
          }
          const options = this.prdOptions[ele.model]
          ele.name = options.name
          ele.unit = options.unit
          ele.model = options.model
        })
        
        this.$http.post(apiUrl.insertCustomer, {
          data: this.tableOptions.dataAdd
        }).then((res) => {
          if (res.data.code === 200) {
            const message = res.data.message
            if (typeof message === 'string') {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.goBack()
            } else {
              let txt = []
              message.forEach(ele => {
                txt.push(ele.model)
              })
              this.$message({
                type: 'error',
                message: `型号 ${txt.join(', ')} 已存在`
              })
            }
          } else {
            this.$message({
              type: 'error',
              message: '提交失败'
            })
          }
          this.tableOptions.subWait = false
          this.goBack()
        }).catch(err => {

        })
      },
      checkData() {
        for (let i = 0, len = this.tableOptions.dataAdd.length; i < len; i++) {
          const item = this.tableOptions.dataAdd[i]
          if (item.customer === '' || item.model === '') {
            return '* 为必填字段'
          }
        }
        return true
      }
    },
    components: {
      IconFont,
      Search,
      vTable
    }
  }
</script>

<style lang="scss" scoped>
  @import 'common/css/variable.scss';
</style>
