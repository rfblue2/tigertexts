import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';

const serializeListing = (listing, opts = { included: true }) => (new Serializer('listing', {
  pluralizeType: false,
  attributes: ['kind', 'title', 'date_posted', 'detail', 'price', 'price_type', 'book'],
  keyForAttribute: 'snake_case',
  typeForAttribute: (attribute) => {
    if (attribute === 'books') return 'book';
    return attribute;
  },
  book: {
    ref: (listingself, book) => {
      // Direct mongo query returns mere id, otherwise object has id field
      if (book instanceof String) {
        return book;
      }
      return book.id;
    },
    attributes: ['isbn', 'title', 'image', 'book_type', 'authors', 'classes'],
    included: opts.included,
  },
})).serialize(listing);

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
