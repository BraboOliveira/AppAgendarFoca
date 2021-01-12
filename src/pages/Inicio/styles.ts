import styled from 'styled-components/native'
import { Platform } from 'react-native'
import { getStatusBarHeight } from 'react-native-iphone-x-helper'
import { FlatList } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'
import { Provider } from './index'

export const Header = styled.View`
  background: #000;
  opacity: ${props => (props.available ? 1 : 0.5)};
  flex-direction: row;
  align-items: center;
  padding-top: ${getStatusBarHeight() + 24}px;
  height: 130px;
  borderRadius: 15px;
`
export const HeaderTitle = styled.Text`
  color: 5063eb#;
  font-family: 'RobotoSlab-Medium';
  font-size: 20px;
  margin-left: 16px;
`

export const Container = styled.View`
  background: ${props => props.theme.colors.background};
  background: #fff;
  position: relative;
  flex: 1;
`

export const ContainerModal = styled.View`
  background: #fff;
  opacity: ${props => (props.available ? 1 : 0.9)};
  width: 90%;
  borderRadius: 15px;
  align-items: center;
  border: 1px;
`
export const ContainerModalF = styled.View`
  align-items: center;
  justify-Content: center;
  margin: 20px;
  padding-top: 35%;
`


export const Title = styled.Text`
  font-size: 20px;
  color: ${props => props.theme.colors.text};
  color:#000;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 24px 24px 24px;
`
export const TextModal = styled.Text`
  font-size: 18px;
  color: #000;
  font-family: 'RobotoSlab-Medium';
  margin: 24px 24px 24px 24px;
`
export const TextButtonModal = styled.Text`
  font-size: 18px;
  color: #fff;
  font-family: 'RobotoSlab-Medium';
  margin: 5px 30px 5px 30px;
`
export const BackButton = styled.TouchableOpacity`
  margin-top: 0px;
`
export const ModalButton = styled.TouchableOpacity`
  margin-top: 40px;
  background: red;
  borderRadius: 15px;
  margin: 20px;
`

export const UserAvatarButton = styled.TouchableOpacity`
  /* margin-top: 32px; */
`

export const UserAvatar = styled.Image`
  width: 186px;
  height: 186px;
  border-radius: 98px;
  align-self: center;
`

export const ProvidersList = styled(FlatList as new () => FlatList<Provider>)`
  padding: 5px 5px 10px 15px;
  padding-top: 10%;
`

export const ProvidersListTitle = styled.Text`
  font-size: 24px;
  margin-bottom: 24px;
  color: #f4ede8;
  font-family: 'RobotoSlab-Medium';
`
export const ProvidersListContainer = styled.View`
  align-items: center;
  border: 1px;
  border-color: #f4ede8;
  margin: 0px 20px 10px 20px;
  border-radius: 10px;
`
export const Content = styled.SafeAreaView`
justify-content: center;
align-items: center;
justify-content: center;
padding-top: 5%;
`
export const Content1 = styled.View`
flex-direction: row;
`
export const Scroll = styled.ScrollView`
margin:3px;
`
export const Section = styled.View`
  margin-bottom: 5px;
`
export const Hour1 = styled(RectButton)<HourProps>`
  padding: 8px;
  background: ${props => (props.selected ? '#ff9000' : '#000')};
  border-radius: 5px;
  margin-right: 8px;
  opacity: ${props => (props.available ? 1 : 0.7)};
  height: 150px;
  width: 150px;
`
export const HourText = styled.Text<HourTextProps>`
  color: ${props => (props.selected ? '#000' : '#fff')};
  font-family: 'RobotoSlab-Regular';
  font-size: 18px;
`
export const ProviderName = styled.Text<ProviderNameProps>`
  margin-left: 8px;
  font-family: 'RobotoSlab-Medium';
  font-size: 16px;
  color: ${props => (props.selected ? '#9f9ca7' : '#f4ede8')};
  
`
export const ButtonBusca = styled(RectButton)`
  height: 50px;
  background: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 24px 24px;
`

export const ButtonBuscaText = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 18px;
  color: #232129;
`
export const TextBanner = styled.Text`
  font-family: 'RobotoSlab-Medium';
  font-size: 24px;
  color: #ffeb3b;
  text-shadow: 0px 0px 15px #000;
`