<template>
  <div class="table-container">
    <div class="btn-operate" v-if="!tableOptions.onlySift">
      <el-button v-if="userInfo && userInfo.root === 1" type="primary" size="mini" v-show="!this.addFlag" @click="goAdd">新增</el-button>
      <el-button type="primary" size="mini" v-show="this.addFlag" @click="goBack">返回</el-button>
      <!-- <el-button type="danger" size="mini" @click="submitDelete(false)">删除</el-button> -->
    </div>
    <div class="table-sift" ref="tableSift" v-show="!this.addFlag">
      <el-table v-loading="loading" :highlight-current-row="true" border size="mini" :data="this.tableOptions.dataSift">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <template v-for="(item, i) in fieldSift">
          <el-table-column :min-width="item.minWidth ? item.minWidth : ''" :prop="item.prop" :label="item.label" :key="i"></el-table-column>
        </template>
        <el-table-column v-if="!tableOptions.onlySift && userInfo && userInfo.root === 1" width="80" label="操作">
          <template slot-scope="scope" v-if="scope.row.type != 1">
            <el-button size="mini" @click="handleEdit(scope.row, scope.$index)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page-wrapper">
        <el-pagination
          background
          layout="prev, pager, next"
          :disabled="loading"
          :total="total"
          @current-change="currentChange">
        </el-pagination>
      </div>
    </div>
    <div class="table-add" v-show="this.addFlag">
      <!-- <el-table border size="mini" :data="dataAdd" :max-height="`${height - 50}`"> -->
      <el-table border size="mini" :data="dataAdd">
        <el-table-column
          type="selection"
          width="35">
        </el-table-column>
        <template v-for="(item, i) in fieldAdd">
          <el-table-column :prop="item.prop" :label="item.label" :key="i" :label-class-name="item.required ? 'field-required' : ''" v-if="item.input || item.select|| item.date">
            <template slot-scope="scope">
              <el-input size="mini" v-if="item.input" v-model="scope.row[item.prop]" :type="item.type || 'text'" :placeholder="item.placeholder"></el-input>
              <el-select size="mini" v-if="item.select" v-model="scope.row[item.prop]" :filterable="item['allow-create'] || item.filterable" :allow-create="item['allow-create']" clearable :placeholder="item.placeholder">
                <el-option
                  v-for="option in item.options" :label="option.name" :value="option.id" :key="option.id">
                </el-option>
              </el-select>
              <el-date-picker
                v-if="item.date"
                v-model="scope.row[item.prop]"
                size="mini"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                :clearable="false">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column :prop="item.prop" :label="item.label" :key="i" :label-class-name="item.required ? 'field-required' : ''" v-if="!item.input && !item.select && !item.date">
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
    <el-dialog :modal-append-to-body="false" :modal="false" :visible.sync="dialogVisible">
      <el-table :data="updData.data">
        <template v-for="(item, i) in fieldAdd">
          <el-table-column :prop="item.prop" :label="item.label" :key="i" :label-class-name="item.required ? 'field-required' : ''" v-if="item.input || item.select || item.date">
            <template slot-scope="scope">
              <el-input size="mini" v-if="item.input" v-model="scope.row[item.prop]" :placeholder="item.placeholder"></el-input>
              <el-select size="mini" v-if="item.select" v-model="scope.row[item.prop]" :filterable="item['allow-create'] || item.filterable" :allow-create="item['allow-create']" clearable :placeholder="item.placeholder">
                <el-option
                  v-for="option in item.options" :label="option.name" :value="option.id" :key="option.id">
                </el-option>
              </el-select>
              <el-date-picker
                v-if="item.date"
                v-model="scope.row[item.prop]"
                size="mini"
                type="date"
                format="yyyy 年 MM 月 dd 日"
                value-format="timestamp"
                :clearable="false">
              </el-date-picker>
            </template>
          </el-table-column>
          <el-table-column :prop="item.prop" :label="item.label" :key="i" :label-class-name="item.required ? 'field-required' : ''" v-if="!item.input && !item.select && !item.date">
          </el-table-column>
        </template>
      </el-table>
      <div slot="footer">
        <el-button size="mini" type="danger" @click="submitDelete">删除</el-button>
        <el-button size="mini" type="primary" @click="update">更新</el-button>
        <el-button size="mini" type="info" @click="cancel">取消</el-button>
      </div>
    </el-dialog>
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
      },
      total: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dataAdd: [],
        height: 500,
        subWait: false,
        addFlag: false,
        dialogVisible: false,
        updData: {data: [], index: -1}
      }
    },
    computed: {
      fieldSift() {
        return this.tableOptions.fieldSift || this.tableOptions.fieldAdd
      },
      fieldAdd() {
        return this.tableOptions.fieldAdd
      },
      fieldUpd() {

      },
      addTemplate() {
        return this.tableOptions.addTemplate
      },
      deleteMessage() {
        return this.tableOptions.deleteMessage || '此操作将删除该数据, 并且会影响到与之相关的数据, 是否继续?'
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
        // this.$emit('goAdd')
      },
      goBack() {
        this.addFlag = false
        this.$emit('goBack')
      },
      addRow() {
        this.dataAdd.push(JSON.parse(JSON.stringify(this.addTemplate)))
      },
      handleEdit(row, index) {
        // this.$emit('goAdd')
        this.dialogVisible = true
        this.updData.data = []
        this.updData.index = index
        let obj = JSON.parse(JSON.stringify(row))
        for (let i = 0, len = this.fieldAdd.length; i < len; i++) {
          const field = this.fieldAdd[i]
          const prop = field.prop
          const key = field.key || prop
          const options = field.options
          if (options) {
            for (let j = 0; j < options.length; j++) {
              if (options[j].name === obj[key]) {
                obj[prop] = options[j].id
                break
              }
            }
          }
        }
        this.updData.data.push(obj)
      },
      update() {
        this.$http.post(this.tableOptions.updApi, {
          data: this.updData.data[0]
        }).then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.dialogVisible = false
            this.$emit('update', {data: res.data.result[0], row: this.updData.index})
          } else {
            this.$message.error(res.data.message)
          }
        }).catch(err => {
          this.$message.error('服务器君傲娇啦😭')
        })
      },
      cancel() {
        this.dialogVisible = false
      },
      submitDelete(flag, row, index) {
        if (this.addFlag) {
          this.dataAdd.splice(index, 1)
        } else {
          this.$confirm(this.deleteMessage, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$http.post(this.tableOptions.deleteApi, {
              data: this.updData.data
            }).then(res => {
              if (res.data.code === 200) {
                this.$message.success(res.data.message);
                this.$emit('delete', this.updData.index)
                this.dialogVisible = false
              }
            }).catch(err => {
              this.$message.error('服务器君傲娇啦😭')
            })
          }).catch(() => {
            this.$message.info('已取消删除!')
          });
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
      },
      currentChange(pageNo) {
        this.$emit('currentChange', pageNo)
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
    .page-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
  }
</style>
