import React from 'react';
import { inject, observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import { BookAppStore } from '../bookAppStore';
import '../styles/bookApp.scss';

interface Props {
	bookAppStore?: BookAppStore;
}

@inject('bookAppStore') @observer
export class MinBooksReadFilter extends React.Component<Props, object> {

	onChange = event => {
		this.props.bookAppStore.setAuthorBooksReadFilter(event.target.value);
	}

	render() {
		const { bookAppStore: store } = this.props;
		return (
			<div className='flyoutSection'>
				<div className='heading'>Books read</div>
				<div className='rangeContainer'>
					<TextField
						id='authorName'
						className='unlabeledInput'
						type='number'
						onChange={this.onChange}
						value={store.filters.minBooksRead}
					/>
				</div>
			</div>
		);
	}
}