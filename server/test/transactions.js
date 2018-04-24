import '@babel/polyfill';
import chai from 'chai';
import chaiThings from 'chai-things';
import chaiHttp from 'chai-http';
import Book from '../models/book';
import User from '../models/user';
import Class from '../models/class';
import Transaction from '../models/transaction';
import server from '../app';

const { expect } = chai;

chai.use(chaiHttp);
chai.use(chaiThings);

describe('Transactions', () => {
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

  const testUser1 = { name: 'tester1' };

  const testUser2 = { name: 'tester2' };

  const testTransaction1 = {
    status: 'completed',
    price: 100,
  };

  const testTransaction2 = {
    status: 'completed',
    price: 100,
  };

  let savedClass1;
  let savedBook1;
  let testTransactionReq1;

  beforeEach(async () => {
    await Transaction.remove({});
    await Book.remove({});
    await Class.remove({});

    const class1 = new Class(testClass1);
    savedClass1 = await class1.save();
    testBook1.classes = [savedClass1.id];
    const book1 = new Book(testBook1);
    savedBook1 = await book1.save();
    const user1 = new User(testUser1);
    const user2 = new User(testUser2);
    const savedUser1 = await user1.save();
    const savedUser2 = await user2.save();

    testTransaction1.book = savedBook1.id;
    testTransaction1.buyer = savedUser1.id;
    testTransaction1.seller = savedUser2.id;

    testTransactionReq1 = {
      data: {
        type: 'transaction',
        attributes: testTransaction2,
        relationships: {
          book: {
            data: {
              id: savedBook1.id,
              type: 'book',
            },
          },
          buyer: {
            data: {
              id: savedUser1.id,
              type: 'user',
            },
          },
          seller: {
            data: {
              id: savedUser2.id,
              type: 'user',
            },
          },
        },
      },
    };
  });


  describe('/GET transactions', () => {
    it('should GET all the transactions and their books and users', async () => {
      const transaction = new Transaction(testTransaction1);
      await transaction.save();
      const res = await chai.request(server)
        .get('/api/transactions?include=book,seller,buyer');
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.a('array');
      expect(res.body.data.length).to.be.eql(1);
      expect(res.body.data[0]).to.have.property('type').eql('transaction');
      expect(res.body.data[0]).to.have.property('attributes').eql(testTransaction2);
      expect(res.body.data[0]).to.have.property('relationships').eql(testTransactionReq1.data.relationships);
      expect(res.body.included).to.be.a('array');
      expect(res.body.included.length).to.be.eql(3);
      expect(res.body.included).to.include.something.with.property('type', 'book');
      expect(res.body.included).to.include.something.with.property('type', 'user');
    });
  });


  describe('/POST transaction', () => {
    it('should POST a transaction', async () => {
      const res = await chai.request(server)
        .post('/api/transactions')
        .send(testTransactionReq1);
      expect(res).to.have.status(201);
      expect(res.body).to.be.a('object');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('type').eql(testTransactionReq1.data.type);
      expect(res.body.data).to.have.property('attributes').eql(testTransactionReq1.data.attributes);
      expect(res.body.data.relationships).to.deep.equal(testTransactionReq1.data.relationships);
    });
  });
});
