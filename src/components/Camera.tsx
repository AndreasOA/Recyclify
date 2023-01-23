import React, {useEffect, useState} from 'react';
import {TouchableOpacity,
    View,
    Alert,
    ImageBackground,
    } from 'react-native';
import {
    Container,
    } from 'components';

import { Camera, CameraType, FlashMode} from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

let camera: Camera;

import {
    StyleService,
    useStyleSheet,
  } from '@ui-kitten/components';

  import {
    Text,
  } from 'components';


const CameraObj = ( {navigation} ) => {
    const styles = useStyleSheet(themedStyles);
  
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [camera, setCamera] = useState(null);
    const [previewVisible, setPreviewVisible] = React.useState(false)
    const [image, setImage] = useState(String);
    const [type, setType] = useState(CameraType.back);
    const [flashMode, setFlashMode] = useState(FlashMode.off)
    const [imagePaths, setImagePaths] = useState(Array<String>)   

  
    useEffect(() => {
      (async () => {
        const cameraStatus = await Camera.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus.status === 'granted');
  })();
    }, []);
  
    const takePicture = async () => {
      if(camera){
          const data = await camera.takePictureAsync(null)
          setImage(data.uri);
          setPreviewVisible(true);
      }
    }

    const pickImage  = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({});

        if (result.cancelled === false) {
            setImage(result.uri);
            setPreviewVisible(true);
        }
    }
  
    const retakePicture = () => {
      setImage('')
      setPreviewVisible(false)
    }
  
    const savePhoto = () => {
      //MediaLibrary.saveToLibraryAsync(image);
      imagePaths.push(image);
      setImage('');
      setPreviewVisible(false);
    }
  
    const handleFlashMode = () => {
      if (flashMode === FlashMode.on) {
        setFlashMode(FlashMode.off)
      } else if (flashMode === FlashMode.off) {
        setFlashMode(FlashMode.on)
      } else {
        setFlashMode(FlashMode.auto)
      }
    }
    const switchCamera = () => {
      if (type === CameraType.back) {
        setType(CameraType.front)
      } else {
        setType(CameraType.back)
      }
    }
    const closeCam = () => {
      navigation.navigate('CreateOffer', {"images":imagePaths});
    }
  
    if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    }
    return (
      <Container style={styles.container} level="2" useSafeArea={false}>
        <View style={{flex: 1, width: '100%', height: '100%'}}>
          {previewVisible && image ? (
            <CameraPreview photo={image} savePhoto={savePhoto} retakePicture={retakePicture} />
          ):( 
          <Camera ref= {ref => setCamera(ref)} style={{flex: 1}} type={type} flashMode={flashMode}>
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '10%',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <TouchableOpacity
                    onPress={closeCam}
                    style={styles.action_button}
                  >
                      <MaterialCommunityIcons name="arrow-left" size={25} color={'#ffffff'}/>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleFlashMode}
                    style={[
                      styles.action_button, 
                      {backgroundColor: flashMode === FlashMode.off ? '#000' : '#FF715B'},
                    ]}
                  >
                    <MaterialCommunityIcons name="lightning-bolt" size={25} color={'#ffffff'}/>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={switchCamera}
                    style={styles.action_button}
                  >
                    <MaterialCommunityIcons name="camera-flip" size={25} color={'#ffffff'}/>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    flexDirection: 'row',
                    flex: 1,
                    width: '100%',
                    padding: 20,
                    justifyContent: 'flex-start'
                  }}
                >
                  <View
                    style={{
                      alignSelf: 'center',
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <TouchableOpacity
                      onPress={takePicture}
                      style={{
                        width: 80,
                        height: 80,
                        bottom: 0,
                        borderWidth: 4,
                        borderRadius: 50,
                        marginBottom: 20,
                        borderColor: '#000',
                        backgroundColor: '#fff'
                      }}
                    />
                  </View>
                </View>
                <View
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      flexDirection: 'row',
                      flex: 1,
                      width: '20%',
                      padding: 20,
                      alignItems: 'center',
                      justifyContent:'center'
                    }}
                  >
                    <TouchableOpacity
                      style={themedStyles.galleryButton}
                      onPress={pickImage}
                    >
                        <View style={{alignItems: 'center', justifyContent: 'center', flex:1}}>
                            <MaterialCommunityIcons name="image" size={40} color="white" />
                        </View>
                        
                    </TouchableOpacity>

                  </View>
              </View>
            </Camera>
          )}
        </View>
      </Container>
    )
  }
  
  const CameraPreview = ({photo, retakePicture, savePhoto}: any) => {
    const styles = useStyleSheet(themedStyles);
    return (
        <View
        style={{
          backgroundColor: 'transparent',
          flex: 1,
          width: '100%',
          height: '100%'
        }}
        > 
            <ImageBackground source={{uri: photo}} resizeMode='contain' style={{flex:1}}>
                <View
                style={{
                    flex: 1,
                    zIndex: 999,
                    flexDirection: 'column',
                    padding: 15,
                    justifyContent: 'flex-end'
                }}
                >
                    <View
                        style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                        }}
                    >
                        <TouchableOpacity
                        onPress={retakePicture}
                        style={styles.preview_button}
                        >
                        <Text
                            style={themedStyles.imageViewButtonText}
                        >
                            Re-take
                        </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                        onPress={savePhoto}
                        style={styles.preview_button}
                        >
                        <Text
                            style={themedStyles.imageViewButtonText}
                        >
                            Use photo
                        </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
      </View>
    )
  }
  
  export default CameraObj;
  
  const themedStyles = StyleService.create({
    container: {
      flex: 1,
      zIndex: 999,
    },
    content: {
      padding: 24,
    },
    camera: {
      flex: 1,
    },
    button: {
      flex: 1,
      alignSelf: 'flex-end',
      alignItems: 'center',
    },
    imageViewButtonText:{
        color: '#fff',
        fontSize: 20,
        padding: 15,
        borderRadius: 20
    },
    galleryButton:{
        width: 60,
        height: 60,
        bottom: 0,
        borderRadius: 20,
        marginLeft: 10,
        marginBottom: 25,
        backgroundColor: '#000',
        alignContent: 'center',
        justifyContent: 'center'
    },
    action_button: {
      margin: 5,
      alignItems: 'center',
      justifyContent: 'center',
      width: 45,
      height: 45,
      backgroundColor: '#000000',
      borderRadius: 100,
      zIndex: 999,
    },
    preview_button: {
      width: 150,
      height: 50,
      marginBottom: 20,
      alignItems: 'center',
      borderRadius: 8,
      backgroundColor: '#000000',
      shadowOffset: { 
        width: 0, 
        height: 2.5 
      }, 
      shadowOpacity: 0.2, 
      borderWidth: 0,
      borderColor: '#ffffff', 
    }
  });