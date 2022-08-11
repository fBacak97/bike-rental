import React from "react"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "../../actions/authActions"
import { useDispatch, useSelector } from "react-redux"

import { Layout, Menu } from "antd"
import { LogoutOutlined, HomeOutlined, BookOutlined, TeamOutlined, NodeIndexOutlined } from '@ant-design/icons'
const { Header } = Layout

const Navbar = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector(state => state.auth)

  const onClick = e => {
    switch (e.key) {
      case 'logout':
        dispatch(logoutUser())
        break
      case 'home':
        navigate('/dashboard')
        break
      case 'reservations':
        navigate('/reservations')
        break
      case 'manageUsers':
        navigate('/users')
        break
      case 'manageBikes':
        navigate('/bikes')
        break
      default:
        break
    }
  };

  const standardMenuItems = [
    { label: 'Dashboard', key: 'home', icon: <HomeOutlined/>},
    { label: 'My Reservations', key: 'reservations', icon: <BookOutlined/>},
    { label: 'Logout', key: 'logout', icon: <LogoutOutlined/>},
  ]

  const managerMenuItems = [
    { label: 'Dashboard', key: 'home', icon: <HomeOutlined/>},
    { label: 'My Reservations', key: 'reservations', icon: <BookOutlined/>},
    { label: 'Manage Users', key: 'manageUsers', icon: <TeamOutlined/>},
    { label: 'Manage Bikes', key: 'manageBikes', icon: <NodeIndexOutlined/>},
    { label: 'Logout', key: 'logout', icon: <LogoutOutlined/>},
  ]
   
  return auth.isAuthenticated && (
    (<Header style={{padding: '0px', marginBottom: '15px'}}>
      <Menu 
        items={auth.user.role === 'manager' ? managerMenuItems : standardMenuItems}
        onClick={onClick}
        selectable={false}
        theme="dark"
        mode="horizontal"
      />
    </Header>)
  )
}


export default Navbar



