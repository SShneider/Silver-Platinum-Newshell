import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {Navbar, Nav, Form, FormControl, Button} from 'react-bootstrap'
const OurNavbar = ({handleClick, isLoggedIn, clientName}) => (

    <Navbar bg="dark" variant="dark">
    <Navbar.Brand href="/home">Silver Platinum Stocks</Navbar.Brand>
    
      {isLoggedIn ? (
        <Nav>
        <Nav className="mr-auto">
          {/* The navbar will show these links after you log in */}
          <Nav.Link href="/portfolio">Portfolio</Nav.Link>
          <Nav.Link href="/transactions">Transactions</Nav.Link>
          <Nav.Link href="#"  onClick={handleClick}>Logout</Nav.Link>
          
          </Nav>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
       <Navbar.Text>
       Signed in as: <a href="/profile">{clientName}</a>
        </Navbar.Text>
          <Form inline>
          <FormControl type="text" placeholder="Search For Ticker" className="mr-sm-2" />
          <Button variant="outline-light">Search</Button>
        </Form>
        </Navbar.Collapse>
        </Nav>
      ) : (
        <Nav className="mr-auto">
          {/* The navbar will show these links before you log in */}
          <Nav.Link href="/login">Login</Nav.Link>
          <Nav.Link href="/signup">Sign Up</Nav.Link>
          </Nav>
      )}
  
  </Navbar>

)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.userState.loggedInUser.id, //|| !!state.userState.user.admin,
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
