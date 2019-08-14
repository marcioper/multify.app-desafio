import { call, put } from 'redux-saga/effects';
import api from '../../services/api';

import { Creators as CityActions } from '../ducks/cities';

import stringsUtil from '../../util/strings';

export function* getCityRequest(action) {
  try {
    const { city } = action.payload;

    let response = yield call(
      api.get,
      `/api/v1/locale/city?name=${city.name}&state=${city.state}&token=${stringsUtil.keys.token}`
    );

    if (response !== null && response.status === 200) {
      const data = response.data[0];
      console.tron.log(`Retorno ID: ${data.id}`);
      const query = `localeId%5B%5D=${data.id}`;
      response = yield call(
        api.put,
        `/api-manager/user-token/${stringsUtil.keys.token}/locales`,
        query,
        {
          headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        }
      );
      if (response !== null && response.status === 200) {
        response = yield call(
          api.get,
          `/api/v1/weather/locale/${data.id}/current?token=${stringsUtil.keys.token}`
        );
        if (response !== null && response.status === 200) {
          console.tron.log(`Retorno FInal: ${JSON.stringify(response.data)}`);
          yield put(CityActions.getCitySuccess(response.data));
        } else {
          yield put(
            CityActions.getCityError(
              'Oops something went wrong :( Please contact your administrator.'
            )
          );
        }
      }
    }
  } catch (error) {
    yield put(
      CityActions.getCityError(
        'Oops something went wrong :( Please contact your administrator.'
      )
    );
  }
}
