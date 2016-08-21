import React from 'react';
import Question from './question.js';

export default class Room extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			questions: [],
			completed: 0
		};
	}
	componentDidMount() {
		firebase.database().ref(`room/${this.props.params.room}/questions`)
			.orderByChild('date')
			.on('value', (res) => {
				let questions = [];
				res.forEach((obj) => {
					let question = Object.assign({},obj.val(),{key:obj.key});
					questions.push(question);
				});
				questions.reverse();
				this.setState({
					questions
				});
			});

		firebase.database().ref(`room/${this.props.params.room}/completed`)
			.on('value', (res) => {
				let count = 0;
				res.forEach(() => {
					count++;
				});
				this.setState({
					completed: count
				});
			});
	}
	componentWillUnmount() {
		firebase.database().ref(`room/${this.props.params.room}/questions`)
			.off();
	}
	newQuestion(e) {
		e.preventDefault();

		const question = {
			user: firebase.auth().currentUser.email,
			question: this.question.value,
			beingHelped: false,
			date: +new Date()
		};

		firebase.database().ref(`room/${this.props.params.room}/questions`)
			.push(question);
	}
	beingHelped(index) {
		let question = this.state.questions[index];

		question.beingHelped = true;

		firebase.database()
			.ref(`room/${this.props.params.room}/questions/${question.key}`)
			.update(question)
	}
	completeQuestion(index) {
		const question = this.state.questions[index];
		firebase.database()
			.ref(`room/${this.props.params.room}/completed`)
			.push(question, () => {
				firebase.database()
					.ref(`room/${this.props.params.room}/questions/${question.key}`)
					.remove()
			});
	}
	render() {
		return (
			<div>
				<h2>Room {this.props.params.room} | Completed {this.state.completed}</h2>
				<div className="question-form">
					<form onSubmit={e => this.newQuestion.call(this,e)}>
						<p>Ask a question:</p>
						<div>
							<textarea name="question" ref={ref => this.question = ref}></textarea>
						</div>
						<div>
							<input type="submit"/>
						</div>
					</form>
				</div>
				<section className="questions">
					{this.state.questions.map((question,i) => <Question key={i} beingHelped={this.beingHelped.bind(this,i)} completeQuestion={this.completeQuestion.bind(this,i)} question={question}/>)}
				</section>
			</div>
		);
	}
}