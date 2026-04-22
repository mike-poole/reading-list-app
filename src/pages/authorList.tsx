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

interface Props {
	bookAppStore?: BookAppStore;
}

@inject('bookAppStore') @observer
export class AuthorList extends React.Component<Props, object> {

	@observable expanded: Map<string, boolean> = new Map();

	constructor(props: Props) {
		super(props);
		makeObservable(this);
	}

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
					const books = store.filter(author.booksRead);
					return (books.length >= (store.filters.minBooksRead || 1) &&
						<Accordion
							key={`${author.key}-panel`}
							expanded={!!this.expanded.get(author.key)}
							classes={{root: 'expansionPanel'}}
							onChange={this.onClickPanel(author.key)}
						>
							<AccordionSummary>
								<div className="summaryLeft">{author.alphaName}</div>
								<div className="summaryRight">
									<SummaryAwardTags id={author.key} books={author.booksRead}/>
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
											<Book key={book.key} bookKey={book.key}/>
										)
									})}
								</div>
							</AccordionDetails>
						</Accordion>
					)
				})}
			</div>
		);
	}
}
