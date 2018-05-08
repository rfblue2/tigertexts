import { deserializeOffer, serializeOffer } from '../serializers/offerSerializer';
import { deserializeListing } from '../serializers/listingSerializer';

export const fetchUserOffers = async (token) => {
  const ores = await fetch('api/users/offers?include=buyer,listing', {
    headers: { 'x-auth-token': token },
  });
  const oresjson = await ores.json();
  const offer = await deserializeOffer(oresjson);
  const newOffers = await Promise.all(offer.map(async (o) => {
    // get the book for the listing
    const lres = await fetch(`/api/listings/${o.listing.id}?include=book`);
    const lresjson = await lres.json();
    const listing = await deserializeListing(lresjson);
    const newO = o;
    newO.book = listing.book;
    return newO;
  }));
  return newOffers;
};

export const createUserOffer = async (token, offer) => {
  const serializedOffer = await serializeOffer(offer);
  const res = await fetch('api/users/offers', {
    method: 'POST',
    headers: { 'x-auth-token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify(serializedOffer),
  });
  const newOffer = await res.json();
  return deserializeOffer(newOffer);
};

export const deleteUserOffer = async (token, offerId) => {
  const offer = await fetch(`api/users/offers/${offerId}`, {
    headers: { 'x-auth-token': token },
    method: 'DELETE',
  });
  const ojson = await offer.json();
  return deserializeOffer(ojson);
};
