<template>
  <div class="label-card">
    <!-- <div class="label-header">
      <h3>骆驼集团新能源电池有限公司</h3>
      <p>Camel Group New Energy Battery Co., Ltd.</p>
    </div> -->
    <table class="label-table">
      <tbody>
        <tr>
          <td colspan="3">
            <div class="label-header">
              <h3>骆驼集团新能源电池有限公司</h3>
              <p>Camel Group New Energy Battery Co., Ltd.</p>
            </div>
          </td>
        </tr>
        <tr>
          <td class="label-left">供应商料号<br><span class="label-en">supplier code</span></td>
          <td class="label-right" colspan="2">
            <template v-if="!isEdit">{{ data.supplierPartNo || data.partNo || '' }}</template>
            <template v-else>{{ selectedProduct ? selectedProduct.partNo : '' }}</template>
          </td>
        </tr>
        <tr>
          <td class="label-left">物料名称<br><span class="label-en">Material name</span></td>
          <td class="label-right" colspan="2">
            <template v-if="!isEdit">{{ data.productName || data.name || '' }}</template>
            <template v-else>{{ selectedProduct ? selectedProduct.name : '' }}</template>
          </td>
        </tr>
        <tr>
          <td class="label-left">骆驼 NC 编码<br><span class="label-en">Camel NC encoding</span></td>
          <td class="label-right" colspan="2">
            <template v-if="!isEdit">{{ data.productCode || data.code || '' }}</template>
            <template v-else>{{ selectedProduct ? selectedProduct.code : '' }}</template>
          </td>
        </tr>
        <tr>
          <td class="label-left">供应商代码<br><span class="label-en">Vendor Code</span></td>
          <td class="label-right" colspan="2">170710(情义明木业)</td>
        </tr>
        <tr>
          <td class="label-left">版本号<br><span class="label-en">version number</span></td>
          <td class="label-right" colspan="2">
            <template v-if="!isEdit">{{ data.versionNo || '' }}</template>
            <template v-else>{{ editForm.versionNo || 'A0' }}</template>
          </td>
        </tr>
        <tr>
          <td class="label-left">零件尺寸<br><span class="label-en">Part size</span></td>
          <td class="label-right">
            <div class="qr-cell">
              <div class="size-info">
                <template v-if="!isEdit">{{ data.productSize || data.size || '' }}</template>
                <template v-else>{{ selectedProduct ? selectedProduct.size : '' }}</template>
              </div>
            </div>
          </td>
          <td rowspan="4">
            <img :src="qrImageUrl" class="qr-img" v-if="qrImageUrl">
          </td>
        </tr>
        <tr>
          <td class="label-left">数量/单位<br><span class="label-en">Quantity/unit</span></td>
          <td class="label-right">
            <template v-if="!isEdit">{{ data.productQty || data.qty || '' }}</template>
            <template v-else>{{ selectedProduct ? selectedProduct.qty : '' }}</template>
          </td>
        </tr>
        <tr>
          <td class="label-left">重量/单位<br><span class="label-en">weight/unit</span></td>
          <td class="label-right">
            <template v-if="!isEdit">{{ data.productWeight || data.weight || '' }}</template>
            <template v-else>{{ selectedProduct ? selectedProduct.weight : '' }}</template>
          </td>
        </tr>
        <tr>
          <td class="label-left">QR 码内容<br><span class="label-en">QR codecontent</span></td>
          <td class="label-right qr-content">{{ qrContent || '' }}</td>
        </tr>
        <tr>
          <td class="label-left">双方确认<br><span class="label-en">Bothparties confirm</span></td>
          <td class="label-right" colspan="2"></td>
        </tr>
        <tr>
          <td class="label-left">签名/盖章<br><span class="label-en">Signed and sealed</span></td>
          <td class="label-right" colspan="2"></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'LabelCard',
    props: {
      data: {
        type: Object,
        default: () => ({})
      },
      isEdit: {
        type: Boolean,
        default: false
      },
      qrcodeProductList: {
        type: Array,
        default: () => []
      },
      editForm: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      selectedProduct() {
        if (!this.editForm.qrcodeProductId) return null
        return this.qrcodeProductList.find(p => p.id === this.editForm.qrcodeProductId)
      },
      qrContent() {
        if (this.isEdit) {
          if (!this.selectedProduct || !this.editForm.versionNo) return ''
          const productCode = this.selectedProduct.code
          const vendorCode = '170710'
          const versionNo = this.editForm.versionNo
          const now = new Date()
          const year = String(now.getFullYear()).slice(2)
          const month = String(now.getMonth() + 1).padStart(2, '0')
          const dateStr = year + month + '01'
          const seq1 = this.editForm.seq1 || '01'
          const seq2 = this.editForm.seq2 || '0001'
          return `${productCode}*${vendorCode}*${versionNo}*${dateStr}*${seq1}*${seq2}`
        } else {
          return this.data.qrContent || ''
        }
      },
      qrImageUrl() {
        if (!this.qrContent) return ''
        return `https://api.2dcode.biz/v1/create-qr-code?data=${encodeURIComponent(this.qrContent)}`
      }
    }
  }
</script>

<style lang="scss" scoped>
  .label-card {
    // border: 1px solid #333;
    // padding: 10px;
    // background: #fff;
    color: #000;
  }

  .label-header {
    text-align: center;
    font-size: 16px;
    font-weight: bold;
    p {
      margin: 5px 0 0;
    }
  }

  .label-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;
  }

  .label-table td {
    border: 1px solid #333;
    padding: 4px 8px;
    vertical-align: middle;
  }

  .label-left {
    width: 130px;
    text-align: center;
  }

  .label-right {
    text-align: center;
    font-size: 14px;
  }

  .qr-content {
    font-size: 14px;
    word-break: break-all;
  }

  .qr-cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .size-info {
      flex: 1;
    }
  }

  .qr-img {
    width: 80px;
    height: 80px;
  }

  /* 打印样式 */
  @media print {
    .label-card {
      width: 100%;
      height: 100%;
      transform: scale(0.9);
      transform-origin: center;
    }
  }
</style>
