import React, {useRef, useState, useEffect} from 'react';
import * as LocationExpo from 'expo-location'
import {Text} from '@ui-kitten/components';

const Location = (locationOffer: any) =>{
  const [location, setLocation] = useState<number[]>([0, 0]);
  const [errorMsg, setErrorMsg] = useState('');
  const toRadian = (n: number) => (n * Math.PI) / 180
  useEffect(() => {
    (async () => {
      
      let { status } = await LocationExpo.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location_t = await LocationExpo.getCurrentPositionAsync({});
      setLocation([location_t.coords.latitude, location_t.coords.longitude]);
    })();
  }, []);
  let text = 'Waiting..';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    let lat2 = locationOffer.locationOffer[0]
    let lon2 = locationOffer.locationOffer[1]
    let lat1 = location[0]
    let lon1 = location[1]
    let R = 6371  // km
    let x1 = lat2 - lat1
    let dLat = toRadian(x1)
    let x2 = lon2 - lon1
    let dLon = toRadian(x2)
    let a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    text = (R * c).toFixed(1).toString() + ' km away'
  }
  return (
      <Text category='s2-sb'>{text}</Text>
  );
}

export default Location;