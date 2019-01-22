import React from 'react';
import { inject, observer } from 'mobx-react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import '../styles/bookApp.scss';

@inject('bookAppStore') @observer
export class AwardSelector extends React.Component {

	onChange = key => event => {
		this.props.bookAppStore.toggleAward(key);
	}

	render() {
		const { bookAppStore: store } = this.props;
		return (
			<div>
				<span className='heading'>Award Tags</span>
				<Divider/>
				<FormGroup classes={{root: 'checkboxList'}}>
				{ store.awardList.map(award =>
					<FormControlLabel
						key={award.key}
						label={award.name} 
						classes={{ root: 'awardSelectorItem' }}
						control={
							<Checkbox
								value={award.key}
								checked={store.awards[award.key].show}
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