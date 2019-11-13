import React from 'react';
import { observer, inject } from 'mobx-react';
import { BookAppStore } from '../bookAppStore';
import { BookInfoModel } from '../models/model';
import { AwardTags } from './awardTags';
import '../styles/bookApp.scss';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

interface Props {
	bookAppStore?: BookAppStore;
	bookKey: string;
	checked?: boolean;
	subitem?: boolean;
}

@inject('bookAppStore') @observer
export class Book extends React.Component<Props, object> {

	renderCheckbox(book: BookInfoModel) {
		if (book.yearsRead.length > 0) {
			return <CheckBoxIcon/>
		} else {
			return <CheckBoxOutlineBlankIcon/>
		}
	}

	render() {

		const { bookKey, subitem, checked, bookAppStore: store } = this.props;
		const book: BookInfoModel = store.getBook(bookKey);

		const classNames = 'book' + (subitem ? ' seriesBook' : '');
	
		return (
			<div className={classNames}>
				{checked &&
					this.renderCheckbox(book)
				}
				<span className='title'>{book.title}</span>
				<span className='author'>{book.authorName}</span>
				<span className='year'>{book.year}</span>
				<AwardTags bookKey={book.key} awards={book.awards}/>
			</div>
		);
	}
}
