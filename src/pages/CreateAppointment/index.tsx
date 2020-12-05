import React, { useCallback, useEffect, useState, useMemo } from 'react'

import { useRoute, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import { Platform, Alert, Text } from 'react-native'
import { endOfDay, format } from 'date-fns'
import DateTimePicker from '@react-native-community/datetimepicker'
import {format as dateFormat} from 'date-fns';
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
  Categoria: string
}

export interface Provider {
  id: string
  name: string
  avatar_url: string
}

interface AvailabilityItem {
  hour: string
  available: boolean
}

const CreateAppointment: React.FC = () => {
  const { Nome , Cpf, Token} = useAuth()
  const route = useRoute()
  const routeParams = route.params as RouteParams
  const { goBack, navigate } = useNavigation()
  const [aulaDisp, setAuladisp] = useState([])
  const [dataMin, setDatamin] = useState('')
  const [dataMax, setDatamax] = useState('')
  const [availability, setAvailability] = useState<AvailabilityItem[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dataSelecionada, setDataselecionada] = useState('')
  const [selectedHour, setSelectedHour] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [show, setShow] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  )
  const [placa, setPlaca] = useState('JKT0001')
  const [dataHora, setDataHora] = useState('2020-12-05T17:12:00')
  const [categoria, setCategoria] = useState('')
  const [codFilial, setCodFilial] = useState('10')


  useEffect(() => {
    async function aulasDisponiveis(): Promise<void>{
    try{
      console.log(Cpf, Token, routeParams.providerId, routeParams.Categoria)
      const a = await routeParams.providerId
    const aulas = await api.post('/WSAgendamento/AulasPraticasDisponiveis',null, { params:{
      cpf: Cpf,
      token: Token,
      //codFilial: a,
      //categoria: routeParams.Categoria,
       codFilial: '10',
       categoria: 'B',
    }})
      setProviders(aulas.data)
      console.log(aulas.data)
      let dataehora = aulas.data.map( hora=>hora.AulaDataHora)
      setAvailability(dataehora)
      setAuladisp(dataehora)
      let datamax = format(new Date([...dataehora].pop()),'yyyy-MM-dd')
      let datamin = format(new Date([...dataehora].shift()),'yyyy-MM-dd')
      setDatamax(datamax)
      setDatamin(datamin)
      console.log(datamin)
      console.log(dataehora)
  }catch(e){
    console.log(e)
    }
  }
  aulasDisponiveis()
  }, [])

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

  const handleSelectHour = useCallback((Hora: string, Categoria: string, Placa: string) => {
    console.log(Hora+' '+Categoria+' '+Placa)
    setSelectedHour(Hora)
    //setPlaca(Placa)
    setCategoria(Categoria)
  }, [])

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate)
      console.log(Cpf, Token, codFilial, categoria, placa,selectedHour)
      await api.post('/WSAgendamento/AgendarAulaPratica',null, {params: {
        cpf:Cpf,
        token:Token,
        codFilial: codFilial,
        categoria: categoria,
        placa:placa,
        dataHora: selectedHour,

        // provider_id: selectedProvider,
        // date,
      }})
      navigate('AppointmentCreated', { selectedHour: selectedHour.getTime() })
    } catch (err) {
      console.log(err)
      console.log(Cpf +' '+ Token+' '+ codFilial+' '+ categoria+' '+ placa +' '+ selectedHour)
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu ao tentar criar o agendamento, tente novamente',
      )
    }
  }, [selectedProvider, selectedDate, selectedHour, navigate])



  const dateFormatted = useMemo(
    () => format(selectedDate, "dd '/' MM '/' yyyy"),
    [selectedDate]
  );
  


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
              minimumDate={new  Date ( dataMin) }
              maximumDate={new  Date ( dataMax) }
              value={selectedDate}
              locale='pt-br'
            />
          )}
        </Calendar>
        {/* <DateTimePicker 
          value={selectedDate}
          mode="time" 
          minuteInterval = { 5 }
          display = "spinner"
        /> */}
        <Title>Escolha o horário</Title>
         <SectionContent>
     {/* {morningAvailability.map(({ hourFormatted, hour, available }) => (
      <Hour
        enabled={available}
        selected={selectedHour === hour}
        available={available}
        key={hourFormatted}
        onPress={() => handleSelectHour(hour)}
      >
        <HourText selected={selectedHour === hour}>
          {hourFormatted}
        </HourText>
      </Hour>
    ))} */}
<ProvidersListContainer>
 <ProvidersList
  showsHorizontalScrollIndicator={false}
  data={providers}
  keyExtractor={(provider) => provider.AulaDataHora}
  renderItem={({item})=>{
    return(
      <Hour 
        onPress={() => handleSelectHour(item.AulaDataHora, item.Categoria, item.VeiculoPlaca)}
        //onPress={() => console.log(item.AulaDataHora)}
        selected={selectedHour === item.AulaDataHora}
      >
      <SectionContent>
       <ProviderName >
         Placa: {item.VeiculoPlaca}{"\n"}
         Data: {dateFormatted } {"\n"}
         Hora: { format(new Date(item.AulaDataHora),'HH:MM:SS')}
       </ProviderName>
      </SectionContent>
      </Hour>
    )
  }}
/>
</ProvidersListContainer>
  </SectionContent>

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