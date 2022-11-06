import { env } from './lib/env';
import { HttpServer } from './net/http-server';

const server = new HttpServer(env.servicePort);
