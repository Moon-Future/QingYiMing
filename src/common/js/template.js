const templateDelivery = {
  1: {
    selectField: [
      {prop: 'prdm', label: '产品名称', width: '100'},
      {prop: 'model', label: '规格型号', width: '250'},
      {prop: 'nun', label: '物料编码', width: '100'}
    ],
    field: [
      {prop: 'nun', label: '物料编码', 'width': '80'},
      {prop: 'prdm', label: '产品名称', width: '70'},
      {prop: 'model', label: '规格型号'},
      {prop: 'unitm', label: '单位', width: '50'},
      {prop: 'qty', label: '数量', width: '50', input: true},
      {prop: 'qtyR', label: '实收数量', width: '70', input: true},
      {prop: 'ptime', label: '生产日期', width: '80'},
      {prop: 'lot', label: '生产批次', input: true, width: '60'},
      {prop: 'remark', label: '备注', input: true, width: '50'}
    ],
    history: [
      {prop: 'nun', label: '物料编码', 'width': '80'},
      {prop: 'prdm', label: '产品名称', width: '70'},
      {prop: 'model', label: '规格型号'},
      {prop: 'unitm', label: '单位', width: '50'},
      {prop: 'qty', label: '数量', width: '50', input: true},
      {prop: 'qtyR', label: '实收数量', width: '70', input: true},
      {prop: 'ptime', label: '生产日期', width: '80'},
      {prop: 'lot', label: '生产批次', input: true, width: '60'},
      {prop: 'remark', label: '备注', input: true, width: '50'}
    ],
    sumFlag: true,
    sumIndex: 4
  },
  2: {
    selectField: [
      {prop: 'prdm', label: '产品名称', width: '100'},
      {prop: 'model', label: '规格型号', width: '250'},
      {prop: 'nun', label: '物料编码', width: '100'}
    ],
    field: [
      {prop: 'model', label: '产品名称'},
      {prop: 'unitm', label: '单位', width: '50'},
      {prop: 'qty', label: '数量', width: '50', input: true},
      {prop: 'remark', label: '备注', input: true}
    ],
    history: [
      {prop: 'model', label: '产品名称'},
      {prop: 'unitm', label: '单位', width: '50'},
      {prop: 'qty', label: '数量', width: '50', input: true},
      {prop: 'remark', label: '备注', input: true}
    ],
    sumFlag: false,
    sumIndex: 2
  },
  3: {
    selectField: [
      {prop: 'ord', label: '订单编号', width: '150'},
      {prop: 'checked', label: '', checkBox: true, width: '30'},
      {prop: 'model', label: '产品型号', width: '150'},
      {prop: 'qty', label: '数量', width: '60'},
      {prop: 'sentQty', label: '已送数量', width: '80'},
      {prop: 'restQty', label: '待送数量', width: '80'},
    ],
    field: [
      {prop: 'ord', label: '订单编号'},
      {prop: 'model', label: '产品名称'},
      {prop: 'unitm', label: '单位', width: '50'},
      {prop: 'qty', label: '数量', width: '50', input: true},
      {prop: 'remark', label: '备注', input: true}
    ],
    history: [
      {prop: 'ord', label: '订单编号', input: true},
      {prop: 'model', label: '产品名称'},
      {prop: 'unitm', label: '单位', width: '50'},
      {prop: 'qty', label: '数量', width: '50', input: true},
      {prop: 'remark', label: '备注', input: true}
    ],
    sumFlag: false,
    sumIndex: 2
  },
}

const templateOptions = [
  {id: 1, name: '骆驼模板'},
  {id: 2, name: '回天模板'},
  {id: 3, name: '米克模板'}
]

const templateMap = {
  1: '骆驼模板',
  2: '回天模板',
  3: '米克模板'
}

module.exports = {templateDelivery, templateOptions, templateMap}