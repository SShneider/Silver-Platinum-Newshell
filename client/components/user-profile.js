import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { findSingleUserThunk } from '../store/user'

class UserProfile extends React.Component {
	constructor() {
		super()
		this.state = {
			allUsers: [],
			user: {}
		}
	}
	componentDidMount() {
		if (this.props.match) this.props.findUser(this.props.match.params.id)
	}
	render() {
		let ifAdmin
		if (this.props.user.loggedInUser)
			ifAdmin = this.props.user.loggedInUser.admin
		let id
		if (this.props.match) id = this.props.match.params.id

		let displaybutton = 'none'
		if (!this.props.islist) displaybutton = 'block'
		const displayStyle = {
			display: displaybutton
		}
		let displayAdmin = 'none'
		if (ifAdmin) displayAdmin = 'block'
		const adminPanel = {
			display: displayAdmin
		}
		let uservalue
		if (this.props.user.user) uservalue = this.props.user.user
		else uservalue = this.props.user
		const { username, firstName, lastName, address, email } = uservalue
		return (
			<div className="containerNoWrap">
				<div>
					<ul>
						<li>Username: {username}</li>
						<li>
							Name: {firstName} {lastName}
						</li>
						<li>Address: {address}</li>
						<li>Email: {email}</li>
					</ul>
					<Link
						to={`/users/${uservalue.id}/update`}
						style={displayStyle}
					>
						<button type="button">Edit User</button>
					</Link>
				</div>
				<div style={displayStyle}>
					<p>Transactions</p>
				</div>
				<div style={adminPanel}>
					<p>Admin Panel</p>
					<Link to="/users">All Users</Link>
					<br />
					<Link to="/products">All Transactions</Link>
				</div>
			</div>
		)
	}
}
const mapState = (state, ownProps) => {
	return {
		user: ownProps.user || state.user,
		islist: ownProps.islist || false
	}
}

const mapDispatch = dispatch => {
	return {
		findUser: id => dispatch(findSingleUserThunk(id))
	}
}
export default connect(mapState, mapDispatch)(UserProfile)
