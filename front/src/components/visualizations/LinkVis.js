const duration = 350
// const margin = {top: 10, left: 5}
// const padding = {top: 5, left: 5}

const LinkVis = {}

LinkVis.enter = (selection) => {
  selection.select('line')
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)
    .attr('stroke', '#aaa')
    // .attr('fill-opacity', 0.7)
    .attr('stroke-width', 0.5)

  selection.call(LinkVis.update)
}

LinkVis.update = (selection) => {
  selection.select('line')
    .transition().duration(duration)
    .attr('x1', d => d.x1)
    .attr('y1', d => d.y1)
    .attr('x2', d => d.x2)
    .attr('y2', d => d.y2)
    .attr('stroke', '#aaa')
    .attr('stroke-width', 0.5)
  //
  // selection
  //   .transition().duration(duration)
  //   .attr('transform', (d) => 'translate(' + d._x + ',' + d._y + ')')

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

LinkVis.exit = () => {

}

module.exports = LinkVis
