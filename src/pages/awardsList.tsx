import React from 'react';
import { observable, action, makeObservable } from 'mobx';
import { inject, observer } from 'mobx-react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { BookAppStore } from '../bookAppStore';
import { AwardType } from '../models/model';
import { Work } from '../components/work';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

interface Props {
	bookAppStore?: BookAppStore;
}

@inject('bookAppStore') @observer
export class AwardsList extends React.Component<Props, object> {

	@observable currentAward = 'PUL';

	constructor(props: Props) {
		super(props);
		makeObservable(this);
	}

	@action.bound
	onChangeAward(event) {
		this.currentAward = event.target.value;
	}

	renderWork(key: string) {
		return (
			<div>
				<Work workKey={key} checked/>
			</div>
		);
	}

	render() {

		const { bookAppStore: store } = this.props;
		const award = store.awardInfo.get(this.currentAward);
		const booksByYear = award.books;
		const allBookKeys = (Object.values(booksByYear) as string[][]).flat();
		const worksTotal = allBookKeys.length;
		const worksRead = allBookKeys.reduce((total, work) => total + store.getWasRead(work), 0);
		const sortedKeys = award.type == AwardType.ANNUAL ?
			Object.keys(booksByYear).sort((a, b) => Number(b) - Number(a)) :
			Object.keys(booksByYear).sort((a, b) => Number(a) - Number(b));
		const showYearLabel = [AwardType.ANNUAL, AwardType.RANKED].includes(award.type);

		return (
			<React.Fragment>
				<Select
					value={this.currentAward}
					onChange={this.onChangeAward}
				>
					{store.awardList.map(a =>
						<MenuItem key={a.key} value={a.key}>
							{a.name}
						</MenuItem>
					)}
				</Select>
				<p className="awardSummary">
					{worksRead} of {worksTotal} read ({Math.round(worksRead / worksTotal * 100)}%)
				</p>
				{sortedKeys.map(yearKey =>
					booksByYear[yearKey].length === 0
						? (
							<div key={yearKey} className='awardEntry'>
								{showYearLabel && <span className='awardYear'>{yearKey}</span>}
								<div className='book noEntry'>
									<CheckBoxOutlineBlankIcon/>
									<span>(no award)</span>
								</div>
							</div>
						)
						: booksByYear[yearKey].map(bookKey =>
							<div key={`${yearKey}-${bookKey}`} className='awardEntry'>
								{showYearLabel && <span className='awardYear'>{yearKey}</span>}
								{this.renderWork(bookKey)}
							</div>
						)
				)}
			</React.Fragment>
		);
	}
}
