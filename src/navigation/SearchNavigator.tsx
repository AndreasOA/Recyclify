import * as React from 'react';
import { Text, View, useColorScheme } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack'
import SearchFilter from '../screens/SubSearch/FilterSearch';
import Search from '../screens/Main/Search';

const SearchStack = createStackNavigator()
export default function SearchNavigator() {
  return (
    <SearchStack.Navigator
        initialRouteName="News"
        screenOptions={{
            headerShown: false,
        }}
    >
      <SearchStack.Screen name="Search" component={Search} />
      <SearchStack.Screen name="SearchFilter" component={SearchFilter} />
    </SearchStack.Navigator>
  )
}