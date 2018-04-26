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
      title: "Advanced Prog Tech",
      authors: ["Kernighan", "Pike"],
      image: "https://images-na.ssl-images-amazon.com/images/I/51a1SwDTnYL._AC_US436_QL65_.jpg",
      listings: [{
        kind: 'labyrinth',
        title: 'Test listing',
      }],
    },
    {
      title: "C Prog",
      authors: ["Kernighan", "Pike"],
      image: "https://images-na.ssl-images-amazon.com/images/I/51a1SwDTnYL._AC_US436_QL65_.jpg",
      listings: [
        {
          kind: 'labyrinth',
          title: 'Test listing',
        },
        {
          kind: 'amazon',
          title: 'amazon listing',
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