
import React, {useEffect, useState, Component} from 'react';
import {enableScreens} from 'react-native-screens';
import {useLayout} from 'hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { Switch } from 'react-native-paper';
import { getUserInfo, getCurrentCategory, uploadData, createOffer, auth, updateUserdata} from 'services/firebaseService';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import {
  TouchableOpacity, 
  Image, 
  View, 
  ScrollView, 
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  Layout,
  StyleService,
  useStyleSheet,
  Text,
  Button,
  Divider
} from '@ui-kitten/components';
import {
  Container,
  HStack,
  VStack,
  TextInput,
  SegmentedControl
} from 'components';

import {
  offerDescriptionValidator,
  offerNameValidator,
  offerPriceValidator,
} from '../../utils/validator';

enableScreens();

const CreateOffer = ( {route, navigation} ) => {
  const {height, width, top, bottom} = useLayout();
  const color = '#10171f';
  const itemsPerInterval = 4;
  let bullets = [];
  const styles = useStyleSheet(themedStyles);
  const [images, setImagePaths] = useState(Array<String>)
  const [interval, setInterval] = useState(1);
  const [intervals, setIntervals] = useState(0);
  const [widthScrollview, setwidthScrollview] = useState(0);
  const [deleteOpActive, setDeleteOpActive] = useState(false);

  const [offerName, setOfferName] = useState({ value: '', error: '' });
  const [offerDescription, setOfferDescription] = useState({ value: '', error: '' });
  const [offerPrice, setOfferPrice] = useState({ value: '', error: '' });
  const [offerLocation, setOfferLocation] = useState({ value: [], error: '' });
  const [isSellSwitchOn, setIsSellSwitchOn] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(Array<any>);
  const [categories, setCategories] = useState<any>();
  const onSellToggleSwitch = () => setIsSellSwitchOn(!isSellSwitchOn);

  const _onCreateOfferPressed = async () => {
    let userinfo = await getUserInfo();
    const offerNameError = offerNameValidator(offerName.value);
    const offerDescriptionError = offerDescriptionValidator(offerDescription.value);
    const offerPriceError = offerPriceValidator(offerPrice.value);

    if (offerNameError || offerDescriptionError || offerPriceError || userinfo == undefined) {
      setOfferName({ ...offerName, error: offerNameError });
      setOfferDescription({ ...offerDescription, error: offerDescriptionError });
      setOfferPrice({ ...offerPrice, error: offerPriceError });
        return;
    }
    setOfferLocation( {value: userinfo.location, error: '' });
    if(categories === undefined){
      setCategories({current: "Other", child: "", fullpath:"/Other/", parent:"/"});
    }

    const imagePaths: String[] = [];
    try{
      await Promise.all(images.map(async (path, index) => {
        let ending = path.split(".")[1];
        let savePath = 'OfferImages/' + String(userinfo.uid) + '_' + String(userinfo.overallOffers + 1) + '_image_' + String(index) + '.' + String(ending);
        uploadData(String(path), String(savePath));
        imagePaths.push(savePath);
      }))
    }catch(err){
      console.log(JSON.stringify(err));
    }
    
    let kind = "";
    if(isSellSwitchOn){
      kind = "Buy"
    }else{
      kind = "Sell"
    }


    let offerData = {
      name: offerName.value,
      description: offerDescription.value,
      price: offerPrice.value,
      kind: kind,
      images: imagePaths,
      item_category: categories[0].current,
      location: userinfo.location,
      email: auth.currentUser?.email,
      phone: userinfo.phone,
      uid: auth.currentUser?.uid,
    };


    let succ = await createOffer(offerData);;
    if (succ){
      await updateUserdata({overallOffers: userinfo.overallOffers + 1});
      navigation.goBack();
    }

  };

  if(((route.params != undefined) && (deleteOpActive == false))){
    for (let i = 0; i < route.params.images.length; i++) {
      let imageFound = false
      for (let j = 0; j < images.length; j++) {
        if (route.params.images[i] == images[j]) {
          imageFound = true
        }
      }
      if (imageFound == false) {
        images.push(route.params.images[i]);
        setIntervals(Math.ceil(images.length / itemsPerInterval));
      }
    }
    for (let j = 0; j < images.length; j++) {
      route.params.images = route.params.images.filter(function(image: String) { 
        return image !== images[j] 
    });
    }
  }
  
  for (let i = 1; i <= intervals; i++) {
    bullets.push(
      <Text
        key={i}
        style={{
          ...styles.bullet,
          opacity: interval === i ? 0.5 : 0.1
        }}
      >
        &bull;
      </Text>
    );
  }

  const removeImage = (rm_image: String) => {
    setDeleteOpActive(true)
    setImagePaths(images.filter(function(image) { 
        return image !== rm_image 
    }));
    setIntervals(Math.ceil((images.length - 1) / itemsPerInterval));
  }

  const getInterval = (offset: any) => {
    for (let i = 1; i <= intervals; i++) {
      if (offset+1 < (widthScrollview / intervals) * i) {
        return i;
      }
      if (i == intervals) {
        return i;
      }
    }
  }

  const getCategories = async (category: string) => {
    setCategories(await getCurrentCategory(category));
  }

  if (categories == undefined) {
    getCategories('/');
  }

  const CategoryBackButton = () => {
    if (selectedCategories.length != 0) {
      return(
        <View style={{justifyContent: 'center', alignSelf: 'center', width: '90%'}}>
          <VStack>
            <Layout style={styles.currentCategory}>
              <VStack style={{marginLeft:12}}>
                <Text style={{marginBottom:3}}>Selected Category:</Text>
                <Text>{selectedCategories[selectedCategories.length - 1].fullpath + selectedCategories[selectedCategories.length - 1].child}</Text>
              </VStack>
            </Layout>
            <TouchableOpacity
              onPress={() => {getCategories(selectedCategories.pop().current)}}
            >
              <Layout style={styles.categoryBack}>
                <HStack justify='flex-start' itemsCenter style={{}}>
                  <MaterialCommunityIcons name="arrow-left" size={25} color={'#fff'}/>
                  <Text category='p1' status='white' style={{marginLeft: 10}}> Go back to {selectedCategories[selectedCategories.length - 1].current}</Text>
                </HStack>
              </Layout>
            </TouchableOpacity>
          </VStack>
        </View>
      )
    } else {
      return (<></>)
    }
  }

  const Stat = ({path, index}: any) => {
    return (
      <View style={styles.stat}>
        <TouchableOpacity
          style={{zIndex: 999}}
          onPress={ ()=> removeImage(images[index])}
        >
          <Layout style={[styles.scrollviewItem, {backgroundColor: '#10171f'}]}>
            <MaterialCommunityIcons name="delete" size={15} color={'#ffffff'}/>
          </Layout>
        </TouchableOpacity>
        <Image source={{uri : path}} style={{ resizeMode: 'cover', width: 80, height: 120 }}/>
      </View>
    );
  }
  if ((categories == undefined) || (categories.length == 0)) {
    return (
      <Container style={styles.container} level="2" useSafeArea={false}>
        <ActivityIndicator animating={true} color={MD2Colors.red800} style={{marginTop: 100}}/>
      </Container>
    );
  } else {
    return (
      <Container style={styles.container} level="2" useSafeArea={false}>
        <HStack style={{position: 'absolute', left: -12, right: 0, top: 0, zIndex: 999}} justify="space-between" itemsCenter maxWidth={1.015*width}>
          <Button style={styles.back_button} 
                accessoryLeft={<MaterialCommunityIcons name="arrow-left" size={25} color={'#000000'}/>}
                onPress={ ()=>navigation.goBack()}
                size={'giant'}
          />
          <TouchableOpacity
            onPress={() => _onCreateOfferPressed()}
          >
            <Layout style={styles.create_offer}> 
              <Text status="white" category="s1-sb">
                Create Offer
              </Text>
            </Layout>
          </TouchableOpacity>
        </HStack>
        <VStack justify='center' itemsCenter mt={70}>
          <Text category='h6' style={{marginBottom: 20}}>
            Enter offer details
          </Text>
          <View style={styles.scrollviewContainer}>
            <HStack justify='space-between' itemsCenter mb={10} mt={10}>
              <VStack style={styles.imageRepText}>
                <Text>Selected Images</Text>
              </VStack>
              <View style={styles.bullets}>
                  {bullets}
              </View>
              <TouchableOpacity 
                  style={styles.capture_image} 
                  onPress={ ()=>{navigation.navigate('CameraObj'); setDeleteOpActive(false);}}
                >
                  <Layout style={[styles.item, {backgroundColor: color}]}>
                    <HStack justify="center" itemsCenter mt={0}>
                      <VStack itemsCenter>
                        <MaterialCommunityIcons name="camera" size={15} color={'#ffffff'}/>
                          <Text category="label" status="white">
                                  Add Image
                          </Text>
                      </VStack>
                    </HStack>
                  </Layout>
                </TouchableOpacity>
            </HStack>
            <Divider/>
            {images.length == 0 ? 
              <VStack itemsCenter style={styles.scrollViewAlt}>
                <Text category='label'>Captured Images will appear here</Text>
              </VStack> 
            :
              <ScrollView
                horizontal={true}
                nestedScrollEnabled={true}
                contentContainerStyle={{ ...styles.scrollView, width: `${100 * intervals}%` }}
                showsHorizontalScrollIndicator={false}
                onScroll={data => {
                  setwidthScrollview(data.nativeEvent.contentSize.width);
                  setInterval(getInterval(data.nativeEvent.contentOffset.x));
                } }
                scrollEventThrottle={200}
                //pagingEnabled
                decelerationRate="fast"
              >
                {images.map((item: any, index: number) => {
                  return (
                    <Stat
                      path={item}
                      key={index}
                      index={index} />
                  );
                })}
                <Text style={{width:'100%'}}> </Text>
              </ScrollView>                  
            }
          </View>
        </VStack>
        <KeyboardAwareScrollView nestedScrollEnabled={true}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              <View style={styles.inner}>
                <VStack justify='center' itemsCenter style={styles.offer_content} maxWidth={0.9*width}>
                  <TextInput
                    label="Name"
                    returnKeyType="next"
                    value={offerName.value}
                    onChangeText={text => setOfferName({ value: text, error: '' })}
                    error={!!offerName.error}
                    errorText={offerName.error}                   
                  />
                  <TextInput
                    label="Description"
                    returnKeyType="next"
                    value={offerDescription.value}
                    onChangeText={text => setOfferDescription({ value: text, error: '' })}
                    error={!!offerDescription.error}
                    errorText={offerDescription.error}
                    multiline                
                  />
                  <TextInput
                    label="Price in €"
                    returnKeyType="done"
                    value={offerPrice.value}
                    onChangeText={text => setOfferPrice({ value: text, error: '' })}
                    error={!!offerPrice.error}
                    errorText={offerPrice.error}
                    keyboardType="decimal-pad"            
                  />
                </VStack>
              </View>
              <HStack itemsCenter style={styles.buyorder_switch} justify='flex-start'>
                <Switch 
                  color={'#FF715B'} 
                  value={isSellSwitchOn} 
                  onValueChange={onSellToggleSwitch}
                  style={{marginBottom: 15, marginRight: 15}}
                />
                <Text style={{textAlign: 'center', marginBottom: 16}}>
                  Create Buy Order
                </Text>
              </HStack>
              <VStack>
                <View style={{alignItems:'center', marginHorizontal: 20}}>
                  <Divider style={styles.divider}/>
                </View>
                <Text category='h6' style={{textAlign: 'center', marginBottom: 16}}>
                  Choose Category
                </Text>
                <CategoryBackButton/>
                <VStack itemsCenter style={{marginTop: 20, width: '100%'}}>
                  {categories.map((item: any, index: number) => {
                    if (item.child != '') {
                      return (
                        <TouchableOpacity key={index} style={styles.list_entry}
                        onPress={() => {getCategories(item.child); setSelectedCategories([...selectedCategories, item])}}
                        >
                          <HStack justify="flex-start" mh={0}>
                            <VStack
                              maxWidth= {width * 0.9}
                              style={styles.list_entry_content}
                              ml={12}
                              mt={2}
                              mb={2}>
                              <Text category="p1">
                                {item.child}
                              </Text>
                              <Text category="s2">
                                {item.fullpath}
                              </Text>
                            </VStack>
                          </HStack>
                        </TouchableOpacity>
                      );
                    } else {
                      return(<Text key={index}></Text>)
                    }
                  })}
                </VStack>
              </VStack>  
            </View>
          </TouchableWithoutFeedback>  
        </KeyboardAwareScrollView>
      </Container>
    );
  }
};

