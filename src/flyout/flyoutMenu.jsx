import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Drawer from '@material-ui/core/Drawer';
import { AwardSelector } from './awardSelector.jsx';
import { GenreSelector } from './genreSelector.jsx';
import '../styles/bookApp.scss';

@observer
export class FlyoutMenu extends React.Component {

	@observable drawerOpen = false;

	render() {
		const { drawerOpen, closeDrawer } = this.props;
		return (
			<Drawer
				variant='temporary'
				anchor='left'
				open={drawerOpen}
				onClose={closeDrawer}
				classes={{paper: 'flyoutPaper'}}
			>
				<AwardSelector/>
				<GenreSelector/>
			</Drawer>
		);
	}

}
