module.exports = {
  default: {
    requireModule: [],
    require: [
      'cucumber/world.js',
      'cucumber/hooks.js',
      'features/step_definitions/**/*.js'
    ],
    paths: ['features/**/*.feature'],
    format: ['progress']
  }
};