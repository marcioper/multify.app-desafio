import React from 'react';
import PropTypes from 'prop-types';

import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './styles';

const MenuRightIcon = ({ navigation }) => (
  <TouchableOpacity onPress={() => navigation.state.params.handleRightClick()}>
    <Icon
      name="refresh"
      size={styles.iconRight.fontSize}
      color={styles.iconRight.color}
    />
  </TouchableOpacity>
);

MenuRightIcon.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    state: PropTypes.any,
  }).isRequired,
};

const ViewWithTitle = ({ title }) => (
  <View style={styles.headerCenterContainer}>
    <Text style={styles.textTitle}>{title}</Text>
  </View>
);

const headerWithTitle = props => {
  const { navigation } = props;
  const title = navigation.getParam('titleParam');
  return {
    headerTitle: <ViewWithTitle title={title} />,
    headerTintColor: 'white',
    headerStyle: styles.header,
    headerRight: <MenuRightIcon {...props} />,
    headerRightContainerStyle: styles.headerRightContainer,
    headerBackTitle: null,
  };
};

export default {
  headerWithTitle,
};
