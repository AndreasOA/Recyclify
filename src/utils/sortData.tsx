import calcDistance from 'utils/calcDistance';

const sortData = (data: any, userLocation: any, maxDistance: any) => {
    const filtered_data = []
    for (let i = 0; i < data.length; i++) {
        data[i].distance = Number(calcDistance(data[i].location, userLocation));
    }
    data = data.sort((a: any,b: any) => a.distance - b.distance);
    
    if ((maxDistance != undefined) && (maxDistance != '')) {
        for (let i = 0; i < data.length; i++) {
            if (data[i].distance <= maxDistance) {
                filtered_data.push(data[i])
            }
        }
        return filtered_data;
    } else {
        return data;
    }

  };

export default sortData;