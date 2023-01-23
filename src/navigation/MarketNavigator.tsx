import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import FilterMarket from '../screens/Market/FilterMarket';
import CreateOffer from '../screens/Market/CreateOffer';
import Marketplace from '../screens/Main/Marketplace';

const MarketStack = createStackNavigator()
export default function MarketNavigator() {
  return (
    <MarketStack.Navigator
        initialRouteName="Marketplace"
        screenOptions={{
            headerShown: false,
        }}
    >
      <MarketStack.Screen name="Marketplace" component={Marketplace} />
      <MarketStack.Screen name="FilterMarket" component={FilterMarket} />
      <MarketStack.Screen name="CreateOffer" component={CreateOffer} />
    </MarketStack.Navigator>
  )
}