export default CreateOffer;

const themedStyles = StyleService.create({
  container: {
    flex: 1
  },
  inner: {
    width: '100%',
    alignItems: 'center',
  },
  topNavigation: {
    alignItems: 'center',
    backgroundColor: 'background-basic-color-7',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  currentCategory: {
    padding: 5,
    elevation: 5, 
    shadowOffset: { 
      width: 0, 
      height: 2.5 }, 
    borderRadius: 5, 
    shadowOpacity: 0.2, 
    borderWidth: 0.5,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
  },
  list_entry: {
    width: '90%',
    elevation: 5, 
    shadowOffset: { 
      width: 0, 
      height: 2.5 }, 
    borderRadius: 5, 
    marginBottom: 12, 
    shadowOpacity: 0.2, 
    borderWidth: 0.5,
    borderColor: "#ffffff",
    backgroundColor: "#ffffff",
  },
  list_entry_content: {
    padding: 5,
  },
  profile_logo: {
    paddingRight: 8,
  },
  content: {
    padding: 24,
  },
  offer_content: {
    width: '100%'
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  item: {
    padding: 10,
    marginRight: 15,
    borderRadius: 16,
  },
  create_offer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    margin: 10,
    marginRight: 15,
    borderRadius: 10,
    outlineColor: '#FF715B',
    backgroundColor: '#FF715B',
  },
  icon: {
    tintColor: 'text-white-color',
    width: 24,
    height: 24,
  },
  layoutIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  buyorder_switch: {
    marginLeft: '5%',
    marginBottom: 8,
  },
  bottomBar: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  iconActive: {
    tintColor: 'text-info-color',
    width: 24,
    height: 24,
  },
  iconInactive: {
    tintColor: '#ABA4AC',
    width: 24,
    height: 24,
  },
  back_button: {
    margin: 2,
    backgroundColor: 'rgba(52, 52, 52, 0.0)',
    borderColor: 'rgba(52, 52, 52, 0.0)',
    height: 40,
    width: 40,
    borderRadius: 7
  },
  camera_button: {
    margin: 2,
    backgroundColor: 'rgba(52, 52, 52, 0.0)',
    borderColor: 'rgba(52, 52, 52, 0.0)',
    height: 20,
    borderRadius: 7
  },
  capture_image: {
    justifyContent: 'center'
  },
  scrollviewContainer: {
    width: '100%',
    marginTop: 10,
    backgroundColor: '#ffffff',
    elevation: 5, 
    shadowOffset: { 
      width: 0, 
      height: 2.5 }, 
    borderRadius: 5, 
    marginBottom: 20, 
    shadowOpacity: 0.2, 
  },
  scrollviewItem: {
    display: 'flex',
    position: 'absolute',
    right: -90, 
    top: -70,
    zIndex: 999,
    padding: 8,
    marginBottom: 30,
    borderRadius: 16,
  },
  scrollView: {
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent:'space-between',
  },
  scrollViewAlt: {
    marginTop: 20,
    marginBottom: 20,
  },
  bullets: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  bullet: {
    paddingHorizontal: 5,
    fontSize: 30,
    color: '#000000',
  },
  imageRepText: {
    marginLeft: 15,
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
  statLabel: {
    width: '100%',
    height: '100%',
    textAlign: 'left',
    fontSize: 11,
    fontWeight: '600',
    paddingTop: 5,
    color: '#000000',
    backgroundColor: '#f0f0f0',
  },
  categoryBack: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 5,
    backgroundColor: '#FF715B',
    elevation: 5, 
    shadowOffset: { 
      width: 0, 
      height: 2.5 }, 
    shadowOpacity: 0.2, 
  },
  divider: {
    align: 'center',
    height: 2,
    backgroundColor: '#FFFFFF80',
    marginBottom: 20,
  },
});