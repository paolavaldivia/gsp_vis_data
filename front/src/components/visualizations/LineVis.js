const duration = 350
// const margin = {top: 10, left: 5}
// const padding = {top: 5, left: 5}

const LineVis = {}

LineVis.enter = (selection) => {
  selection.select('path.line')
    .attr('d', d => d.path)
    .style('stroke-opacity', 0.5)
    .attr('stroke', d => d.color)
    .attr('stroke-width', 1)

  // selection
  //   .attr('transform', (d) => {
  //     return 'translate(' + d.x + ',' + d.y + ')'
  //   })

  selection.call(LineVis.update)
}

LineVis.update = (selection) => {
  selection.select('path.line')
    .transition().duration(duration)
    .attr('d', d => d.path)
    .attr('stroke', d => d.color)
    .style('stroke-opacity', d => {
      if (!d.d) return 0.5
      return d.d.selected || d.d.highlighted ? 1 : (d.d.faded ? 0.1 : 0.5)
    })

  // selection
  //   .transition().duration(duration)
  //   .attr('transform', (d) => {
  //     return 'translate(' + d.x + ',' + d.y + ')'
  //   })
}

LineVis.exit = () => {

}

module.exports = LineVis
