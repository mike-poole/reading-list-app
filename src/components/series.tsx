import React from 'react';
import { observer, inject } from 'mobx-react';
import { BookAppStore } from '../bookAppStore';
import { SeriesInfoModel } from '../models/model';
import '../styles/bookApp.scss';

interface Props {
	bookAppStore?: BookAppStore;
	seriesKey: string;
}

@inject('bookAppStore') @observer
export class Series extends React.Component<Props, object> {

	render() {

		const { seriesKey, bookAppStore: store } = this.props;
		const series: SeriesInfoModel = store.getSeries(seriesKey);
		const years = series.yearFirst !== series.yearLast ? `${series.yearFirst} - ${series.yearLast}` : series.yearFirst;
	
		return (
			<div className='book'>
				<span className='title'>{series.title}</span>
				<span className='author'>{store.getAuthorsAsString(series.authorKeys)}</span>
				<span className='year'>{years}</span>
			</div>
		);
	}
}
