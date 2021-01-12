import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import Profile from '../pages/Profile'
import CreateAppointment from '../pages/CreateAppointment'
import AppointmentCreated from '../pages/AppointmentCreated'
import TiposDeAula from '../pages/TiposDeAula'
import Agendadas from '../pages/Agendadas'
import Inicio from '../pages/Inicio'
import Dashboard from '../pages/Dashboard'

const App = createStackNavigator()

const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: '#312e38' },
    }}
    initialRouteName="Inicio"
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="CreateAppointment" component={CreateAppointment} />
    <App.Screen name="AppointmentCreated" component={AppointmentCreated} />
    <App.Screen name="Tipos" component={TiposDeAula} />
    <App.Screen name="Profile" component={Profile} />
    <App.Screen name="Agendadas" component={Agendadas} />
    
  </App.Navigator>
)

export default AppRoutes
