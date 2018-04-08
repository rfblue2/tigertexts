import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';

const ClassSerializer = new Serializer('class', {
  pluralizeType: false,
  attributes: ['title', 'numbers'],
});

const ClassDeserializer = new Deserializer();

export {
  ClassSerializer,
  ClassDeserializer,
};
