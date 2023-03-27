// Menu.js

import React from 'react'
import { Menu } from 'antd'


const CustomMenu = ({handleMenuClick}) => {
  return (
    <Menu
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      className='h-4/6 ml-4 m-auto absolute top-0 bottom-0 rounded-md p-4'
      style={{ background: 'linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)' ,
      boxShadow: '0 2px 4px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.1)'

    }}
    onSelect={handleMenuClick}
    >
        <Menu.Item key="1" className='rounded-lg text-lg text-slate-900 ' style={{  marginBottom: '12px', textAlign: 'center', fontWeight: 'bold' }}>
          Home
        </Menu.Item>
        <Menu.Item key="2" className='rounded-lg text-lg text-slate-900' style={{  marginBottom: '12px' , textAlign: 'center', fontWeight: 'bold'}}>
          Past Escrows
        </Menu.Item>
        <Menu.Item key="3" className='rounded-lg text-lg  text-slate-900' style={{ marginBottom: '12px',  textAlign: 'center', fontWeight: 'bold' }}>
          Conditions 
        </Menu.Item>
        <Menu.Item key="4" className='rounded-lg text-lg  text-slate-900
        ' style={{ marginBottom: '12px', textAlign: 'center',  fontWeight: 'bold' }}>
            Auto Escrow
        </Menu.Item>
    </Menu>
  )
}

export default CustomMenu
