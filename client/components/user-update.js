/* eslint-disable complexity */
import React from 'react'
import { connect } from 'react-redux'
import {
	findSingleUserThunk,
	updateUserThunk,
	deleteUserThunk
} from '../store/user'
import {Form, Button} from 'react-bootstrap'
import { USstates } from './index.js'

class UserUpdate extends React.Component {
	constructor() {
		super()
		this.state = {
			allUsers: [],
			user: {
				userName: '',
				email: '',
				firstName: '',
				lastName: '',
				houseNumber: '',
				apt: '',
				street: '',
				zipcode: '',
				state: '',
				country: '',
				password: '',
				bankroll: 0, 
				admin: 0
			}
		}
		this.handleOnSubmit = this.handleOnSubmit.bind(this)
		this.handleOnChange = this.handleOnChange.bind(this)
		this.handleOnDelete = this.handleOnDelete.bind(this)
	}
	componentDidMount() {
		
		// if (this.props.match && this.props.match.params.id) {
		// 	this.props.findUser(this.props.match.params.id)
		// 	this.setState({ user: this.props.user.user })
		// } else 
	
		if (this.props.loggedInUser.id) {
			//this.props.findUser(this.props.loggedInUser.id)
			this.setState({ user: this.props.loggedInUser })
		}
	}

	handleOnDelete(id, admin) {
		this.props.deleteUser(id, admin)
	}
	handleOnChange(event) {
		event.preventDefault()
		const newUser = { ...this.state.user }
		const { name, value } = event.target
		newUser[name] = value
		this.setState({
			user: newUser
		})
	}

	handleOnSubmit(event) {
		event.preventDefault()

		const data = {
			username: this.state.user.userName,
			id: this.props.match.params.id,
			email: this.state.user.email,
			firstName: this.state.user.firstName,
			lastName: this.state.user.lastName,
			houseNumber: this.state.user.houseNumber,
			apt: this.state.user.apt,
			street: this.state.user.street,
			zipcode: this.state.user.zipcode,
			state: this.state.user.state,
			country: this.state.user.country,
			password: this.state.user.password,
			admin: !!parseInt(this.state.user.admin)
		}
		this.props.updateUser(data)
	}
	render() {
		let userObj
		if (this.state.user.userName) userObj = this.state.user
		else if (this.props.user) userObj = this.props.user

		let {
			email,
			userName,
			firstName,
			lastName,
			houseNumber,
			apt,
			street,
			zipcode,
			state,
			country
		} = userObj
		const { error } = this.props
		let displaybutton = 'none'
		if (this.props.loggedInUser.admin) displaybutton = 'block'
		const displayStyle = {
			display: displaybutton
		}
		let delStyle = 'none'
		if (this.props.match) {
			if (
				this.props.loggedInUser.id ===
					parseInt(this.props.match.params.id) ||
				this.props.loggedInUser.admin
			)
				delStyle = 'block'
		}
		const displayDel = {
			display: delStyle
		}

		return (
			<div>
				<Form 
					onSubmit={() => this.handleOnSubmit(event)}
					className="mr-auto ml-auto mt-3 w-50 p-3 border rounded"
				>
					{error &&
						error.response && <div> {error.response.data} </div>}
					<Form.Group controlId = "userName">
					<Form.Label>Username: </Form.Label>

					<Form.Control
						type="text"
						name="userName"
						defaultValue={userName}
						onChange={this.handleOnChange}
						maxLength="15"
					/>
					</Form.Group>
					<Form.Group controlId = "email">
					<Form.Label>EMail: </Form.Label>
					<Form.Control
						type="email"
						name="email"
						defaultValue={email}
						onChange={this.handleOnChange}
						pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
					/>
					</Form.Group>
					<Form.Group controlId = "password">
					<Form.Label>Password: </Form.Label>
					<Form.Control
						type="password"
						name="password"
						onChange={this.handleOnChange}
						maxLength="15"
						minLength="6"
						pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
					/>
					</Form.Group>
					<Form.Group controlId = "firstName">
					<Form.Label>First Name: </Form.Label>
					<Form.Control
						type="text"
						name="firstName"
						defaultValue={firstName}
						onChange={this.handleOnChange}
					/>
					</Form.Group>
					<Form.Group controlId = "lastName">
					<Form.Label>Last Name: </Form.Label>
					<Form.Control
						type="text"
						name="lastName"
						defaultValue={lastName}
						onChange={this.handleOnChange}
					/>
					</Form.Group>
					<Form.Group controlId = "houseNumber">
					<Form.Label>House Number: </Form.Label>
					<Form.Control
						type="text"
						name="houseNumber"
						defaultValue={houseNumber}
						onChange={this.handleOnChange}
					/>
					</Form.Group>
					<Form.Group controlId = "street">
					<Form.Label>Street: </Form.Label>
					<Form.Control
						type="text"
						name="street"
						defaultValue={street}
						onChange={this.handleOnChange}
					/>
					</Form.Group>
					<Form.Group controlId = "apt">
					<Form.Label>Apt/Unit #: </Form.Label>
					<Form.Control
						type="text"
						name="apt"
						defaultValue={apt}
						onChange={this.handleOnChange}
					/>
					</Form.Group>
					<Form.Group controlId = "zipcode">
					<Form.Label>Zipcode: </Form.Label>
					<Form.Control
						type="text"
						name="zipcode"
						defaultValue={zipcode}
						onChange={this.handleOnChange}
					/>
					</Form.Group>
					<Form.Group controlId = "state">
					<Form.Label>State: </Form.Label>
					<USstates handleOnChange={this.handleOnChange} />
					</Form.Group>
					<Form.Group controlId = "country">
					<Form.Label>Country: </Form.Label>
					<Form.Control
						type="text"
						name="country"
						defaultValue={country}
						onChange={this.handleOnChange}
					/>
					</Form.Group>
					<Form.Group controlId = "admin">
					<Form.Label style={displayStyle}>Admin: </Form.Label>
					<Form.Control as="select"
						name="admin"
						onChange={this.handleOnChange}
						style={displayStyle}
						value={this.state.user.admin}
					>
					
						<option value="0">False</option>
						<option value="1">True</option>
						</Form.Control>
					</Form.Group>
						<Button variant="primary"
							type="submit"
						>
							Submit
						</Button>
				</Form>
				<Form style={displayDel}
					onSubmit={() => this.handleOnDelete(
						this.props.match.params.id,
						this.props.loggedIn
					)}
					className="mr-auto ml-auto mt-3 w-50 p-3 border rounded"
				>
					<Button type="submit" variant="danger">TERMINATE ACCOUNT</Button>
				</Form>
				
			</div>
		)
	}
}
const mapState = state => {
	return {
		user: state.userState.requestedUser,
		loggedInUser: state.userState.loggedInUser,
		error: state.userState.requestedUser.error
	}
}

const mapDispatch = dispatch => {
	return {
		findUser: id => dispatch(findSingleUserThunk(id)),
		updateUser: formInfo => dispatch(updateUserThunk(formInfo)),
		deleteUser: (id, admin) => dispatch(deleteUserThunk(id, admin))
	}
}
export default connect(mapState, mapDispatch)(UserUpdate)
