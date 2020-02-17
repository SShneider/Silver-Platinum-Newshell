import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store/index'
import {Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap'
const OurNavbar = ({handleClick, isLoggedIn, clientName}) => (
<div>
      {isLoggedIn ? (
        
    <Navbar bg="dark" variant="dark" expand="lg">
    <Navbar.Brand href="/profile">Silver Platinum Stocks</Navbar.Brand>
    
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {/* The navbar will show these links after you log in */}
          <Nav.Link href="/portfolio">Portfolio</Nav.Link>
          <Nav.Link href="/transactions">Transactions</Nav.Link>
          <Nav.Link href="#"  onClick={handleClick}>Logout</Nav.Link>
          
          </Nav>
          
          <Nav className="justify-content-space-between">
       <Navbar.Text className="mr-2">
       Signed in as: <a href="/profile">{clientName} </a>
        </Navbar.Text>
          <Form inline>
          <FormControl type="text" placeholder="Search For Ticker" className="mr-sm-2" />
          <Button variant="outline-light">Search</Button>
        </Form>
        </Nav>
        </Navbar.Collapse>
        </Navbar>
      ) : (
        <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand href="/home">Silver Platinum Stocks</Navbar.Brand>
        
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {/* The navbar will show these links before you log in */}
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="/signup">Sign Up</Nav.Link>
          </Nav>
          </Navbar.Collapse>
        </Navbar>
      )}
  </div>
  

)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.userState.loggedInUser.id, // || !!state.userState.requestedUser.admin,
    clientName: `${state.userState.loggedInUser.firstName} ${state.userState.loggedInUser.lastName}` 
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout())
    }
  }
}

export default connect(mapState, mapDispatch)(OurNavbar)

/**
 * PROP TYPES
 */
OurNavbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
