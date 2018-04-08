import '@babel/polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Class from '../models/class';
import Book from '../models/book';
import server from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Books', () => {
  const testClass1 = {
    title: 'Advanced Programming Techniques',
    numbers: ['COS 333'],
  };

  const testClass2 = {
    title: 'Programming Systems',
    numbers: ['COS 217'],
  };

  const testBook1 = {
    title: 'Practice of Programming',
    isbn: '100',
    authors: ['Kernighan', 'Pike'],
  };

  const testBook2 = {
    title: 'Practice of Programming',
    authors: ['Kernighan', 'Pike'],
  };

  const testBook4 = {
    title: 'Practice of Programming',
    isbn: '100',
    authors: ['Kernighan', 'Pike'],
  };

  let savedClass1;
  let savedClass2;
  let testBook3;
  let testBookReq1;
  let testBookReq2;

  beforeEach(async () => {
    await Book.remove({});
    await Class.remove({});

    const class1 = new Class(testClass1);
    const class2 = new Class(testClass2);

    savedClass1 = await class1.save();
    savedClass2 = await class2.save();

    testBook4.classes = [savedClass1.id, savedClass2.id];

    testBookReq1 = {
      data: {
        type: 'book',
        attributes: testBook1,
        relationships: {
          classes: {
            data: [
              { id: savedClass1.id, type: 'class' },
              { id: savedClass2.id, type: 'class' },
            ],
          },
        },
      },
    };

    testBookReq2 = {
      data: {
        type: 'book',
        attributes: testBook2,
        relationships: {
          classes: {
            data: [
              { id: savedClass1.id, type: 'class' },
              { id: savedClass2.id, type: 'class' },
            ],
          },
        },
      },
    };

    testBook3 = {
      ...testBook1,
      classes: [savedClass1.id, savedClass2.id],
    };
  });


  describe('/GET books', () => {
    it('should GET all the books', async () => {
      const res = await chai.request(server)
        .get('/api/books');
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.a('array');
      expect(res.body.data.length).to.be.eql(0);
    });
  });


  describe('/POST books', () => {
    it('should not POST a book without isbn', async () => {
      const res = await chai.request(server)
        .post('/api/books')
        .send(testBookReq2);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('errors');
    });

    it('should POST a book', async () => {
      const res = await chai.request(server)
        .post('/api/books')
        .send(testBookReq1);
      expect(res).to.have.status(201);
      expect(res.body).to.be.a('object');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('type').eql(testBookReq1.data.type);
      expect(res.body.data).to.have.property('attributes').eql(testBookReq1.data.attributes);
      expect(res.body.data).to.have.property('relationships').eql(testBookReq1.data.relationships);
    });
  });


  describe('/GET/:id book', () => {
    it('should GET a book by the given id', async () => {
      const book = new Book(testBook3);
      await book.save();
      const res = await chai.request(server)
        .get(`/api/books/${book.id}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('type').eql('book');
      expect(res.body.data).to.have.property('attributes').eql(testBook1);
      expect(res.body.data).to.have.property('relationships').eql(testBookReq1.data.relationships);
    });
  });

  describe('/GET/:id/books class', () => {
    it('should GET the books associated with class by id', async () => {
      // TODO this is a fragile test with dependencies on the exact structure
      // testBook1, testBook4, testBook1Req; shouldn't have interdependencies
      const book = new Book(testBook4);
      await book.save();
      const res = await chai.request(server)
        .get(`/api/classes/${savedClass1.id}/books`);
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.a('array');
      expect(res.body.data.length).to.be.eql(1);
      expect(res.body.data[0]).to.have.property('type').eql('book');
      expect(res.body.data[0]).to.have.property('attributes').eql(testBook1);
      expect(res.body.data[0]).to.have.property('relationships').eql(testBookReq1.data.relationships);
    });
  });
});
