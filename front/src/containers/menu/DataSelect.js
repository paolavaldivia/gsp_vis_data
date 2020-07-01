import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {fetchData, selectDataset, setNSamples, setNClasses, setNFeatures, setRandom} from 'redux/actions/data'
import { Input, InputGroup, InputGroupAddon, NavItem, Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import {fetchFilter} from 'redux/actions/filter'
import {fetchFilteredData} from 'redux/actions/filteredData'
import {fetchProjection} from 'redux/actions/projection'
import {fetchFProjection} from 'redux/actions/fprojection'
import {fetchMetrics} from 'redux/actions/metrics'

class DataSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modal: false,
      datasetName: this.props.datasetName,
      nSamples: this.props.nSamples,
      nFeatures: this.props.nFeatures,
      nClasses: this.props.nClasses,
      random: this.props.random
    }
    this.toggle = this.toggle.bind(this)
  }
  toggle () {
    this.setState({
      modal: !this.state.modal
    })
  }
  componentDidMount () {
    this.update(this.props.datasetName, this.props.nSamples, this.props.nClasses, this.props.nFeatures)
  }

  update (datasetName, nSamples, nClasses, nFeatures, random) {
    this.props.selectDataset(datasetName)
    this.props.setNFeatures(nFeatures)
    this.props.setNSamples(nSamples)
    this.props.setNClasses(nClasses)
    this.props.setRandom(random)

    this.props.fetchData(datasetName, nSamples, nFeatures)
    // this.props.fetchFilter(this.props.filter, this.props.alpha, this.props.beta, this.props.c)
    // this.props.fetchFilteredData()
    // this.props.fetchProjection(this.props.projection)
    // this.props.fetchFilteredProjection(this.props.projection)
    // this.props.fetchMetrics()
  }

  handleChangeDataset = (e) => {
    const datasetName = e.target.value
    this.setState({
      datasetName: datasetName
    })
  }

  handleChangeNsamples = (e) => {
    const nSamples = parseInt(e.target.value)
    this.setState({
      nSamples: nSamples
    })
  }

  handleChangeNfeatures = (e) => {
    const nFeatures = parseInt(e.target.value)
    this.setState({
      nFeatures: nFeatures
    })
  }

  handleChangeRandom = (e) => {
    const random = parseInt(e.target.value)
    this.setState({
      random: random
    })
  }
  handleChangeNClasses = (e) => {
    const nClasses = parseInt(e.target.value)
    this.setState({
      nClasses: nClasses
    })
  }

  submit = () => {
    this.update(this.state.datasetName, this.state.nSamples, this.state.nClasses, this.state.nFeatures, this.state.random)
    this.toggle()
  }
  cancel = () => {
    this.setState({
      datasetName: this.props.datasetName,
      nSamples: this.props.nSamples,
      nFeatures: this.props.nFeatures
    })
    this.toggle()
  }
  needSamples () {
    return ['classification', 'blobs', 'ds2',
      'bimodal', 'squares2', 'squares3', 'grid',
      'frame'].indexOf(this.state.datasetName) !== -1
  }
  needFeatures () {
    return ['classification', 'blobs'].indexOf(this.state.datasetName) !== -1
  }
  needRandom () {
    return ['classification', 'blobs'].indexOf(this.state.datasetName) !== -1
  }
  needNClasses () {
    return ['classification', 'blobs'].indexOf(this.state.datasetName) !== -1
  }

  render () {
    const datasets = ['classification', 'blobs',
      'ds2', 'bimodal', 'iris', 'eggs', 'cars',
      'wine', 'ecoli', 'yeast'] // 'squares2', 'squares3', 'grid', 'frame', 'diabetes'
    const datasetsOptions = datasets.map((ds) => <option value={ds}>{ds}</option>)
    return (
      <NavItem>
        <Button color='info' onClick={this.toggle}> Dataset </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalHeader toggle={this.toggle}>Select Dataset</ModalHeader>
          <ModalBody>
            <InputGroup size='sm'>
              <InputGroupAddon>Dataset</InputGroupAddon>
              <Input type='select' value={this.state.datasetName} onChange={this.handleChangeDataset}>
                {datasetsOptions}
              </Input>
            </InputGroup>
            <InputGroup size='sm'>
              <InputGroupAddon>n samples</InputGroupAddon>
              <Input disabled={!this.needSamples()} type='number' value={this.state.nSamples} onChange={this.handleChangeNsamples} />
            </InputGroup>
            <InputGroup size='sm'>
              <InputGroupAddon>n features</InputGroupAddon>
              <Input disabled={!this.needFeatures()} type='number' value={this.state.nFeatures} placeholder='5' onChange={this.handleChangeNfeatures} />
            </InputGroup>
            <InputGroup size='sm'>
              <InputGroupAddon>n classes</InputGroupAddon>
              <Input disabled={!this.needNClasses()} type='number' placeholder='3' value={this.state.nClasses} onChange={this.handleChangeNClasses} />
            </InputGroup>
            <InputGroup size='sm'>
              <InputGroupAddon>random state</InputGroupAddon>
              <Input disabled={!this.needRandom()} type='number' value={this.state.random} onChange={this.handleChangeRandom} />
            </InputGroup>
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
    datasetName: state.get('dataset').name,
    nSamples: state.get('dataset').nSamples,
    nFeatures: state.get('dataset').nFeatures,
    nClasses: state.get('dataset').nClasses,
    random: state.get('dataset').random,
    projection: state.get('projection').name,
    filter: state.get('filter').name,
    alpha: state.get('filter').alpha,
    beta: state.get('filter').beta,
    c: state.get('filter').c
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectDataset: dataset => dispatch(selectDataset(dataset)),
    setNSamples: nSamples => dispatch(setNSamples(nSamples)),
    setNClasses: nClasses => dispatch(setNClasses(nClasses)),
    setRandom: random => dispatch(setRandom(random)),
    setNFeatures: nFeatures => dispatch(setNFeatures(nFeatures)),
    fetchData: (dataset, nSamples, nF) => dispatch(fetchData(dataset, nSamples, nF)),
    fetchProjection: projection => dispatch(fetchProjection(projection)),
    fetchFilter: (filter, a, b, c) => dispatch(fetchFilter(filter, a, b, c)),
    fetchFilteredData: () => dispatch(fetchFilteredData()),
    fetchFilteredProjection: projection => dispatch(fetchFProjection(projection)),
    fetchMetrics: () => dispatch(fetchMetrics())
  }
}

DataSelect.propTypes = {
  datasetName: PropTypes.string,
  nSamples: PropTypes.number,
  nFeatures: PropTypes.number,
  nClasses: PropTypes.number,
  random: PropTypes.number
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DataSelect)
