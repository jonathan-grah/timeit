import React from 'React';
import {
  AsyncStorage,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  View,
  Text
} from 'react-native';
import { Button, Icon, Input } from 'react-native-elements';
import GestureRecognizer, {
  swipeDirections
} from 'react-native-swipe-gestures';
import moment from 'moment';

import * as firebase from 'firebase';

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyAJu-JZ-uHEs4PFCPqLv8qRz1pqJdiHee',
  authDomain: 'track-9671a.firebaseapp.com',
  databaseURL: 'https://track-9671a.firebaseio.com/',
  storageBucket: 'gs://track-9671a.appspot.com/'
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Log Time'
  };

  constructor(props) {
    super(props);

    this.state = {
      day: moment(new Date()),
      hours: 0,
      minutes: '00',
      location: '',
      disabled: false
    };
  }

  removeDay() {
    this.setState({ day: moment(this.state.day).subtract(1, 'days') });
  }

  addDay() {
    this.setState({ day: moment(this.state.day).add(1, 'days') });
  }

  removeHour() {
    if (this.state.hours >= 1)
      this.setState({ hours: (this.state.hours -= 1) });
  }

  addHour() {
    this.setState({ hours: (this.state.hours += 1) });
  }

  addMins() {
    if (this.state.minutes == '00') this.setState({ minutes: '30' });
    else {
      this.setState({ hours: (this.state.hours += 1) });
      this.setState({ minutes: '00' });
    }
  }

  removeMins() {
    if (this.state.minutes == '00') {
      if (!this.state.hours == 0) {
        this.setState({ hours: (this.state.hours -= 1) });
        this.setState({ minutes: '30' });
      }
    } else this.setState({ minutes: '00' });
  }

  getGeolocation() {
    // navigator.geolocation.getCurrentPosition(
    //   position => {
    //     let req = new XMLHttpRequest()
    //     req.open('GET', `https://maps.googleapis.com/maps/api/geocode/json?latlng=
    //     ${`${position.coords.latitude},${position.coords.longitude}`}&key=
    //     ${'AIzaSyA5JxqkJzRQ91xUYCywrep670CP65z7muo'}`, true)

    //     req.onload = res => {
    //       if (JSON.parse(res.target._response).results.length > 0) {
    //         this.setState({ location: JSON.parse(res.target._response).results[0].formatted_address });
    //       } else {
    //         this.setState({ location: 'Liberty IT Office, 24-26 Adelaide St, Belfast' })
    //       }
    //     }

    //     req.send()
    //   },
    //   error => console.log(error.message),
    //   { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    // );

    this.setState({
      location: 'Liberty IT Office, Belfast'
    });
  }

  toggleDisabled() {
    const currentStatus = this.state.disabled;
    this.setState({ disabled: !currentStatus });
  }

  handleSubmit() {
    firebase
      .database()
      .ref('days/' + moment(this.state.day).format('YYYY-MM-DD'))
      .push()
      .set({
        hours: this.state.hours.toString(),
        minutes: this.state.minutes.toString(),
        location: this.state.location
      });
    this.props.navigation.navigate('Week');
  }

  render() {
    const gestureConfig = {
      velocityThreshold: 0
    };

    return (
      <KeyboardAvoidingView
        style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}
        behavior="padding"
        enabled
        keyboardVerticalOffset={85}
      >
        <ScrollView>
          <View
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 10,
              paddingTop: 35
            }}
          >
            <GestureRecognizer
              onSwipeLeft={state => this.addDay()}
              onSwipeRight={state => this.removeDay()}
              config={gestureConfig}
              style={{
                width: '100%',
                padding: 20
              }}
            >
              <Text
                style={[
                  this.state.disabled ? { color: '#eee' } : {},
                  {
                    fontSize: 50,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }
                ]}
              >
                {moment(this.state.day).format('ddd Do')}
              </Text>
              <Icon
                name="exchange"
                type="font-awesome"
                color={this.state.disabled ? '#eee' : '#000'}
              />
            </GestureRecognizer>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <GestureRecognizer
                onSwipeUp={state => this.removeHour()}
                onSwipeDown={state => this.addHour()}
                config={gestureConfig}
              >
                <Text
                  style={[
                    this.state.disabled ? { color: '#eee' } : {},
                    {
                      fontSize: 105,
                      textTransform: 'uppercase',
                      fontWeight: 'bold'
                    }
                  ]}
                >
                  {this.state.hours < 10
                    ? `0${this.state.hours}`
                    : this.state.hours}
                </Text>
              </GestureRecognizer>
              <Text
                style={[
                  this.state.disabled ? { color: '#eee' } : {},
                  {
                    fontSize: 105,
                    fontWeight: 'bold',
                    marginHorizontal: 10
                  }
                ]}
              >
                :
              </Text>
              <GestureRecognizer
                onSwipeUp={state => this.removeMins()}
                onSwipeDown={state => this.addMins()}
                config={gestureConfig}
              >
                <Text
                  style={[
                    this.state.disabled ? { color: '#eee' } : {},
                    {
                      fontSize: 105,
                      textTransform: 'uppercase',
                      fontWeight: 'bold'
                    }
                  ]}
                >
                  {this.state.minutes}
                </Text>
              </GestureRecognizer>
            </View>
            <Icon
              name="exchange"
              type="font-awesome"
              color={this.state.disabled ? '#eee' : '#000'}
              iconStyle={{
                transform: [{ rotate: '90deg' }]
              }}
            />
            <Input
              placeholder="Location..."
              value={this.state.location}
              type="text"
              inputContainerStyle={[styles.input, { marginTop: 30 }]}
              onFocus={() => this.getGeolocation()}
            />
            <View
              style={{
                width: '100%',
                paddingHorizontal: 10,
                marginTop: 30
              }}
            >
              <Button
                icon={
                  <Icon
                    name="check"
                    type="font-awesome"
                    size={30}
                    color="white"
                  />
                }
                buttonStyle={{
                  backgroundColor: '#4388d6'
                }}
                onPress={this.handleSubmit.bind(this)}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                paddingHorizontal: 10,
                marginTop: 30
              }}
            >
              <Button
                title="Holidays"
                containerStyle={{
                  width: '50%'
                }}
                buttonStyle={{
                  paddingVertical: 15,
                  backgroundColor: '#000',
                  marginRight: 5
                }}
                onPress={this.toggleDisabled.bind(this)}
              />
              <Button
                title="Sick"
                containerStyle={{
                  width: '50%'
                }}
                buttonStyle={{
                  paddingVertical: 15,
                  backgroundColor: '#000',
                  marginLeft: 5
                }}
                onPress={this.toggleDisabled.bind(this)}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 5,
    borderColor: 'grey',
    paddingHorizontal: 15,
    paddingVertical: 5
  }
});
