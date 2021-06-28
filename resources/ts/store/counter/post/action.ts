import { MIXED_POST_DATA, USER } from "../../../utils/type";
import { ActionTypes } from "../../actionTypes";

export const set_posts = (data: MIXED_POST_DATA[]) => {
    console.log("action");
    return {
        type: ActionTypes.set_posts,
        payload: data
    };
};
