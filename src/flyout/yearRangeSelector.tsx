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
export class YearRangeSelector extends React.Component<Props, object> {

	onYearStartChange = event => {
		this.props.bookAppStore.setYearStartFilter(event.target.value);
	}

	onYearEndChange = event => {
		this.props.bookAppStore.setYearEndFilter(event.target.value);
	}

	render() {
		const { bookAppStore: store } = this.props;
		return (
			<div className='flyoutSection'>
				<span className='heading'>Show Years of Publication</span>
				<Divider/>
				<div className='rangeContainer'>
					<div className='rangeLabel'>From</div>
					<TextField
						id='yearStart'
						type='number'
						onChange={this.onYearStartChange}
						value={store.filters.yearStart}
					/>
					<br/>
					<div className='rangeLabel'>To</div>
					<TextField
						id='yearEnd'
						type='number'
						onChange={this.onYearEndChange}
						value={store.filters.yearEnd}
					/>
				</div>
			</div>
		);
	}
}