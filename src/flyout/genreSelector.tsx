import React from 'react';
import { inject, observer } from 'mobx-react';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Divider from '@material-ui/core/Divider';
import { BookAppStore } from '../bookAppStore';
import '../styles/bookApp.scss';

interface Props {
	bookAppStore?: BookAppStore;
}

@inject('bookAppStore') @observer
export class GenreSelector extends React.Component<Props, object> {

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
				{ Array.from(store.genreInfo.values()).map(genre =>
					<FormControlLabel
						key={genre.key}
						label={genre.name} 
						classes={{ root: 'awardSelectorItem' }}
						control={
							<Checkbox
								value={genre.key}
								checked={store.filters.genre[genre.key]}
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