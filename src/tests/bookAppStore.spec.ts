// Regression tests for: typescript@6, mobx@6, mobx-react@9, react@19, classnames@2 upgrades
import { describe, it, expect, beforeEach } from 'vitest';
import { BookAppStore } from '../bookAppStore';
import classNames from 'classnames';

describe('BookAppStore - initialization', () => {
  let store: BookAppStore;

  it('initializes without throwing', () => {
    expect(() => { store = new BookAppStore(); }).not.toThrow();
  });

  it('loads books into bookInfo map', () => {
    store = store ?? new BookAppStore();
    expect(store.bookInfo.size).toBeGreaterThan(0);
  });

  it('loads authors into authorInfo map', () => {
    store = store ?? new BookAppStore();
    expect(store.authorInfo.size).toBeGreaterThan(0);
  });

  it('loads awards into awardInfo map', () => {
    store = store ?? new BookAppStore();
    expect(store.awardInfo.size).toBeGreaterThan(0);
  });

  it('loads genres into genreInfo map', () => {
    store = store ?? new BookAppStore();
    expect(store.genreInfo.size).toBeGreaterThan(0);
  });

  it('loads series into seriesInfo map', () => {
    store = store ?? new BookAppStore();
    expect(store.seriesInfo.size).toBeGreaterThan(0);
  });

  it('loads reading list into readingListInfo map', () => {
    store = store ?? new BookAppStore();
    expect(store.readingListInfo.size).toBeGreaterThan(0);
  });

  it('initializes award filters as false', () => {
    store = store ?? new BookAppStore();
    const awardKeys = Object.keys(store.filters.award);
    expect(awardKeys.length).toBeGreaterThan(0);
    awardKeys.forEach(key => {
      expect(store.filters.award[key]).toBe(false);
    });
  });

  it('initializes genre filters as true', () => {
    store = store ?? new BookAppStore();
    const genreKeys = Object.keys(store.filters.genre);
    expect(genreKeys.length).toBeGreaterThan(0);
    genreKeys.forEach(key => {
      expect(store.filters.genre[key]).toBe(true);
    });
  });
});

describe('BookAppStore - computed values', () => {
  let store: BookAppStore;
  beforeEach(() => { store = new BookAppStore(); });

  it('awardList returns all awards', () => {
    expect(store.awardList.length).toBeGreaterThan(0);
    expect(store.awardList[0]).toHaveProperty('key');
    expect(store.awardList[0]).toHaveProperty('name');
  });

  it('bookList returns only read books sorted alphabetically', () => {
    const books = store.bookList;
    expect(books.length).toBeGreaterThan(0);
    books.forEach(book => {
      expect(book.yearsRead.length).toBeGreaterThan(0);
    });
    for (let i = 1; i < books.length; i++) {
      expect(books[i - 1].alphaTitle <= books[i].alphaTitle).toBe(true);
    }
  });

  it('authorList returns only authors with read books sorted alphabetically', () => {
    const authors = store.authorList;
    expect(authors.length).toBeGreaterThan(0);
    authors.forEach(author => expect(author.read).toBe(true));
    for (let i = 1; i < authors.length; i++) {
      expect(authors[i - 1].alphaName <= authors[i].alphaName).toBe(true);
    }
  });

  it('taggedAwards returns empty when no awards selected', () => {
    expect(store.taggedAwards).toEqual([]);
  });

  it('filterYearStart returns 0 when not set', () => {
    expect(store.filterYearStart).toBe(0);
  });

  it('filterYearEnd returns 3000 when not set', () => {
    expect(store.filterYearEnd).toBe(3000);
  });
});

describe('BookAppStore - actions', () => {
  let store: BookAppStore;
  beforeEach(() => { store = new BookAppStore(); });

  it('toggleAward switches award filter from false to true', () => {
    const firstAwardKey = Object.keys(store.filters.award)[0];
    expect(store.filters.award[firstAwardKey]).toBe(false);
    store.toggleAward(firstAwardKey);
    expect(store.filters.award[firstAwardKey]).toBe(true);
    expect(store.taggedAwards).toContain(firstAwardKey);
  });

  it('toggleAward switches award filter from true to false', () => {
    const firstAwardKey = Object.keys(store.filters.award)[0];
    store.toggleAward(firstAwardKey);
    store.toggleAward(firstAwardKey);
    expect(store.filters.award[firstAwardKey]).toBe(false);
  });
});

describe('BookAppStore - book data integrity', () => {
  let store: BookAppStore;
  beforeEach(() => { store = new BookAppStore(); });

  it('each book has required fields', () => {
    store.bookInfo.forEach(book => {
      expect(book).toHaveProperty('key');
      expect(book).toHaveProperty('title');
      expect(book).toHaveProperty('authorKeys');
      expect(book).toHaveProperty('year');
      expect(Array.isArray(book.yearsRead)).toBe(true);
    });
  });

  it('each author has required fields', () => {
    store.authorInfo.forEach(author => {
      expect(author).toHaveProperty('key');
      expect(author).toHaveProperty('name');
      expect(author).toHaveProperty('alphaName');
      expect(Array.isArray(author.books)).toBe(true);
      expect(Array.isArray(author.booksRead)).toBe(true);
    });
  });

  it('getBook returns a book by key', () => {
    const firstKey = Array.from(store.bookInfo.keys())[0];
    const book = store.getBook(firstKey);
    expect(book).toBeDefined();
    expect(book.key).toBe(firstKey);
  });
});

describe('classnames - upgrade regression', () => {
  it('combines class names', () => {
    expect(classNames('foo', 'bar')).toBe('foo bar');
  });

  it('conditionally includes class names', () => {
    expect(classNames('base', { active: true, disabled: false })).toBe('base active');
  });

  it('handles undefined and null', () => {
    expect(classNames('foo', undefined, null, 'bar')).toBe('foo bar');
  });

  it('handles array syntax', () => {
    expect(classNames(['foo', 'bar'])).toBe('foo bar');
  });

  it('matches usage in bookApp - contentArea classes', () => {
    const drawerOpen = true;
    const result = classNames('contentArea', { 'contentAreaShifted': drawerOpen });
    expect(result).toBe('contentArea contentAreaShifted');
  });

  it('matches usage in bookApp - appBar classes when drawer closed', () => {
    const drawerOpen = false;
    const result = classNames('appBar', { 'appBarShifted': drawerOpen });
    expect(result).toBe('appBar');
  });
});
