import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, AppState, Linking, Platform, TouchableWithoutFeedback } from 'react-native';
import Home from './src/screens/Home';
import DeviceList from './src/screens/DeviceList';
import { Stack, HStack, Center, Box, Progress, Heading, NativeBaseProvider, Icon } from 'native-base';
import {createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Root, Popup } from 'popup-ui'
import AsyncStorage from '@react-native-async-storage/async-storage';
import NewDevicePrompt from './src/screens/NewDevicePrompt';
const config = {
  dependencies: {
    'linear-gradient': require('expo-linear-gradient').LinearGradient
  }
}

const nav_bar_options = {
  title: "NVNT Patch",
  headerStyle: {
    backgroundColor: "#18181b"
  },
  headerTintColor: "#fff",
  headerTitleAlign: 'center'
}

const nav_bar_options_no_back = {
  title: "Connect New Device",
  headerStyle: {
    backgroundColor: "#18181b"
  },
  headerTintColor: "#fff",
  headerTitleAlign: 'center',
  headerLeft: () => {
    return null;
  },
  headerBackVisible: false
}

const PERSISTENCE_KEY = 'APPLICATION_STATE';

const nav_stack = createNativeStackNavigator();
export default function App() {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [initialState, setInitialState] = useState();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if(!isReady || initialState == undefined) {
      restoreState();
    }

    AppState.addEventListener('change', _handleAppStateChange);
 
    return() => {
      AppState.removeEventListener('change', _handleAppStateChange);
    }
  }, [isReady]);

  async function restoreState() {
    try {
      const initialUrl = await Linking.getInitialURL();

      if(Platform.OS !== 'web') {
        const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
        var state = savedStateString ? JSON.parse(savedStateString): undefined;
        if(state !== undefined) {
          setInitialState(state);
        } else if(state == undefined) {
          state = {
            bleConnected: false,
            bleMAC: "null"
          };
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
          setInitialState(state);
        }
        console.log(state);
      }
      console.log("Restore state called!");
    } finally {
      setIsReady(true);
    }
  }



  const _handleAppStateChange = nextAppState => {
    if(appState.current.match(/inactive|background/) && nextAppState === 'active') {
      console.log("App has come into the foreground!");
      /*
        Check BLE for updates
      */
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
    console.log("App State:", appState.current);
  }

  if(!isReady) {
    return null; /* TO-DO: Local cache error page */
  }

  return (
    <NativeBaseProvider config={config}>
        <NavigationContainer>
          <nav_stack.Navigator>
              <nav_stack.Screen name="Home" component={Home} options={nav_bar_options} />
              <nav_stack.Screen name="Connect" component={DeviceList} options={nav_bar_options_no_back} />
              <nav_stack.Screen name="NewDevice" component={NewDevicePrompt} options={nav_bar_options_no_back} />          
          </nav_stack.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
