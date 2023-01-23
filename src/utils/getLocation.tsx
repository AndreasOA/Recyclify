import React, {useRef, useState, useEffect} from 'react';
import * as LocationExpo from 'expo-location'

export async function getLocation() {
  let { status } = await LocationExpo.requestForegroundPermissionsAsync();
  for (let i = 0; i < 20; i++) {
    let location_t = await LocationExpo.getCurrentPositionAsync({});
    if ((location_t.coords.latitude != 0) && (location_t.coords.longitude != 0)) {
        return([location_t.coords.latitude, location_t.coords.longitude]);
    }
}
}

export default getLocation;