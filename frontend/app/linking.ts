// linking.ts
const linking = {
  prefixes: ['studentmentor://'],
  config: {
    screens: {
      login: 'login',
      verify: 'verify-email/:uid/:token', // this should match your page
      '(tabs)': {
        screens: {
          home: 'home',
          // ... add more tab screens
        },
      },
      // fallback screen
      '+not-found': '*',
    },
  },
};

export default linking;