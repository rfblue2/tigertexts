import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';

const BookSerializer = new Serializer('book', {
  pluralizeType: false,
  attributes: ['isbn', 'title', 'book_type', 'authors', 'classes'],
  included: false,
  typeForAttribute: (attribute) => {
    if (attribute === 'classes') return 'class';
    return attribute;
  },
  classes: {
    ref: (book, classObj) => classObj.id,
  },
  transform: (record) => {
    const newRecord = record.toObject({ getters: true });
    newRecord.classes = record.classes.map(id => ({ id }));
    return newRecord;
  },
});

const BookDeserializer = new Deserializer({
  class: {
    valueForRelationship: relationship => relationship.id,
  },
});

export {
  BookSerializer,
  BookDeserializer,
};
