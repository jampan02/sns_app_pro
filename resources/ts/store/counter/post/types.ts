import { Action } from "redux";
import { MIXED_POST_DATA, USER } from "../../../utils/type";
import { ActionTypes } from "../../actionTypes";

interface SetPostsAction extends Action {
    type: typeof ActionTypes.set_posts;
    payload: MIXED_POST_DATA[];
}

export type PostsActionTypes = SetPostsAction;

export type PostsState = MIXED_POST_DATA[];

//export type UserReducer = (state: UserState, action: UserActionTypes) => UserState
