import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';

const TransactionSerializer = new Serializer('transaction', {
  pluralizeType: false,
  attributes: ['seller', 'buyer', 'book', 'initiated'],
  included: false,
  keyForAttribute: 'snake_case',
  typeForAttribute: (attribute) => {
    if (attribute === 'books') return 'book';
    if (attribute === 'users') return 'user';
    return attribute;
  },
  book: {
    ref: (transaction, book) => book.id,
  },
  seller: {
    ref: (transaction, seller) => seller.id,
  },
  buyer: {
    ref: (transaction, buyer) => buyer.id,
  },
  transform: (record) => {
    const newRecord = record.toObject({ getters: true });
    newRecord.book = { id: newRecord.book };
    newRecord.seller = { id: newRecord.seller };
    newRecord.buyer = { id: newRecord.buyer };
    return newRecord;
  },
});

const TransactionDeserializer = new Deserializer({
  keyForAttribute: 'snake_case',
  book: {
    valueForRelationship: relationship => relationship.id,
  },
  user: {
    valueForRelationship: relationship => relationship.id,
  },
});

export {
  TransactionSerializer,
  TransactionDeserializer,
};
