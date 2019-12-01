import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { TabBarRoutes, StackRoutes } from './Routes'
import TabBarComponent from './TabBarComponent';

const TabNavigator = createBottomTabNavigator({
  HomeScreen: {
    screen: TabBarRoutes.HomeScreen
  },
  ExploreScreen: {
    screen: TabBarRoutes.ExploreScreen
  },
  UploadScreen: {
    screen: TabBarRoutes.UploadScreen
  },
  NotificationScreen: {
    screen: TabBarRoutes.NotificationScreen
  },
  ProfileScreen: {
    screen: TabBarRoutes.ProfileScreen
  },
}, {
  initialRouteName: 'ProfileScreen',
  lazy: true,
  tabBarOptions: {
    showLabel: false,
  },
  tabBarComponent: props => <TabBarComponent  {...props} />
});

const AuthStack = createStackNavigator({
  LoginScreen: {
    screen: StackRoutes.LoginScreen
  }
}, { headerMode: 'none' });

const AppStack = createStackNavigator({
  TabNavigator: {
    screen: TabNavigator
  },
  MessageScreen: {
    screen: StackRoutes.MessageScreen
  },
  ConversationScreen: {
    screen: StackRoutes.ConversationScreen
  },
  ProfileViewScreen: {
    screen: StackRoutes.ProfileViewScreen
  },
  PostViewScreen: {
    screen: StackRoutes.PostViewScreen
  }
}, { headerMode: 'none' });

const SwitchNavigator = createSwitchNavigator({
  Auth: AuthStack,
  App: AppStack
}, {
  initialRouteName: 'Auth'
});

const AppNavigator = createAppContainer(SwitchNavigator);

export default AppNavigator;