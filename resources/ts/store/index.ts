import { combineReducers, compose, createStore } from "redux";
import { postsReducer } from "./counter/post/reducer";
import { userReducer } from "./counter/user/reducer";

const rootReducer = combineReducers({
    user: userReducer,
    posts: postsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

interface ExtendedWindow extends Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
}
declare var window: ExtendedWindow;

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
