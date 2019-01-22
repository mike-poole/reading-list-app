import React from 'react';
import { inject } from 'mobx-react';
import '../styles/bookApp.scss';

@inject('bookAppStore')
export class AuthorList extends React.Component {

	render() {

		const { bookAppStore: store } = this.props;

		return (
			store.authorList.map(author =>
				<p className='author' key={author.key}>{author.lastName}, {author.firstName}</p>
			)
		);
	}
}