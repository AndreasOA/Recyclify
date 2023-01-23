import * as React from 'react';
import {useEffect, useState} from 'react';
import {enableScreens} from 'react-native-screens';
import {useLayout} from 'hooks';
import keyExtractor from 'utils/keyExtractor';
import sortData from 'utils/sortData';
import _ from 'lodash';
import {getCollection, getUserInfo} from 'services/firebaseService';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

import {
  Image,
  FlatList,
  View, 
} from 'react-native';
import {
  Layout,
  StyleService,
  useStyleSheet,
  Text,
  Divider,
} from '@ui-kitten/components';
import {
  Container,
  HStack,
} from 'components';

enableScreens();

interface ICardProps {
    title: string;
    description: string;
    distance: number;
    item_category: Array<string>;
    image: Array<string>;
    location: Array<number>;
    create_by: string;
    date: string;
}

const News = () => {
  const {height, width, top, bottom} = useLayout();
  const styles = useStyleSheet(themedStyles);
  const [news, setNews] = useState<any>()
  const [userLocation, setUserLocation] = useState<any>()

  useEffect(() => {
    (async () => {
      const userLoc = await getUserInfo();
      const data = await getCollection("News");
      setUserLocation(userLoc.location);
      setNews(data);
    })();
  }, []);

  const NewsElements = () => {
    if ((news == undefined) || (news.length == 0) || (userLocation == undefined)) {
      return (
        <ActivityIndicator animating={true} color={MD2Colors.red800} style={{marginTop: 100}}/>
      )
    } else {
      return(
        <FlatList
          data={sortData(news, userLocation, '')}
          contentContainerStyle={styles.content}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      )
    }
  }
  

  const renderItem = React.useCallback(({item}: {item: ICardProps}) => {
    const color = '#10171f';
    const label_color = '#FF715B';

    const categories = item.item_category.map((cat, index) =>
    <Layout style={[styles.category, {backgroundColor: label_color} ]} key={index}> 
      <Text status="white" category="s1-sb">
      {cat} 
      </Text>
    </Layout>
    );

    return (
      <View style={styles.newsCardParent} >
        <Image resizeMode={'cover'} source={{uri: item.images[0]}} style={styles.newsCardImage} />
        <View style={styles.newsCardTextContentParent} >
          <View style={styles.newsCardHeaderParent} >
            <Text category='h4' ellipsizeMode='tail' style={styles.newsCardHeader} >{item.title}</Text>
          </View>
          <HStack justify="space-between" mb={20} mt={20} style={styles.newsCardHorizontalInfo}>
            <Text category='s2-sb' >
              {item.date}
            </Text>
            <Text category="s2-sb">
                {item.distance}{' km away'}
            </Text>
          </HStack>
          <Text category='s1' ellipsizeMode='tail' style={styles.newsCardMainText} >{item.description}</Text>
          <Divider style={{marginTop: 20}}></Divider>
          <HStack justify="center" mb={2} mt={10} style={styles.newsCardHorizontalInfo}>
            <Text category='s2-sb' >Tags</Text>
          </HStack>
          <HStack justify="space-evenly" wrap={true} mt={5}>
            {categories}
          </HStack>
        </View>
      </View>
    );
  }, [userLocation]);

  return (
    <Container style={styles.container} level="2" useSafeArea={false}>
      <NewsElements/>
    </Container>
  );
};

export default News;

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
    borderRadius: 6,
  },
  category: {
    paddingHorizontal: 14,
    paddingVertical: 2,
    margin: 10,
    borderRadius: 5,
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
  marketCardHeaderView: { 
    width: "100%", 
    borderColor: "#ffffff", 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
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
});