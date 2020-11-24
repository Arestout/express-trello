const chai = require('chai');
const dirtyChai = require('dirty-chai');
// global.Promise = jest.requireActual('promise');

chai.use(dirtyChai);

jest.setTimeout(10000);

global.jestExpect = global.expect;
global.expect = chai.expect;
