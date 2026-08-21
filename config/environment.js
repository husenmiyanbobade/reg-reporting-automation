const path = require('path');

// Resolve to the actual project root, converted to a proper file:// friendly path

const projectRoot = path.resolve(__dirname,'..').replace(/\\/g, '/');

const BASE_URL = process.env.BASE_URL.replace('__DIRNAME__', projectRoot);

const TEST_USERNAME = process.env.TEST_USERNAME ;
const TEST_PASSWORD = process.env.TEST_PASSWORD ;
const ENV_NAME = process.env.ENV_NAME ;

module.exports = {BASE_URL , TEST_USERNAME, TEST_PASSWORD, ENV_NAME};