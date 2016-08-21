import React from 'react';
import ReactDom from 'react-dom';
import { Route, Router, Link, browserHistory, IndexRoute } from 'react-router';
import config from './config.js';
import Home from './home.js';
import Room from './room.js';

class App extends React.Component {
	constructor(props,context) {
		super();
		this.state = {
			loggedIn: false,
			create: false
		};
		firebase.initializeApp(config);
	}
	componentDidMount() {
		firebase.auth()
			.onAuthStateChanged((res) => {
				this.setState({
					loggedIn: true
				});
			});
	}
	login(e) {
		e.preventDefault();
		console.log(this);
		let user = {
			email: this.userEmail.value,
			password: this.userPassword.value
		};
		if(this.state.create) {
			if(user.password === this.confirmPassword.value) {
				firebase.auth()
					.createUserWithEmailAndPassword(user.email, user.password)
					.then(res => {
						console.log('create: ', res);
					})
					.catch(err => {
						console.log('error: ', err);
					});
			}
		}
		else {
			firebase.auth()
				.signInWithEmailAndPassword(user.email, user.password)
				.then(res => {
					console.log(res);
				})
				.catch(err => {
					console.log(err);
				});
		}
	}
	createUser(e) {
		e.preventDefault();
		this.setState({
			create: true
		});
	}
	signout(e) {
		e.preventDefault();
		firebase.auth().signOut();
		this.setState({
			loggedIn: false
		});
		this.context.router.push('/')
	}
	render() {
		let loginForm = (
			<aside>
				<form onSubmit={e => this.login.call(this,e)}>
					<div>
						<label htmlFor="email">Email: </label>
						<input type="text" name="email" ref={ref => this.userEmail = ref}/>
					</div>
					<div>
						<label htmlFor="password">Password: </label>
						<input type="password" name="password" ref={ref => this.userPassword = ref}/>
					</div>
					{( _ => {
						return this.state.create ? (
							<div>
								<label htmlFor="confirm">Confirm Password: </label>
								<input type="password" name="confirm" ref={ref => this.confirmPassword = ref}/>
							</div>
						) : '';
					})()}
					<input type="submit"/>
					<a href="#" onClick={e => this.createUser.call(this,e)}>Create new User</a>
				</form>
			</aside>
		);
		if(this.state.loggedIn) {
			loginForm = '';
		}
		return (
			<div>
				<header className="main-header">
					<div className="wrapper">
						<nav>
							<h1><Link to="/">Halpq</Link></h1>
							<a href="#" onClick={e => this.signout.call(this,e)}>Sign out</a>
						</nav>
						{loginForm}
					</div>
				</header>
				<section className="wrapper">
					{this.props.children}
				</section>
			</div>
		);
	}
};

App.contextTypes = {
	router: React.PropTypes.object
};


ReactDom.render(
	<Router history={browserHistory}>
		<Route path="/" component={App}>
			<IndexRoute component={Home} />
			<Route path="/rooms/:room" component={Room} />
		</Route>
	</Router>
, document.getElementById('main'));