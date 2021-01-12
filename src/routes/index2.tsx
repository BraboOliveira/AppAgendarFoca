import React from 'react'
import { View, ActivityIndicator } from 'react-native'

import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'
import AppInicio from './app.inicio'
import { useAuth } from '../hooks/auth'

const Routes: React.FC = () => {
  const { Nome, loading } = useAuth()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#999" />
      </View>
    )
  }

  // return Nome ? <AppRoutes /> : <AuthRoutes />
  return Nome ? <AppRoutes/> : <AuthRoutes />
}

export default Routes
