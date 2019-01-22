import React from 'react';
import { observable, action } from 'mobx';
import { Provider, observer } from 'mobx-react';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Toolbar from '@material-ui/core/Toolbar'
import MenuIcon from '@material-ui/icons/Menu';
import { BookAppStore } from './bookAppStore';
import { FlyoutMenu } from './flyout/flyoutMenu.jsx';
import { ReadingList } from './pages/readingList.jsx';
import { AuthorList } from './pages/authorList.jsx';
import { BookList } from './pages/bookList.jsx';
import './styles/bookApp.scss';

@observer
export class BookApp extends React.Component {

	@observable store;
	@observable activeTab = 0;
	@observable drawerOpen = false;

	constructor() {
		super();
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
		return (
			<Provider bookAppStore={this.store}>
				<div>
					<FlyoutMenu drawerOpen={this.drawerOpen} closeDrawer={this.closeDrawer}/>

					<AppBar>
						<Toolbar>
							<IconButton onClick={this.openDrawer}>
								<MenuIcon color='action'/>
							</IconButton>
							<Tabs value={this.activeTab} onChange={this.onClickTab}>
								<Tab label="Reading List"/>
								<Tab label="Authors"/>
								<Tab label="Books"/>
							</Tabs>
						</Toolbar>
					</AppBar>

					<div className='contentArea'>
						{ this.activeTab === 0 &&
							<ReadingList/>
						}
						{ this.activeTab === 1 &&
							<AuthorList/>
						}
						{ this.activeTab === 2 &&
							<BookList/>
						}
					</div>
				</div>
			</Provider>
		);
	}

}
