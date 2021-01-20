import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { View, Text,style, Modal , Alert, TouchableHighlight, Animated, Dimensions, Image,ImageBackground, SafeAreaView} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useAuth } from '../../hooks/auth'
import Carousel from 'react-native-snap-carousel';
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
    Content1,
    Content2,
    Hour1,
    ProviderName,
    HourText,
    ContainerModal,
    ContainerModalF,
    TextModal,
    TextButtonModal,
    ModalButton,
    ButtonBusca,
    ButtonBuscaText,
    Scroll,
    TextBanner,
    StyledFlatList,
    SlideBut,
    Button2,
    Pontos,
  } from './styles';
  import { ParallaxImage } from 'react-native-snap-carousel';
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

const Inicio: React.FC = () => {
  const { Nome , Cpf, Token, signOut} = useAuth()
  const { goBack, navigate } = useNavigation()
  const [modalVisible, setModalVisible] = useState(false);
  const [ativo, setAtivo] = useState(0);

  const slides = [
    { title: 'Agende Suas Aulas Pelo Aplicativo', num : 0, value: 'Dashboard' ,uri: 'https://img.ibxk.com.br/2020/01/30/30021141299110.jpg?w=1120&h=420&mode=crop&scale=both'},
    { title: 'Alterar Senha', value: '2', num : 1, uri: 'https://www.autoescolaonline.net/wp-content/uploads/2018/09/post-trocar-autoescola.jpg'},
    { title: 'Falar com o Suporte', num : 2, value: '3' , uri: 'https://automotoescolacarlao.com.br/wp-content/uploads/2017/02/placas.png'},
    { title: 'Falar com o Suporte', num : 3, value: '3', uri: 'https://autoescolaneon.com.br/wp-content/uploads/2016/10/cnh.png' },
    { title: 'Aulas Agendadas', num : 4, value: 'Agendadas' , uri: 'https://www.autoescolaonline.net/wp-content/uploads/2019/08/post-autoescola-post.jpg'},
    { title: 'Alterar Senha', num : 5, value: '2' , uri: 'https://www.autoescolaonline.net/wp-content/uploads/2019/08/post-autoescola-post.jpg'},
    { title: 'Falar com o Suporte', num : 6, value: '3' , uri: 'https://www.autoescolaonline.net/wp-content/uploads/2019/08/post-autoescola-post.jpg'},
    { title: 'Falar com o Suporte', num : 7, value: '3' , uri: 'https://www.autoescolaonline.net/wp-content/uploads/2019/08/post-autoescola-post.jpg'},
  ];
  const navigateBack = useCallback(() => {
    goBack()
  }, [goBack])

  const navigateAgendadas = useCallback((value: string) => {
    navigate(value)
  }, [navigate])

  const botoes = [
    { title: 'Agendar Aula', value: 'Routes', num : 0},
    { title: 'A Empresa', value: '2',  num : 1},
    { title: 'Simulado', value: '3' , num : 2},
    { title: 'Categorias', value: '3', num : 3},
    // { title: '...', value: 'Agendadas', num : 4},
    // { title: '...', value: '2' , num : 5},
    // { title: 'Falar com o Suporte', value: '3'},
    // { title: 'Falar com o Suporte', value: '3'},
  ];
  const _renderItem = ({item})=>{
    return (
      <View >
        <Text >{item.title}</Text>
        <Text>{item.text}</Text>
      </View>
    );
}
  return (
    <Container>
      <Scroll>      
        <Header>
        <Image
        style={{width: 120, height: 60,}}
                source={{
                  uri: "http://179.188.38.158/dist/logo.png",
                }}
          />
          {/* <Title>
            Inicio
          </Title> */}
        </Header>

      <Content>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center' }} >
                <Carousel
                  layout={"default"}
                  //ref={ref => carousel = ref}
                  data={slides}
                  sliderWidth={windowWidth}
                  itemWidth={windowWidth-70}
                  renderItem={({item})=>{
                    return (
                          <ImageBackground
                            source={item}
                            imageStyle={{ borderRadius: 6}}
                            style={{
                              opacity:  0.8,
                              backgroundColor:'#000',
                              borderRadius: 6,
                              height: 150,
                              padding: 20,
                              marginLeft: 1,
                              marginRight: 1,
                               }}>
                            <TextBanner>{item.title}</TextBanner>
                            {/* <TextBanner>{item.value}</TextBanner> */}
                        </ImageBackground>
                    );
                }
                }
                onSnapToItem = { (index) => {setAtivo(index)}} />
            </View>
            <View style={{ flex: 1, flexDirection:'row', justifyContent: 'center' }} >
            <Pontos>
            <StyledFlatList
              data={slides}
              keyExtractor={(item,index) => index.toString()}
              horizontal= {true}
              renderItem={({item})=>{
            return(   
              <SlideBut> 
                <Button2 
                  onPress={() => {}}
                  selected={item.num === ativo}
                >
                <HourText  >
                  {item.num + 1}
                </HourText>
                </Button2>
               </SlideBut>  
                    )
                }}
              />
              </Pontos>
              </View>
        </Content>
        <Content1>    
      <ProvidersList
              data={botoes}
              keyExtractor={(item,index) => index.toString()}
              horizontal={false}
              numColumns={2}
              renderItem={({item})=>{
            return(   
              <Section> 
                <Hour1 
                  onPress={() => {setModalVisible(!modalVisible); navigateAgendadas(item.value)}}
                >
                <HourText >
                  {item.title}
                </HourText>
                </Hour1>
               </Section>  
                    )
                }}
              />
      </Content1>
      </Scroll>
    </Container>
  );
}

export default Inicio;