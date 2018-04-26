import { deserializeBook } from '../serializers/bookSerializer';
import { deserializeListing } from '../serializers/listingSerializer';

export const getClassBooks = async (classIds) => {
  let returnedbooks = await Promise.all(classIds.map(async (classId) => {
    const res = await fetch(`api/classes/${classId}/books`);
    const book = await res.json();
    return deserializeBook(book);
  }));
  const books = [];
  // Dedup book list
  returnedbooks = returnedbooks.reduce((a, b) => a.concat(b), []);
  returnedbooks.forEach((b) => {
    for (const b1 of books) {
      if (b1.id === b.id) return;
    }
    books.push(b);
  });

  // TODO maybe abstract this out somehow
  // get book listingsd
  const booksWithListings = await Promise.all(books.map(async (b) => {
    const lres = await fetch(`api/books/${b.id}/listings`);
    const ljson = await lres.json();
    const listings = await deserializeListing(ljson);
    return { ...b, listings };
  }));
  return booksWithListings;
};

export const getBooksListings = async bookIds =>
  Promise.all(bookIds.map(async (id) => {
    const lres = await fetch(`api/books/${id}/listings`);
    const ljson = await lres.json();
    return deserializeListing(ljson);
  }));

export const getUserSelling = async (token) => {
  const res = await fetch('api/users/selling', {
    headers: { 'x-auth-token': token },
  });
  const selling = await res.json();
  const books = await deserializeBook(selling);
  return Promise.all(books.map(async (b) => {
    const lres = await fetch(`api/books/${b.id}/listings`);
    const ljson = await lres.json();
    const listings = await deserializeListing(ljson);
    return { ...b, listings };
  }));
};

export const getUserFavorites = async (token) => {
  const res = await fetch('api/users/favorites', {
    headers: { 'x-auth-token': token },
  });
  const favorite = await res.json();
  const books = await deserializeBook(favorite);
  return Promise.all(books.map(async (b) => {
    const lres = await fetch(`api/books/${b.id}/listings`);
    const ljson = await lres.json();
    const listings = await deserializeListing(ljson);
    return { ...b, listings };
  }));
};
