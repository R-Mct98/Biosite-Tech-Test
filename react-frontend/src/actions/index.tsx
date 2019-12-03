import * as constants from '../constants';
const axios = require('axios');

export interface UserDataFetch {
    type: constants.USER_DATA_FETCH;
    payload: any
}

export type UserAction = UserDataFetch;

export function userDataFetch(): any {
  return (dispatch:any) => {
    axios.get('http://localhost:8080/api/users')
    .then(function (response:any) {
      // handle success
      return dispatch({
        payload: response.data,
        type: constants.USER_DATA_FETCH
      });
    })
    .catch(function (error:any) {
      // handle error
      return dispatch({
        payload: error.errorMessage,
        type: constants.USER_DATA_FETCH_FAILED
      });
    });
  }
}
