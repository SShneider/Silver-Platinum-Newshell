import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {logout} from '../store/index'
import {Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap'
import {LinkContainer} from 'react-router-bootstrap'
const OurNavbar = ({handleClick, isLoggedIn, clientName}) => (
<div>
      {isLoggedIn ? (
        
    <Navbar bg="dark" variant="dark" expand="lg">
    <LinkContainer to = {{pathname:"/portfolio", query:{type:'portfolio'}}}><Navbar.Brand>Silver Platinum Stocks</Navbar.Brand></LinkContainer>
    
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {/* The navbar will show these links after you log in */}
          
          <LinkContainer to={{pathname:"/portfolio", query:{type:'portfolio'}}}><Nav.Link>Portfolio</Nav.Link></LinkContainer>
          <LinkContainer to={{pathname:"/transactions", query:{type:'transactions'}}}><Nav.Link>Transactions</Nav.Link></LinkContainer>
          <Nav.Link href="#"  onClick={handleClick}>Logout</Nav.Link>
          
          </Nav>
          
          <Nav className="justify-content-space-between">
       <Navbar.Text className="mr-2">
       Signed in as: <LinkContainer to="/profile"><Nav.Link>{clientName}</Nav.Link></LinkContainer>
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
          <LinkContainer to="/login"><Nav.Link>Login</Nav.Link></LinkContainer>
        <LinkContainer to="/signup"><Nav.Link>Sign Up</Nav.Link></LinkContainer>
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
