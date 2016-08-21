import React from 'react';

class Home extends React.Component {
	constructor(props,context) {
		super(props, context);
	}
	goToRoom(e) {
		e.preventDefault();
		const room = this.room.value;
		this.context.router.push(`/rooms/${room}`);
	}
	render() {
		return (
			<div className="home">
				<h2>Enter a room name:</h2>
				<form onSubmit={e => this.goToRoom.call(this,e)}>
					<input type="text" name="room" ref={ref => this.room = ref}/>
					<input type="submit" value="Go to Room"/>
				</form>
			</div>
		);
	}
}

Home.contextTypes = {
	router: React.PropTypes.object
};

export default Home;