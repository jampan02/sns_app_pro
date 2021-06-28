import { USER } from "../../../utils/type";
import { ActionTypes } from "../../actionTypes";

export const login_user = ({
    id,
    name,
    profile_image,
    self_introduction,
    email,
    created_at,
    updated_at
}: USER) => {
    return {
        type: ActionTypes.login_user,
        payload: {
            id,
            name,
            profile_image,
            self_introduction,
            email,
            created_at,
            updated_at
        }
    };
};
