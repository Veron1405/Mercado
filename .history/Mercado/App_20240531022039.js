import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Alert, StatusBar } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import ListsScreen from './screens/ListsScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import FloatingTabBar from './components/FloatingTabBar';
import { customTheme } from './Theme';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <FloatingTabBar {...props} />}
      tabBarOptions={{
        activeTintColor: customTheme.colors.primary,
        inactiveTintColor: customTheme.colors.text,
        style: {
          backgroundColor: customTheme.colors.card,
          borderTopColor: customTheme.colors.border,
        },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Lists" component={ListsScreen} />
      {/* Adicione mais telas aqui, se necessário */}
    </Tab.Navigator>
  );
};

const showAlert = (title, message) => {
  Alert.alert(title, message);
};

const App = () => {
  return (
    <NavigationContainer theme={customTheme}>
      <StatusBar barStyle="light-content" backgroundColor={customTheme.colors.background} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{
            tabBarVisible: false, // Ocultar a tab bar na tela principal
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
