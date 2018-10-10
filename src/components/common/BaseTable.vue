<template>
  <div class="table-container">
    <div class="btn-operate">
      <el-button v-if="userInfo && userInfo.root === 1" type="primary" size="mini" v-show="!this.addFlag" @click="goAdd">新增</el-button>
      <el-button type="primary" size="mini" v-show="this.addFlag" @click="goBack">返回</el-button>
      <!-- <el-button type="danger" size="mini" @click="submitDelete(false)">删除</el-button> -->
    </div>
    <div class="table-sift" ref="tableSift" v-show="!this.addFlag">
      <el-table v-loading="loading" fit border size="mini" :data="this.tableOptions.dataSift" :max-height="height">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <template v-for="(item, i) in fieldSift">
          <el-table-column :min-width="item.minWidth ? item.minWidth : ''" :prop="item.prop" :label="item.label" :key="i"></el-table-column>
        </template>
        <el-table-column v-if="userInfo && userInfo.root === 1" width="150" label="操作">
          <template slot-scope="scope" v-if="scope.row.type != 1">
            <el-button size="mini" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger" @click="submitDelete(true, scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-add" v-show="this.addFlag">
      <el-table border size="mini" :data="dataAdd" :max-height="`${height - 50}`" cell-class-name="no-padding">
        <el-table-column
          type="selection"
          width="35">
        </el-table-column>
        <template v-for="(item, i) in fieldAdd">
          <el-table-column :prop="item.prop" :label="item.label" :key="i" :label-class-name="item.required ? 'field-required' : ''" v-if="item.input || item.select">
            <template slot-scope="scope">
              <el-input size="mini" v-if="item.input" v-model="scope.row[item.prop]" :placeholder="item.placeholder"></el-input>
              <el-select size="mini" v-if="item.select" v-model="scope.row[item.prop]" :filterable="item['allow-create'] || item.filterable" :allow-create="item['allow-create']" clearable :placeholder="item.placeholder">
                <el-option
                  v-for="option in item.options" :label="option.name" :value="option.id" :key="option.id">
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column :prop="item.prop" :label="item.label" :key="i" :label-class-name="item.required ? 'field-required' : ''" v-if="!item.input && !item.select">
          </el-table-column>
        </template>
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
      },
      userInfo: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
        dataAdd: [],
        height: 500,
        subWait: false,
        addFlag: false
      }
    },
    computed: {
      fieldSift() {
        return this.tableOptions.fieldSift || this.tableOptions.fieldAdd
      },
      fieldAdd() {
        return this.tableOptions.fieldAdd
      },
      addTemplate() {
        return this.tableOptions.addTemplate
      }
    },
    mounted() {
      this.$nextTick(() => {
        const windowH = window.innerHeight
        const offsetTop = this.$refs.tableSift.offsetTop
        this.height = windowH - offsetTop - 100
      })
    },
    methods: {
      goAdd() {
        this.addFlag = true
        this.dataAdd.splice(0, this.dataAdd.length)
        this.dataAdd.push(JSON.parse(JSON.stringify(this.addTemplate)))
        this.$emit('goAdd')
      },
      goBack() {
        this.addFlag = false
        this.$emit('goBack')
      },
      addRow() {
        this.dataAdd.push(JSON.parse(JSON.stringify(this.addTemplate)))
      },
      handleEdit() {

      },
      submitDelete(flag, row, index) {
        if (this.addFlag) {
          this.dataAdd.splice(index, 1)
        } else {
          let subData = flag ? [row] : ''
          this.$http.post(this.tableOptions.deleteApi, {
            data: subData
          }).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.$emit('delete', index)
            }
          }).catch(err => {

          })
        }
      },
      submitAdd() {
        if (this.subWait) {
          return
        }
        const check = this.checkData()
        if (check !== true) {
          this.$message({
            type: 'error',
            message: check
          })
          return
        }
        this.subWait = true
        this.$http.post(this.tableOptions.addApi, {
          data: this.dataAdd
        }).then((res) => {
          if (res.data.code === 200) {
            const message = res.data.message
            const repeat = res.data.repeat
            this.$message({
              type: repeat ? 'error' : 'success',
              message: res.data.message
            })
            this.goBack()
          } else {
            this.$message({
              type: 'error',
              message: '提交失败'
            })
          }
          this.subWait = false
        }).catch(err => {

        })
      },
      checkData() {
        let modelList = []
        for (let i = 0, len = this.dataAdd.length; i < len; i++) {
          const item = this.dataAdd[i]
          for (let j = 0, len = this.fieldAdd.length; j < len; j++) {
            if (this.fieldAdd[j].required && item[this.fieldAdd[j].prop] == '') {
              return '* 为必填字段'
            }
          }
        }
        if (this.tableOptions.checkRepeat) {
          const field = this.tableOptions.checkRepeat.field
          for (let i = 0, len = this.dataAdd.length; i < len; i++) {
            const item = this.dataAdd[i]
            let txt = ''
            field.forEach(ele => {
              txt += item[ele] + ','
            })
            if (modelList.indexOf(txt) !== -1) {
              return this.tableOptions.checkRepeat.message
            } else {
              modelList.push(txt)
            }
          }
        }
        return true
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
