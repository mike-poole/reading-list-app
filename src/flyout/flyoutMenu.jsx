import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { AwardSelector } from './awardSelector.jsx';
import { GenreSelector } from './genreSelector.jsx';
import { YearRangeSelector } from './yearRangeSelector.jsx';
import '../styles/bookApp.scss';

@observer
export class FlyoutMenu extends React.Component {

	@observable drawerOpen = false;

	renderHeader() {
		return (
			<div className="flyoutHeader">
				<IconButton onClick={this.props.closeDrawer}>
					<ChevronLeftIcon />
				</IconButton>
			</div>
		);
}

	render() {
		const { drawerOpen, closeDrawer } = this.props;
		return (
			<Drawer
				variant='persistent'
				anchor='left'
				open={drawerOpen}
				onClose={closeDrawer}
				classes={{paper: 'flyoutPaper'}}
			>
				{this.renderHeader()}
				<GenreSelector/>
				<YearRangeSelector/>
				<AwardSelector/>
			</Drawer>
		);
	}

}
