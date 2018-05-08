import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';
import { Types } from 'mongoose';

const serializeListing = (listing, opts = { included: true }) => {
  const attrs = [
    'kind',
    'title',
    'date_posted',
    'detail',
    'price',
    'url',
    'price_type',
  ];
  if (listing instanceof Array && listing.length > 0) {
    if (listing[0].seller) attrs.push('seller');
    if (listing[0].book) attrs.push('book');
  } else {
    if (listing.seller) attrs.push('seller');
    if (listing.book) attrs.push('book');
  }
  return (new Serializer('listing', {
    pluralizeType: false,
    attributes: attrs,
    keyForAttribute: 'snake_case',
    typeForAttribute: (attribute) => {
      if (attribute === 'books') return 'book';
      if (attribute === 'users') return 'user';
      return attribute;
    },
    book: {
      ref: (listingself, book) => {
        // Direct mongo query returns mere id, otherwise object has id field
        if (Types.ObjectId.isValid(book.toString())) {
          return book;
        }
        return book.id;
      },
      attributes: ['isbn', 'title', 'image', 'book_type', 'authors', 'classes'],
      included: opts.included,
    },
    seller: {
      included: opts.included,
      attributes: ['name', 'email'],
      ref: (listingself, seller) => {
        console.log(JSON.stringify(listing, null, 2))
        console.log(seller)
        if (!seller) return;
        // Direct mongo query returns mere id, otherwise object has id field
        if (Types.ObjectId.isValid(seller.toString())) {
          return seller;
        }
        return seller ? seller.id : seller;
      },
    },
  })).serialize(listing);
}

const deserializeListing = (listing, opts) => (new Deserializer({
  keyForAttribute: 'snake_case',
  book: {
    valueForRelationship: relationship => relationship.id,
  },
})).deserialize(listing);

export { 
  serializeListing,
  deserializeListing,
};
