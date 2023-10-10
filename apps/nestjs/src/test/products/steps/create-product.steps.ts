import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  ProductTypeormEntity,
  CreateProductCommand,
} from '@ecommerce-monorepo/products-management';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from '../../../app/products/products.module';

const feature = loadFeature(
  './apps/nestjs/src/test/products/features/create-product.feature',
);

defineFeature(feature, (test) => {
  let app: INestApplication;
  let res: request.Response;
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 8001,
          username: 'postgres',
          password: 'postgres',
          database: 'ecommerce',
          entities: [ProductTypeormEntity],
          synchronize: true,
        }),
        ProductsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('Successful Creation', ({ given, when, then }) => {
    let command: CreateProductCommand;

    given('a valid product command data', async () => {
      command = {
        name: 'ProductoPrueba',
        price: 5,
        stock: 10,
      };
    });

    when('the system receives a request create the product', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(command);

      res = response; // store the response in a global variable
    });

    then('a successful response should be retrieved', async () => {
      expect(res.status).toEqual(201);
    });
  });

  test('Product Price Non positive', ({ given, when, then }) => {
    let command: CreateProductCommand;

    given(
      'a product command data in which the price is not positive',
      async () => {
        command = {
          name: 'ProductoPrueba',
          price: -5,
          stock: 10,
        };
      },
    );

    when('the system receives a request create the product', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(command);

      res = response; // store the response in a global variable
    });

    then('a bad request error should be retrieved', async () => {
      expect(res.status).toEqual(400);
    });
  });

  test('Product Stock Non Positive Integer', ({ given, when, then }) => {
    let command: CreateProductCommand;
    let res: request.Response;

    given(
      'a product command data in which the stock is not positive integer',
      async () => {
        command = {
          name: 'ProductoPrueba',
          price: 5,
          stock: 3.5,
        };
      },
    );

    when('the system receives a request create the product', async () => {
      const response = await request(app.getHttpServer())
        .post('/products')
        .send(command);

      res = response; // store the response in a global variable
    });

    then('a bad request error should be retrieved', async () => {
      expect(res.status).toEqual(400);
    });
  });
});
