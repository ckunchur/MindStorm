// module.exports = function(api) {
//   api.cache(true);
//   return {
//     presets: ['babel-preset-expo'],
//     plugins: [
//       ['module:react-native-dotenv']
//     ]
//   };
// };

// module.exports = {
//   presets: ['module:metro-react-native-babel-preset'],
//   plugins: [
//     ["module:react-native-dotenv"]
//   ]
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
