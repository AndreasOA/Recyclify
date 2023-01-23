import React from 'react';
import {getAuth, signOut } from 'firebase/auth';
import app, { updateUserdata } from 'services/firebaseService';
import {
    FormButton,
    VStack
} from 'components';
import {
    StyleService,
    useStyleSheet,
    Text,
  } from '@ui-kitten/components';
  import {
    Container,

} from 'components';
import getLocation from 'utils/getLocation';



const SignHome = ({ navigation }) => {

    async function updateLocation() {
        let location = await getLocation();
        updateUserdata({ location : location});
    }

    const styles = useStyleSheet(themedStyles);
    const auth = getAuth(app);
    if (auth.currentUser?.uid === undefined){
        return (
            <Container style={styles.container} level="2" useSafeArea={true}>
                <Container style={styles.container_safearea} level="2">
                    <VStack justify='center' itemsCenter style={styles.content}>
                        <Text style={styles.header_welcome} category='h3'>Welcome to</Text>
                        <Text style={styles.header_title} category='h2'>Recyclify</Text>
                        <Text style={styles.header_description} category='h6'>Start your experience by creating an account</Text>
                        <FormButton mode="contained" style={styles.register_button} onPress={() => navigation.navigate('SignUp')}>
                            Sign Up
                        </FormButton>
                        <Text style={styles.header_description} category='h6'>or</Text>
                        <Text style={styles.header_description} category='h6'>Login to an existing account</Text>
                        <FormButton mode="contained" style={styles.login_button} onPress={() => navigation.navigate('SignIn')}>
                            Login
                        </FormButton>
                    </VStack>
                </Container>
            </Container>
        );
    }else{
        updateLocation();
        navigation.navigate('AppContainer');
        return (
            <Container style={styles.container} level="2" useSafeArea={true}>
                <Container style={styles.container_safearea} level="2">
                    <VStack justify='center' itemsCenter style={styles.content}>
                        <Text style={styles.header_welcome} category='h3'>Welcome to</Text>
                        <Text style={styles.header_title} category='h2'>Recyclify</Text>
                        <Text style={styles.header_description} category='h6'>You are already logged in.</Text>
                        <FormButton mode="contained" style={styles.login_button} onPress={() => navigation.navigate('AppContainer')}>
                            Start
                        </FormButton>
                    </VStack>
                </Container>
            </Container>
        );
        
    }
};

export default SignHome;

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
    login_button: {
        marginTop: 16,
        width: 200,
        backgroundColor: '#FF715B',
        color: '#ffffff',
    },
    register_button: {
        marginTop: 16,
        marginBottom: 16,
        width: 200,
        backgroundColor: '#131313',
        color: '#ffffff',
    },
    header_title:{
        color: '#FF715B',
        marginTop: 10,
        marginBottom: 50,
    },
    header_welcome: {
        marginTop: 20
    },
    header_description: {
        textAlign: 'center',
        marginTop: 5,
        marginBottom: 10,
    },
});
