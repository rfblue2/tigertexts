import {
  Serializer,
  Deserializer,
} from 'jsonapi-serializer';
import { Types } from 'mongoose';

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
      if (Types.ObjectId.isValid(listing.toString())) {
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
      if (Types.ObjectId.isValid(buyer.toString())) {
        return buyer;
      }
      return buyer ? buyer.id : buyer;
    },
  },
})).serialize(offer);

const deserializeOffer = (offer) => (new Deserializer({
  listing: {
    valueForRelationship: relationship => relationship.id,
  },
  buyer: {
    valueForRelationship: relationship => relationship.id,
  },
})).deserialize(offer);

export {
  serializeOffer,
  deserializeOffer,
};
