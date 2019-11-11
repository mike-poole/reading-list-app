import React from 'react';
import { inject, observer } from 'mobx-react';
import { BookAppStore } from '../bookAppStore';
import { BookInfoModel } from '../models/model';

interface Props {
	bookAppStore?: BookAppStore;
	bookKey: string;
	awards: string[];
}

@inject('bookAppStore') @observer
export class AwardTags extends React.Component<Props, object> {
	render() {
		const { bookAppStore: store, bookKey, awards } = this.props;
		const keys = Object.values(awards);
		return (
			<span className='awardTags'>
				{ keys.filter(award => store.filters.award[award]).map(key => {
					const award = store.awardInfo.get(key);
					const className = award.type === 'annual' ? 'awardTagAnnual' : 'awardTagTop100';
					return (
						<span key={`${bookKey}-${award.key}`} className={className}>{award.key}</span>
					);
				})}
			</span>
		);
	}
}

interface SummaryAwardTagsProps {
	bookAppStore?: BookAppStore;
	id: string;
	books: BookInfoModel[];
}

@inject('bookAppStore') @observer
export class SummaryAwardTags extends React.Component<SummaryAwardTagsProps, object> {
	render() {
		const { bookAppStore: store, books, id } = this.props;
		return (
			store.taggedAwards.map(award => 
				<SummaryAwardTag key={`${id}-${award}`} award={award} books={books}/>
			)
		)
	}
}

interface SummaryAwardTagProps {
	bookAppStore?: BookAppStore;
	books: BookInfoModel[];
	award: string;
}

@inject('bookAppStore') @observer
class SummaryAwardTag extends React.Component<SummaryAwardTagProps, object> {
	render() {
		const { bookAppStore: store, books, award } = this.props;
		const count = books.reduce((accum, book) => accum + (book.awards.includes(award) ? 1 : 0), 0);
		if (count > 0) {
			const className = store.awardInfo.get(award).type === 'annual' ? 'awardTagAnnual' : 'awardTagTop100';
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