import React from 'react';

export default class Question extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		let className = this.props.question.beingHelped ? 'question-card helping' : 'question-card';
		return (
			<article className={className}>
				<p>{this.props.question.question}</p>
				<nav>
					<i className="fa fa-thumbs-o-up" onClick={this.props.beingHelped}></i>
					<i className="fa fa-check" onClick={this.props.completeQuestion}></i>
				</nav>
			</article>
		);
	}
}