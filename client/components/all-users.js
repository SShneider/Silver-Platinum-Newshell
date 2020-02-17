import React, { Component } from 'react'
import { connect } from 'react-redux'
import { allUsersThunk, me } from '../store'
import { UserProfile } from './index.js'
import { Link } from 'react-router-dom'

class AllUsers extends Component {
	componentDidMount() {
		this.props.loadData()
	}

	render() {
		return (
			<div>
				{this.props.allUsers &&
					this.props.allUsers.map(user => {
						return (
							<div key={user.id}>
								<UserProfile user={user} islist={true} />
								<Link to={`/profile`}>
									<button>Go to User Page</button>
								</Link>
							</div>
						)
					})}
			</div>
		)
	}
}

const mapState = state => {
	return {
		allUsers: state.user.allUsers
	}
}
const mapDispatch = dispatch => {
	return {
		loadData: () => dispatch(allUsersThunk())
	}
}

export default connect(mapState, mapDispatch)(AllUsers)
