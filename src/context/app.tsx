import { createContext } from 'react';

const AppContext = createContext({
  userName: 'bharath',
  setUserName: () => {},
});

export default AppContext;
