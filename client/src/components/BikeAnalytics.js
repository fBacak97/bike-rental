import React from 'react'
import {Row, Col, PageHeader, Table} from 'antd';
import moment from 'moment';
import { useLocation } from 'react-router-dom';


const tableColumns = [
  {
    title: 'Reserved By',
    dataIndex: ['reservedBy', 'email'],
    key: 'reservedBy',
    render: reservedBy => <span>{reservedBy ? reservedBy : 'Unavailable'}</span>,
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
]

const BikeAnalytics = (props) => {
  const location = useLocation()  
  const bike = location.state.bike
  const {reservations} = bike

  return (
    <Row className='container'>
      <Col span={24}>
        <PageHeader 
          backIcon={false}
          title={`Analytics for ${bike._id}`}
          subTitle=""
        />
        <Table columns={tableColumns} rowKey={(elem) => elem._id} dataSource={reservations}/>
      </Col>
    </Row>
  )
}

export default BikeAnalytics