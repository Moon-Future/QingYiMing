const template = {
  1: {
    selectField: [
      {prop: 'name', label: '产品名称'},
      {prop: 'model', label: '规格型号', width: '250'},
      {prop: 'nun', label: '物料编码'}
    ],
    field: [
      {prop: 'nun', label: '物料编码', 'width': '80'},
      {prop: 'name', label: '产品名称', width: '70'},
      {prop: 'model', label: '规格型号'},
      {prop: 'unit', label: '单位', width: '40'},
      {prop: 'qty', label: '数量', width: '50', input: true},
      {prop: 'qtyR', label: '实收数量', width: '70', input: true},
      {prop: 'ptime', label: '生产日期', width: '80'},
      {prop: 'lot', label: '生产批次', input: true, width: '60'},
      {prop: 'remark', label: '备注', input: true, width: '50'}
    ],
    sum: true,
    sumIndex: 5
  },
  2: {
    selectField: [
      {prop: 'name', label: '产品名称'},
      {prop: 'model', label: '规格型号', width: '250'},
      {prop: 'nun', label: '物料编码'}
    ],
    field: [
      {prop: 'model', label: '产品名称'},
      {prop: 'unit', label: '单位', width: '40'},
      {prop: 'qty', label: '数量', width: '50', input: true},
      {prop: 'remark', label: '备注', input: true}
    ],
    sum: false,
    sumIndex: 2
  },
  3: {
    selectField: [
      {prop: 'name', label: '产品名称'},
      {prop: 'model', label: '规格型号', width: '250'},
      {prop: 'nun', label: '物料编码'}
    ],
    field: [
      {prop: 'order', label: '订单编号', input: true},
      {prop: 'model', label: '产品名称'},
      {prop: 'unit', label: '单位', width: '40'},
      {prop: 'qty', label: '数量', width: '50', input: true},
      {prop: 'remark', label: '备注', input: true}
    ],
    sum: false,
    sumIndex: 2
  },
}

module.exports = template