import * as React from 'react';
import { useState, useEffect } from 'react';
import {enableScreens} from 'react-native-screens';
import {useLayout} from 'hooks';
import keyExtractor from 'utils/keyExtractor';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Popover from 'react-native-popover-view';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import {getCollection, getUserInfo, getPossibleCategories } from 'services/firebaseService';
import sortData from 'utils/sortData';
import {
  TouchableOpacity, 
  View, 
  Linking, 
  Platform, 
  FlatList, 
  Image
} from 'react-native';
import {
  Layout,
  StyleService,
  useStyleSheet,
  Button, 
  Divider,
  Text,
} from '@ui-kitten/components';
import {
  Container,
  HStack,
  VStack,
} from 'components';


enableScreens();

interface ICardProps {
  id: string,
  company_name: string;
  kind: string,
  distance: number;
  item_category: Array<string>,
  location: Array<number>;
  images: Array<string>;
  description: string;
  email: string;
  phone: string;
  website: string;
}


const Search = ({ route, navigation }) => {
  const {height, width, top, bottom} = useLayout();
  const styles = useStyleSheet(themedStyles);
  const [showPopover, setShowPopover] = useState('');
  const [services, setServices] = useState<any>()
  const [filterObj, setFilterObj] = useState<any>();
  let isSet = true;


  setApplyFilter();

  async function setApplyFilter() {
    if ((route.params != undefined) && (route.params.serviceFilter != undefined)){
      let filter = route.params.serviceFilter;
      route.params = undefined;
      setFilterObj(filter);
      const loc = await getUserInfo();
      setServices(sortData(await applyFilter(filter), loc.location, Number(filter.filterDistance.value.replace(/\,/gi, "."))));
    }
  }

  async function applyFilter(filter:any){
    let offers = await getCollection("Services");
    if(filter.mode == 0){
      let categories = await getPossibleCategories(filter.categories, []);
      offers = offers?.filter(x => categories.some(r=>x.item_category.indexOf(r) >= 0));
    }else{
      offers = offers?.filter(x => String(x.company_name.toLowerCase()).includes(filter.searchOffer.value.toLowerCase()));
    }
    return offers;
  }

  useEffect(() => {
    const focusHandler = navigation.addListener('focus', async () => {
      if((filterObj == undefined) && (services == undefined) && (isSet)){
        const loc = await getUserInfo();
        setServices(sortData(await getCollection("Services"), loc.location, ''));
        isSet = false;
      }
    });
    return focusHandler;
  }, [navigation]);


  const renderItem = React.useCallback(({item}: {item: ICardProps}) => {
    const color = '#10171f';
    const label_color = '#FF715B';
    const cat_color = '#255c6b'
    const dist_color_close = '#0f6e14';
    const dist_color_mid = '#b59a00';
    const dist_color_far = '#cf0000';
    let dist_color = '#FF715B';

    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${item.location[0]},${item.location[1]}`;
    const label = item.company_name;
    const location_url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (item.location[0] < 10 && item.location[1] < 10)
    {
      dist_color = dist_color_close
    }
    else if (item.location[0] > 50 && item.location[1] > 50)
    {
      dist_color = dist_color_far
    }
    else if (item.location[0] < 50 && item.location[1] < 50 && item.location[0] > 10 && item.location[1] > 10) 
    {
      dist_color = dist_color_mid
    }

    let backCount = 0

    const categories = item.item_category.map((cat, index) =>
    <Layout style={[styles.category, {backgroundColor: label_color} ]} key={index}> 
      <Text status="white" category="s1-sb">
      {cat} 
      </Text>
    </Layout>
    );

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
        <View style={styles.marketCardParentPop} >
          <Image resizeMode={'contain'} source={{uri: item.images[0]}} style={styles.marketCardImagePop} />
          <View style={styles.marketCardContentView} >
            <View style={styles.marketCardTextContentView} >
              <View style={styles.marketCardHeaderView} >
                <Layout style={[styles.kind, {backgroundColor: label_color}]}>
                  <Text status="white" category="s2-sb">
                    {item.kind}
                  </Text>
                </Layout>
                <Layout style={[styles.kind]}> 
                  <Text category='s2-sb'>{item.distance}{' km away'}</Text>
                </Layout>
              </View>
              <View style={styles.marketCardDescriptionView} >
                <Text numberOfLines={4} style={styles.marketCardDescription} category="s1">{item.description}</Text>
              </View>
            </View>
          </View>
        </View>
        <HStack justify="center" mt={10} mb={35}>
          <Text>Contact info:</Text>
        </HStack>
        <HStack justify="space-evenly" mb={20}>
          <VStack justify='center' itemsCenter>
            <Text category="s1-sb" style={{marginBottom: 15, textAlign: 'center', marginLeft: 8}}>
              Phone
            </Text>
            <Button style={styles.offer_button} 
              accessoryLeft={<MaterialCommunityIcons name="phone" size={17} color={'#ffffff'}/>}
              onPress={ ()=>{Linking.openURL(`tel:${item.phone}`)}}
            />
          </VStack>
          <VStack justify='center' itemsCenter>
            <Text category="s1-sb" style={{marginBottom: 15, textAlign: 'center', marginLeft: 8}}>
              Email
            </Text>
            <Button style={styles.offer_button} 
              accessoryLeft={<MaterialCommunityIcons name="email" size={17} color={'#ffffff'}/>}
              onPress={ ()=>{Linking.openURL(`mailto:${item.email}`)}}
            />
          </VStack>
          <VStack justify='center' itemsCenter>
            <Text category="s1-sb" style={{marginBottom: 15, textAlign: 'center', marginLeft: 8}}>
              Location
            </Text>
            <Button style={styles.offer_button} 
              accessoryLeft={<MaterialCommunityIcons name="map-outline" size={17} color={'#ffffff'}/>}
              onPress={ ()=>{Linking.openURL(location_url)}} 
            />
          </VStack>
          <VStack justify='center' itemsCenter>
            <Text category="s1-sb" style={{marginBottom: 15, textAlign: 'center', marginLeft: 8}}>
              Website
            </Text>
            <Button style={styles.offer_button} 
              accessoryLeft={<MaterialCommunityIcons name="earth" size={17} color={'#ffffff'}/>}
              onPress={ ()=>{ Linking.openURL(item.website)}}  
            />
          </VStack>
        </HStack>
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
        <View style={styles.newsCardParent} >
          <Image
            resizeMode={'cover'} source={{uri: item.images[0]}} style={styles.newsCardImage} />
          <View style={styles.newsCardTextContentParent} >
            <View style={styles.newsCardHeaderParent} >
              <Text category='h4' ellipsizeMode='tail' style={styles.newsCardHeader} >{item.company_name}</Text>
            </View>
            <HStack justify="space-between" mb={20} mt={20} style={styles.newsCardHorizontalInfo}>
              <Text category='s2-sb' >{item.kind}</Text>
              <Text category='s2-sb'>{item.distance}{' km away'}</Text>
            </HStack>
            <Text category='s1' ellipsizeMode='tail' style={styles.newsCardMainText} >{item.description}</Text>
            <Divider style={{marginTop: 20}}></Divider>
            <HStack justify="center" mb={2} mt={10} style={styles.newsCardHorizontalInfo}>
              <Text category='s2-sb' >Tags</Text>
            </HStack>
            <HStack justify="space-evenly" wrap={true} mt={5}>
              {categories}
            </HStack>
            <Divider style={{marginTop: 20}}></Divider>
            <HStack justify="center" mb={2} mt={16} style={styles.newsCardHorizontalInfo}>
              <Text category='s2-sb' >Double Tap to open details</Text>
            </HStack>
          </View>
        </View>
      </TouchableWithoutFeedback>
      </>
    );
  }, [showPopover]);

  return (
    <Container style={styles.container} level="2" useSafeArea={false}>
      <TouchableOpacity style={styles.menu_button}
        onPress={() => navigation.navigate('SearchFilter', {filterState: filterObj})}
      >
        <MaterialCommunityIcons name="filter-outline" color={"#e1e2e3"} size={30}/>
      </TouchableOpacity>
      {(services == undefined) ?         
        <ActivityIndicator animating={true} color={MD2Colors.red800} style={{marginTop: 100}}/>
        : ((services.length == 0) ?
          <Container style={styles.container} level="2" useSafeArea={false}>
            <VStack itemsCenter>
              <Text category='h6' style={{marginTop: 100}}>No offers found</Text>
            </VStack>
          </Container>
        :
        <FlatList
          data={services}
          contentContainerStyle={styles.content}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />)
        
      }
      </Container>
  );
  
};

export default Search;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  content: {
    marginTop: 16,
    marginHorizontal: 16,
    paddingBottom: 16,
  },
  item: {
    padding: 12,
    marginBottom: 30,
    borderRadius: 16,
  },
  item_content: {
    alignItems: "center",
  },
  kind: {
    paddingHorizontal: 14,
    paddingVertical: 2,
    borderRadius: 99,
  },
  category: {
    paddingHorizontal: 14,
    paddingVertical: 2,
    margin: 10,
    borderRadius: 5,
  },
  button: {
    margin: 2,
    borderColor: '#3C899F',
    backgroundColor: '#3C899F',
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
  newsCardParent: {
    width: "100%", 
    elevation: 5, 
    shadowOffset: { 
      width: 0, 
      height: 2.5 
    }, 
    shadowOpacity: 0.2, 
    backgroundColor: '#ffffff', 
    borderRadius: 22, 
    borderWidth: 0,
    borderColor: '#ffffff', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginBottom: 25,
  },
  newsCardImage: { 
    width: "100%", 
    height: 190, 
    borderTopLeftRadius: 23, 
    borderTopRightRadius: 23, 
  },
  newsCardTextContentParent: {
    width: "100%", 
    paddingTop: 22, 
    paddingBottom: 22, 
    paddingLeft: 22, 
    paddingRight: 22, 
    elevation: 5, 
    shadowOffset: { 
      width: 0, 
      height: 2.5 
    }, 
    shadowOpacity: 0.2, 
    backgroundColor: '#ffffff', 
    borderBottomLeftRadius: 22, 
    borderBottomRightRadius: 22, 
    borderWidth: 0, 
    borderColor: '#ffffff', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  newsCardHeaderParent: { 
    width: "100%", 
    borderRadius: 0, 
    borderWidth: 0,
    borderColor: '#ffffff', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'flex-start', 
  },
  newsCardHeader: { 
    width: "100%", 
    textAlign: 'center', 
    textAlignVertical: 'center', 
  },
  newsCardMainContentParent: {
    width: "100%", 
    paddingTop: 8, 
    paddingBottom: 12,
    marginLeft: 3,
    borderRadius: 0, 
    borderWidth: 0, 
    borderColor: '#ffffff', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  newsCardCreatedDate: {
    width: "100%", 
    marginBottom: 12, 
    textAlign: 'left', 
    textAlignVertical: 'center',
  },
  newsCardMainText: {
    width: "100%", 
    textAlign: 'left', 
    textAlignVertical: 'center', 
    lineHeight: 26,
  },
  newsCardHorizontalInfo: {
    width: "100%"
  },
  offer_button: {
    margin: 2,
    marginLeft: 9,
    borderColor: '#131313',
    backgroundColor: '#131313',
    height: 30,
    borderRadius: 7
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
    height: 220, 
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
    width: "50%", 
    color: "#000000", 
    fontWeight: '500', 
    textAlign: 'left', 
    textAlignVertical: 'center', 
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
    marginBottom: 20,  
    backgroundColor: "#ffffff", 
    borderColor: "#ffffff", 
    flexDirection: 'row'
  },
  marketCardImagePop: { 
    width: "40%", 
    height: 220, 
    borderBottomRightRadius: 20, 
  },
});