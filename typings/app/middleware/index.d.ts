// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportXmlbodyparser from '../../../app/middleware/xmlbodyparser';

declare module 'egg' {
  interface IMiddleware {
    xmlbodyparser: typeof ExportXmlbodyparser;
  }
}
