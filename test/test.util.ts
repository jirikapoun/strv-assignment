import { App, applicationDefault, initializeApp } from 'firebase-admin/app';
import request from 'supertest';
import { Connection, createConnection, useContainer } from 'typeorm';
import { Container } from 'typeorm-typedi-extensions';
import { app } from '../src/app';
import { environment, loadAndValidateEnvironment } from '../src/common';
import { UserEntity } from '../src/data';

let firebaseApp: App;

let connection: Connection;

export async function setup() {
  loadAndValidateEnvironment();

  if (!firebaseApp) {
    firebaseApp = initializeApp({
      credential: applicationDefault()
    });
  }

  if (!connection) {
    useContainer(Container);
    connection = await createConnection({
      type: environment.DB_TYPE,
      host: environment.DB_HOST,
      username: environment.DB_USERNAME,
      password: environment.DB_PASSWORD,
      database: environment.DB_NAME,
      schema: environment.DB_SCHEMA,
      synchronize: environment.DB_SYNCHRONIZE === 'true',
      dropSchema: environment.DB_DROP_SCHEMA === 'true',
      entities: [
        UserEntity
      ]
    });
  }
}

export async function expectBadRequest(url: string, payload: object, token?: string) {
  await (token
    ? request(app)
      .post(url)
      .auth(token, { type: 'bearer' })
    : request(app)
      .post(url))
    .send(payload)
    .expect(400);
}

export async function expectUnauthorized(url: string, payload: object, token?: string) {
  await (token
    ? request(app)
      .post(url)
      .auth(token, { type: 'bearer' })
    : request(app)
      .post(url))
    .send(payload)
    .expect(401);
}
