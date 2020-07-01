import React from 'react'
import { connect } from 'react-redux'
import {fetchProjection, selectProjection} from 'redux/actions/actions'
import { NavItem, Input, InputGroup, InputGroupAddon } from 'reactstrap'
import {fetchFProjection} from 'redux/actions/fprojection'

import { igroup } from 'styles/menu.scss'

class ProjectionSelect extends React.Component {
  toggle = () => {
    console.log(this)
    this.modal = !this.modal
  }

  componentDidMount () {
    // this.props.selectProjection('pca')
  }

  handleChange = (e) => {
    const name = e.target.value
    this.props.selectProjection(name)
    this.props.fetchProjection(name)
    this.props.fetchFilteredProjection(name)
  }

  render () {
    return (
      <NavItem>
        <InputGroup className={igroup} size='sm'>
          <InputGroupAddon>Projection</InputGroupAddon>
          <Input type='select' onChange={this.handleChange}>
            <option>pca</option>
            <option>force</option>
            <option>tsne</option>
            <option>lamp</option>
          </Input>
        </InputGroup>
      </NavItem>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projectionName: state.get('projection').name
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    selectProjection: proj => dispatch(selectProjection(proj)),
    fetchProjection: proj => dispatch(fetchProjection(proj)),
    fetchFilteredProjection: proj => dispatch(fetchFProjection(proj))
  }
}

ProjectionSelect.propTypes = {
  projectionName: React.PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectionSelect)
