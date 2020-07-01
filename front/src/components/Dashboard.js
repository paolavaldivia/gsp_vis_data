import React from 'react'
import {Responsive, WidthProvider} from 'react-grid-layout'
import withMeasure from 'hocs/withMeasure'
import DataSplom from 'containers/DataSplom'
import DataFilteredSplom from 'containers/FilteredDataSplom'
import Projection from 'containers/DataProjection'
import ProjectionFiltered from 'containers/FilteredDataProjection'
import DataPC from 'containers/DataPC'
import FilteredDataPC from 'containers/FilteredDataPC'

const ResponsiveReactGridLayout = WidthProvider(Responsive)
const dimensions = ['width', 'height']
const MeasuredDataSplom = withMeasure(dimensions)(DataSplom)
const MeasuredDataFilteredSplom = withMeasure(dimensions)(DataFilteredSplom)
const MeasuredSPChart = withMeasure(dimensions)(Projection)
const MeasuredFPChart = withMeasure(dimensions)(ProjectionFiltered)
const MeasuredPCChart = withMeasure(dimensions)(DataPC)
const MeasuredFPCChart = withMeasure(dimensions)(FilteredDataPC)

class Dashboard extends React.Component {
  render () {
    const layouts = {'lg': [
      { i: 'd_proj', x: 0, y: 0, w: 6, h: 4 },
      { i: 'fd_proj', x: 6, y: 0, w: 6, h: 4 },
      { i: 'd_splom', x: 0, y: 8, w: 6, h: 8, minW: 6, minH: 8 },
      { i: 'fd_splom', x: 6, y: 8, w: 6, h: 8, minW: 6, minH: 8 },
      { i: 'd_pc', x: 0, y: 4, w: 6, h: 4 },
      { i: 'fd_pc', x: 6, y: 4, w: 6, h: 4 }
    ]}
    return (
      <ResponsiveReactGridLayout className='dashboard' rowHeight={100} layouts={layouts}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 12, md: 6, sm: 2, xs: 2, xxs: 2}}
        useCSSTransforms={false}>
        <div key='d_proj'>
          <MeasuredSPChart className='center' />
        </div>
        <div key='fd_proj'>
          <MeasuredFPChart className='center' />
        </div>
        <div key='d_splom'>
          <MeasuredDataSplom className='center' />
        </div>
        <div key='fd_splom'>
          <MeasuredDataFilteredSplom className='center' />
        </div>
        <div key='d_pc'>
          <MeasuredPCChart className='center' />
        </div>
        <div key='fd_pc'>
          <MeasuredFPCChart className='center' />
        </div>
      </ResponsiveReactGridLayout>
    )
  }
}

export default Dashboard
