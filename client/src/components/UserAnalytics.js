import React from 'react'
import {Row, Col, PageHeader, Table} from 'antd';
import moment from 'moment';
import { useLocation } from 'react-router-dom';


const tableColumns = [
  {
    title: 'Bike ID',
    dataIndex: ['bike', '_id'],
    key: 'bikeId',
    render: bikeId => <span>{bikeId ? bikeId : 'Unavailable'}</span>,
  },
  {
    title: 'Model',
    dataIndex: ['bike', 'model'],
    key: 'model',
    render: model => <span>{model ? model : 'Unavailable'}</span>,
  },
  {
    title: 'Start Date',
    dataIndex: 'startDate',
    key: 'startDate',
    render: date => <span>{moment(date).format("MMMM Do YYYY, HH:mm:ss")}</span>,
  },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    render: date => <span>{moment(date).format("MMMM Do YYYY, HH:mm:ss")}</span>,
  },
  {
    title: 'Color',
    dataIndex: ['bike', 'color'],
    key: 'color',
    render: color => <span>{color ? color : 'Unavailable'}</span>,
  },
  {
    title: 'Location',
    dataIndex: ['bike', 'location'],
    key: 'location',
    render: location => <span>{location ? location : 'Unavailable'}</span>,
  },
  {
    title: 'Bike Rating',
    dataIndex: ['bike', 'rating'],
    key: 'rating',
    render: rating => <span>{rating ? rating : 'Unavailable'}</span>,
  },
]

const UserAnalytics = (props) => {
  const location = useLocation()   
  const user = location.state.user
  const {reservations} = user

  return (
    <Row>
      <Col span={24}>
        <PageHeader 
          backIcon={false}
          title={`Analytics for ${user.email}`}
          subTitle=""
        />
        <Table columns={tableColumns} rowKey={(elem) => elem._id} dataSource={reservations}/>
      </Col>
    </Row>
  )
}

export default UserAnalytics