import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';
import { Types } from 'mongoose';

const serializeTransaction = (transaction, opts = { included: true }) => {
  const attrs = [
    'book', 'initiated', 'completed', 'status', 'price',
  ];
  // TODO deal with null book (e.g. book id no longer exists
  if (transaction instanceof Array && transaction.length > 0) {
    if (transaction[0].seller) attrs.push('seller');
    if (transaction[0].buyer) attrs.push('buyer');
    if (transaction[0].listing) attrs.push('listing');
  } else {
    if (transaction.seller) attrs.push('seller');
    if (transaction.buyer) attrs.push('buyer');
    if (transaction.listing) attrs.push('listing');
  }
  return (new Serializer('transaction', {
    pluralizeType: false,
    attributes: attrs,
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
        if (Types.ObjectId.isValid(book.toString())) {
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
        if (Types.ObjectId.isValid(seller.toString())) {
          return seller;
        }
        return seller ? seller.id : seller;
      },
    },
    buyer: {
      included: opts.included,
      attributes: ['name', 'email'],
      ref: (transactionself, buyer) => {
        if (!buyer) return buyer;
        // Direct mongo query returns mere id, otherwise object has id field
        if (Types.ObjectId.isValid(buyer.toString())) {
          return buyer;
        }
        return buyer ? buyer.id : buyer;
      },
    },
    listing: {
      included: opts.included,
      attributes: ['kind', 'title', 'date_posted', 'detail', 'price', 'price_type', 'url'],
      ref: (transactionself, listing) => {
        if (!listing) return listing;
        // Direct mongo query returns mere id, otherwise object has id field
        if (Types.ObjectId.isValid(listing.toString())) {
          return listing;
        }
        return listing ? listing.id : listing;
      },
    },
  })).serialize(transaction);
};

const deserializeTransaction = (transaction, opts) => (new Deserializer({
  keyForAttribute: 'snake_case',
  book: {
    valueForRelationship: relationship => relationship.id,
  },
  user: {
    valueForRelationship: relationship => relationship.id,
  },
  listing: {
    valueForRelationship: relationship => relationship.id,
  },
})).deserialize(transaction);

export {
  serializeTransaction,
  deserializeTransaction,
};
