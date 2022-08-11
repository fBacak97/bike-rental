import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ManagerRoute = ({children}) => {
  const {user} = useSelector(state => state.auth)

  return user.role === 'manager' ? children : <Navigate to="/dashboard" />
}

export default ManagerRoute
