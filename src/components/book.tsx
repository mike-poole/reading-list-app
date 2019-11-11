import React from 'react';
import { observer } from 'mobx-react';
import { BookInfoModel } from '../models/model';
import { AwardTags } from './awardTags';
import '../styles/bookApp.scss';

interface Props {
	book: BookInfoModel;
}

@observer
export class Book extends React.Component<Props, object> {

	render() {

		const { book } = this.props;
	
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
