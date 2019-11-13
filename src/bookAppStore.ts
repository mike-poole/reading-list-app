import React from 'react';
import { computed, observable, action, autorun } from 'mobx';
import { AwardData, AuthorData, BookData, GenreData, SeriesData,
	BookInfoModel, AuthorInfoModel, ReadingListInfo, SeriesInfoModel, GenreInfoModel, AwardInfoModel,
	BookSeriesInfoModel, FilterModel, GenreType } from './models/model';
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
	@observable seriesInfo: Map<string, SeriesInfoModel> = new Map();
	@observable readingListInfo: Map<string, ReadingListInfo> = new Map();

	@observable filters: FilterModel = {};
	
	constructor() {

		this.filters.award = {};  // map of string -> boolean
		this.filters.genre = {};  // map of GenreKey -> boolean

		const authorData = JSON.parse(JSON.stringify(Authors)).default;
		const bookData = JSON.parse(JSON.stringify(Books)).default;
		const awardData = JSON.parse(JSON.stringify(Awards)).default;
		const genreData = JSON.parse(JSON.stringify(Genres)).default;
		const seriesData = JSON.parse(JSON.stringify(Series)).default;
		const readingListData = JSON.parse(JSON.stringify(ReadingList)).default;

		for (const awardKey in awardData) {
			const award: AwardData = awardData[awardKey];
			const awardInfo: AwardInfoModel = {
				key: award.abbr,
				type: award.type,
				name: award.name,
				books: award.list
			}
			this.awardInfo.set(award.abbr, awardInfo);
			this.filters.award[award.abbr] = false;
		}

		for (const genreKey in genreData) {
			const genre: GenreData = genreData[genreKey];
			const genreInfo: GenreInfoModel = {
				key: genreKey as GenreType,
				name: genre.name
			}
			this.genreInfo.set(genreKey, genreInfo);
			this.filters.genre[genreInfo.key] = true;
		}

		for (const authorKey in authorData) {
			const author: AuthorData = authorData[authorKey];
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
			const bookInfo: BookInfoModel = {
				key: bookKey,
				title: book.name,
				alphaTitle: this.getBookAlphabeticalTitle(book.name),
				authorKeys: Array.isArray(book.author) ? book.author : [book.author],
				authorName: this.getAuthorsAsString(book.author),
				year: book.year,
				genre: book.cat,
				awards: this.getBookAwards(bookKey),
				series: undefined,
				yearsRead: []
			}
			this.bookInfo.set(bookKey, bookInfo);

			bookInfo.authorKeys.forEach(authorKey => {
				const author = this.authorInfo.get(authorKey);
				author.books.push(bookInfo);
			});
		}

		for (const yearKey in readingListData) {
			const bookKeys: string[] = readingListData[yearKey];
			const readingListInfo: ReadingListInfo = {
				year: yearKey,
				books: bookKeys.map(bookKey => this.bookInfo.get(bookKey)),
				count: bookKeys.length
			};
			this.readingListInfo.set(yearKey, readingListInfo);

			bookKeys.forEach(bookKey => {
				const book = this.bookInfo.get(bookKey);
				book.yearsRead.push(Number(yearKey));
				book.authorKeys.forEach(authorKey => {
					const author = this.authorInfo.get(authorKey);
					if (!author.booksRead.includes(book)) {
						author.booksRead.push(book);
					}
					author.read = true;
				});
			});
		}

		for (const seriesKey in seriesData) {
			const series: SeriesData = seriesData[seriesKey];
			const size = series.books.length;
			const percent = 100 / size;
			let readSize = 0;
			let years: number[] = [];
			const bookSeriesInfo: BookSeriesInfoModel = {
				key: seriesKey,
				percent,
				isLast: false
			}
			const seriesAuthorKeys: string[] = [];
			series.books.forEach(bookKey => {
				const book = this.bookInfo.get(bookKey);
				book.series = bookSeriesInfo;
				book.series.isLast = bookKey === series.books[size - 1];
				book.authorKeys.forEach(bookAuthorKey => {
					if (!seriesAuthorKeys.includes(bookAuthorKey)) {
						seriesAuthorKeys.push(bookAuthorKey);
					};
				});
				readSize += (book.yearsRead.length > 0) ? 1 : 0;
				years.push(book.year);
			});
			const seriesInfo: SeriesInfoModel = {
				key: seriesKey,
				title: series.name,
				size,
				bookKeys: series.books,
				authorKeys: seriesAuthorKeys,
				yearFirst: Math.min(...years),
				yearLast: Math.max(...years),
				readPct: readSize / size
			}
			this.seriesInfo.set(seriesKey, seriesInfo);
		}
	}

	@computed
	get taggedAwards() {
		return Object.entries(this.filters.award).filter(([_, show]) => show).map(([key]) => key);
	}

	@computed
	get filterYearStart() {
		return this.filters.yearStart || 0;
	}

	@computed
	get filterYearEnd() {
		return this.filters.yearEnd || 3000;
	}

	@computed
	get filteredBooks() {
		const books = Array.from(this.bookInfo.values())
					.filter(book => book.yearsRead.length > 0);
		return this.filter(books);
	}

	filter(books: BookInfoModel[]) {
		return books
			.filter(book => this.filters.genre[book.genre])
			.filter(book => book.year >= this.filterYearStart)
			.filter(book => book.year <= this.filterYearEnd);
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
		return this.bookInfo.get(bookKey);
	}

	getSeries(seriesKey: string): SeriesInfoModel {
		return this.seriesInfo.get(seriesKey);
	}

	getWasRead(key: string): number {
		const series = this.getSeries(key);
		if (series) {
			return series.readPct;
		}
		const book = this.getBook(key);
		if (book) {
			return book.yearsRead.length > 0 ? 1 : 0;
		}
		return 0;
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