import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';
import { Types } from 'mongoose';

const serializeUser = (user, opts) => (new Serializer('user', {
  pluralizeType: false,
  attributes: ['name', 'email', 'facebook_id', 'role', 'favorite', 'selling'],
  keyForAttribute: 'snake_case',
  typeForAttribute: (attribute) => {
    if (attribute === 'selling') return 'book';
    if (attribute === 'favorite') return 'book';
    return attribute;
  },
  favorite: {
    included: opts.included,
    attributes: ['isbn', 'title', 'image', 'book_type', 'authors', 'classes'],
    ref: (userself, favorite) => {
      // Direct mongo query returns mere id, otherwise object has id field
      if (Types.ObjectId.isValid(favorite.toString())) {
        return favorite;
      }
      return favorite ? favorite.id : favorite;
    },
  },
  selling: {
    included: opts.included,
    attributes: ['isbn', 'title', 'image', 'book_type', 'authors', 'classes'],
    ref: (userself, selling) => {
      // Direct mongo query returns mere id, otherwise object has id field
      if (Types.ObjectId.isValid(selling.toString())) {
        return selling;
      }
      return selling ? selling.id : selling;
    },
  },
})).serialize(user);

const deserializeUser = (user, opts) => (new Deserializer({
  keyForAttribute: 'snake_case',
  book: {
    valueForRelationship: relationship => relationship,
  },
})).deserialize(user);

export {
  serializeUser,
  deserializeUser,
};
