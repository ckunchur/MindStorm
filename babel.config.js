// module.exports = function(api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//   };
// };

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'], // Keep this for Expo projects
    plugins: [
      ['module:react-native-dotenv'], // Add any additional plugins here
    ],
  };
};
