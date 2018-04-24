import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';

const serializeClass = course => (new Serializer('class', {
  pluralizeType: false,
  attributes: ['title', 'numbers'],
})).serialize(course);

const deserializeClass = course => (new Deserializer()).deserialize(course);

export {
  serializeClass,
  deserializeClass,
};
