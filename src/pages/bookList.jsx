import React from 'react';
import { inject, observer } from 'mobx-react';
import { Book } from '../components/book.jsx';
import '../styles/bookApp.scss';

@inject('bookAppStore') @observer
export class BookList extends React.Component {

	render() {

		const { bookAppStore: store } = this.props;

		return (
			store.bookList.map(book =>
				<Book key={book.key} book={book}/>
			)
		);
	}
}