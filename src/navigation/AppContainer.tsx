import * as React from 'react';
import { useColorScheme } from 'react-native';
import { enableScreens } from 'react-native-screens';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import News from '../screens/Main/News';
import Profile from '../screens/Main/Profile';
import SearchNavigator from './SearchNavigator';
import MarketNavigator from './MarketNavigator';

enableScreens();

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="News"
      screenOptions={{
        tabBarActiveTintColor: '#FF715B',
        headerShown: true,
      }}
    >
      <Tab.Screen
        name="News"
        component={News}
        options={{
          tabBarLabel: 'News',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="newspaper-variant-multiple-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Services"
        component={SearchNavigator}
        options={{
          tabBarLabel: 'Service',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="recycle" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Market"
        component={MarketNavigator}
        options={{
          tabBarLabel: 'Market',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shopping" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const AppContainer = () => {
  return (
        <MyTabs />
  );
};

export default AppContainer;
