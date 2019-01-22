import React from 'react';
import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { Book } from '../components/book.jsx';
import { SummaryAwardTags } from '../components/awardTags.jsx';
import '../styles/bookApp.scss';
import { Badge } from '@material-ui/core';

@inject('bookAppStore') @observer
export class ReadingList extends React.Component {

	@observable expanded = {};

	componentDidMount() {
		const { bookAppStore: store } = this.props;
		Object.keys(store.readingList).forEach(year => {
			this.expanded[year] = true;
		});
	}

	@action
	onClickPanel = year => () => {
		this.expanded[year] = !this.expanded[year];
	}

	@action
	onExpandAll = expand => {
		for (const year in this.expanded) {
			this.expanded[year] = expand;
		}
	}

	@computed
	get allExpanded() {
		return Object.entries(this.expanded).map(entry => entry[1]).reduce((accum, expanded) => expanded && accum, true);
	}

	@computed
	get allCollapsed() {
		return Object.entries(this.expanded).map(entry => entry[1]).reduce((accum, expanded) => !expanded && accum, true);
	}

	render() {

		const { bookAppStore: store } = this.props;

		return (
			<div>
				<div className='buttonBar'>
					<Button disabled={this.allExpanded} onClick={() => this.onExpandAll(true)}>Expand All</Button>
					<Button disabled={this.allCollapsed} onClick={() => this.onExpandAll(false)}>Collapse All</Button>
				</div>
				{Object.keys(store.readingList).map(year =>
					<ExpansionPanel
						key={`${year}-panel`}
						expanded={!!this.expanded[year]}
						classes={{root: 'expansionPanel'}}
						onChange={this.onClickPanel(year)}
					>
						<ExpansionPanelSummary>
							<div className="summaryLeft">{year}</div>
							<div className="summaryRight">
								<SummaryAwardTags year={year}/>
								{/* <span className="summaryTotal">
									{store.readingList[year].count}
								</span> */}

								<Badge 
									badgeContent={store.readingList[year].count}
									color='primary'
									classes={{ badge: 'summaryBadge', root: 'summaryBadgeRoot' }}
								>
									<div>&nbsp;</div>
								</Badge>
							</div>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails classes={{root: 'expansionDetailsRoot'}}>
							<div className="expansionDetails">
								{store.readingList[year].books.map(book => {
									return (
										<Book key={book.key} book={book}/>
									)
								})}
							</div>
						</ExpansionPanelDetails>
					</ExpansionPanel>
				)}
			</div>
		);
	}
}
