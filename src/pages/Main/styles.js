import { StyleSheet } from 'react-native';
import { colors } from '../../styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.darker,
    padding: 5,
  },
  temperature: {
    fontSize: 68,
    fontWeight: '300',
    color: colors.darker,
    padding: 20,
  },
  data: {
    fontSize: 12,
    fontWeight: '300',
    fontStyle: 'italic',
    color: colors.darker,
  },
});

export default styles;
