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
export class AuthorList extends React.Component {

	@observable expanded = {};

	componentDidMount() {
		const { bookAppStore: store } = this.props;
		Object.entries(store.authorList).forEach(author => {
			this.expanded[author[1].books[0].authorKey] = true;
		});
	}

	@action
	onClickPanel = authorKey => () => {
		this.expanded[authorKey] = !this.expanded[authorKey];
	}

	@action
	onExpandAll = expand => {
		for (const authorKey in this.expanded) {
			this.expanded[authorKey] = expand;
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
				{store.authorList.map(author => {
					const authorKey = author.books[0].authorKey;
					return (
						<ExpansionPanel
							key={`${authorKey}-panel`}
							expanded={!!this.expanded[authorKey]}
							classes={{root: 'expansionPanel'}}
							onChange={this.onClickPanel(authorKey)}
						>
							<ExpansionPanelSummary>
								<div className="summaryLeft">{author.name}</div>
								<div className="summaryRight">
									<SummaryAwardTags id={authorKey} list={author.books}/>
									<Badge 
										badgeContent={author.books.length}
										color='primary'
										classes={{ badge: 'summaryBadge', root: 'summaryBadgeRoot' }}
									>
										<div>&nbsp;</div>
									</Badge>
								</div>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails classes={{root: 'expansionDetailsRoot'}}>
								<div className="expansionDetails">
									{author.books.map(book => {
										return (
											<Book key={book.key} book={book}/>
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
