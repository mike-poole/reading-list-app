import React from 'react';
import { observable, action, computed } from 'mobx';
import { inject, observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { BookAppStore } from '../bookAppStore';
import { Book } from '../components/book';
import { SummaryAwardTags } from '../components/awardTags';
import '../styles/bookApp.scss';
import { Badge } from '@material-ui/core';

interface Props {
	bookAppStore?: BookAppStore;
}

@inject('bookAppStore') @observer
export class AuthorList extends React.Component<Props, object> {

	@observable expanded: Map<string, boolean> = new Map();

	componentDidMount() {
		const { bookAppStore: store } = this.props;
		store.authorList.forEach(author => {
			this.expanded.set(author.key, true);
		})
	}

	@action
	onClickPanel = authorKey => () => {
		this.expanded.set(authorKey, !this.expanded.get(authorKey));
	}

	@action
	onExpandAll = expand => {
		this.expanded.forEach((_, key) => {
			this.expanded.set(key, expand);
		});
	}

	@computed
	get allExpanded(): boolean {
		return Array.from(this.expanded.values()).reduce((accum, expanded) => expanded && accum, true);
	}

	@computed
	get allCollapsed(): boolean {
		return Array.from(this.expanded.values()).reduce((accum, expanded) => !expanded && accum, true);
	}

	render() {

		const { bookAppStore: store } = this.props;

		return (
			<div>
				<div className='buttonBar'>
					<Button disabled={this.allExpanded} onClick={() => this.onExpandAll(true)}>Expand All</Button>
					<Button disabled={this.allCollapsed} onClick={() => this.onExpandAll(false)}>Collapse All</Button>
				</div>
				{store.authorList.map(author => {
					return (
						<ExpansionPanel
							key={`${author.key}-panel`}
							expanded={!!this.expanded.get(author.key)}
							classes={{root: 'expansionPanel'}}
							onChange={this.onClickPanel(author.key)}
						>
							<ExpansionPanelSummary>
								<div className="summaryLeft">{author.alphaName}</div>
								<div className="summaryRight">
									<SummaryAwardTags id={author.key} books={author.booksRead}/>
									<Badge 
										badgeContent={store.filter(author.booksRead).length}
										color='primary'
										classes={{ badge: 'summaryBadge', root: 'summaryBadgeRoot' }}
									>
										<div>&nbsp;</div>
									</Badge>
								</div>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails classes={{root: 'expansionDetailsRoot'}}>
								<div className="expansionDetails">
									{store.filter(author.booksRead).map(book => {
										return (
											<Book key={book.key} bookKey={book.key}/>
										)
									})}
								</div>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					)
				})}
			</div>
		);
	}
}
