import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { findSingleUserThunk } from '../store/user'
import {Card, Button, ListGroup, ListGroupItem} from 'react-bootstrap'
class UserProfile extends React.Component {
	constructor() {
		super()
		this.state = {
			allUsers: [],
			user: {},
			loggedInUser :{}
		}
	}
	componentDidMount() {
		if (this.props.match) {this.props.findUser(this.props.match.params.id)}
	}
	render() {
		let ifAdmin
		if (this.props.user.loggedInUser) ifAdmin = this.props.user.loggedInUser.admin//checks if the user has admin priveleges 
		let displaybutton = 'none'
		if (!this.props.islist) displaybutton = 'block' //if the component is used in the 
		//allusers list, 'Go To User Profile' button is displayed. 
		const displayStyle = {
			display: displaybutton
		}
		let displayAdmin = 'none'
		let updateLink = `/profile/update` //masks the fact that other users can be accessed
	
		let uservalue
		if (this.props.user.requestedUser) uservalue = this.props.user.requestedUser
		else uservalue = this.props.user //checks if the user requested their own profile
		//or if admin requested someone elses
		if (ifAdmin) {
			displayAdmin = 'block' //displays admin panel if the user logged in has
			updateLink = `/profile/${uservalue.id}/update`} 
		//admin priveleges 
		const adminPanel = {
			display: displayAdmin
		}
		const { userName, firstName, lastName, address, email } = uservalue
		return (
				<Card bg="info" text="white" className="mr-auto ml-auto mt-3 w-25">
					<Card.Header><h3>Welcome, {firstName} {lastName}</h3></Card.Header>
					<Card.Body className="pl-3 pb-3">
						<ListGroup>
						
							<ListGroupItem variant="info">Name: {firstName} {lastName}</ListGroupItem>
							<ListGroupItem variant="info">Address: {address}</ListGroupItem>
							<ListGroupItem variant="info">Email: {email}</ListGroupItem>
						</ListGroup>
						<div style={displayStyle}>
					<Card.Link className="pt-3 pb-3 d-flex justify-content-center"
						href={updateLink}
					>
						<Button variant="primary">Edit Info</Button>
					</Card.Link></div>
					<div style={adminPanel}>
					<Card.Title className="text-center" >Admin Panel</Card.Title>
					<Card.Body className="d-flex justify-content-center">
					<Card.Link href="/users"><Button variant="primary">All Users</Button></Card.Link>
					<Card.Link href="/products"><Button variant="primary">All Transactions</Button></Card.Link>
					</Card.Body></div>
				</Card.Body>
				</Card>
		)
	}
}
const mapState = (state, ownProps) => {
	return {
		user: ownProps.user || state.userState,
		loggedInUser: state.userState.loggedInUser,
		islist: ownProps.islist || false
	}
}

const mapDispatch = dispatch => {
	return {
		findUser: id => dispatch(findSingleUserThunk(id))
	}
}
export default connect(mapState, mapDispatch)(UserProfile)
