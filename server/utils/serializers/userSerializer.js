import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';

const UserSerializer = new Serializer('user', {
  pluralizeType: false,
  attributes: ['name', 'email', 'facebook_id', 'role', 'favorite', 'selling'],
  included: false,
  keyForAttribute: 'snake_case',
  typeForAttribute: (attribute) => {
    if (attribute === 'books') return 'book';
    return attribute;
  },
  favorites: {
    ref: (user, favorites) => favorites.id,
  },
  selling: {
    ref: (user, selling) => selling.id,
  },
  transform: (record) => {
    const newRecord = record.toObject({ getters: true });
    newRecord.favorite = record.favorite.map(id => ({ id }));
    newRecord.selling = record.selling.map(id => ({ id }));
    return newRecord;
  },
});

const UserDeserializer = new Deserializer({
  keyForAttribute: 'snake_case',
  book: {
    valueForRelationship: relationship => relationship.id,
  },
});

export {
  UserSerializer,
  UserDeserializer,
};
