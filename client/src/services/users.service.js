import { deserializeTransaction } from '../serializers/transactionSerializer';
import { deserializeBook } from '../serializers/bookSerializer';
import { deserializeListing } from '../serializers/listingSerializer';
import { deserializeUser } from '../serializers/userSerializer';

export const getAndVerifyJwt = async () => {
  // check if user already logged in
  const token = localStorage.getItem('jwtToken');
  if (!token) return null;

  // get user from token
  const res = await fetch('/api/users/me', {
    headers: { 'x-auth-token': token },
  });

  // token probably expired
  if (res.status === 401) {
    localStorage.removeItem('jwtToken');
    return null;
  }

  return token;
};

export const handleFbResponse = res =>
  // console.log(`Facebook response: ${JSON.stringify(res)}`);
  fetch(`/api/users/login?token=${res.accessToken}&email=${res.email}&name=${res.name}&userId=${res.id}`);

export const getUser = async (token, fields) => {
  // get user from token
  const res = await fetch(`/api/users/me?include=${fields.join(',')}`, {
    headers: { 'x-auth-token': token },
  });

  // get listings for user favorites and selling
  const getBookWithListings = async (b) => {
    const lres = await fetch(`api/books/${b.id}/listings`);
    const ljson = await lres.json();
    const listings = await deserializeListing(ljson);
    return { ...b, listings };
  };

  // token probably expired
  if (res.status === 401) {
    localStorage.removeItem('jwtToken');
    return null;
  }

  const userRes = await res.json();
  const user = await deserializeUser(userRes);

  if (user.selling) {
    user.selling = await Promise.all(user.selling.map(getBookWithListings));
  }
  if (user.favorites) {
    user.favorites = await Promise.all(user.favorites.map(getBookWithListings));
  }

  return user;
};

export const fetchUserActivity = async (token) => {
  const actres = await fetch('api/users/activity', {
    headers: { 'x-auth-token': token },
  });
  const actresjson = await actres.json();
  let activity = await deserializeTransaction(actresjson);
  activity = await Promise.all(activity.map(async (t) => {
    const bookRes = await fetch(`/api/books/${t.book}`);
    const bookResjson = await bookRes.json();
    const transact = { ...t };
    transact.book = await deserializeBook(bookResjson);
    return transact;
  }));
  return activity;
};

export const postSelling = async (token, user, bookIds, sellData) => {
  const userObj = {
    included: sellData.map(sd => ({
      type: 'book',
      id: sd.id,
      attributes: {
        price: sd.price,
        comment: sd.comment,
      },
    })),
    data: {
      type: 'user',
      id: user.id,
      attributes: {},
      relationships: {
        selling: {
          data: bookIds.map(b => ({
            type: 'book',
            id: b,
          })),
        },
      },
    },
  };
  const res = await fetch('api/users/selling', {
    method: 'POST',
    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify(userObj),
  });
  const jsonres = await res.json();
  const books = await deserializeBook(jsonres);
  // update the books' listings
  return Promise.all(books.map(async (b) => {
    const lres = await fetch(`api/books/${b.id}/listings`);
    const ljson = await lres.json();
    const listings = await deserializeListing(ljson);
    return { ...b, listings };
  }));
};

export const deleteSelling = async (token, bookId) =>
  fetch(`/api/users/selling/${bookId}`, {
    method: 'DELETE',
    headers: { 'x-auth-token': token },
  });
