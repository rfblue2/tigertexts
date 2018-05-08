import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';

const serializeBook = (book, opts = { included: true }) => (new Serializer('book', {
  pluralizeType: false,
  attributes: ['isbn', 'title', 'description', 'image', 'book_type', 'authors', 'classes'],
  typeForAttribute: (attribute) => {
    if (attribute === 'classes') return 'class';
    return attribute;
  },
  classes: {
    ref: (bookself, classObj) => {
      // Direct mongo query returns mere id, otherwise object has id field
      if (classObj instanceof String) {
        return classObj;
      }
      return classObj.id;
    },
    attributes: ['title', 'numbers'],
    included: opts.included,
  },
})).serialize(book);

const deserializeBook = (book, opts = { included: true }) => {
  let deserializer = new Deserializer({
    keyForAttribute: 'snake_case',
    class: {
      valueForRelationship: relationship => relationship.id,
    },
  });
  if (opts && opts.included) {
    deserializer = new Deserializer({
      keyForAttribute: 'snake_case',
    });
  }
  return deserializer.deserialize(book);
};

export {
  serializeBook,
  deserializeBook,
};
