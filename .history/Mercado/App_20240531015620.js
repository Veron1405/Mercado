import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ListsScreen from './screens/ListsScreen';
import FloatingTabBar from './components/FloatingTabBar';
import { Animated } from 'react-native';
import LottieView from 'lottie-react-native';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const WelcomeScreen = ({ navigation }) => {
  const animation = React.useRef(null);
  
  React.useEffect(() => {
    animation.current.play();
    setTimeout(() => {
      navigation.replace('Main');
    }, 4000); // Adjust timing according to the animation length
  }, []);

  return (
    <LottieView
      ref={animation}
      source={require('./assets/animations/welcome.json')}
      autoPlay
      loop={false}
      style={{ flex: 1 }}
    />
  );
};

function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <FloatingTabBar {...props} />}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Lists" component={ListsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
