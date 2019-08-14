import { all, takeLatest } from 'redux-saga/effects';

import { Types as CityTypes } from '../ducks/cities';
import { getCityRequest } from './cities';

export default function* rootSaga() {
  return yield all([takeLatest(CityTypes.GET_REQUEST, getCityRequest)]);
}
