import '@babel/polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import Class from '../models/class';
import server from '../app';

const { expect } = chai;

chai.use(chaiHttp);

describe('Classes', () => {
  const testClass1 = {
    title: 'Advanced Programming Techniques',
    numbers: ['COS 333'],
  };

  const testClass2 = {
    numbers: ['COS 333'],
  };

  const testClass3 = {
    title: 'Best Class Ever!',
    numbers: ['COS 333'],
  };

  const testClassReq1 = {
    data: {
      type: 'class',
      attributes: testClass1,
    },
  };

  const testClassReq2 = {
    data: {
      type: 'class',
      attributes: testClass2,
    },
  };

  beforeEach(async () => {
    await Class.remove({});
  });


  describe('/GET classes', () => {
    it('should GET all the classes', async () => {
      const res = await chai.request(server)
        .get('/api/classes');
      expect(res).to.have.status(200);
      expect(res.body.data).to.be.a('array');
      expect(res.body.data.length).to.be.eql(0);
    });
  });

  describe('/POST classes', () => {
    it('should not POST a class without title', async () => {
      const res = await chai.request(server)
        .post('/api/classes')
        .send(testClassReq2);
      expect(res).to.have.status(400);
      expect(res.body).to.have.property('errors');
    });

    it('should POST a class', async () => {
      const res = await chai.request(server)
        .post('/api/classes')
        .send(testClassReq1);
      expect(res).to.have.status(201);
      expect(res.body).to.be.a('object');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('type').eql(testClassReq1.data.type);
      expect(res.body.data).to.have.property('attributes').eql(testClassReq1.data.attributes);
    });
  });


  describe('/GET/:id class', () => {
    it('should GET a class by the given id', async () => {
      const classObj = new Class(testClass1);
      await classObj.save();
      const res = await chai.request(server)
        .get(`/api/classes/${classObj.id}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('type').eql('class');
      expect(res.body.data).to.have.property('attributes').eql(testClass1);
    });
  });


  describe('/PATCH/:id class', () => {
    it('should PATCH class given id', async () => {
      const classObj = new Class(testClass1);
      await classObj.save();
      const res = await chai.request(server)
        .patch(`/api/classes/${classObj.id}`)
        .send({
          id: classObj.id,
          type: 'class',
          data: {
            attributes: {
              title: testClass3.title,
            },
          },
        });
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('type').eql('class');
      expect(res.body.data).to.have.property('attributes').eql(testClass3);
    });
  });


  describe('/DELETE/:id class', () => {
    it('should DELETE a class given id', async () => {
      const classObj = new Class(testClass1);
      await classObj.save();
      const res = await chai.request(server)
        .delete(`/api/classes/${classObj.id}`);
      expect(res).to.have.status(200);
      expect(res.body).to.be.a('object');
      expect(res.body.data).to.have.property('id');
      expect(res.body.data).to.have.property('type').eql('class');
      expect(res.body.data).to.have.property('attributes').eql(testClass1);
    });
  });
});
