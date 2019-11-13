import React from 'react';
import { observer, inject } from 'mobx-react';
import { BookAppStore } from '../bookAppStore';
import { Book } from './book';
import { SeriesInfoModel } from '../models/model';
import '../styles/bookApp.scss';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

interface Props {
	bookAppStore?: BookAppStore;
	seriesKey: string;
	sublist?: boolean;
	checked?: boolean
}

@inject('bookAppStore') @observer
export class Series extends React.Component<Props, object> {

	renderCheckbox(series: SeriesInfoModel) {
		if (series.readPct === 1) {
			return <CheckBoxIcon/>
		} else if (series.readPct === 0) {
			return <CheckBoxOutlineBlankIcon/>
		} else {
			return <CheckBoxIcon className='partiallyRead'/>
		}
	}

	renderSublist(series: SeriesInfoModel) {
		return (
			series.bookKeys.map(bookKey =>
				<Book key={`${series.key}.${bookKey}`} bookKey={bookKey} subitem checked/>
			)
		);
	}

	render() {

		const { seriesKey, sublist, checked, bookAppStore: store } = this.props;
		const series: SeriesInfoModel = store.getSeries(seriesKey);
		const years = series.yearFirst !== series.yearLast ? `${series.yearFirst} - ${series.yearLast}` : series.yearFirst;
	
		return (
			<div className='book'>
				{checked &&
					this.renderCheckbox(series)
				}
				<span className='title'>{series.title}</span>
				<span className='author'>{store.getAuthorsAsString(series.authorKeys)}</span>
				<span className='year'>{years}</span>
				{sublist &&
					<div>
						{this.renderSublist(series)}
					</div>
				}
			</div>
		);
	}
}
