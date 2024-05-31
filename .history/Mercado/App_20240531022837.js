import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ListsScreen from './screens/ListsScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import FloatingTabBar from './components/FloatingTabBar';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator tabBar={(props) => <FloatingTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ tabBarVisible: false }} // Oculta a tela da tab bar
      />
      <Tab.Screen name="Lists" component={ListsScreen} />
      {/* Adicione mais telas aqui, se necessário */}
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }} // Oculta o cabeçalho
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
