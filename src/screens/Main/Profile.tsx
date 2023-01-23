import React, {useEffect, useState} from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {enableScreens} from 'react-native-screens';
import {useLayout} from 'hooks';
import keyExtractor from 'utils/keyExtractor';
import Popover from 'react-native-popover-view';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {getAuth, signOut } from 'firebase/auth';
import 'react-native-gesture-handler';
import {Images} from 'assets/images';
import app, { 
  getUserInfo, 
  getActiveOffers, 
  deleteEntry, 
  updateUserdata, 
  deleteImages 
} from 'services/firebaseService';

import {
  TouchableOpacity, 
  ImageRequireSource, 
  View, 
  Platform, 
  FlatList, 
  Image
} from 'react-native';

import {
  Container,
  HStack,
  VStack,
  SegmentedControl
} from 'components';

import {
  Layout,
  StyleService,
  useStyleSheet,
  Avatar,
  Button,
  Text
} from '@ui-kitten/components';


const auth = getAuth(app);

enableScreens();

interface ICardProps {
  id: string;
  price: string;
  kind: string,
  item_category: Array<string>,
  location: Array<number>;
  image: ImageRequireSource;
  name: string;
  description: string;
  email: string;
  phone: string;
  website: string;
}



const Profil = ({navigation}:any) => {
  const styles = useStyleSheet(themedStyles);
  const {height, width} = useLayout();
  const [segmentedIndex, setSegmentedIndex] = useState(0);
  const [updateUI, setUpdateUi] = useState(false);
  const [overallOffers, setOverallOffers] = useState(0);
  const [activeOffers, setActiveOffers] = useState(0);
  const [userName, setUsername] = useState("");
  const [allActiveOffers, setAllActiveOffers] = useState<any>();
  const [showPopover, setShowPopover] = useState('');
  const [showImage, setShowImage] = useState<any>();
  let label_color = '#FF715B';

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', () => {
      getUserInfos();
    });
    return focusHandler;
  }, [navigation]);

  const handleSegmentChange = (index: number) => {
    setSegmentedIndex(index);
  };
  
  if (updateUI == true) {
    setUpdateUi(false);
  }

  async function getUserInfos() {
    let userInfo = await getUserInfo();
    let activeOffers = await getActiveOffers();
    setAllActiveOffers(activeOffers);
    setUsername(userInfo.name);
    setActiveOffers(activeOffers?.length);
    setOverallOffers(userInfo.overallOffers);
  }

  async function deleteOffer(item: any){
    console.log(item);
    await deleteEntry("Marketplace", item.id);
    await updateUserdata({overallOffers:overallOffers-1});
    deleteImages(item.imagesStore);
    getUserInfos();
  }

  async function offerSold(item: any){
    await deleteEntry("Marketplace", item.id);
    deleteImages(item.imagesStore);
    getUserInfos();
  }


  function logOut() {
      signOut(auth).then(() => {
        navigation.navigate('SignHome')
      }). catch((error) => {
        console.log(error);
      });
  }
  const Stat = ({path, index}: any) => {
    return (
        <View style={styles.stat}>
          <TouchableWithoutFeedback onPress={ ()=>{setShowImage(path);}}>
            <Image source={{uri: path}} style={{ resizeMode: 'cover', width: 100, height: 150 }}/>
          </TouchableWithoutFeedback>
        </View>
    );
  }

  const ScrollViewContent = (item: any) => {
    item = item.item
    const intervals = Math.ceil(item.images.length / 4);

    return(
      <ScrollView
              horizontal={true}
              nestedScrollEnabled={true}
              contentContainerStyle={{ ...styles.scrollView, width: `${100 * intervals}%` }}
              showsHorizontalScrollIndicator={true}

              scrollEventThrottle={200}
              //pagingEnabled
              decelerationRate="fast"
            >
              {item.images.map((item: any, index: number) => {
                return (
                  <Stat
                    path={item}
                    key={index}
                    index={index} />
                );
              })}
              <Text style={{width:'100%'}}> </Text>
        </ScrollView>
    )
  }

  const PopoverContent = (item: any) => {
    item = item.item
    const intervals = Math.ceil(item.images.length / 4);
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${item.location[0]},${item.location[1]}`;
    const label = item.name;
    const location_url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (item.kind == 'Buy')
    {
      label_color = '#255c6b';
    }
    else if (item.kind == 'Sell')
    {
      label_color = '#FF715B';
    }
    if (showImage != undefined) {
      return(
        <HStack itemsCenter justify='center'>
          <View>
            <TouchableOpacity
              style={{zIndex: 999}}
              onPress={ ()=> {setShowImage(undefined)}}
            >
              <Layout style={[styles.scrollviewItem, {backgroundColor: '#10171f', right: 0.05*width, top: 0.02*height,}]}>
                <MaterialCommunityIcons name="close" size={25} color={'#ffffff'}/>
              </Layout>
            </TouchableOpacity>
            <Image source={{uri: showImage}} style={{ resizeMode: 'cover', width: width, height: height*0.5}}/>
          </View>
        </HStack>
      )
    } else {
      return(
        <>
          <View style={styles.marketCardParentPop} > 
            <ScrollViewContent item={item} intervals={intervals}/>
            <HStack justify='center' itemsCenter mb={1} mt={1}>
              <View style={styles.bullets}>
                <Text category='label'>Scroll to see all images</Text>
              </View>
            </HStack>
            <View style={styles.marketCardContentViewPopover} >
              <View style={styles.marketCardTextContentView} >
                <View style={styles.marketCardHeaderView} >
                    <Layout style={[styles.kind, {backgroundColor: label_color}]}>
                      <Text status="white" category="s2-sb">
                        {item.kind}
                      </Text>
                    </Layout>
                </View>
                <Text numberOfLines={4} style={[styles.marketCardName, {marginLeft: 10}]} category="h6">{item.name}</Text>
                <View style={[styles.marketCardDescriptionView, {marginLeft: 10}]} >
                  <Text numberOfLines={4} style={styles.marketCardDescription} category="s1">{item.description}</Text>
                </View>
              </View>
              <View style={[styles.marketCardPriceView, {marginLeft: 5, marginTop: 12}]} >
                <Text ellipsizeMode='tail' style={styles.marketCardPrice} category="h6">{Number(item.price.replace(/\,/gi, ".")).toFixed(2)}{'€'}</Text>
              </View>
            </View>
          </View>
          <HStack justify="space-evenly" mb={20} mt={20}>
            <VStack justify='center' itemsCenter>
              <Text category="s1-sb" style={{marginBottom: 15, textAlign: 'center', marginLeft: 8}}>
                Offer fulfilled
              </Text>
              <Button style={styles.offer_button} 
                accessoryLeft={<MaterialCommunityIcons name="check" size={17} color={'#ffffff'}/>}
                onPress={ () => offerSold(item) }
              />
            </VStack>
            <VStack justify='center' itemsCenter>
              <Text category="s1-sb" style={{marginBottom: 15, textAlign: 'center', marginLeft: 8}}>
                Delete Offer
              </Text>
              <Button style={styles.offer_button} 
                accessoryLeft={<MaterialCommunityIcons name="delete" size={17} color={'#ffffff'}/>}
                onPress={ () => {deleteOffer(item)}}
              />
            </VStack>
          </HStack>
        </>
      )
    }
  }

  const renderItem = React.useCallback(({item}: {item: ICardProps}) => {
    let backCount = 0;

    if (item.kind == 'Buy')
    {
      label_color = '#255c6b';
    }
    else if (item.kind == 'Sell')
    {
      label_color = '#FF715B';
    }
    if ((segmentedIndex == 1) && (item.kind == 'Sell')) {
      return (<></>)
    }
    else if ((segmentedIndex == 2) && (item.kind == 'Buy')) {
      return (<></>)
    }
    return (
      <>
      <Popover
        arrowSize={{ width: 0, height: 0 }}
        isVisible={showPopover == item.id} 
        onRequestClose={() => {
          setShowPopover('')
        }}
        popoverStyle={styles.popoverParent}
      >
        <PopoverContent item={item}/>
      </Popover>
      <TouchableWithoutFeedback
        onPress={() => {
          backCount++
          if (backCount == 2) {
            backCount = 0;
            setShowPopover(item.id);
          } else {
            setTimeout(() => {
              backCount = 0
            }, 300)
          }
        }}
      >
        <View style={styles.marketCardParent} >
          <Image resizeMode={'cover'} source={{uri: item.images[0]}} style={styles.marketCardImage} />
          <View style={styles.marketCardContentView} >
            <View style={styles.marketCardTextContentView} >
              <View style={styles.marketCardHeaderView} >
                  <Layout style={[styles.kind, {backgroundColor: label_color}]}>
                    <Text status="white" category="s2-sb">
                      {item.kind}
                    </Text>
                  </Layout>
              </View>
              <View style={styles.marketCardDescriptionView} >
                <Text numberOfLines={4} style={styles.marketCardDescription} category="h6">{item.name}</Text>
              </View>
            </View>
            <View style={styles.marketCardPriceView} >
              <Text numberOfLines={1} ellipsizeMode='tail' style={styles.marketCardPrice} category="h6">{Number(item.price.replace(/\,/gi, ".")).toFixed(2)}{'€'}</Text>
            </View>
            <View style={styles.marketCardBottomHint} >
              <Text category="s2">
                Double Tap for details
              </Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </>
    )
  }, [showPopover, showImage, segmentedIndex]);

  return (
    <Container style={styles.container} level="2" useSafeArea={false}>
      <HStack style={{position: 'absolute', left: 0, right: 0, top: 0, zIndex: 999}} justify="flex-end" itemsCenter>
        <TouchableOpacity
          onPress={logOut}
        >
          <Layout style={styles.logout}> 
            <Text status="white" category="s1-sb">
              Logout
            </Text>
          </Layout>
        </TouchableOpacity>
      </HStack>
      <Layout level="2" style={styles.information}>
      <VStack justify="center" itemsCenter>
        <Avatar source={Images.avatar['avatar-02']} size="72" />
        <Text category="t5-sb" status="white" marginTop={8}>
          {userName}
        </Text>
      </VStack>
      <HStack mh={24} mt={20} ml={80} mr={80} justify="space-between">
        <VStack itemsCenter>
          <Text category="t4-sb" status="white">{activeOffers}</Text>
          <Text category="s2-sb" status="white">
            Active Offers
          </Text>
        </VStack>
        <VStack itemsCenter>
          <Text category="t4-sb" status="white">{overallOffers}</Text>
          <Text category="s2-sb" status="white">
            Offers overall
          </Text>
        </VStack>
      </HStack>
      </Layout>
      <VStack justify="center" itemsCenter>
        <Text category="t5-sb" style={{marginTop: 20, marginBottom: 10,}}>
          Active Offers
        </Text>
      </VStack>
      <View style={{alignItems:'center', width: '100%', marginBottom: 10}}>
        <SegmentedControl
          tabs={['All', 'Buy', 'Sell']}
          currentIndex={segmentedIndex}
          onChange={handleSegmentChange}
          segmentedControlBackgroundColor='#fff'
          activeSegmentBackgroundColor='#FF715B'
          activeTextColor='white'
          textColor='black'
          paddingVertical={12}
        />
      </View>
      <FlatList
          data={allActiveOffers}
          contentContainerStyle={styles.content}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
      />
    </Container>
  )
}

export default Profil;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  stat: {
    paddingTop: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    flexBasis: '25%',
    flex: 1,
    maxWidth: '25%',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  scrollviewItem: {
    display: 'flex',
    position: 'absolute',
    zIndex: 999,
    padding: 8,
    marginBottom: 30,
    borderRadius: 20,
  },
  information: {
    paddingTop: 30,
    paddingBottom: 30,
    backgroundColor: '#131313',
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    zindex: 999,
  },
  marketCardContentViewPopover: { 
    width: "100%", 
    padding: 12, 
    borderColor: "#ffffff", 
    flexDirection: 'column', 
    justifyContent: 'space-evenly', 
  },
  bullet: {
    paddingHorizontal: 5,
    fontSize: 30,
    color: '#000000',
  },
  bullets: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  offer_button_success: {
    margin: 2,
    borderColor: '#0f6e14',
    backgroundColor: '#0f6e14',
  },
  offer_button_decline: {
    margin: 2,
    borderColor: '#cf0000',
    backgroundColor: '#cf0000',
  },
  content: {
    marginTop: 16,
    marginHorizontal: 16,
    marginBottom: 100,
  },
  item: {
    padding: 12,
    marginBottom: 30,
    borderRadius: 16,
  },
  item_content: {
    alignItems: "flex-end",
    flex: 1,
  },
  kind: {
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderRadius: 99,
  },
  category: {
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginBottom: 10,
    borderRadius: 99,
  },
  menu_button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 65,
    position: 'absolute',
    bottom: 15,
    right: 15,
    height: 65,
    backgroundColor: '#FF715B',
    borderRadius: 100,
    zIndex: 999,
  },
  settings_button: {
    margin: 2,
    backgroundColor: 'rgba(52, 52, 52, 0.0)',
    borderColor: 'rgba(52, 52, 52, 0.0)',
    height: 40,
    width: 40,
    borderRadius: 7
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#131313',
    placeholderStyle: { color: '#ffffff' },
    borderRadius: 7,
    
  },
  scrollView: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent:'space-between',
  },
  buttonSubmit: {
    marginTop: 16,
    backgroundColor: '#FF715B',
    color: '#ffffff',
  },
  offer_button: {
    margin: 2,
    marginLeft: 9,
    borderColor: '#131313',
    backgroundColor: '#131313',
    height: 30,
    borderRadius: 7
  },
  logout: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    margin: 10,
    marginRight: 20,
    borderRadius: 10,
    outlineColor: '#FF715B',
    backgroundColor: '#FF715B',
  },


  marketCardParent: {
    width: "100%", 
    elevation: 5, 
    shadowOffset: { 
      width: 0, 
      height: 2.5 }, 
    borderRadius: 20, 
    marginBottom: 20, 
    shadowOpacity: 0.2, 
    backgroundColor: "#ffffff", 
    borderColor: "#ffffff", 
    flexDirection: 'row'
  },
  marketCardImage: { 
    width: "40%", 
    height: 160, 
    borderRadius: 20, 
  },
  marketCardContentView: { 
    width: "60%", 
    padding: 12, 
    borderColor: "#ffffff", 
    flexDirection: 'column', 
    justifyContent: 'space-evenly', 
  },
  marketCardTextContentView: { 
    width: "100%", 
    borderColor: "#ffffff", 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
  },
  marketCardHeaderView: { 
    width: "100%", 
    borderColor: "#ffffff", 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8,
  },
  marketCardDescriptionView: { 
    width: "100%", 
    marginTop: 8, 
    marginBottom: 8, 
    borderColor: "#ffffff", 
    flexDirection: 'row', 
    alignItems: 'center', 
  justifyContent: 'flex-start', 
},
  marketCardName: {
    width: "100%", 
    color: "#000000", 
    textAlign: 'left', 
    textAlignVertical: 'center', 
    marginBottom: 8,
    marginTop: 12,
  },
  marketCardDescription: { 
    width: "100%", 
    color: "#000000", 
    textAlign: 'left', 
    textAlignVertical: 'center', 
  },
  marketCardPriceView: { 
    width: "100%", 
    borderColor: "#ffffff", 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
  },
  marketCardPrice: { 
    width: "100%", 
    color: "#000000", 
  },
  marketCardBottomHint: { 
    width: "100%", 
    paddingTop: 10, 
    borderColor: "#ffffff", 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
  },
  popoverParent: {
    width: 1000,
  },

  marketCardParentPop: {
    width: "100%", 
    backgroundColor: "#ffffff", 
    borderColor: "#ffffff",
  },
  marketCardImagePop: { 
    width: "40%", 
    height: 220, 
    borderBottomRightRadius: 20, 
  },
});

