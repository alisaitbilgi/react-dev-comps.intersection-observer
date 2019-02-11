module.exports = function (api) {
  const presets = [
    "@babel/env",
    "@babel/preset-react",
    "@babel/preset-typescript"
  ];

  api.cache.never();

  return {
    presets
  };
};
