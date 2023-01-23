import React, { memo, useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import app, { addUserInfo } from  'services/firebaseService';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { 
    TouchableOpacity,
} from 'react-native';
import {
    Container,
    HStack,
    VStack,
} from 'components';
import {
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
    phoneValidator,
    passwordValidator,
    nameValidator,
} from '../../utils/validator';
import getLocation from 'utils/getLocation';



const auth = getAuth(app);


const RegisterScreen = ({ navigation }:any) => {
    const styles = useStyleSheet(themedStyles);
    const [name, setName] = useState({ value: '', error: '' });
    const [email, setEmail] = useState({ value: '', error: '' });
    const [phone, setPhone] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [loading, setLoading] = useState(false);

    const _onSignUpPressed = async () => {

        const location = await getLocation();

        function checkErrors(){
            const nameError = nameValidator(name.value);
            const emailError = emailValidator(email.value);
            const phoneError = phoneValidator(phone.value);
            const passwordError = passwordValidator(password.value);

            if (emailError || phoneError || passwordError || nameError) {
                setName({ ...name, error: nameError });
                setEmail({ ...email, error: emailError });
                setPhone({ ...phone, error: phoneError})
                setPassword({ ...password, error: passwordError });
                return true;
            }else {
                false
            }
        }

        async function signUp() {
            if (!checkErrors()){
                setLoading(true);
                await createUserWithEmailAndPassword(auth, email.value, password.value)
                .then(async (userCredential) => {
                    const user = userCredential.user;
                    let ret = addUserInfo({uid: user.uid, name: name.value, phone: phone.value, location: location, overallOffers: 0});
                    
                    if (await ret != ""){
                        setName({ ...name, error: String(ret)})
                        return;
                    }
                    navigation.navigate('AppContainer');
                })
                .catch((firebase_error) => {
                    setLoading(false);
                    if(firebase_error.message.includes("email-already-in-use")){
                        setEmail({ ...email, error: "Email is already used"});
                    }else if(firebase_error.message.includes("invalid-email")){
                        setEmail({ ...email, error: "Enter a valid email"});
                    }else {
                        setEmail({ ...email, error: firebase_error.message });
                    }
                });
            }
        }
        signUp();
    };
    if (loading == false) {
        return (
            <>
                <Container style={styles.container} level="2" useSafeArea={true}>
                    <Container style={styles.container_safearea} level="2">
                        <HStack style={{ position: 'absolute', left: 0, right: 0, top: 0 }} justify="flex-start" itemsCenter>
                            <Button style={styles.back_button}
                                accessoryLeft={<MaterialCommunityIcons name="arrow-left" size={25} color={'#000000'} />}
                                onPress={() => navigation.navigate('SignHome')}
                                size={'giant'} />
                        </HStack>
                        <HStack mb={10} justify="center">
                            <Text style={styles.headerText} category='h6'>Create a new account</Text>
                        </HStack>
                        <VStack justify='center' itemsCenter style={styles.content}>
                            <TextInput
                                label="Name"
                                returnKeyType="next"
                                value={name.value}
                                onChangeText={text => setName({ value: text, error: '' })}
                                error={!!name.error}
                                errorText={name.error}  
                                textContentType='name'
                                keyboardType="default"         
                            />
                            <TextInput
                                label="Phone"
                                returnKeyType="next"
                                value={phone.value}
                                onChangeText={text => setPhone({ value: text, error: '' })}
                                error={!!phone.error}
                                errorText={phone.error}
                                autoCapitalize="none"
                                autoComplete="tel"
                                textContentType="telephoneNumber"
                                keyboardType="phone-pad" 
                            />
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
                            <FormButton mode="contained" onPress={_onSignUpPressed} style={styles.submitButton}>
                                Sign Up
                            </FormButton>

                            <HStack>
                                <Text style={styles.label}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                                    <Text style={styles.link}>Login</Text>
                                </TouchableOpacity>
                            </HStack>
                        </VStack>
                    </Container>
                </Container>
            </>
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
    row: {

    },
    label: {

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
    content: {
        marginLeft: 30,
        marginRight: 30,
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

export default memo(RegisterScreen);