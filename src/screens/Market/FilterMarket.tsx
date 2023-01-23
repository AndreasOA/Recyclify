import * as React from 'react';
import { useState, useEffect } from 'react';
import {TouchableOpacity, View} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {useLayout} from 'hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Switch } from 'react-native-paper';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import { getFilteredOffers, getCurrentCategory } from 'services/firebaseService';
import {
  Layout,
  StyleService,
  useStyleSheet,
  Button,
  Text,
} from '@ui-kitten/components';
import {
  Container,
  HStack,
  VStack,
  TextInput,
  SegmentedControl
} from 'components';



enableScreens();
type SearchBarComponentProps = {};

const FilterMarket = ( {route, navigation} ) => {
  const {height, width, top, bottom} = useLayout();
  const styles = useStyleSheet(themedStyles);
  const [search, setSearch] = useState("");
  const [isSellSwitchOn, setIsSellSwitchOn] = useState(false);
  const [isBuySwitchOn, setIsBuySwitchOn] = useState(false);
  const [filterDistance, setFilterDistance] = useState({ value: '', error: '' });
  const [searchOffer, setSearchOffer] = useState({ value: '', error: '' });
  const [categories, setCategories] = useState<any>();
  const [offers, setOffers] = useState<any>();
  const [selectedCategories, setSelectedCategories] = useState(Array<any>);
  const [tabIndex, setTabIndex] = React.useState(1);
  const handleTabsChange = (index: number) => {
    getCategories('/');
    setTabIndex(index);
  };

  useEffect(() => {
    (async () => {
      if((route.params != undefined) && (route.params.filterState != undefined)){
        let filter = route.params.filterState;
        route.params = undefined;
        setCategories(await getCurrentCategory(filter.categories[0].current));
        setSelectedCategories(filter.selectedCategories);
        setTabIndex(filter.mode);
        setFilterDistance(filter.filterDistance);
        setIsBuySwitchOn(filter.isBuySwitchOn);
        setIsSellSwitchOn(filter.isSellSwitchOn);
        setSearchOffer(filter.searchOffer);
        getSearchOfferCategories(filter.searchOffer.value);
      }
    })();
  }, []);
  

  const onSellToggleSwitch = () => setIsSellSwitchOn(!isSellSwitchOn);
  const onBuyToggleSwitch = () => setIsBuySwitchOn(!isBuySwitchOn);

  const updateSearch = (search: React.SetStateAction<string>) => {
    setSearch(search);
  };

  const getCategories = async (category: string) => {
    setCategories(await getCurrentCategory(category));
  }

  async function getSearchOfferCategories(searchString: string) {
    setSearchOffer({ value: searchString, error: '' });
    setOffers(await getFilteredOffers(searchString));
    
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

  const SwitchFilterContent = () => { 
    if (tabIndex == 0) {
      return(
        <VStack>
          <CategoryBackButton/>
            <VStack itemsCenter style={{marginTop: 20, width: '100%'}}>
            {categories.map((item: any, index: number) => {
              if (item.child != '') {
                  return (
                    <TouchableOpacity style={styles.list_entry}
                    key={index}
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
      )
    } else if ((tabIndex == 1) && (offers != undefined)){
      return(
        <VStack itemsCenter style={{marginTop: 20, width: '100%'}}>
          {offers.map((item: any, index: number) => {
            if (item.child != '') {
                return (
                  <HStack justify="flex-start" mh={0} key={index} style={styles.list_entry}>
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
                );
            } else {
              return(<Text key={index}></Text>)
            }
          })
          }
        </VStack>
      )
    } else {
      <VStack itemsCenter style={{marginTop: 20, width: '100%'}}>
      </VStack>
    }
  }
  if (categories == undefined) {
    getCategories('/');
  }


  return (
    <Container style={styles.container} level="2" useSafeArea={false}>
      <HStack style={{position: 'absolute', left: -12, right: 0, top: 0, zIndex: 999}} justify="space-between" itemsCenter maxWidth={1.015*width}>

      <Button style={styles.back_button} 
            accessoryLeft={<MaterialCommunityIcons name="arrow-left" size={25} color={'#000000'}/>}
            onPress={ ()=> {
              navigation.goBack()}
            }
            size={'giant'}
      />
      <TouchableOpacity
        onPress={async () => {
          navigation.navigate("Marketplace", {filter: {
                              filterDistance: filterDistance,
                              isSellSwitchOn: isSellSwitchOn,
                              isBuySwitchOn: isBuySwitchOn,
                              categories: categories,
                              selectedCategories: selectedCategories,
                              searchOffer: searchOffer,
                              mode: tabIndex}
                            });
        }}
      >
        <Layout style={styles.apply_filter}> 
          <Text status="white" category="s1-sb">
            Apply Filter
          </Text>
        </Layout>
      </TouchableOpacity>
      </HStack>
      <KeyboardAwareScrollView>
        <VStack mt={50} itemsCenter>
          <HStack justify='center' style={styles.filter_selection_stack}>
            <TextInput
              label="Enter maxium allowed distance (km)"
              returnKeyType="done"
              value={filterDistance.value}
              onChangeText={text => setFilterDistance({ value: text, error: '' })}
              error={!!filterDistance.error}
              errorText={filterDistance.error}
              keyboardType="decimal-pad"            
            />
          </HStack>
        </VStack>
        <HStack itemsCenter style={styles.buyorder_switch} justify='flex-start'>
          <Switch 
            color={'#FF715B'} 
            value={isBuySwitchOn} 
            onValueChange={onBuyToggleSwitch}
            style={{marginBottom: 15, marginRight: 15}}
          />
          <Text style={{textAlign: 'center', marginBottom: 16}}>
            Search for buy offers
          </Text>
        </HStack>
        <HStack itemsCenter style={styles.buyorder_switch} justify='flex-start'>
          <Switch 
            color={'#FF715B'} 
            value={isSellSwitchOn} 
            onValueChange={onSellToggleSwitch}
            style={{marginBottom: 15, marginRight: 15}}
          />
          <Text style={{textAlign: 'center', marginBottom: 16}}>
            Search for sell offers
          </Text>
        </HStack>
        <View style={{alignItems:'center', width: '100%', marginBottom: 10}}>
          <SegmentedControl
            tabs={['Category', 'Product name']}
            currentIndex={tabIndex}
            onChange={handleTabsChange}
            segmentedControlBackgroundColor='#fff'
            activeSegmentBackgroundColor='#FF715B'
            activeTextColor='white'
            textColor='black'
            paddingVertical={12}
          />
        </View>
        {tabIndex != 0 ? 
          <VStack mt={10} itemsCenter>
            <HStack justify='center' style={styles.filter_selection_stack}>
              <TextInput
                label="Enter product..."
                returnKeyType="done"
                value={searchOffer.value}
                onChangeText={text => getSearchOfferCategories(text)}
                error={!!searchOffer.error}
                errorText={searchOffer.error}          
              />
            </HStack>
          </VStack>
        :
          <></>
        }
        <SwitchFilterContent/>
      </KeyboardAwareScrollView>
    </Container>
  );
};

export default FilterMarket;

const themedStyles = StyleService.create({
  container: {
    flex: 1,
  },
  buyorder_switch: {
    marginLeft: 30,
    marginBottom: 8,
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
  apply_filter: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    margin: 10,
    marginRight: 15,
    borderRadius: 10,
    outlineColor: '#FF715B',
    backgroundColor: '#FF715B',
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
  filter_selection_stack: {
    width: '90%'
  },
  segmentedButton: {
    color: '#131313',

  },
  list_entry_content: {
    padding: 5,
  },
  topNavigation: {
    alignItems: 'center',
    backgroundColor: 'background-basic-color-7',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  profile_logo: {
    paddingRight: 8,
  },
  content: {
    padding: 24,
  },
  card: {
    borderRadius: 16,
    padding: 16,
  },
  item: {
    marginTop: 32,
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
  header: {
    fontSize: 22,
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 30
  },
  section: {
    marginTop: 0
  },
  divider: {
    align: 'center',
    height: 1.5,
    backgroundColor: '#FFFFFF80',
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
});
