import React from 'react';
import { computed, observable, action, autorun } from 'mobx';
import { AwardData, AuthorData, BookData, GenreData,
	BookInfoModel, AuthorInfoModel, ReadingListInfo, SeriesInfoModel, GenreInfoModel, AwardInfoModel,
	FilterModel, GenreType } from './models/model';
import * as Authors from '../data/authors.json';
import * as Books from '../data/books.json';
import * as ReadingList from '../data/readingList.json';
import * as Series from '../data/series.json';
import * as Awards from '../data/awards.json';
import * as Genres from '../data/genres.json';

export class BookAppStore {

	@observable bookInfo: Map<string, BookInfoModel> = new Map();
	@observable awardInfo: Map<string, AwardInfoModel> = new Map();
	@observable authorInfo: Map<string, AuthorInfoModel> = new Map();
	@observable genreInfo: Map<string, GenreInfoModel> = new Map();
	@observable readingListInfo: Map<string, ReadingListInfo> = new Map();

	@observable readingListData = {};
	@observable seriesData = {};

	@observable filters: FilterModel = {};
	
	constructor() {

		this.filters.award = {};  // map of string -> boolean
		this.filters.genre = {};  // map of GenreKey -> boolean

		this.readingListData = JSON.parse(JSON.stringify(ReadingList)).default;
		this.seriesData = JSON.parse(JSON.stringify(Series)).default;

		const authorData: AuthorData[] = JSON.parse(JSON.stringify(Authors)).default;
		const bookData: BookData[] = JSON.parse(JSON.stringify(Books)).default;
		const awardData: AwardData[] = JSON.parse(JSON.stringify(Awards)).default;
		const genreData: GenreData[] = JSON.parse(JSON.stringify(Genres)).default;

		for (const award in awardData) {
			const abbr: string = awardData[award].abbr;
			const awardInfo: AwardInfoModel = {
				key: abbr,
				type: awardData[award].type,
				name: awardData[award].name,
				books: awardData[award].list
			}
			this.awardInfo.set(abbr, awardInfo);
			this.filters.award[abbr] = false;
		}

		for (const genre in genreData) {
			const genreInfo: GenreInfoModel = {
				key: genre as GenreType,
				name: genreData[genre].name
			}
			this.genreInfo.set(genre, genreInfo);
			this.filters.genre[genreInfo.key] = true;
		}

		for (const authorKey in authorData) {
			const author = authorData[authorKey];
			const authorInfo: AuthorInfoModel = {
				key: authorKey,
				name: `${author.firstName} ${author.lastName}`,
				alphaName: `${author.lastName}, ${author.firstName}`,
				sex: author.sex,
				born: author.born,
				died: author.died,
				books: [],
				booksRead: [],
				read: false
			}
			this.authorInfo.set(authorKey, authorInfo);
		}

		for (const bookKey in bookData) {
			const book: BookData = bookData[bookKey];
			const yearsRead = this.getBookYearsRead(bookKey);
			const wasRead = yearsRead.length > 0;
			const bookInfo: BookInfoModel = {
				key: bookKey,
				title: book.name,
				alphaTitle: this.getBookAlphabeticalTitle(book.name),
				authorKey: book.author,
				authorName: this.getAuthorsAsString(book.author),
				year: book.year,
				genre: book.cat,
				awards: this.getBookAwards(bookKey),
				series: this.getBookSeries(bookKey),
				yearsRead
			}
			this.bookInfo.set(bookKey, bookInfo);

			const authorArr = Array.isArray(book.author) ? book.author : [book.author];
			authorArr.forEach(authorKey => {
				const author = this.authorInfo.get(authorKey);
				author.books.push(bookInfo);
				if (wasRead) {
					author.booksRead.push(bookInfo);
					author.read = true;
				}
			});
		}

		for (const yearKey in this.readingListData) {
			const readingListInfo: ReadingListInfo = {
				year: yearKey,
				books: this.readingListData[yearKey].map(bookKey => this.bookInfo.get(bookKey)),
				count: this.readingListData[yearKey].length
			};
			this.readingListInfo.set(yearKey, readingListInfo);
		}
	}

