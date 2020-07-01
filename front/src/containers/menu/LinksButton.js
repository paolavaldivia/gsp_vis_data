import React from 'react'
import { connect } from 'react-redux'
import { NavItem, Button } from 'reactstrap'
import {showLinks, hideLinks} from 'redux/actions/interactions'

class LinksButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      linksVisible: false
    }
  }

  toggle = () => {
    const newLinksVisible = !this.state.linksVisible
    this.setState({
      linksVisible: newLinksVisible
    })
    console.log(newLinksVisible)
    if (newLinksVisible) {
      this.props.showLinks()
    } else {
      this.props.hideLinks()
    }
  }

  render () {
    return (
      <NavItem>
        <Button color='info' active={this.state.linksVisible} onClick={this.toggle}>Links</Button>
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
    showLinks: proj => dispatch(showLinks()),
    hideLinks: proj => dispatch(hideLinks())
  }
}

LinksButton.propTypes = {
  projectionName: React.PropTypes.string
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LinksButton)
