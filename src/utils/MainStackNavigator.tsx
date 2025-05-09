import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import PostDetailScreen from '../screens/PostDetailScreen';
import NewsDetailScreen from '../screens/NewsDetailScreen/NewsDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import CardProductScreen from '../screens/CardProductScreen';
import CardDetailScreen from '../screens/CardDetailScreen';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
      

      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CardDetail" component={CardDetailScreen} />
      
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
