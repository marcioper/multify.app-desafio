import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  PermissionsAndroid,
  NativeModules,
  Linking,
  Alert,
  Text,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import Geocode from 'react-geocode';
import './src/config/ReactotronConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
});

export default class App extends Component {
  componentDidMount() {
    this.checkPermissions();
  }

  checkPermissions = async () => {
    try {
      if (Platform.OS === 'ios') {
        this.requestPermissions();
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Localization',
            message:
              'Permitir acesso a sua localização para salvar os registros.',
            buttonNeutral: 'Pergunte depois',
            buttonNegative: 'Continuar não permitindo',
            buttonPositive: 'OK',
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          this.requestPermissions();
        } else {
          this.showAlert();
        }
      }
    } catch (err) {
      console.tron.error(`An error occurred at checkPermissions -> ${err}`);
    }
  };

  requestPermissions = async () => {
    try {
      Geolocation.getCurrentPosition(
        response => {
          // set Google Maps Geocoding API for purposes of quota management.
          Geocode.setApiKey('AIzaSyD9fmv0VPkJC5xxVlF5nN9bm7nBCSHHU30');

          // Enable or disable logs. Its optional.
          Geocode.enableDebug();

          // this.setState({ location: response.coords });
          const { latitude, longitude } = response.coords;
          // this.setState({ latitude, longitude });
          // console.tron.log(`latitude: ${latitude}`);
          // console.tron.log(`coords: ${JSON.stringify(response.coords)}`);

          // Get address from latidude & longitude.
          Geocode.fromLatLng(latitude, longitude).then(
            geo => {
              const address = geo.results[0].formatted_address;
              const splitted = address.split(',');
              const arrCityState = splitted[2].split('-');
              const city = arrCityState[0].trim();
              const state = arrCityState[1].trim();
              console.tron.log(city);
              console.tron.log(state);
            },
            error => {
              console.tron.error(error);
            }
          );
        },
        error => {
          if (error.PERMISSION_DENIED === 1) {
            this.showAlert();
          }
        }
      );
    } catch (err) {
      console.tron.error(`An error occurred at requestPermissions -> ${err}`);
    }
  };

  showAlert = () => {
    Alert.alert(
      'Localization',
      'Permitir acesso a sua localização para salvar os registros',
      [
        {
          text: 'Pergunte depois',
          onPress: () => console.tron.log('Ask me later pressed'),
        },
        {
          text: 'Continuar não permitindo',
          onPress: () => console.tron.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Permitir',
          onPress: () => this.openAppSettings(),
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  openAppSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      const { RNAndroidOpenSettings } = NativeModules;
      RNAndroidOpenSettings.appDetailsSettings();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Desafio App</Text>
      </View>
    );
  }
}
