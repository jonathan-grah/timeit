import { createStackNavigator, createAppContainer } from 'react-navigation';

import HomeScreen from './screens/Home.js';
import LoginScreen from './screens/Login.js';
import WeekScreen from './screens/Week.js';

const RootStack = createStackNavigator(
  {
    Home: { screen: HomeScreen },
    Login: { screen: LoginScreen },
    Week: { screen: WeekScreen }
  },
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#4388d6'
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }
);

const App = createAppContainer(RootStack);

export default App;
