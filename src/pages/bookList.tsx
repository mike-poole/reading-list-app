import React from 'react';
import { inject, observer } from 'mobx-react';
import { BookAppStore } from '../bookAppStore';
import { Book } from '../components/book';
import '../styles/bookApp.scss';

interface Props {
	bookAppStore?: BookAppStore;
}

@inject('bookAppStore') @observer
export class BookList extends React.Component<Props, object> {

	render() {

		const { bookAppStore: store } = this.props;

		return (
			store.bookList.map(book =>
				<Book key={book.key} book={book}/>
			)
		);
	}
}