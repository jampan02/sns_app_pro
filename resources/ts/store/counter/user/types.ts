import { Action } from "redux";
import { USER } from "../../../utils/type";
import { ActionTypes } from "../../actionTypes";

interface LoginUserAction extends Action {
    type: typeof ActionTypes.login_user;
    payload: USER;
}

export type UserActionTypes = LoginUserAction;

export type UserState = {
    isLogin: boolean;
    user?: USER;
};

//export type UserReducer = (state: UserState, action: UserActionTypes) => UserState
