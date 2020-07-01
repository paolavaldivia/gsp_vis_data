import React from 'react'
import { info, extend, small, container, item } from 'styles/info.scss'
import { connect } from 'react-redux'

class Info extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      displayPanel: true
    }
    this.toggleDisplay = this.toggleDisplay.bind(this)
    this.dragDisplay = this.dragDisplay.bind(this)
  }
  toggleDisplay (e) {
    e.stopPropagation()
    this.setState({
      displayPanel: !this.state.displayPanel
    })
  }
  dragDisplay (e) {
    console.log(e)
  }
  getMetrics (metrics) {
    let metricsList = []
    if (metrics) {
      var i = 0
      for (var key in metrics) {
        if (metrics.hasOwnProperty(key)) {
          metricsList.push(<p key={'m' + i}>{key} = {metrics[key].toPrecision(3)} </p>)
          i++
        }
      }
    }
    return metricsList
  }
  render () {
    const dataMetrics = this.getMetrics(this.props.metrics.data)
    const dataFilteredMetrics = this.getMetrics(this.props.metrics.data_filtered)
    const dataProjectionMetrics = this.getMetrics(this.props.metrics.data_proj)
    const dataProjectionFilteredMetrics = this.getMetrics(this.props.metrics.data_filtered_proj)
    const dataPCMetrics = this.getMetrics(this.props.metrics.data_pc)
    const dataPCFilteredMetrics = this.getMetrics(this.props.metrics.data_filtered_pc)

    return (
      <div className={info} onClick={this.toggleDisplay} onDrag={this.dragDisplay}>
        { this.state.displayPanel
          ? <div>
            <span className={small}>show measures </span>
          </div>
          : <div className={extend}>
            <div className={container}>
              <div className={item}>
                <strong>projection original</strong>
                {dataProjectionMetrics}
              </div>
              <div className={item}>
                <strong>projection filtered</strong>
                {dataProjectionFilteredMetrics}
              </div>
              <div className={item}>
                <strong>original</strong>
                {dataMetrics}
              </div>
              <div className={item}>
                <strong>filtered</strong>
                {dataFilteredMetrics}
              </div>
              <div className={item}>
                <strong>pc original</strong>
                {dataPCMetrics}
              </div>
              <div className={item}>
                <strong>pc filtered</strong>
                {dataPCFilteredMetrics}
              </div>
              <div className={small}>hide measures </div>
            </div>
          </div> }
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    metrics: state.get('metrics').metrics
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Info)
