import React from 'react'
import { connect } from 'react-redux'
import { Input, InputGroup, InputGroupAddon, NavItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { selectFilter, fetchFilter, fetchFilteredData } from 'redux/actions/actions'
// import {fetchProjection} from 'redux/actions/projection'
import {fetchFProjection} from 'redux/actions/fprojection'
// import {fetchMetrics} from 'redux/actions/metrics'

import Filter from 'containers/FilterLineChart'
import withMeasure from 'hocs/withMeasure'

const dimensions = ['width', 'height']
const MeasuredFilterChart = withMeasure(dimensions)(Filter)

class FilterSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: false,
      filterName: this.props.filterName,
      alpha: this.props.alpha,
      beta: this.props.beta,
      c: this.props.c
    }
    this.reset = false
    this.toggle = this.toggle.bind(this)
  }
  toggle () {
    this.setState({
      modal: !this.state.modal
    })
    if (this.state.modal) {
      this.reset = false
    }
  }

  _changeFilter = (e) => {
    this.setState({
      filterName: e.target.value
    })
    if (e.target.value === 'enhancement') {
      this.setState({
        beta: 2
      })
    }
  }
  _changeAlpha = (e) => {
    this.setState({
      alpha: e.target.value
    })
  }
  _changeBeta = (e) => {
    this.setState({
      beta: e.target.value
    })
  }
  _changeC = (e) => {
    this.setState({
      c: e.target.value
    })
  }

  componentDidUpdate () {
    this.update()
  }

  update () {
    if (this.reset) console.log('not!!!!!!!!!!')
    const filterName = this.state.filterName
    const alpha = this.state.alpha
    const beta = this.state.beta
    const c = this.state.c
    this.props.fetchFilter(filterName, alpha, beta, c)
    // switch (filterName) {
    //   case 'low':
    //     console.log('low')
    //     break
    //   case 'high':
    //     console.log('high')
    //     break
    //   case 'enhancement':
    //     console.log('enhancement')
    //     break
    // }
  }

  submit = () => {
    const filterName = this.state.filterName
    const alpha = this.state.alpha
    const beta = this.state.beta
    const c = this.state.c
    this.props.selectFilter(filterName, alpha, beta, c)
    // this.props.fetchFilter(filterName)
    this.props.fetchFilteredData()
    // this.props.fetchFilteredProjection(this.props.projection)
    this.toggle()
  }
  cancel = () => {
    this.setState({
      filterName: this.props.filterName,
      alpha: this.props.alpha,
      beta: this.props.beta,
      c: this.props.c
    })
    this.toggle()
    this.props.fetchFilter(this.props.filterName, this.props.alpha, this.props.beta, this.props.c)
    this.reset = true
  }

  render () {
    return (
      <NavItem>
        <Button color='info' onClick={this.toggle}> Filter </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} style={{width: '1000px'}}>
          <ModalHeader toggle={this.toggle}>Select Filter</ModalHeader>
          <ModalBody>
            <InputGroup size='sm'>
              <InputGroupAddon>Filter</InputGroupAddon>
              <Input value={this.state.filterName} type='select' onChange={this._changeFilter}>
                <option>low</option>
                <option>high</option>
                <option>enhancement</option>
              </Input>
            </InputGroup>
            <InputGroup size='sm'>
              <InputGroupAddon>low</InputGroupAddon>
              <Input type='number' value={this.state.alpha} onChange={this._changeAlpha} disabled={this.state.filterName === 'high'} />
            </InputGroup>
            <InputGroup size='sm'>
              <InputGroupAddon>high</InputGroupAddon>
              <Input type='number' value={this.state.beta} onChange={this._changeBeta} disabled={this.state.filterName === 'low'} />
            </InputGroup>
            <InputGroup size='sm'>
              <InputGroupAddon>c</InputGroupAddon>
              <Input type='number' value={this.state.c} onChange={this._changeC} disabled={this.state.filterName !== 'enhancement'} />
            </InputGroup>
            <div style={{width: '100%', height: '300px'}}>
              <MeasuredFilterChart />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color='primary' onClick={this.submit}>OK</Button>{' '}
            <Button color='secondary' onClick={this.cancel}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </NavItem>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    filterName: state.get('filter').name,
    alpha: state.get('filter').alpha,
    beta: state.get('filter').beta,
    c: state.get('filter').c,
    projection: state.get('projection').name
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectFilter: (filter, a, b, c) => dispatch(selectFilter(filter, a, b, c)),
    fetchFilter: (filter, a, b, c) => dispatch(fetchFilter(filter, a, b, c)),
    fetchFilteredData: () => dispatch(fetchFilteredData()),
    fetchFilteredProjection: projection => dispatch(fetchFProjection(projection))
  }
}

FilterSelect.propTypes = {
  filterName: React.PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FilterSelect)
