import React from 'react';
import * as actions from '../actions/';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

export interface Props {
    userData: any;
    getUserData: () => void;
  }

function Users({ userData, getUserData }: Props) {
    return (
      <div className="info-wrapper">
        <div className="info-wrapper_data">
            <ul>
                {!userData ? 'No content' : userData.map((data:any) => <li>{data.firstName + ' ' +  data.lastName}</li>)}
            </ul>
        </div>
        <button className="info-wrapper-btn" onClick={getUserData}>Get User Data</button>
      </div>
    );
  }

function mapStateToProps({ userData }: any) {
    return {
        userData
    };
}

function mapDispatchToProps(dispatch: Dispatch<actions.UserAction>) {
    return {
        getUserData: () => dispatch(actions.userDataFetch()),
    };
}
export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(Users);
