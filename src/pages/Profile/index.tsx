import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { View, Text, Modal , Alert, TouchableHighlight} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth'

 import { 
   Container,
    Title , 
    BackButton,
    Header,
    HeaderTitle,
    UserAvatar,
    Section,
    ProvidersList,
    ProvidersListContainer,
    Content,
    Hour1,
    ProviderName,
    HourText,
    ContainerModal,
    ContainerModalF,
    TextModal,
    TextButtonModal,
    ModalButton,
  } from './styles';

const Profile: React.FC = () => {
  const { Nome , Cpf, Token, signOut} = useAuth()
  const { goBack, navigate } = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);

  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  const navigateAgendadas = useCallback((value: string) => {
    navigate(value)
  }, [navigate])

  const botoes = [
    { title: 'Aulas Agendadas', value: 'Agendadas' },
    { title: 'Alterar Senha', value: '2' },
    { title: 'Falar com o Suporte', value: '3' },
    { title: 'Falar com o Suporte', value: '4' },
    { title: 'Falar com o Suporte', value: '5' },
    { title: 'Falar com o Suporte', value: '6' },
  ];

  return (
    <Container>
            <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Perfil do Usuário: {'\n'}{Nome}</HeaderTitle> 

        <UserAvatar
          source={{
            uri:
              Nome.avatar_url ||
              'https://api.adorable.io/avatars/56/abott@adorable.png',
          }}
        />
      </Header>
      <Title>
        Aqui você pode consultar aulas agendadas, desagendar aulas, alterar senha...
      </Title>
      
      <Content>
      <ProvidersList
              showsHorizontalScrollIndicator={true}
              data={botoes}
              keyExtractor={(item,index) => index.toString()}
              renderItem={({item})=>{
            return(   
              <Section> 
                <Hour1 
                  onPress={() => {setModalVisible(!modalVisible); navigateAgendadas(item.value)}}
                >
                <ProviderName >
                <HourText >
                  {item.title}
                </HourText>
                </ProviderName>
      
                </Hour1>
               </Section>  
                    )
                }}
              />
      </Content>
      <BackButton onPress={signOut}>
        <Title>
          Sair
        </Title>
      </BackButton>
      
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                }}
      >
        <ContainerModalF>
          <ContainerModal>
          <TextModal>
          Para desagendar uma aula
          é necessário pelo menos 48 horas de 
          antecedencia...
          </TextModal>
            <ModalButton
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              >
            <TextButtonModal>Fechar e Continuar</TextButtonModal>
            </ModalButton>
            </ContainerModal>
          </ContainerModalF>
      </Modal>
      
    </Container>
  );
}

export default Profile;