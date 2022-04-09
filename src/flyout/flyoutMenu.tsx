import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { AuthorNameFilter } from './authorNameFilter';
import { GenreFilter } from './genreFilter';
import { MinBooksReadFilter } from './minBooksReadFilter';
import { YearRangeFilter } from './yearRangeFilter';
import { AwardSelector } from './awardSelector';
import '../styles/bookApp.scss';

interface Props {
	drawerOpen: boolean;
	closeDrawer: () => void;
}

@observer
export class FlyoutMenu extends React.Component<Props, object> {

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
				<div className="sectionHeading">Filters</div>
				<GenreFilter/>
				<YearRangeFilter/>
				<AuthorNameFilter/>
				<MinBooksReadFilter/>
				<div className="sectionHeading">Tags</div>
				<AwardSelector/>
			</Drawer>
		);
	}

}
