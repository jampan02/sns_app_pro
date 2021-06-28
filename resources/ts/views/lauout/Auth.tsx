import React, { useEffect, useState, ReactNode } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { login_user } from "../../store/counter/user/action";
import { RootState } from "../../store";
type PROPS = {
    children: ReactNode;
};

const Auth: React.FC<PROPS> = ({ children }) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);
    const [isLogin, setIsLogin] = useState(false);
    useEffect(() => {
        if (!user.user) {
            axios
                .get("/json")
                .then(res => {
                    console.log(res);
                    console.log(res.data.id);
                    if (res.data) {
                        dispatch(login_user(res.data));
                        setIsLogin(true);
                    } else {
                        history.push("/register");
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            setIsLogin(true);
        }
    }, [user]);
    return isLogin ? <div>{children}</div> : <div>no login</div>;
};

export default Auth;
