const calcDistance = (locationOffer: any, locationUser: any) => {
  if ((locationOffer != undefined) && (locationUser != undefined) && (locationUser.length != 0) && (locationOffer.length != 0)) {
    const toRadian = (n: number) => (n * Math.PI) / 180
    const lat1 = locationOffer[0]
    const lon1 = locationOffer[1]
    const lat2 = locationUser[0]
    const lon2 = locationUser[1]
    const R = 6371  // km
    const x1 = lat2 - lat1
    const dLat = toRadian(x1)
    const x2 = lon2 - lon1
    const dLon = toRadian(x2)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadian(lat1)) * Math.cos(toRadian(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const dist = (R * c).toFixed(1)

    return dist;
  } else {
    return NaN;
  }
};

export default calcDistance;