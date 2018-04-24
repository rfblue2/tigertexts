import '@babel/polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Book from '../models/book';
import Class from '../models/class';
import Listing from '../models/listing';
import server from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Listings', () => {
  const testClass1 = {
    title: 'Advanced Programming Techniques',
    isbn: '100',
    numbers: ['COS 333'],
  };

  const testBook1 = {
    title: 'Practice of Programming',
    isbn: '100',
    authors: ['Kernighan', 'Pike'],
  };

  const testListing1 = {
    kind: 'facebook',
    title: 'buy my book',
    price: 100,
    price_type: 'new',
  };

  const testListing2 = {
    kind: 'facebook',
    title: 'buy my book',
    price: 100,
    price_type: 'new',
  };

  let savedClass1;
  let savedBook1;
  let testListingReq1;

  beforeEach(async () => {
    await Listing.remove({});
    await Book.remove({});
    await Class.remove({});

    const class1 = new Class(testClass1);
    savedClass1 = await class1.save();
    testBook1.classes = [savedClass1.id];
    const book1 = new Book(testBook1);
    savedBook1 = await book1.save();

    testListing2.book = savedBook1.id;

    testListingReq1 = {
      data: {
        type: 'listing',
        attributes: testListing1,
        relationships: {
          book: {
            data: {
              id: savedBook1.id,
              type: 'book',
            },
          },
        },
      },
    };
  });


  describe('/GET listings', () => {
    it('should GET all the listings', async () => {
      const res = await chai.request(server)
        .get('/api/listings');
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.a('array');
      expect(res.body.data.length).to.be.eql(0);
    });

    it('should GET all the listings and their books', async () => {
      const listing = new Listing(testListing2);
      await listing.save();
      const res = await chai.request(server)
        .get('/api/listings?include=book');
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.a('array');
      expect(res.body.data.length).to.be.eql(1);
      expect(res.body.data[0]).to.have.property('type').eql('listing');
      expect(res.body.data[0]).to.have.property('attributes').eql(testListing1);
      expect(res.body.data[0]).to.have.property('relationships').eql(testListingReq1.data.relationships);
      expect(res.body.included).to.be.a('array');
      expect(res.body.included.length).to.be.eql(1);
      expect(res.body.included[0]).to.have.property('attributes').eql(testBook1);
    });
  });


  describe('/POST listings', () => {
    it('should POST a listing', async () => {
      const res = await chai.request(server)
        .post('/api/listings')
        .send(testListingReq1);
      expect(res).to.have.status(201);
      expect(res.body).to.be.a('object');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('type').eql(testListingReq1.data.type);
      expect(res.body.data).to.have.property('attributes').eql(testListingReq1.data.attributes);
      expect(res.body.data).to.have.property('relationships').eql(testListingReq1.data.relationships);
    });
  });

  describe('/GET/:id/listings book', () => {
    it('should GET the listings associated with book by id', async () => {
      // TODO this is a fragile test that depends on testListing2 being similar
      // in structure to testListing1 (and testListingReq1)
      const listing = new Listing(testListing2);
      await listing.save();
      const res = await chai.request(server)
        .get(`/api/books/${savedBook1.id}/listings`);
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.a('array');
      expect(res.body.data.length).to.be.eql(1);
      expect(res.body.data[0]).to.have.property('type').eql('listing');
      expect(res.body.data[0]).to.have.property('attributes').eql(testListing1);
      expect(res.body.data[0]).to.have.property('relationships').eql(testListingReq1.data.relationships);
    });
  });
});
