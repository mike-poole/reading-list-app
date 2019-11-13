import React from 'react';
import { observer, inject } from 'mobx-react';
import { BookAppStore } from '../bookAppStore';
import { Book } from './book';
import { Series } from './series';
import '../styles/bookApp.scss';

interface Props {
	bookAppStore?: BookAppStore;
	workKey: string;
	checked?: boolean;
}

@inject('bookAppStore') @observer
export class Work extends React.Component<Props, object> {

	render() {

		const { bookAppStore: store, workKey } = this.props;

		if (store.seriesInfo.has(workKey)) {
			return (
				<Series key={workKey} seriesKey={workKey} sublist checked/>
			);
		} else {
			return (
				<Book key={workKey} bookKey={workKey} checked/>
			)
		}
	}
}
