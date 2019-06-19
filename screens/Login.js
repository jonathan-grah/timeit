import React from 'React';
import { View, StyleSheet } from 'react-native';
import { Button, Image, Input } from 'react-native-elements';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    title: 'Login'
  };

  render() {
    const { navigate } = this.props.navigation;

    return (
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10
        }}
      >
        <Image
          resizeMode="contain"
          source={require('../assets/images/logo.png')}
          style={{ width: 200 }}
        />
        <Input placeholder="Username..." inputContainerStyle={styles.input} />
        <Input
          placeholder="Password..."
          inputContainerStyle={[styles.input, { marginTop: 10 }]}
        />
        <View
          style={{ width: '100%', paddingHorizontal: 10, paddingVertical: 5 }}
        >
          <Button
            buttonStyle={{ marginTop: 15 }}
            onPress={() => navigate('Home')}
            title="LOGIN"
            type="outline"
          />
        </View>
      </View>
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
