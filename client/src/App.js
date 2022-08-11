import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { Provider } from 'react-redux';
import jwt_decode from 'jwt-decode';
import { setCurrentUser, logoutUser } from './actions/authActions';
import store from './store';
import setAuthToken from './utils/setAuthToken';

import ProtectedRoute from './components/ProtectedRoute'
import ManagerRoute from './components/ManagerRoute';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Navbar from './components/layout/Navbar'
import Reservations from './components/Reservations';
import BikeAnalytics from './components/BikeAnalytics'
import UserAnalytics from './components/UserAnalytics'
import ManageUsers from './components/ManageUsers';
import ManageBikes from './components/ManageBikes';

// Keep the user logged in if token exists
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);

  // Set current user
  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    window.location.href = "./login";
  }
}

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="App">
          <Navbar/>
          <Routes>
            <Route path="/register" element={<Register/>} />
            <Route path="/login" element={<Login/>}/>
            <Route path="/" element={<Landing/>}/>
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Dashboard/>
              </ProtectedRoute>
            }></Route>
            <Route path='/bikes' element={
              <ManagerRoute>
                <ManageBikes/>
              </ManagerRoute>
            }></Route>
            <Route path='/users' element={
              <ManagerRoute>
                <ManageUsers/>
              </ManagerRoute>
            }></Route>
            <Route path='/bikes/:id' element={
              <ManagerRoute>
                <BikeAnalytics/>
              </ManagerRoute>
            }></Route>
            <Route path='/users/:id' element={
              <ManagerRoute>
                <UserAnalytics/>
              </ManagerRoute>
            }></Route>
            <Route path='/reservations' element={
              <ProtectedRoute>
                <Reservations/>
              </ProtectedRoute>
            }></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </Provider>
  )
}

export default App;
