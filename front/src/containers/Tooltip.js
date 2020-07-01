import { connect } from 'react-redux'
import Tooltip from 'components/Tooltip'

const mapStateToProps = (state) => {
  return ({
    content: state.get('tooltip').content,
    visible: state.get('tooltip').isVisible,
    x: state.get('tooltip').x,
    y: state.get('tooltip').y
  })
}

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(Tooltip)
