import {
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator,
} from 'react-navigation';

import HeaderNavigationOptions from './components/Header';

import Main from './pages/Main';

const InitialStack = createStackNavigator({
  Main: {
    screen: Main,
    navigationOptions: HeaderNavigationOptions.headerWithTitle,
  },
});

const AppRoute = createSwitchNavigator({ InitialStack });

const Routes = createAppContainer(
  createSwitchNavigator(
    {
      App: AppRoute,
    },
    {
      initialRouteName: 'App',
    }
  )
);

export default Routes;
