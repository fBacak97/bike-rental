import React, {useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import { Row, Col, Button } from "antd";

const Landing = (props) => {
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth)

  useEffect(() => {
    if(auth.isAuthenticated){
      navigate('/dashboard')
    }
    // eslint-disable-next-line
  }, [auth.isAuthenticated])

  return (
    <Row style={{height: '100%'}} justify='center' align='middle'>
      <Col span={10} style={{textAlign: 'center'}}>
          <h1>
            Rent a bike easily on {" "}<span style={{ fontFamily: "monospace" }}>BIKE RENTAL</span>, just upon a glance.
          </h1>
          <Row>
          <Col span={12}>
            <Button shape="round"  size="large">
              <Link to="/register">
                Register
              </Link>
            </Button>
          </Col>
          <Col span={12}>
            <Button type='primary' shape="round" size="large">
              <Link to="/login">
                Login
              </Link>
            </Button>
          </Col>
          </Row>
      </Col>
    </Row>  
  )
}

export default Landing;