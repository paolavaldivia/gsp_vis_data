const duration = 250
// const margin = {top: 10, left: 5}
// const padding = {top: 5, left: 5}

const BarVis = {}

BarVis.enter = (selection) => {
  selection.select('rect.front')
    .attr('x', 2)
    .attr('width', d => { return d.width })
    .attr('height', d => { return d.height })
    .attr('fill', '#888')
    .attr('fill-opacity', 0.6)

  selection
    .attr('transform', (d) => {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

  selection.call(BarVis.update)
}

BarVis.update = (selection) => {
  selection.select('rect.front')
    .transition().duration(duration)
    .attr('width', d => { return d.width })
    .attr('height', d => { return d.height })

  selection
    .transition().duration(duration)
    .attr('transform', (d) => {
      return 'translate(' + d.x + ',' + d.y + ')'
    })

  // selection.select('text')
  //   .each(function (d) {
  //     d.textWidth = this.node().getBBox().width + padding.left * 2
  //     d.textHeight = this.node().getBBox().height + padding.top
  //   }).transition().duration((d) => !d.expenseBeingDragged ? duration : 0)
  //   .attr('y', (d) => d.size + margin.top)
  //   .attr('opacity', (d) => {
  //     return d.selected || d.highlighted ? 1 : 0.5
  //   }).attr('fill', (d) => d.fill)

  // selection.select('rect')
  //   .transition().duration((d) => !d.expenseBeingDragged ? duration : 0)
  //   .attr('opacity', 0.75)
  //   .attr('width', (d) => d.textWidth)
  //   .attr('height', (d) => d.textHeight)
  //   .attr('x', (d) => -d.textWidth / 2)
  //   .attr('y', (d) => d.size + margin.top - d.textHeight / 2)
  //
}

BarVis.exit = () => {

}

module.exports = BarVis
