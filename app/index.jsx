import * as React from 'react';
import { Dimensions, Text, View, ImageBackground, Pressable, Alert } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';


function Index() {

    const { isSignedIn } = useAuth()

    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height + 40;

    const images = [
        require('../assets/images/slide1.jpg'),
        require('../assets/images/slide2.jpg'),
        require('../assets/images/slide3.jpg'),
        require('../assets/images/slide1.jpg'), 
        require('../assets/images/slide2.jpg'),
        require('../assets/images/slide3.jpg'),
    ];

    return (
        <View className="w-full h-full"> 
            <Carousel
                loop
                width={width}
                height={height}
                autoPlay={true}
                data={images}
                scrollAnimationDuration={5000}
                renderItem={({ index }) => (
                    <ImageBackground
                        source={images[index]}
                        className="w-full h-full justify-center items-center"
                        resizeMode="cover"
                    >
                        <View className="flex flex-col gap-6 justify-center items-center w-full h-full bg-opacity-50" pointerEvents="box-none">
                            <Image source={require('../assets/images/logo.jpg')} className="w-32 h-32" placeholder={'logo'} contentFit="contain" />
                            <Text className="text-center text-lg w-72 text-white">Awareness is the first step in acceptance, and acceptance is the first step in action.</Text>
                            <Pressable 
                                onPress={() => {
                                    isSignedIn ? router.replace('/home') : router.replace('/sign-in')
                                }} 
                                className="bg-white px-16 py-3 rounded z-10"
                            >
                                <Text>Continue</Text>
                            </Pressable>
                        </View>
                    </ImageBackground>
                )}
            />
        </View>
    );
}

export default Index;
