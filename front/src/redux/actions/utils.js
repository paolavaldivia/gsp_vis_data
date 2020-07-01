const d3 = {...require('d3-dsv')}

export const processData = (text) => {
  var data = d3.csvParse(text)
  const labelIdx = data.columns.indexOf('label')
  if (labelIdx > -1) {
    data.columns.splice(labelIdx, 1)
    data.labeled = true
  } else {
    data.labeled = false
  }
  const nameIdx = data.columns.indexOf('name')
  if (nameIdx > -1) {
    data.columns.splice(nameIdx, 1)
  }
  data.forEach((d, i) => {
    d.id = i
    if (nameIdx > -1) {
      d.name = i
    }
    data.columns.forEach(c => {
      d[c] = +d[c]
    })
    if (labelIdx > -1) {
      d.label = parseInt(d['label'])
    }
    d.update = true
  })
  return data
}
