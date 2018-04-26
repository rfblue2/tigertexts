import { deserializeBook } from '../serializers/bookSerializer';

export const getClassBooks = async (classIds) => {
  const returnedbooks = Promise.all(classIds.map(async (classId) => {
    const res = fetch(`api/classes/${classId}/books`);
    const book = await res.json();
    return deserializeBook(book);
  }));
  const books = [];
  // Dedup book list
  returnedbooks.forEach((b) => {
    for (const b1 of books) {
      if (b1.id === b.id) return;
    }
    books.push(b);
  });
  return books;
};

export const getUserSelling = async (token) => {
  const res = await fetch('api/users/selling', {
    headers: { 'x-auth-token': token },
  });
  const selling = await res.json();
  return deserializeBook(selling);
};

export const getUserFavorites = async (token) => {
  const res = await fetch('api/users/favorite', {
    headers: { 'x-auth-token': token },
  });
  const favorite = await res.json();
  return deserializeBook(favorite);
};
