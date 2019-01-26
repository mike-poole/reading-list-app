import React from 'react';
import { inject, observer } from 'mobx-react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import '../styles/bookApp.scss';

@inject('bookAppStore') @observer
export class GenreSelector extends React.Component {

	onChange = key => event => {
		this.props.bookAppStore.toggleGenre(key);
	}

	render() {
		const { bookAppStore: store } = this.props;
		return (
			<div className='flyoutSection'>
				<span className='heading'>Show Genres</span>
				<Divider/>
				<FormGroup classes={{root: 'checkboxList'}}>
				{ store.genreList.map(genre =>
					<FormControlLabel
						key={genre.key}
						label={genre.name} 
						classes={{ root: 'awardSelectorItem' }}
						control={
							<Checkbox
								value={genre.key}
								checked={store.genres[genre.key].show}
								onChange={this.onChange(genre.key)}
							/>
						}
					/>
				)}
				</FormGroup>
			</div>
		);
	}
}