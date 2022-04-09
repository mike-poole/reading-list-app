import React from 'react';
import { inject, observer } from 'mobx-react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { BookAppStore } from '../bookAppStore';
import '../styles/bookApp.scss';

interface Props {
	bookAppStore?: BookAppStore;
}

@inject('bookAppStore') @observer
export class AwardSelector extends React.Component<Props, object> {

	onChange = key => event => {
		this.props.bookAppStore.toggleAward(key);
	}

	render() {
		const { bookAppStore: store } = this.props;
		return (
			<div className='flyoutSection'>
				<FormGroup classes={{root: 'checkboxList'}}>
				{ store.awardList.map(award =>
					<FormControlLabel
						key={award.key}
						label={award.name} 
						classes={{ root: 'awardSelectorItem' }}
						control={
							<Checkbox
								value={award.key}
								checked={store.filters.award[award.key]}
								onChange={this.onChange(award.key)}
							/>
						}
					/>
				)}
				</FormGroup>
			</div>
		);
	}
}