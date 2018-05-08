import { deserializeListing } from '../serializers/listingSerializer';

export const fetchListing = async (id) => {
  const lres = await fetch(`api/listings/${id}?include=seller,book`);
  const ljson = await lres.json();
  return deserializeListing(ljson, { included: true });
};
