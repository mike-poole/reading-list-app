// Data models reflects what's in the JSON

export interface BookData {
	name: string;
	author: string | string[];
	year: number;
	cat: string;
}

export interface AwardData {
	name: string;
	abbr: string;
	type: AwardType;
	list: []
}

export interface AuthorData {
	firstName: string;
	lastName: string;
	sex: string;
	born?: number;
	died?: number;
}

export interface GenreData {
	name: string;
}

export interface SeriesData {
	name: string;
	author: string;
	books: string[];
}

// Info models are usable runtime data

export interface BookInfoModel {
	key: string;
	title: string;
	alphaTitle: string;
	authorKeys: string[];
	authorName: string;
	year: number;
	genre: string;
	awards?: string[];
	yearsRead?: number[];
	series?: BookSeriesInfoModel;
}

export interface AwardInfoModel {
	key: string;
	name: string;
	type: AwardType;
	books: [];
}

export interface AuthorInfoModel {
	key: string;
	name: string;
	alphaName: string;
	sex: string;
	born?: number;
	died?: number;
	books?: BookInfoModel[];
	booksRead?: BookInfoModel[];
	read: boolean;
}

export interface GenreInfoModel {
	key: GenreType;
	name: string;
}

export interface SeriesInfoModel {
	key: string;
	title: string;
	size: number;
	bookKeys: string[];
	authorKeys: string[];
	yearFirst: number;
	yearLast: number;
}

export interface ReadingListInfo {
	year: string;
	count: number;
	books: BookInfoModel[];
}

// Miscellany

export interface BookSeriesInfoModel {
	key: string;
	percent: number;
	isLast: boolean;
}

export interface FilterModel {
	award?: {};
	genre?: {};
	yearStart?: number;
	yearEnd?: number;
}

export enum AwardType {
	ANNUAL = 'annual',
	RANKED = 'ranked list',
	UNRANKED = 'unranked list'
}

export enum GenreType {
	FICTION = 'f',
	NON_FICTION = 'n',
	LITERARY_NF = 'l',
	OTHER = 'o'
}