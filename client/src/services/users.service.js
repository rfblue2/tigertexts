import { deserializeTransaction } from '../serializers/transactionSerializer';
import { deserializeBook } from '../serializers/bookSerializer';


export const handleFbResponse = res =>
  // console.log(`Facebook response: ${JSON.stringify(res)}`);
  fetch(`/api/users/login?token=${res.accessToken}&email=${res.email}&name=${res.name}&userId=${res.id}`);

export const getUser = async (token, fields) => {
  // get user from token
  const res = await fetch(`/api/users/me?include=${fields.join(',')}`, {
    headers: { 'x-auth-token': token },
  });

  // token probably expired
  if (res.status === 401) {
    localStorage.removeItem('jwtToken');
    return null;
  }

  return res.json();
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

export const postSelling = async (token, user, bookIds) => {
  const userObj = {
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
  return fetch('api/users/selling', {
    method: 'POST',
    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify(userObj),
  });
};

export const deleteSelling = async (token, bookId) =>
  fetch(`/api/users/selling/${bookId}`, {
    method: 'DELETE',
    headers: { 'x-auth-token': token },
  });
