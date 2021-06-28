import { ActionTypes } from "../../actionTypes";
import { USER, MIXED_POST_DATA } from "../../../utils/type";
import { PostsActionTypes, PostsState } from "./types";

const initialState: MIXED_POST_DATA[] = [];

export const postsReducer = (
    state: PostsState = initialState,
    action: PostsActionTypes
) => {
    switch (action.type) {
        case ActionTypes.set_posts:
            console.log("reducer", action.payload);
            return action.payload;
        default:
            return state;
    }
};
