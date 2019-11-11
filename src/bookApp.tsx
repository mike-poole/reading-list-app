import React from 'react';
import { observable, action } from 'mobx';
import { Provider, observer } from 'mobx-react';
import classNames from 'classnames';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar'
import MenuIcon from '@material-ui/icons/Menu';
import { BookAppStore } from './bookAppStore';
import { FlyoutMenu } from './flyout/flyoutMenu';
import { ReadingList } from './pages/readingList';
import { AuthorList } from './pages/authorList';
import { BookList } from './pages/bookList';
import { AwardsList } from './pages/awardsList';
import './styles/bookApp.scss';

interface Props {

}

@observer
export class BookApp extends React.Component<Props, object> {

	@observable store;
	@observable activeTab = 0;
	@observable drawerOpen = false;

	constructor(props) {
		super(props);
		this.store = new BookAppStore();
	}

	@action
	onClickTab = (event, value) => {
		this.activeTab = value;
	}

	@action
	openDrawer = () => {
		this.drawerOpen = true;
	}

	@action
	closeDrawer = () => {
		this.drawerOpen = false;
	}

	render() {
		const contentAreaClasses = classNames(
			'contentArea', { 'contentAreaShifted': this.drawerOpen }
		);
		const appBarClasses = classNames(
			'appBar', { 'appBarShifted': this.drawerOpen }
		);
		return (
			<Provider bookAppStore={this.store}>
				<div>
					<FlyoutMenu drawerOpen={this.drawerOpen} closeDrawer={this.closeDrawer}/>

					<AppBar classes={{root: appBarClasses}} >
						<Toolbar>
							<IconButton onClick={this.openDrawer} disabled={this.drawerOpen}>
								<MenuIcon color='action'/>
							</IconButton>
							<Tabs value={this.activeTab} onChange={this.onClickTab}>
								<Tab label="Reading List"/>
								<Tab label="Authors"/>
								<Tab label="Books"/>
								<Tab label="Awards"/>
							</Tabs>
						</Toolbar>
					</AppBar>

					<div className={contentAreaClasses}>
						{ this.activeTab === 0 &&
							<ReadingList/>
						}
						{ this.activeTab === 1 &&
							<AuthorList/>
						}
						{ this.activeTab === 2 &&
							<BookList/>
						}
						{ this.activeTab === 3 &&
							<AwardsList/>
						}
					</div>
				</div>
			</Provider>
		);
	}

}
