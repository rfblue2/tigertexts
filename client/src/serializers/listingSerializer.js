import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';

const ListingSerializer = new Serializer('listing', {
  pluralizeType: false,
  attributes: ['kind', 'title', 'date_posted', 'detail', 'price', 'price_type', 'book'],
  included: false,
  keyForAttribute: 'snake_case',
  typeForAttribute: (attribute) => {
    if (attribute === 'books') return 'book';
    return attribute;
  },
  book: {
    ref: (listing, book) => book.id,
  },
  transform: (record) => {
    const newRecord = record.toObject({ getters: true });
    newRecord.book = { id: newRecord.book };
    return newRecord;
  },
});

const ListingDeserializer = new Deserializer({
  keyForAttribute: 'snake_case',
  book: {
    valueForRelationship: relationship => relationship.id,
  },
});

export {
  ListingSerializer,
  ListingDeserializer,
};
