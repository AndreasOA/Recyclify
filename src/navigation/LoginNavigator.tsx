import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import SignIn from '../screens/Sign/SignIn';
import SignUp from '../screens/Sign/SignUp';
import SignHome from '../screens/Sign/SignHome';
import AppContainer from "../navigation/AppContainer";
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CameraObj from 'components/Camera';

const SignStack = createStackNavigator()
const SignNavigator = () => {
  return (
    <NavigationContainer theme={DarkTheme} independent={true}>  
      <SafeAreaProvider>
        <SignStack.Navigator
            initialRouteName="SignHome"
            screenOptions={{
                headerShown: false,
                gestureEnabled: false,
            }}
        >
          <SignStack.Screen name="SignHome" component={SignHome} />
          <SignStack.Screen name="SignIn" component={SignIn} />
          <SignStack.Screen name="SignUp" component={SignUp} />
          <SignStack.Screen name="AppContainer" component={AppContainer} />
          <SignStack.Screen name="CameraObj" component={CameraObj} />
        </SignStack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  )
}


export default SignNavigator;