	@computed
	get taggedAwards() {
		return Object.entries(this.filters.award).filter(([_, show]) => show).map(([key]) => key);
	}

	@computed
	get filteredBooks() {
		const books = Array.from(this.bookInfo.values())
					.filter(book => book.yearsRead.length > 0);
		return this.filter(books);
	}

	filter(books: BookInfoModel[]) {
		let filteredBooks = books.filter(book => this.filters.genre[book.genre]);
		if (this.filters.yearStart) {
			filteredBooks = filteredBooks.filter(book => book.year >= this.filters.yearStart);
		}
		if (this.filters.yearEnd) {
			filteredBooks = filteredBooks.filter(book => book.year <= this.filters.yearEnd);
		}
		return filteredBooks;
	}

	@computed
	get bookList(): BookInfoModel[] {
		const books = this.filteredBooks;
		books.sort((a, b) => a.alphaTitle < b.alphaTitle ? -1 : 1);
		return books;
	}

	@computed
	get genreList(): GenreInfoModel[] {
		return Object.entries(this.genreInfo).map(entry => entry[1]);
	}

	@computed
	get authorList(): AuthorInfoModel[] {
		const readAuthors = Array.from(this.authorInfo.values()).filter(author => author.read);
		readAuthors.sort((a, b) => a.alphaName < b.alphaName ? -1 : 1);
		return readAuthors;
	}

	@computed
	get awardList() {
		return Array.from(this.awardInfo.values());
	}

	@action.bound
	toggleAward(awardKey: string) {
		const awardFlag: boolean = this.filters.award[awardKey] || false;
		delete this.filters.award[awardKey];
		this.filters.award[awardKey] = !awardFlag;
	}

	@action.bound
	toggleGenre(genreKey: GenreType) {
		const genreFlag: boolean = this.filters.genre[genreKey] || false;
		this.filters.genre[genreKey] = !genreFlag;
	}

	@action
	setYearStartFilter(year: number) {
		this.filters.yearStart = year;
	}

	@action
	setYearEndFilter(year: number) {
		this.filters.yearEnd = year;
	}

	getBook(bookKey: string): BookInfoModel {
		return this.bookInfo[bookKey];
	}

	getBookAwards(bookKey: string): string[] {
		let awards: string[] = [];
		this.awardInfo.forEach(award => {
			if (award.books[bookKey]) {
				awards.push(award.key);
			}
		});
		return awards;
	}

	getBookYearsRead(bookKey: string): number[] {
		let years: number[] = [];
		for (const year in this.readingListData) {
			if (this.readingListData[year].includes(bookKey)) {
				years.push(Number(year));
			}
		}
		return years;
	}

	getBookSeries(bookKey: string): SeriesInfoModel {
		for (const seriesKey in this.seriesData) {
			const series = this.seriesData[seriesKey];
			if (series.books.includes(bookKey)) {
				const seriesBooks = series.books;
				const seriesInfo: SeriesInfoModel = {
					key: seriesKey,
					size: seriesBooks.length,
					isLast: seriesBooks[seriesBooks.length - 1] === bookKey
				}
				return seriesInfo;
			}
		}
		return undefined;
	}

	getBookAlphabeticalTitle(title: string): string {
		const firstSpace = title.indexOf(' ');
		if (firstSpace > 0) {
			const firstWord = title.slice(0, firstSpace);
			if (firstWord === 'The' || firstWord === 'A' || firstWord === 'An') {
				return title.slice(firstSpace + 1) + ', ' + firstWord;
			}
		}
		return title;
	}
 
	getAuthorsAsString(author: string | string[], firstNameFirst = true): string {
		let s: string;
		const authorArr = Array.isArray(author) ? author : [author];
		return authorArr.reduce((s, key) => `${s}${s.length > 0 ? ' and ' : ''}${this.authorInfo.get(key)[firstNameFirst ? 'name' : 'alphaName']}`, '')
	}

	getAuthorAsString(authorKey: string, firstNameFirst = true): string {
		const author = this.authorInfo.get(authorKey);
		return firstNameFirst ? author.name : author.alphaName;
	}

}