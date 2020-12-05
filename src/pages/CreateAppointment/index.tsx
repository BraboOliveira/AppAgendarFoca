import React, { useCallback, useEffect, useState, useMemo } from 'react'

import { useRoute, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import { Platform, Alert, Text } from 'react-native'
import { format } from 'date-fns'
import DateTimePicker from '@react-native-community/datetimepicker'

import { useAuth } from '../../hooks/auth'
import api from '../../services/api'

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  Content,
  ProvidersList,
  ProvidersListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from './styles'

interface RouteParams {
  providerId: string
}

export interface Provider {
  id: string
  name: string
  avatar_url: string
}

interface AvailabilityItem {
  hour: number
  available: boolean
}

const CreateAppointment: React.FC = () => {
  const { Nome , Cpf, Token} = useAuth()
  const route = useRoute()
  const routeParams = route.params as RouteParams
  const { goBack, navigate } = useNavigation()
  const [aulaDisp, setAuladisp] = useState('')
  const [availability, setAvailability] = useState<AvailabilityItem[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dataSelecionada, setDataselecionada] = useState('')
  const [selectedHour, setSelectedHour] = useState(0)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [show, setShow] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  )
  

  useEffect(() => {
    console.log(Cpf, Token)
    api.post('/WSAgendamento/AulasPraticasDisponiveis',null, { params:{
      cpf: Cpf,
      token: Token,
      codFilial: '10',
      categoria: 'B',
    }
    }).then(response => {
      setAuladisp(response.data)
      let dataehora = response.data.map( hora=>hora.AulaDataHora)
      setAvailability(dataehora)
      console.log(dataehora)
    })
    setProviders([
      {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        title: 'First Item',
        name: '01 Aula',
      },
      {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        title: 'Second Item',
        name: '02 Aulas',
      },
      {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        title: 'Third Item',
        name: '03 Aulas',
      },
    ])
    
  }, [])

  // useEffect(() => {
  //   api
  //     .get(`providers/${selectedProvider}/day-availability`, {
  //       params: {
  //         year: selectedDate.getFullYear(),
  //         month: selectedDate.getMonth() + 1,
  //         day: selectedDate.getDate(),
  //       },
  //     })
  //     .then(response => {
  //       setAvailability(response.data)
  //     })
  // }, [selectedDate, selectedProvider])

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  const handleSelectProvider = useCallback((providerId: string) => {
    setSelectedProvider(providerId)
  }, [])

  const handleToggleDatePicker = useCallback(() => {
    setShowDatePicker(state => !state)
  }, [])

  const handleDateChanged = useCallback(
    (event: any, date: Date | undefined) => {
      if (Platform.OS === 'android') {
        setShowDatePicker(false)
      }

      if (date) {
        console.log(date)
        setSelectedDate(date)
      }
    },
    [],
  )

  const handleSelectHour = useCallback((hour: number) => {
    setSelectedHour(hour)
  }, [])

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate)

      date.setHours(selectedHour)
      date.setMinutes(0)

      await api.post('/WSAgendamento/AgendarAulaPratica',null, {params: {
        cpf:'93178468234',
        token:'46c02e4d-92fa-4aac-9631-d1269faf73ba',
        codFilial:'10',
        categoria:'B',
        placa:'JKT0001',
        dataHora:'2020-11-23T07:51:00',

        // provider_id: selectedProvider,
        // date,
      }})
      navigate('AppointmentCreated', { date: date.getTime() })
    } catch (err) {
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu ao tentar criar o agendamento, tente novamente',
      )
    }
  }, [selectedProvider, selectedDate, selectedHour, navigate])

  const morningAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour < 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        }
      })
  }, [availability])

  const dateFormatted = useMemo(
    () => format(selectedDate, "dd '/' MM '/' yyyy"),
    [selectedDate]
  );

  const afternoonAvailability = useMemo(() => {
    return availability
      .filter(({ hour }) => hour >= 12)
      .map(({ hour, available }) => {
        return {
          hour,
          available,
          hourFormatted: format(new Date().setHours(hour), 'HH:00'),
        }
      })
  }, [availability])

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Horários Disponíveis</HeaderTitle>

        <UserAvatar
          source={{
            uri:
              Nome.avatar_url ||
              'https://api.adorable.io/avatars/56/abott@adorable.png',
          }}
        />
      </Header>

      <Content>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleToggleDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar Data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>
          <SectionTitle>Data selecionada: {dateFormatted }</SectionTitle>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              onChange={handleDateChanged}
              textColor="#f4ede8"
              minimumDate={new Date(2020, 12, 15)}
              maximumDate={new Date(2020, 12, 18)}
              value={selectedDate}
              locale='pt-br'
            />
          )}
        </Calendar>
        <Title>Escolha o horário</Title>
        <ProvidersListContainer>
          <ProvidersList
            showsHorizontalScrollIndicator={false}
            data={aulaDisp}
            keyExtractor={provider => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                onPress={() => handleSelectProvider(provider.id)}
                selected={provider.id === selectedProvider}
              >
                <ProviderAvatar
                  source={{
                    uri:
                      provider.avatar_url ||
                      'https://api.adorable.io/avatars/32/abott@adorable.png',
                  }}
                />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider['AulaDataHora']}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>
        <Schedule>
          
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar Aula</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  )
}
export default CreateAppointment

// <Title>Escolha o horário</Title>

// <ProvidersListContainer>
// <ProvidersList
//   showsHorizontalScrollIndicator={false}
//   data={providers}
//   keyExtractor={provider => provider.id}
//   renderItem={({ item: provider }) => (
//     <ProviderContainer
//       onPress={() => handleSelectProvider(provider.id)}
//       selected={provider.id === selectedProvider}
//     >
//       {/* <ProviderAvatar
//         source={{
//           uri:
//             provider.avatar_url ||
//             'https://api.adorable.io/avatars/32/abott@adorable.png',
//         }}
//       /> */}
//       <ProviderName selected={provider.id === selectedProvider}>
//         {provider.name}
//       </ProviderName>
//     </ProviderContainer>
//   )}
// />
// </ProvidersListContainer>
// <Section>
//   <SectionTitle>Manhã</SectionTitle>

//   <SectionContent>
//     {morningAvailability.map(({ hourFormatted, hour, available }) => (
//       <Hour
//         enabled={available}
//         selected={selectedHour === hour}
//         available={available}
//         key={hourFormatted}
//         onPress={() => handleSelectHour(hour)}
//       >
//         <HourText selected={selectedHour === hour}>
//           {hourFormatted}
//         </HourText>
//       </Hour>
//     ))}
//   </SectionContent>
// </Section> 
//  <Section>
//   <SectionTitle>Tarde</SectionTitle>

//   <SectionContent>
//     {afternoonAvailability.map(
//       ({ hourFormatted, hour, available }) => (
//         <Hour
//           enabled={available}
//           selected={selectedHour === hour}
//           available={available}
//           key={hourFormatted}
//           onPress={() => handleSelectHour(hour)}
//         >
//           <HourText selected={selectedHour === hour}>
//             {hourFormatted}
//           </HourText>
//         </Hour>
//       ),
//     )}
//   </SectionContent>
// </Section>