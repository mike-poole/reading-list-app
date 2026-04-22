import React from 'react';
import { observable, action, makeObservable } from 'mobx';
import { inject, observer } from 'mobx-react';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { BookAppStore } from '../bookAppStore';
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
		const { bookAppStore: store } = this.props;
		if (key.indexOf('[NA') >= 0) {
			return (
				<div className='book noEntry'>
					<CheckBoxOutlineBlankIcon/>
					<span>[No award]</span>
				</div>
			);
		} else {
			return (
				<div>
					<Work workKey={key} checked/>
				</div>
			);
		}

	}

	render() {

		const { bookAppStore: store } = this.props;
		const worksTotal = Object.keys(store.awardInfo.get(this.currentAward).books).length;
		const worksRead = Object.keys(store.awardInfo.get(this.currentAward).books).reduce(
			(total, work) => total + store.getWasRead(work), 0
		);

		return (
			<React.Fragment>
				<Select
					value={this.currentAward}
					onChange={this.onChangeAward}
				>
					{store.awardList.map(award =>
						<MenuItem key={award.key} value={award.key}>
							{award.name}
						</MenuItem>
					)}
				</Select>
				<p className="awardSummary">
					{worksRead} of {worksTotal} read ({Math.round(worksRead / worksTotal * 100)}%)
				</p>
				{Object.keys(store.awardInfo.get(this.currentAward).books).map(bookKey =>
					<div key={bookKey}>
						{this.renderWork(bookKey)}
					</div>
				)}
			</React.Fragment>
		);
	}
}
