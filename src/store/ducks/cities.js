export const Types = {
  GET_REQUEST: 'cities/GET_REQUEST',
  GET_SUCCESS: 'cities/GET_SUCCESS',
  GET_ERROR: 'cities/GET_ERROR',
};

const initialState = {
  data: {
    id: 0,
    name: '',
    state: '',
    country: '',
    data: {
      temperature: 0,
      wind_direction: '',
      wind_velocity: 0,
      humidity: 0,
      condition: '',
      pressure: 0,
      icon: '',
      sensation: 0,
      date: '',
    },
  },
  loading: false,
  error: null,
};

export default function cities(state = initialState, action) {
  switch (action.type) {
    case Types.GET_REQUEST:
      return {
        ...state,
        loading: true,
        error: '',
      };
    case Types.GET_SUCCESS:
      return {
        ...state,
        data: action.payload.city,
        loading: false,
        error: '',
      };
    case Types.GET_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.message,
      };
    default:
      return state;
  }
}

export const Creators = {
  getCityRequest: city => ({
    type: Types.GET_REQUEST,
    payload: {
      city,
    },
  }),

  getCitySuccess: city => ({
    type: Types.GET_SUCCESS,
    payload: {
      city,
    },
  }),

  getCityError: message => ({
    type: Types.GET_ERROR,
    payload: {
      message,
    },
  }),
};
