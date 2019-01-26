import React from 'react';
import { computed, observable, action } from 'mobx';
import Authors from '../data/authors.json';
import Books from '../data/books.json';
import ReadingList from '../data/readingList.json';
import Series from '../data/series.json';
import Awards from '../data/awards.json';

export class BookAppStore extends React.Component {

	@observable awards = {};
	bookInfo = {};
	
	constructor() {
		super();
		for (let award in Awards) {
			this.awards[Awards[award].abbr] = {
				key: Awards[award].abbr,
				type: Awards[award].type,
				show: false
			}
		}
		for (let bookKey in Books) {
			const book = Books[bookKey];
			this.bookInfo[bookKey] = {
				key: bookKey,
				title: book.name,
				alphaTitle: this.getBookAlphabeticalTitle(book.name),
				authorKey: book.author,
				authorName: this.getAuthorsAsString(book.author),
				year: book.year,
				category: book.cat,
				awards: this.getBookAwards(bookKey),
				yearsRead: this.getBookYearsRead(bookKey),
				series: this.getBookSeries(bookKey)
			}
		}
	}

	@computed
	get showingAwards() {
		return Object.entries(this.awards).filter(([_, award]) => award.show).map(([key]) => key);
	}

	@computed
	get bookList() {
		let books = Object.entries(this.bookInfo).map(entry => entry[1]).filter(book => book.yearsRead.length > 0);
		books.sort((a, b) => a.alphaTitle < b.alphaTitle ? -1 : 1);
		return books;
	}

	@computed
	get authorMap() {
		const books = Object.entries(this.bookInfo).map(entry => entry[1]).filter(book => book.yearsRead.length > 0);
		let authorMap = {};
		books.forEach(book => {
			const authorArr = Array.isArray(book.authorKey) ? book.authorKey : [book.authorKey];
			authorArr.forEach(authKey => {
				const curAuthBookList = authorMap[authKey] || [];
				curAuthBookList.push(book)
				authorMap[authKey] = curAuthBookList;
			});
		});
		return authorMap;
	}

	@computed
	get authorList() {
		const list = Object.entries(this.authorMap).map((entry) => { return { name: this.getAuthorAsString(entry[0], false), books: entry[1]}});
		list.sort((a, b) => a.name < b.name ? -1 : 1);
		return list;
	}

	get authorInfo() {
		let authors = [];
		for (const key in Authors) {
			const author = Authors[key];
			author.key = key;
			authors.push(author);
		}
		authors.sort((a, b) => a.lastName < b.lastName ? -1 : 1);
		return authors;
	}

	@computed
	get readingList() {
		const readingList = {}
		for (const year in ReadingList) {
			const books = ReadingList[year].map(book => this.bookInfo[book]);
			readingList[year] = { books, count: books.length };
		}

		return readingList;
	}

	@computed
	get awardList() {
		let awards = [];
		for (const awardKey in Awards) {
			const award = Awards[awardKey];
			awards.push({
				key: award.abbr,
				name: award.name
			});
		}
		return awards;
	}

	@action
	toggleAward(awardKey) {
		const changed = {};
		changed[awardKey] = {
			...this.awards[awardKey],
			show: !this.awards[awardKey].show
		}
		this.awards = { ...this.awards, ...changed };
	}

	getBook(bookKey) {
		return this.bookInfo[bookKey];
	}

	getBookAwards(bookKey) {
		let awards = {};
		for (let award in Awards) {
			const hasAward = Awards[award].list[bookKey];
			if (hasAward) {
				awards[Awards[award].abbr] = hasAward;
			}
		}
		return awards;
	}

	getBookYearsRead(bookKey) {
		let years = [];
		for (const year in ReadingList) {
			if (ReadingList[year].includes(bookKey)) {
				years.push(Number(year));
			}
		}
		return years;
	}

	getBookSeries(bookKey) {
		for (const seriesKey in Series) {
			if (Series[seriesKey].books.includes(bookKey)) {
				const seriesBooks = Series[seriesKey].books;
				const seriesInfo = {
					key: seriesKey,
					size: seriesBooks.length,
					isLast: seriesBooks[seriesBooks.length - 1] === bookKey
				}
				return seriesInfo;
			}
		}
		return undefined;
	}

	getBookAlphabeticalTitle(title) {
		const firstSpace = title.indexOf(' ');
		if (firstSpace > 0) {
			const firstWord = title.slice(0, firstSpace);
			if (firstWord === 'The' || firstWord === 'A' || firstWord === 'An') {
				return title.slice(firstSpace + 1) + ', ' + firstWord;
			}
		}
		return title;
	}
 
	getAuthorsAsString(author, firstNameFirst = true) {
		let s;
		const authorArr = Array.isArray(author) ? author : [author];
		authorArr.forEach(authKey => {
			const auth = Authors[authKey];
			s = s === undefined ? '' : s + ' and ';
			s += firstNameFirst ? 
					auth.firstName + ' ' + auth.lastName :
					auth.lastName + ', ' + auth.firstName;
		});
		return s;
	}

	getAuthorAsString(authorKey, firstNameFirst = true) {
		const auth = Authors[authorKey];
		if (firstNameFirst) {
			return auth.firstName + ' ' + auth.lastName;
		} else {
			return auth.lastName + ', ' + auth.firstName;
		}
	}

}