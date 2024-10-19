import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { router } from "expo-router";
import { useSignUp } from "@clerk/clerk-expo";
import { useAuth } from "@clerk/clerk-expo";

const SignupScreen = () => {

  const { isLoaded, signUp, setActive } = useSignUp()
  const { isSignedIn } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirm_passord: '',
  });
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [toggleEye, setToggleEye] = useState(false)

  if(isSignedIn){
    router.replace('/home')
  }

  const handleInputChange = (name, value) => {
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSignup = async () => {
    try {

      if (!isLoaded) {
        return
      }

      if(! formData.email || ! formData.password || !formData.confirm_passord){
        Alert.alert('Warning', 'Please fill the fields!')
        return
      }

      if(formData.password !== formData.confirm_passord){
        Alert.alert('Warning', 'Passwords mismatch!')
        return
      }

      await signUp.create({
        emailAddress: formData.email,
        password: formData.password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)

    } catch (error) {
      Alert.alert('Error', error)
      console.log(error)
    }
    finally{
      setIsloading(false)
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return
    }

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/home')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2))
    }
  }

  if(!pendingVerification){
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButtonWrapper} onPress={() => { router.replace('/'); }}>
          <Ionicons name={"arrow-back-outline"} color={'#45484A'} size={25} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Let's get</Text>
          <Text style={styles.headingText}>started</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Ionicons name={"mail-outline"} size={30} color={'#AEB5BB'} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={'#AEB5BB'}
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)} // Update state on input change
            />
          </View>
          <View style={styles.inputContainer}>
            <SimpleLineIcons name={"lock"} size={30} color={'#AEB5BB'} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              placeholderTextColor={'#AEB5BB'}
              secureTextEntry={!toggleEye ? true : false}
              value={formData.password}
              onChangeText={(value) => handleInputChange('password', value)} // Update state on input change
            />
            <TouchableOpacity
              onPress={() => {
                // Implement password visibility toggle if needed
                setToggleEye(!toggleEye)
              }}
            >
              <Ionicons name={toggleEye ? "eye" : "eye-off"} size={20} color={'#AEB5BB'} />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <SimpleLineIcons
              name={"lock"}
              size={30}
              color={'#AEB5BB'}
            />
            <TextInput
              style={styles.textInput}
              placeholder="confirm password"
              placeholderTextColor={'#AEB5BB'}
              value={formData.confirm_passord}
              onChangeText={(value) => handleInputChange('confirm_passord', value)} // Update state on input change
            />
          </View>
  
          <TouchableOpacity style={styles.loginButtonWrapper} onPress={handleSignup}>
            <Text style={styles.loginText}>Sign up</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.accountText}>Already have an account!</Text>
            <TouchableOpacity onPress={() => { router.replace('/sign-in') }}>
              <Text style={styles.signupText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }else{
    return(
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButtonWrapper} onPress={() => { router.replace('/'); }}>
          <Ionicons name={"arrow-back-outline"} color={'#45484A'} size={25} />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Let's get</Text>
          <Text style={styles.headingText}>verified</Text>
        </View>
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <SimpleLineIcons name={"lock"} size={30} color={'#AEB5BB'} />
            <TextInput
              style={styles.textInput}
              placeholder="code..."
              placeholderTextColor={'#AEB5BB'}
              secureTextEntry={true}
              value={code}
              onChangeText={(code) => setCode(code)}
            />
          </View>
          <TouchableOpacity style={styles.loginButtonWrapper} onPress={onPressVerify}>
            <Text style={styles.loginText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    paddingTop: 40,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: '#45484A',
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#AEB5BB',
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  forgotPasswordText: {
    textAlign: "right",
    color: '#45484A',
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: '#45484A',
    borderRadius: 100,
    marginTop: 20,
  },
  loginText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    color: '#45484A',
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 2,
    borderColor: '#45484A',
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    height: 20,
    width: 20,
  },
  googleText: {
    fontSize: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: '#45484A',
  },
  signupText: {
    color: '#45484A',
  },
});
