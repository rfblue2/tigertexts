import {
  BOOK_ERROR,
  GET_CLASS_BOOKS_RES,
  GET_CLASS_BOOKS_REQ,
  GET_USER_FAVORITES_REQ,
  GET_USER_FAVORITES_RES,
  GET_USER_SELLING_REQ,
  GET_USER_SELLING_RES,
} from '../constants/books.constants';

const bookReducer = (state = {
  books: [
    // TODO this is mock data
    {
      title: 'Advanced Prog Tech',
      authors: ['Kernighan', 'Pike'],
      image: 'https://images-na.ssl-images-amazon.com/images/I/51a1SwDTnYL._AC_US436_QL65_.jpg',
      detail: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like',
      listings: [{
        kind: 'labyrinth',
        title: 'Test listing',
        price: 30.13,
      }],
    },
    {
      title: 'Advanced Prog Tech Editors United',
      authors: ['Kernighan', 'Pike', 'Smith', 'Deb', 'Reeer'],
      image: 'https://images-na.ssl-images-amazon.com/images/I/51a1SwDTnYL._AC_US436_QL65_.jpg',
      detail: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like',
      listings: [{
        kind: 'labyrinth',
        title: 'Test listing',
        price: 30.13,
      }],
    },
    {
      title: 'Advanced Prog Tech 1231321312',
      authors: ['Kernighan'],
      image: 'https://images-na.ssl-images-amazon.com/images/I/51a1SwDTnYL._AC_US436_QL65_.jpg',
      detail: 'This impressive paella is a perfect party dish and a fun meal to cook together with your guests. Add 1 cup of frozen peas along with the mussels, if you like',
      listings: [{
        kind: 'labyrinth',
        title: 'Test listing',
        price: 30.13,
      }],
    },
    {
      title: 'C Prog',
      authors: ['Kernighan', 'Pike'],
      image: 'https://images-na.ssl-images-amazon.com/images/I/51a1SwDTnYL._AC_US436_QL65_.jpg',
      detail: 'Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10 minutes.',
      listings: [
        {
          kind: 'labyrinth',
          title: 'Test listing',
          price: 123.44,
        },
        {
          kind: 'amazon',
          title: 'amazon listing',
          price: 10.00,
        },
      ],
    },
  ], // books to be displayed in a book list
}, action) => {
  switch (action.type) {
    case GET_CLASS_BOOKS_REQ:
      return { ...state, error: null };
    case GET_CLASS_BOOKS_RES:
      return { ...state, books: action.books, error: null };
    case GET_USER_SELLING_REQ:
      return { ...state, error: null };
    case GET_USER_SELLING_RES:
      return { ...state, books: action.selling, error: null };
    case GET_USER_FAVORITES_REQ:
      return { ...state, error: null };
    case GET_USER_FAVORITES_RES:
      return { ...state, books: action.favorites, error: null };
    case BOOK_ERROR:
      return { ...state, error: action.error };
    default:
      return state;
  }
};

export default bookReducer;
