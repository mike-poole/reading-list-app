import React from 'react';
import { AwardTags } from './awardTags.jsx';
import '../styles/bookApp.scss';

export class Book extends React.Component {

	render() {

		const { book } = this.props;
	
		return (
			<div className='book'>
				<span className='title'>{book.title}</span>
				<span className='author'>{book.authorName}</span>
				<span className='year'>{book.year}</span>
				<AwardTags key={book.key} awards={book.awards}/>
			</div>
		);
	}
}
