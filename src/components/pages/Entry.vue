<template>
  <div class="entry-container">
    <search :showElements="showElements"></search>
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
          customer: {placeholder: '请选择出货单位'},
          product: true,
          time: true
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
