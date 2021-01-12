import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import Profile from '../pages/Profile'
import CreateAppointment from '../pages/CreateAppointment'
import AppointmentCreated from '../pages/AppointmentCreated'
import TiposDeAula from '../pages/TiposDeAula'
import Agendadas from '../pages/Agendadas'
import Inicio from '../pages/Inicio'
import Dashboard from '../pages/Dashboard'
import Routes from './index2';

const App = createStackNavigator()

const AppInicio: React.FC = () => (
//   <App.Navigator
//     screenOptions={{
//       headerShown: false,
//       cardStyle: { backgroundColor: '#312e38' },
//     }}
//   >
//     <App.Screen name="Inicio" component={Dashboard} />
//     <App.Screen name="Dashboard" component={Dashboard} />
    
//   </App.Navigator>
<App.Navigator 
  initialRouteName="Home" 
  screenOptions={{
    headerShown: false
  }}
  >
  <App.Screen name="Inicio" component={Inicio} />
  <App.Screen name="Routes" component={Routes} />
</App.Navigator>
)

export default AppInicio


