import React, { useCallback, useEffect, useState, useMemo } from 'react'

import { useRoute, useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Feather'
import { Platform, Alert, Text, StyleSheet,View, ActivityIndicator } from 'react-native'
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
  Content1,
  Content,
  ProvidersList,
  ProvidersListContainer,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar1,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  Hour1,
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
  inicioAula: string
  fimAula: string
  value: string
  label: string
  placa: string
  qtdAulasDisponiveis: string
  categoria: string
  marca:string
}

interface AvailabilityItem {
  hour: string
  available: boolean
}

const CreateAppointment: React.FC = () => {
  const { Nome , Cpf, Token, codFilial, setCodFilial, categoria, setCategoria, qtdAula, setQtdaula} = useAuth()
  const route = useRoute()
  const routeParams = route.params as RouteParams
  const { goBack, navigate } = useNavigation()
  const [aulaDisp, setAuladisp] = useState([])
  const [qtdaulas, setQtdAulas] = useState([])
  const [dataMin, setDatamin] = useState('')
  const [inicio, setIni] = useState('')
  const [final, setFinal] = useState('')
  const [dataMax, setDatamax] = useState('')
  const [availability, setAvailability] = useState<AvailabilityItem[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [dataSelecionada, setDataselecionada] = useState('')
  const [selectedHour, setSelectedHour] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [baixou, setBaixou] = useState(false)
  const [providers, setProviders] = useState<Provider[]>([])
  const [selectedProvider, setSelectedProvider] = useState(
    routeParams.providerId,
  )
  const [placa, setPlaca] = useState('')
  const [dataHora, setDataHora] = useState('')

useEffect(()=>{
    async function aulasDisponiveis(): Promise<void>{
    try{
      const Data = format(selectedDate, "yyyy'-'MM'-'dd")
      console.log(Cpf, Token, codFilial, categoria, Data)
    const aulas = await api.post('/WSAgendamento/AulasPraticasDisponiveisDia',null, { params:{
      cpf: Cpf,
      token: Token,
      codFilial: codFilial,
      categoria: categoria,
      qtdAula: qtdAula,
      placa:placa,
      data: Data,
    }})
       setProviders(aulas.data)
       console.log(...aulas.data)
  }catch(e){
    console.log(e.response.data)
    Alert.alert("Não há aulas disponiveis para o parâmetro ")
    }
  }
  aulasDisponiveis()
},[selectedDate])

  useEffect(() => {
    async function QtdAulas(): Promise<void> {
      try{
        console.log(Cpf, Token, codFilial, categoria, qtdAula)
      const aulas = await api.post('/WSAgendamento/DisponibilidadeVeiculos',null, { params:{
        cpf: Cpf,
        token: Token,
        codFilial: codFilial,
        categoria: categoria,
        qtdAula: qtdAula,
      }})
        let DATA2 = aulas.data.map( data=>data.dtFim)
        let DATA1 = aulas.data.map( data=>data.dtInicio)
        console.log(...aulas.data)
        setQtdAulas(aulas.data)
        let datamax = format(new Date([...DATA2].pop()),'yyyy-MM-dd')
        let datamin = format(new Date([...DATA1].shift()),'yyyy-MM-dd')
        let ini = format(new Date([...DATA2].pop()),'dd/MM/yyyy')
        let fin = format(new Date([...DATA1].shift()),'dd/MM/yyyy')
        setIni(fin)
        setFinal(ini)
        console.log(dataMax)
        setDatamax(datamax)
        setDatamin(datamin)
        setBaixou(true)

    }catch(e){
      console.log(e.response.data)
      Alert.alert("Não há aulas disponiveis para o parâmetro solicitado, por favor entre em contato com a administração ")
    }
    }
    QtdAulas()
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

  const handleSelectHour = useCallback((Hora: string, categoria: string, placa: string) => {
    console.log(Hora+' '+categoria+' '+placa)
    setSelectedHour(format(new Date(Hora),'HH:MM:SS'))
    setDataHora(Hora)
    setCategoria(categoria)
  }, [])

  const handleSelectPlaca= useCallback((Placa: string) => {
    console.log(Placa)
    setPlaca(Placa)
  }, [])

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(dataHora)
      console.log(Cpf, Token, codFilial, categoria, placa, date )
      
      await api.post('/WSAgendamento/AgendarAulaPratica',null, {params: {
        cpf:Cpf,
        token:Token,
        codFilial: codFilial,
        categoria: categoria,
        placa:placa,
        dataHora: dataHora,
        qtdAula: qtdAula,
      }})
      navigate('AppointmentCreated', { date : date.getTime() })
    } catch (err) {
      //console.log(err.response.data)
      console.log(Cpf +' '+ Token+' '+ codFilial+' '+ categoria+' '+ placa +' '+ dataHora)
      Alert.alert(
        'Erro ao criar agendamento',
        'Ocorreu ao tentar criar o agendamento, tente novamente',
        //'Caso o erro persista entre em contato com a administração',
        //teste
      )
    }
  }, [selectedProvider, selectedDate, selectedHour, navigate])



  const dateFormatted = useMemo(
    () => format(selectedDate, "dd '/' MM '/' yyyy"),
    [selectedDate]
  );
  
const aulasQtd = [
  { label: '1 aula', value: '1' },
  { label: '2 aulas', value: '2' },
  { label: '3 aulas', value: '3' },
];
const placeholder = {
  label: 'Selecione um veículo...',
  value: null,
};
const styles = StyleSheet.create({
  LISTA: {
    margin: 10,
    padding: 20,
    borderRadius: 40,
    color: __BUNDLE_START_TIME__,
  }
});
if (!baixou) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#999" />
    </View>
  )
}
else{
  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Finalizar Agendamento</HeaderTitle>

        <UserAvatar
          source={{
            uri:
              Nome.avatar_url ||
              'https://api.adorable.io/avatars/56/abott@adorable.png',
          }}
        />
      </Header>
      <Content1>
      <Title>Quantidade de Aulas</Title>
      <Content>
      <ProvidersList
              horizontal
              showsHorizontalScrollIndicator={true}
              data={aulasQtd}
              keyExtractor={(item,index) => index.toString()}
              renderItem={({item})=>{
            return(   
              <Section> 
                <Hour1 
                  // onPress={() =>setQtdaula(item.value)}
                  onPress={() =>Alert.alert("Disponível Apenas de Duas Aulas Sequenciais")}
                  selected={qtdAula === item.value}
                >
                <ProviderName >
                <HourText selected={qtdAula === item.value}>
                  {item.label}
                </HourText>
                </ProviderName>
      
                </Hour1>
               </Section>  
                    )
                }}
              />
      </Content>
      <Title>Escolha o Veículo</Title>
      <Content>
      <ProvidersList
              horizontal
              showsHorizontalScrollIndicator={true}
              data={qtdaulas}
              keyExtractor={(item,index) => index.toString()}
              renderItem={({item})=>{
            return(   
              <Section> 
                <Hour 
                  onPress={() =>handleSelectPlaca(item.placa)}
                  selected={placa === item.placa}
                >
                <ProviderName >
                  <HourText selected={placa === item.placa}>
                  Carro: {item.marca}{" "}
                  de Placa: {item.placa}{"\n"}
                  Datas Disponiveis de dia: {inicio} {"\n"}
                  até dia: {final} {"\n"}
                  Aulas Disponíveis: {item.qtdAulasDisponiveis}
                  </HourText>
                </ProviderName>
      
                </Hour>
               </Section>  
                    )
                }}
              />
      </Content>
        <Calendar1>
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
              value={new Date(selectedDate)}
              is24Hour={true}
              timeZoneOffsetInMinutes={180}
            />
          )}
        </Calendar1>
        <Title>Escolha o horário</Title>
          <ProvidersListContainer>
            <ProvidersList
              showsHorizontalScrollIndicator={false}
              data={providers}
              keyExtractor={(providers,index) => index.toString()}
              renderItem={({item})=>{
            return(   
              <Section> 
                <Hour 
                  onPress={() => handleSelectHour(item.inicioAula, item.categoria, item.placa)}
                  selected={dataHora === item.inicioAula}
                >                  
                  {item.hasOwnProperty('placa') && item.hasOwnProperty('fimAula') && item.hasOwnProperty('inicioAula') ?
                <ProviderName >
                  <HourText selected={dataHora === item.inicioAula}>
                    Veiculo: {item.marca}{' '} Placa: {item.placa}{"\n"}
                    Data: {dateFormatted } {"\n"}
                    Horário da Aula de: { format(new Date(item.inicioAula),'hh:mm:ss')}{' '}
                    até { format(new Date(item.fimAula),'hh:mm:ss')}
                  </HourText>
                </ProviderName>
                : <Text></Text>
                }
                </Hour>
               </Section>  
                    )
                }}
              />
          </ProvidersListContainer>
        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar Aula</CreateAppointmentButtonText>
        </CreateAppointmentButton>
        </Content1>
    </Container>
  )
              }
}
export default CreateAppointment