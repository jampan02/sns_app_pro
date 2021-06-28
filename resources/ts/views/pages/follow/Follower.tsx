import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import { RootState } from "../../../store";
import axios from "axios";
import { FOLLOW, LIKE, MIXED_POST_DATA, POST, USER } from "../../../utils/type";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroller";
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
//import Link from '@material-ui/core/Link';
const useStyles = makeStyles(theme => ({
    card: {
        display: "flex",
        justifyContent: "space-between"
    },
    cardContent: {
        display: "flex"
    },
    grid: {
        marginBottom: "10px"
    }
}));
type DATA = {
    user: USER;
    follow?: FOLLOW;
};
const Follower = () => {
    const classes = useStyles();
    const params: { id: string; user: string } = useParams();
    const user = useSelector((state: RootState) => state.user.user);
    const targetUserName = params.user;
    const targetUserId = params.id;
    const [users, setUsers] = useState<USER[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
    const [results, setResults] = useState<DATA[]>([]);
    const history = useHistory();
    //フォロー関数
    const onFollow = async (targetId: number) => {
        if (user) {
            console.log(user.id, targetId);
            await axios
                .post("/api/add/follow/search", {
                    followee: user.id,
                    follower: targetId
                })
                .then(res => {
                    const follow = res.data as FOLLOW;
                    setResults(
                        results.map((result, i) => {
                            console.log(i, targetId);
                            if (result.user.id === targetId) {
                                const newResult: DATA = {
                                    user: result.user,
                                    follow
                                };
                                return newResult;
                            } else {
                                return result;
                            }
                        })
                    );
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };
    //フォロー解除関数
    const onRemoveFollow = async (targetId: number) => {
        if (user) {
            console.log(user.id, targetId);
            await axios
                .post("/api/del/follow/search", {
                    followee: user.id,
                    follower: targetId
                })
                .then(res => {
                    console.log(res.data);
                    setResults(
                        results.map((result, i) => {
                            console.log(i, targetId);
                            if (result.user.id === targetId) {
                                const newResult: DATA = {
                                    user: result.user
                                };
                                return newResult;
                            } else {
                                return result;
                            }
                        })
                    );
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };
    const followButton = (result: DATA) => {
        if (user) {
            if (result.follow) {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onRemoveFollow(result.user.id)}
                    >
                        フォローはずす
                    </Button>
                );
            } else if (user.id === result.user.id) {
                //同一アバターの場合
                return null;
            } else {
                return (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => onFollow(result.user.id)}
                    >
                        フォローする
                    </Button>
                );
            }
        } else {
            //非ログイン
            return (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => history.push("/register")}
                >
                    フォローする
                </Button>
            );
        }
    };

    //ロード中に表示する項目
    const loader = (
        <div className="loader" key={0}>
            Loading ...
        </div>
    );
    //項目を読み込むときのコールバック
    const loadMore = async (page: number) => {
        setIsFetching(true);

        const data: DATA = await axios
            .get("/api/get/follower", {
                params: {
                    number: page,
                    targetId: targetUserId,
                    user_id: user?.id
                }
            })
            .then(res => {
                console.log(res.data);
                return res.data;
            })
            .catch(error => {
                console.log(error);
            });

        //データ件数が0件の場合、処理終了
        if (!data) {
            setHasMore(false);
            return;
        }
        //取得データをリストに追加*

        setResults([...results, data]);
        setIsFetching(false);
    };
    return (
        <>
            <InfiniteScroll
                loadMore={loadMore} //項目を読み込む際に処理するコールバック関数
                hasMore={!isFetching && user && hasMore} // isFetchingを判定条件に追加
                loader={loader}
                useWindow={false}
            >
                <Grid container>
                    {results[0] &&
                        results.map((result, i) => {
                            return (
                                <Grid
                                    item
                                    key={i}
                                    xs={12}
                                    className={classes.grid}
                                >
                                    <Card className={classes.card}>
                                        <Link
                                            to={`/${result.user.name}/user/${result.user.id}`}
                                        >
                                            <CardContent
                                                className={classes.cardContent}
                                            >
                                                <Avatar
                                                    alt="image"
                                                    src={
                                                        result.user
                                                            .profile_image
                                                    }
                                                />
                                                <Typography>
                                                    {result.user.name}
                                                </Typography>
                                            </CardContent>
                                        </Link>
                                        <CardActions>
                                            {followButton(result)}
                                        </CardActions>
                                    </Card>
                                </Grid>
                            );
                        })}
                </Grid>
            </InfiniteScroll>
        </>
    );
};

export default Follower;
