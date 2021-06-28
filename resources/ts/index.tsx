import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./views/pages/login/Login";
import Register from "./views/pages/login/Register";
import Top from "./views/pages/top/Top";
import Create from "./views/pages/posts/Create";
import Auth from "./views/lauout/Auth";
import { Provider } from "react-redux";
import store from "./store/index";
import Login_User from "./views/pages/user/Login_User";
import IsLogin from "./views/lauout/IsLogin";
import View from "./views/pages/posts/View";
import User from "./views/pages/user/User";
import Followee from "./views/pages/follow/Followee";
import Follower from "./views/pages/follow/Follower";
import Layout from "./views/lauout/Layout";
import PostResult from "./views/search/PostResult";
import UserResult from "./views/search/UserResult";
import Edit from "./views/pages/posts/Edit";
const App = () => {
    return (
        <Router>
            <Layout>
                <Switch>
                    <IsLogin>
                        <Switch>
                            <Route exact path="/" component={Top} />
                            <Route
                                exact
                                path="/:user/post/:id"
                                component={View}
                            />
                            <Route
                                exact
                                path="/:user/edit/:id"
                                component={Edit}
                            />
                            <Route
                                exact
                                path="/:user/user/:id"
                                component={User}
                            />
                            <Route
                                exact
                                path="/:user/followee/:id"
                                component={Followee}
                            />
                            <Route
                                exact
                                path="/:user/follower/:id"
                                component={Follower}
                            />
                            <Route
                                exact
                                path="/search/post"
                                component={PostResult}
                            />
                            <Route
                                exact
                                path="/search/user"
                                component={UserResult}
                            />
                            <Auth>
                                <Switch>
                                    <Route
                                        exact
                                        path="/create"
                                        component={Create}
                                    />
                                    <Route
                                        exact
                                        path="/user"
                                        component={Login_User}
                                    />
                                </Switch>
                            </Auth>
                        </Switch>
                    </IsLogin>
                </Switch>
            </Layout>
        </Router>
    );
};

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("app")
);

/*
                <Route exact path="/login" component={Login} />
                <Route exact path="/register" component={Register} />
*/
