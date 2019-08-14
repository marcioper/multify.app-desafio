import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Platform,
  PermissionsAndroid,
  NativeModules,
  Linking,
  Alert,
  Text,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import Geocode from 'react-geocode';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { Creators as CityActions } from '../../store/ducks/cities';

import 'moment/locale/pt-br';

import styles from './styles';
import { general } from '../../styles';
import stringsUtil from '../../util/strings';

class App extends Component {
  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({ titleParam: stringsUtil.pages.mainTitle });
    navigation.setParams({ handleRightClick: this.handleSync.bind(this) });

    this.checkPermissions();
  }

  handleSync = async () => {
    this.checkPermissions();
  };

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
      console.error(`An error occurred at checkPermissions -> ${err}`);
    }
  };

  requestPermissions = async () => {
    try {
      Geolocation.getCurrentPosition(
        response => {
          // set Google Maps Geocoding API for purposes of quota management.
          Geocode.setApiKey(stringsUtil.keys.geocode);

          // Enable or disable logs. Its optional.
          Geocode.enableDebug();

          const { latitude, longitude } = response.coords;

          // Get address from latidude & longitude.
          Geocode.fromLatLng(latitude, longitude).then(
            geo => {
              const address = geo.results[0].formatted_address;
              const splitted = address.split(',');
              const arrCityState = splitted[2].split('-');
              const cityName = arrCityState[0].trim();
              const cityState = arrCityState[1].trim();

              const city = {
                name: cityName,
                state: cityState,
              };
              const { getCityRequest } = this.props;
              getCityRequest(city);
            },
            error => {
              console.error(error);
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
      console.error(`An error occurred at requestPermissions -> ${err}`);
    }
  };

  showAlert = () => {
    Alert.alert(
      'Localization',
      'Permitir acesso a sua localização para salvar os registros',
      [
        {
          text: 'Pergunte depois',
          onPress: () => console.log('Ask me later pressed'),
        },
        {
          text: 'Continuar não permitindo',
          onPress: () => console.log('Cancel Pressed'),
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
    const { cities } = this.props;
    const { data, loading } = cities;
    const { data: weather } = data;
    const iconUrl = `https://www.climatempo.com.br/dist/images/${weather.icon}.png`;
    return (
      <SafeAreaView style={styles.container}>
        {data.name === '' || loading ? (
          <View style={general.loadingContainer}>
            <ActivityIndicator
              style
              size="large"
              color={general.loading.color}
            />
          </View>
        ) : (
          <>
            <Image
              style={{ width: 80, height: 80 }}
              source={{ uri: iconUrl }}
            />
            <Text style={styles.temperature}>{weather.temperature}°</Text>
            <Text style={styles.title}>
              {data.name}
              {','} {data.state}{' '}
            </Text>
            <Text style={styles.data}>
              {moment(weather.date).format('DD/MM/YYYY HH:mm:ss')}
            </Text>
          </>
        )}
      </SafeAreaView>
    );
  }
}

App.propTypes = {
  navigation: PropTypes.shape({
    setParams: PropTypes.func,
  }).isRequired,
  cities: PropTypes.shape({
    data: PropTypes.any,
    loading: PropTypes.bool,
    error: PropTypes.oneOfType([null, PropTypes.string]),
  }).isRequired,
  getCityRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  cities: state.cities,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      ...CityActions,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
