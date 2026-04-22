import React from 'react';
import { observable, action, computed, makeObservable } from 'mobx';
import { inject, observer } from 'mobx-react';
import Button from '@material-ui/core/Button';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import { BookAppStore } from '../bookAppStore';
import { Book } from '../components/book';
import { SummaryAwardTags } from '../components/awardTags';
import '../styles/bookApp.scss';
import { Badge } from '@material-ui/core';
import { ReadingListInfo } from '../models/model';

interface Props {
	bookAppStore?: BookAppStore;
}

@inject('bookAppStore') @observer
export class ReadingList extends React.Component<Props, object> {

	@observable expanded: Map<string, boolean> = new Map();

	constructor(props: Props) {
		super(props);
		makeObservable(this);
	}

	componentDidMount() {
		const { bookAppStore: store } = this.props;
		store.readingListInfo.forEach(value => {
			this.expanded.set(value.year, true);
		});
	}

	@action
	onClickPanel = year => () => {
		this.expanded.set(year, !this.expanded.get(year));
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

	renderPanel(entry: ReadingListInfo) {
		const { bookAppStore: store } = this.props;
		const books = store.filter(entry.books);
		return (books.length > 0 &&
			<Accordion
				key={`${entry.year}-panel`}
				expanded={!!this.expanded.get(entry.year)}
				classes={{root: 'expansionPanel'}}
				onChange={this.onClickPanel(entry.year)}
			>
				<AccordionSummary>
					<div className="summaryLeft">{entry.year}</div>
					<div className="summaryRight">
						<SummaryAwardTags id={entry.year} books={entry.books}/>
						<Badge 
							badgeContent={books.length}
							color='primary'
							classes={{ badge: 'summaryBadge', root: 'summaryBadgeRoot' }}
						>
							<div>&nbsp;</div>
						</Badge>
					</div>
				</AccordionSummary>
				<AccordionDetails classes={{root: 'expansionDetailsRoot'}}>
					<div className="expansionDetails">
						{books.map(book => {
							return (
								<Book key={`${entry.year}-${book.key}`} bookKey={book.key}/>
							)
						})}
					</div>
				</AccordionDetails>
			</Accordion>
		);
	}

	render() {

		const { bookAppStore: store } = this.props;

		return (
			<div>
				<div className='buttonBar'>
					<Button disabled={this.allExpanded} onClick={() => this.onExpandAll(true)}>Expand All</Button>
					<Button disabled={this.allCollapsed} onClick={() => this.onExpandAll(false)}>Collapse All</Button>
				</div>
				{Array.from(store.readingListInfo.values()).map(entry =>
					this.renderPanel(entry)
				)}
			</div>
		);
	}
}
