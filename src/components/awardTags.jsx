import React from 'react';
import { inject, observer } from 'mobx-react';
import Badge from '@material-ui/core/Badge';

@inject('bookAppStore') @observer
export class AwardTags extends React.Component {
	render() {
		const { bookAppStore: store, bookKey, awards } = this.props;
		const keys = Object.keys(awards);
		return (
			<span className='awardTags'>
				{ keys.filter(award => store.awards[award].show).map(key => {
					const award = store.awards[key];
					const className = award.type === 'annual' ? 'awardTagAnnual' : 'awardTagTop100';
					return (
						<span key={`${bookKey}-${award.key}`} className={className}>{award.key}</span>
					);
				})}
			</span>
		);
	}
}

@inject('bookAppStore') @observer
export class SummaryAwardTags extends React.Component {
	render() {
		const { bookAppStore: store, list, id } = this.props;
		return (
			store.showingAwards.map(award => 
				<SummaryAwardTag key={`${id}-${award}`} award={award} books={list}/>
			)
		)
	}
}

@inject('bookAppStore') @observer
class SummaryAwardTag extends React.Component {
	render() {
		const { bookAppStore: store, books, award } = this.props;
		const count = books.reduce((accum, book) => accum + (book.awards[award] ? 1 : 0), 0);
		if (count > 0) {
			const className = store.awards[award].type === 'annual' ? 'awardTagAnnual' : 'awardTagTop100';
			return (
				<span>
					<span className={className}>
						{award}&nbsp;({count})
					</span>
				</span>
			);
		}
		return null;
	}
}