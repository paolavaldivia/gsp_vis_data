import React from 'react'
import { Nav, Navbar } from 'reactstrap'
import DataSelect from 'containers/menu/DataSelect'
import FilterSelect from 'containers/menu/FilterSelect'
import ProjSelect from 'containers/menu/ProjSelect'
import LinksButton from 'containers/menu/LinksButton'

import { menu } from 'styles/menu.scss'

const Menu = () => (
  <div id='menu' className={menu}>
    <Navbar light expand='md' fixed='top'>
      <Nav pills>
        <DataSelect />
        <FilterSelect />
        <ProjSelect />
        <LinksButton />
      </Nav>
    </Navbar>
  </div>
)

export default Menu
