import React from 'react';
import { inject, observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import '../styles/bookApp.scss';

@inject('bookAppStore') @observer
export class YearRangeSelector extends React.Component {

	onChange = key => event => {
		this.props.bookAppStore.setYearFilter(key, event.target.value);
	}

	render() {
		const { bookAppStore: store } = this.props;
		return (
			<div className='flyoutSection'>
				<span className='heading'>Show Years of Publication</span>
				<Divider/>
				<div className='rangeContainer'>
					<div className='rangeLabelLeft'>From</div>
					<TextField
						id='yearStart'
						type='number'
						onChange={this.onChange('start')}
						value={store.filters.year.start}
					/>
					<div className='rangeLabelRight'>to</div>
					<TextField
						id='yearEnd'
						type='number'
						onChange={this.onChange('end')}
						value={store.filters.year.end}
					/>
				</div>
			</div>
		);
	}
}