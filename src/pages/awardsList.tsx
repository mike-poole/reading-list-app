import React from 'react';
import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { BookAppStore } from '../bookAppStore';
import { Book } from '../components/book';

interface Props {
	bookAppStore?: BookAppStore;
}

@inject('bookAppStore') @observer
export class AwardsList extends React.Component<Props, object> {

	@observable currentAward = 'PUL';

	@action.bound
	onChangeAward(event) {
		this.currentAward = event.target.value;
	}

	@computed
	get booksTotal() {
		const { bookAppStore: store } = this.props;
		return Object.keys(store.awardInfo[this.currentAward].books).length;
	}

	renderBook(bookKey, store) {
		if (bookKey.indexOf('[NA') >= 0) {
			return (
				<div className='book'>No award</div>
			);
		} else {
			return (
				<div>
					<Book key={bookKey} book={store.getBook(bookKey)}/>
				</div>
			);
		}

	}

	render() {

		const { bookAppStore: store } = this.props;

		return (
			<React.Fragment>
				<Select
					value={this.currentAward}
					onChange={this.onChangeAward}
				>
					{store.awardList.map(award =>
						<MenuItem value={award.key}>
							{award.name}
						</MenuItem>
					)}
				</Select>
				{Object.keys(store.awardInfo[this.currentAward].books).map(bookKey =>
					<div>
						{this.renderBook(bookKey, store)}
					</div>
				)}
			</React.Fragment>
		);
	}
}
