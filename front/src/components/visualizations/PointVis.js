const duration = 350
// const margin = {top: 10, left: 5}
// const padding = {top: 5, left: 5}

const PointVis = {}

PointVis.enter = (selection) => {
  selection.select('circle.back')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 4)
    .attr('fill', '#fff')

  selection.select('circle.front')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', d => d._r ? d._r : 4)
    .attr('fill', d => d.color)
    .attr('fill-opacity', 0.7)
    .attr('stroke-width', 2)

  selection
    .attr('transform', (d) => {
      return 'translate(' + d._x + ',' + d._y + ')'
    })

  selection.call(PointVis.update)
}

PointVis.update = (selection) => {
  selection.select('circle.front')
    .transition().duration(duration)
    .attr('fill', d => d.color)
    .attr('fill-opacity', d => {
      return d.d.selected || d.d.highlighted ? 1 : (d.d.faded ? 0.3 : 0.7)
    })
    .attr('stroke-width', 2)

  selection
    .transition().duration(duration)
    .attr('transform', (d) => 'translate(' + d._x + ',' + d._y + ')')

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

PointVis.exit = () => {

}

module.exports = PointVis
