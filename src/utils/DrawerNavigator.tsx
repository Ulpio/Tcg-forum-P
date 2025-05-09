import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CreatePostScreen from '../screens/CreatePostScreen';
import ForumScreen from '../screens/ForumScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CardProductScreen from '../screens/CardProductScreen';


const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Perfil"
      screenOptions={{
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#fff',
        drawerStyle: { backgroundColor: '#1e1e1e' },
        drawerActiveTintColor: '#6200ee',
        drawerInactiveTintColor: '#ccc',
      }}
    >
      <Drawer.Screen name="Criar Post" component={CreatePostScreen} />
      <Drawer.Screen name="Fórum" component={ForumScreen} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
      <Drawer.Screen name="Cartas Disponiveis" component={CardProductScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
