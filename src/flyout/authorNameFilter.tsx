import React from 'react';
import { inject, observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import { BookAppStore } from '../bookAppStore';
import '../styles/bookApp.scss';

interface Props {
	bookAppStore?: BookAppStore;
}

@inject('bookAppStore') @observer
export class AuthorNameFilter extends React.Component<Props, object> {

	onChange = event => {
		this.props.bookAppStore.setAuthorNameFilter(event.target.value);
	}

	render() {
		const { bookAppStore: store } = this.props;
		return (
			<div className='flyoutSection'>
				<div className='heading'>Author name</div>
				<div className='rangeContainer'>
					<TextField
						id='authorName'
						className='unlabeledInput'
						type='string'
						onChange={this.onChange}
						value={store.filters.authorName}
					/>
				</div>
			</div>
		);
	}
}