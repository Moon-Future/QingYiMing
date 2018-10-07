<template>
  <div class="product-container">
    <search :showElements="showElements"></search>
    <v-table
      ref="customerTable"
      :loading="loading"
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
          product: {'allow-create': true, placeholder: '请选择或输入产品名'},
          time: true,
          searchBtn: true
        },
        options: {},
        tableOptions: {
          field: [
            { prop: 'name', label: '名称', required: true, input: true, placeholder: '输入产品名' },
            { prop: 'model', label: '型号', required: true, input: true, placeholder: '输入产品型号' },
            { prop: 'unit', label: '单位', required: true, select: true, 'allow-create': true, options: [], placeholder: '请选择或输入'}
          ],
          dataSift: [],
          dataAdd: [
            { name: '木托盘', model: '', unit: '' }
          ],
          subWait: false,
          addFlag: false
        },
        loading: false
      }
    },
    created() {
      this.getProduct()
    },
    methods: {
      getProduct() {
        this.loading = true
        this.$http.post(apiUrl.getProduct).then(res => {
          this.loading = false
          if (res.data.code === 200) {
            this.tableOptions.dataSift = res.data.message
          }
        }).catch(err => {
          this.loading = false
        })
      },
      goAdd() {
        this.tableOptions.addFlag = true
        this.tableOptions.dataAdd = [
          {
            name: '木托盘',
            model: '',
            unit: ''
          }
        ]
        this.$http.post(apiUrl.getUnit).then(res => {
          this.options = {}
          this.tableOptions.field[2].options = []
          if (res.data.code === 200) {
            res.data.message.forEach(ele => {
              this.tableOptions.field[2].options.push({value: ele._id, label: ele.name})
              this.options[ele._id] ? false : this.options[ele._id] = ele.name
            })
          }
        })
      },
      goBack() {
        this.tableOptions.addFlag = false
        this.getProduct()
      },
      addRow() {
        this.tableOptions.dataAdd.push({
          name: '木托盘',
          model: '',
          unit: ''
        })
      },
      handleEdit() {

      },
      submitDelete({flag, row, index}) {
        if (this.tableOptions.addFlag) {
          this.tableOptions.dataAdd.splice(index, 1)
        } else {
          let subData = flag ? [row] : ''
          this.$http.post(apiUrl.deleteProduct, {
            data: subData
          }).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.tableOptions.dataSift.splice(index, 1)
            }
          }).catch(err => {

          })
        }
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
          if (this.options[ele.unit]) {
            ele.unitId = ele.unit
            ele.unit = this.options[ele.unit]
          }
        })
        this.$http.post(apiUrl.insertProduct, {
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
          this.$refs.customerTable.$el.goBack()
        }).catch(err => {

        })
      },
      checkData() {
        let modelList = []
        for (let i = 0, len = this.tableOptions.dataAdd.length; i < len; i++) {
          const item = this.tableOptions.dataAdd[i]
          if (modelList.indexOf(item.model) !== -1) {
            return '型号重复'
          } else {
            modelList.push(item.model)
          }
        }
        for (let i = 0, len = this.tableOptions.dataAdd.length; i < len; i++) {
          const item = this.tableOptions.dataAdd[i]
          if (item.name === '' || item.model === '' || item.unit === '') {
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

  .product-container {
    .product-operate {
      text-align: left;
      margin-bottom: 10px;
      button {
        margin: 0;
      }
    }
    .product-table-add {
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
