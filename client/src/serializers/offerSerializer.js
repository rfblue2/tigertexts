import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';

const serializeOffer = (offer, opts = { included: true }) => (new Serializer('offer', {
  pluralizeType: false,
  attributes: ['price', 'buyer', 'listing'],
  typeForAttribute: (attribute) => {
    if (attribute === 'users') return 'user';
    if (attribute === 'listings') return 'listing';
    return attribute;
  },
  listing: {
    ref: (offerself, listing) => {
      // Direct mongo query returns mere id, otherwise object has id field
      if (typeof listing === 'string') {
        return listing;
      }
      return listing.id;
    },
    attributes: ['kind', 'title', 'date_posted', 'detail', 'price', 'price_type', 'url'],
    included: opts.included,
  },
  buyer: {
    included: opts.included,
    attributes: ['name', 'email'],
    ref: (offerself, buyer) => {
      // Direct mongo query returns mere id, otherwise object has id field
      if (typeof buyer === 'string') {
        return buyer;
      }
      return buyer ? buyer.id : buyer;
    },
  },
})).serialize(offer);

const deserializeOffer = (offer, opts = { included: true }) => {
  let deserializer = new Deserializer({
    keyForAttribute: 'snake_case',
    listing: {
      valueForRelationship: relationship => relationship.id,
    },
    user: {
      valueForRelationship: relationship => relationship.id,
    },
  });
  if (opts && opts.included) {
    deserializer = new Deserializer({
      keyForAttribute: 'snake_case',
    });
  }
  return deserializer.deserialize(offer);
};

export {
  serializeOffer,
  deserializeOffer,
};
