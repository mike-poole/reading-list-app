import React from 'react';
import { observer, inject } from 'mobx-react';
import { BookAppStore } from '../bookAppStore';
import { BookInfoModel } from '../models/model';
import { AwardTags } from './awardTags';
import '../styles/bookApp.scss';

interface Props {
	bookAppStore?: BookAppStore;
	bookKey: string;
}

@inject('bookAppStore') @observer
export class Book extends React.Component<Props, object> {

	render() {

		const { bookKey, bookAppStore: store } = this.props;
		const book: BookInfoModel = store.getBook(bookKey);
	
		return (
			<div className='book'>
				<span className='title'>{book.title}</span>
				<span className='author'>{book.authorName}</span>
				<span className='year'>{book.year}</span>
				<AwardTags bookKey={book.key} awards={book.awards}/>
			</div>
		);
	}
}
