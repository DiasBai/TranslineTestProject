import React from 'react';

import AuthScreen from '../screens/AuthScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackParamList } from '../types';
import { useAuth } from '../provider/AuthProvider.tsx';
import RegisterScreen from '../screens/RegisterScreen.tsx';
import { ActivityIndicator, View } from 'react-native';
import { Colors } from '../theme';

const Stack = createNativeStackNavigator<StackParamList>();

export default function AppNavigator() {
  const { isAuth, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.ivory,
        }}
      >
        <ActivityIndicator color={Colors.accentCyan} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuth ? (
        <>
          <Stack.Screen name={'AuthScreen'} component={AuthScreen} />
          <Stack.Screen name={'RegisterScreen'} component={RegisterScreen} />
        </>
      ) : (
        <Stack.Screen name={'ProfileScreen'} component={ProfileScreen} />
      )}
    </Stack.Navigator>
  );
}
