import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import Animated, { BounceIn } from 'react-native-reanimated';
import { router } from 'expo-router';
import { ResizeMode, Video } from 'expo-av';
import { useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {

  const video = useRef(null);
  const { signOut } = useAuth()

  const sections = [
    { name: 'Monitoring', screen: '/monitor', color: '#E3F2FD' },
    { name: 'Settings', screen: 'SettingsScreen', color: '#FFCDD2' },
    { name: 'Data Center', screen: 'DataCenterScreen', color: '#C8E6C9' },
    { name: 'Reports', screen: 'ReportsScreen', color: '#FFF9C4' },
  ];

  return (
    <View style={styles.container}>
      <View style={{
        flex: 1, flexDirection: 'row', height: 'auto', gap: 40, marginBottom: 18
      }}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={() => { router.replace('/'); }}>
        <Ionicons name={"arrow-back-outline"} color={'#45484A'} size={25} />
      </TouchableOpacity>
      <Text style={styles.title}>Autism Monitoring</Text>
      </View>
      <ScrollView>
        <View style={styles.gridContainer}>
          {sections.map((section, index) => (
            <Animated.View
              key={index}
              entering={BounceIn.delay(index * 100)} // Animation for each section
              style={[styles.animatedTouchable, { backgroundColor: section.color }]}
            >
              <TouchableOpacity onPress={() => {
                router.replace(section.screen)
              }}>
                <Text style={styles.sectionText}>{section.name}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
        <View style={styles.videoContainer}>
          <Video
            ref={video}
            style={styles.video}
            source={require('../../assets/images/animated.mp4')}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={true}
      />
        </View>
        <View style={styles.videoContainer}>
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
            }}
            resizeMode={ResizeMode.CONTAIN}
            isLooping
            shouldPlay={true}
      />
        </View>
        <View style={{
          flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30, width: '100%'
        }}>
        <Animated.View
         entering={BounceIn.delay(4 * 100)}>
          <TouchableOpacity style={styles.signout} onPress={()=>{
            signOut().then(()=>{
              router.replace('/')
            })
          }}>
            <Text style={{
              fontSize: 14
            }}>Sign out</Text>
          </TouchableOpacity>
        </Animated.View>
        </View> 
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#f5f5f5',
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  animatedTouchable: {
    width: '45%',
    marginBottom: 20,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  sectionText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  videoContainer: {
    marginTop: 30,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  signout: {
    backgroundColor: '#FFD7BE',
    paddingHorizontal: 45,
    paddingVertical: 10,
    borderRadius: 10,
  }
});

export default HomeScreen;
