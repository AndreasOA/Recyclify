import React, { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import getLocation from 'utils/getLocation';
import {getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import app, { updateUserdata } from 'services/firebaseService';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { 
    View, 
    TouchableOpacity,
} from 'react-native';
import {
    Container,
    HStack,
    VStack,
    FormButton,
    TextInput,
} from 'components';
import {
    StyleService,
    useStyleSheet,
    Text,
    Button
  } from '@ui-kitten/components';
import {
    emailValidator,
    passwordValidator,
} from '../../utils/validator';



const auth = getAuth(app);


const LoginScreen = ({ navigation }) => {
    const styles = useStyleSheet(themedStyles);
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [updateUi, setUpdateUi] = useState(false);

    const _onLoginPressed = async () => {
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);

        if (emailError || passwordError) {
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            return;
        } else {
            setUpdateUi(true)
        }

        const location = await getLocation();


        

        async function signIn() {
            if (!checkErrors()){
                await signInWithEmailAndPassword(auth, email.value, password.value)
                .then((userCredential) => {
                    console.log(location);
                    updateUserdata({ location: location })
                    navigation.navigate('AppContainer');
                })
                .catch((firebase_error) => {
                    if(firebase_error.message.includes("wrong-password")){
                        setPassword({ ...password, error: "Wrong Password"})
                    }else if(firebase_error.message.includes("user-not-found")){
                        setEmail({ ...email, error: "User not found"});
                    }else {
                        setEmail({ ...email, error: firebase_error.message });
                    }
                });
            }
        }

        function checkErrors(){
            const emailError = emailValidator(email.value);
            const passwordError = passwordValidator(password.value);

            if (emailError || passwordError) {
                setEmail({ ...email, error: emailError });
                setPassword({ ...password, error: passwordError });
                return true;
            }else {
                return false;
            }
        }

        signIn();
    };
    if (updateUi == false) {
        return (
            <Container style={styles.container} level="2" useSafeArea={true}>
                <Container style={styles.container_safearea} level="2">
                    <HStack style={{ position: 'absolute', left: 0, right: 0, top: 0 }} justify="flex-start" itemsCenter>
                        <Button style={styles.back_button}
                            accessoryLeft={<MaterialCommunityIcons name="arrow-left" size={25} color={'#000000'} />}
                            onPress={() => navigation.navigate('SignHome')}
                            size={'giant'} />
                    </HStack>
                    <HStack mb={10} justify="center">
                        <Text style={styles.headerText} category='h6'>Login to your Account</Text>
                    </HStack>
                    <VStack justify='center' itemsCenter style={styles.content}>
                        <TextInput
                            label="Email"
                            returnKeyType="next"
                            value={email.value}
                            onChangeText={text => setEmail({ value: text, error: '' })}
                            error={!!email.error}
                            errorText={email.error}
                            autoCapitalize="none"
                            autoComplete="email"
                            textContentType="emailAddress"
                            keyboardType="email-address"
                        />
                        <TextInput
                            label="Password"
                            returnKeyType="done"
                            value={password.value}
                            onChangeText={text => setPassword({ value: text, error: '' })}
                            error={!!password.error}
                            errorText={password.error}
                            secureTextEntry                    
                        />
                        <FormButton mode="contained" onPress={ ()=>{_onLoginPressed();}}  style={styles.submitButton}>
                            Login
                        </FormButton>
                        <View style={styles.row}>
                            <Text style={styles.label}>Dont have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={styles.link}>Sign up</Text>
                            </TouchableOpacity>
                        </View>
                    </VStack>
                </Container>
            </Container>
        );
    } else {
        return(
            <Container style={styles.container} level="2" useSafeArea={true}>
                <Container style={styles.container_safearea} level="2">
                    <ActivityIndicator animating={true} color={MD2Colors.red800} style={{marginTop: 100}}/>
                </Container>
            </Container>
        );
    }

};

const themedStyles = StyleService.create({
    container: {
      flex: 1,
    },
    container_safearea: {
        marginTop: 5,
    },
    content: {
        marginLeft: 30,
        marginRight: 30,
    },
    forgotPassword: {
        width: '100%',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    row: {
        flexDirection: 'row',
        marginTop: 4,
    },
    label: {
        color: '#000000',
    },
    link: {
        fontWeight: 'bold',
        color: '#FF715B',
    },
    submitButton: {
        width: 200,
        marginTop: 0,
        marginBottom: 16,
        backgroundColor: '#FF715B',
        color: '#ffffff',
    },
    back_button: {
        margin: 2,
        backgroundColor: 'rgba(52, 52, 52, 0.0)',
        borderColor: 'rgba(52, 52, 52, 0.0)',
        height: 40,
        width: 40,
        borderRadius: 7
    },
    headerText: {
        textAlign: 'center',
    },
});

export default LoginScreen;