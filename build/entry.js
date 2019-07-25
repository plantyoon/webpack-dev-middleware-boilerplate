import 'core-js/stable'

require('../src/main')

if(module.hot) {
  module.hot.accept(); // This will make current module replaceable
}