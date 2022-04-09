import React from 'react';
import { inject, observer } from 'mobx-react';
import TextField from '@material-ui/core/TextField';
import { BookAppStore } from '../bookAppStore';
import '../styles/bookApp.scss';

interface Props {
	bookAppStore?: BookAppStore;
}

@inject('bookAppStore') @observer
export class YearRangeFilter extends React.Component<Props, object> {

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
				<div className='heading'>Year of publication</div>
				<div className='rangeContainer'>
					<div className="dateRange">
						<div className='rangeLabel'>From:</div>
						<TextField
							id='yearStart'
							className='labeledInput'
							type='number'
							onChange={this.onYearStartChange}
							value={store.filters.yearStart}
						/>
					</div>
					<div className="dateRange">
						<div className='rangeLabel'>To:</div>
						<TextField
							id='yearEnd'
							className='labeledInput'
							type='number'
							onChange={this.onYearEndChange}
							value={store.filters.yearEnd}
						/>
					</div>
				</div>
			</div>
		);
	}
}