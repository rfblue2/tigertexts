import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';

const serializeTransaction = (transaction, opts = { included: true }) => (new Serializer('transaction', {
  pluralizeType: false,
  attributes: ['seller', 'buyer', 'book', 'initiated', 'status', 'price'],
  included: false,
  keyForAttribute: 'snake_case',
  typeForAttribute: (attribute) => {
    if (attribute === 'seller') return 'user';
    if (attribute === 'buyer') return 'user';
    return attribute;
  },
  book: {
    included: opts.included,
    attributes: ['isbn', 'title', 'image', 'book_type', 'authors', 'classes'],
    ref: (transactionself, book) => {
      // Direct mongo query returns mere id, otherwise object has id field
      if (book instanceof String) {
        return book;
      }
      return book ? book.id : book;
    },
  },
  seller: {
    included: opts.included,
    attributes: ['name', 'email'],
    ref: (transactionself, seller) => {
      // Direct mongo query returns mere id, otherwise object has id field
      if (seller instanceof String) {
        return seller;
      }
      return seller ? seller.id : seller;
    },
  },
  buyer: {
    included: opts.included,
    attributes: ['name', 'email'],
    ref: (transactionself, buyer) => {
      // Direct mongo query returns mere id, otherwise object has id field
      if (buyer instanceof String) {
        return buyer;
      }
      return buyer ? buyer.id : buyer;
    },
  },
})).serialize(transaction);

const deserializeTransaction = (transaction, opts) => (new Deserializer({
  keyForAttribute: 'snake_case',
  book: {
    valueForRelationship: relationship => relationship.id,
  },
  user: {
    valueForRelationship: relationship => relationship.id,
  },
})).deserialize(transaction);

export {
  serializeTransaction,
  deserializeTransaction,
};
