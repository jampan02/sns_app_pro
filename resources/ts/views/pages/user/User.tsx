import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router";
import { RootState } from "../../../store";
import axios from "axios";
import { FOLLOW, LIKE, MIXED_POST_DATA, POST, USER } from "../../../utils/type";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Hidden from "@material-ui/core/Hidden";
import Button from "@material-ui/core/Button";
import InfiniteScroll from "react-infinite-scroller";
import AppBar from "@material-ui/core/AppBar";
import CameraIcon from "@material-ui/icons/PhotoCamera";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Container from "@material-ui/core/Container";
import Avatar from "@material-ui/core/Avatar";
import CardActions from "@material-ui/core/CardActions";
//import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
    icon: {
        marginRight: theme.spacing(2)
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6)
    },
    heroButtons: {
        marginTop: theme.spacing(4)
    },
    cardGrid: {
        paddingRight: theme.spacing(15),
        paddingLeft: theme.spacing(15)
    },
    card: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: "10px"
    },
    cardMedia: {
        paddingTop: "56.25%" // 16:9
    },
    cardContent: {
        flexGrow: 1
    },
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6)
    },
    profileContent: {},
    grid: {
        marginBottom: "30px"
    },
    large: {
        width: theme.spacing(15),
        height: theme.spacing(15)
    },
    followLength: {
        display: "flex"
    },
    nameText: {
        marginBottom: "20px"
    },
    introductionText: {
        marginLeft: "5px"
    },
    avatarContainer: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",

        alignItems: "center"
    },
    followContainer: {
        display: "flex",
        justifyContent: "space-between"
    }
}));
type FollowLength = {
    followeeLength: number;
    followerLength: number;
};

const User = () => {
    const classes = useStyles();
    const myUserId = useSelector((state: RootState) => state.user.user?.id);
    const history = useHistory();
    const [hasMore, setHasMore] = useState(true);
    const [user, setUser] = useState<USER>();
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [followLength, setFollowLength] = useState<FollowLength>({
        followeeLength: 0,
        followerLength: 0
    });
    const [isFollow, setIsFollow] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const params: { id: string } = useParams();
    const id = params.id;

    const location: {
        pathname: string;
        state: USER;
    } = useLocation();
    useEffect(() => {
        if (location.state) {
            setUser(location.state);
        }
        //パラメーターに則ったユーザー情報取得
        const f = async () => {
            //該当のユーザーの、フォロー・フォロワー数取得
            await axios
                .get("/api/get/follow", { params: { userId: id } })
                .then(res => {
                    console.log(res.data);
                    setFollowLength({
                        followeeLength: res.data.followee,
                        followerLength: res.data.follower
                    });
                })
                .catch(error => {
                    console.log(error);
                });
        };
        f();
    }, []);
    useEffect(() => {
        //フォロー中かどうか調べる
        if (myUserId) {
            console.log("lognnin");
            axios
                .get("/api/get/isfollow", {
                    params: { followee: myUserId, follower: id }
                })
                .then(res => {
                    console.log(res.data);
                    if (res.data === "yes") {
                        setIsFollow(true);
                    } else {
                        setIsFollow(false);
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }, [myUserId]);
    //フォロー関数
    const onFollow = (targetId: number) => {
        if (myUserId) {
            axios
                .post("/api/add/follow", {
                    followee: myUserId,
                    follower: targetId
                })
                .then(res => {
                    setFollowLength({
                        followeeLength: res.data.followee,
                        followerLength: res.data.follower
                    });
                    setIsFollow(true);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };
    //フォロー解除関数
    const onRemoveFollow = (targetId: number) => {
        if (myUserId) {
            axios
                .post("/api/del/follow", {
                    followee: myUserId,
                    follower: targetId
                })
                .then(res => {
                    console.log(res.data);
                    setFollowLength({
                        followeeLength: res.data.followee,
                        followerLength: res.data.follower
                    });
                    setIsFollow(false);
                })
                .catch(error => {
                    console.log(error);
                });
        } else {
            history.push("/register");
        }
    };
    const isCanFollow = (userId: number) => {
        let isUserSame = false;
        if (myUserId) {
            if (userId === myUserId) {
                isUserSame = true;
            }
        } else {
            isUserSame = false;
        }
        return isUserSame;
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
        if (user) {
            const data: MIXED_POST_DATA = await axios
                .get("/api/get/post/scroll/user", {
                    params: { number: page, user_id: user.id }
                })
                .then(res => {
                    const data = res.data;
                    console.log(data);
                    return data;
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
            setPosts([...posts, data]);
            setIsFetching(false);
            console.log(page);
        }
    };
    const onAddLike = (post_id: number, index: number) => {
        if (user) {
            const user_id = user.id;
            console.log(index);
            const indexNumber = index;
            axios
                .post("/api/add/like", {
                    user_id,
                    post_id
                })
                .then(res => {
                    console.log(res.data);
                    console.log(posts);

                    setPosts(
                        posts.map((post, i) => {
                            if (i === indexNumber) {
                                return res.data;
                            } else {
                                return post;
                            }
                        })
                    );

                    console.log(posts);
                })
                .catch(error => console.log(error));
        } else {
            history.push("/register");
        }
    };
    //いいね解除
    const onRemoveLike = (post_id: number, index: number) => {
        if (user) {
            const user_id = user.id;
            axios
                .post("/api/del/like", {
                    user_id,
                    post_id
                })
                .then(res => {
                    console.log(res.data);
                    console.log(posts);

                    setPosts(
                        posts.map((post, i) => {
                            if (i === index) {
                                return res.data;
                            } else {
                                return post;
                            }
                        })
                    );
                });
        } else {
            history.push("/register");
        }
    };
    //いいねしたことあるか、
    const isLikedBefore = (post: MIXED_POST_DATA) => {
        if (user) {
            const even = (like: LIKE) => like.user_id === user.id;
            const isLiked = post.likes.some(even);
            return isLiked;
        }
    };
    const getDate = (date: string) => {
        const toDate = new Date(date);
        const month = toDate.getMonth() + 1;
        const day = toDate.getDate();
        return (
            <Typography>
                {month}月 {day}日
            </Typography>
        );
    };
    return (
        <>
            {user && (
                <Grid item xs={12} className={classes.grid}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            <div className={classes.avatarContainer}>
                                <Avatar
                                    alt="image"
                                    src={user.profile_image}
                                    className={classes.large}
                                />
                                <Typography
                                    variant="h4"
                                    gutterBottom
                                    className={classes.nameText}
                                >
                                    {user.name}
                                </Typography>
                            </div>
                            <Typography className={classes.introductionText}>
                                {user.self_introduction}
                            </Typography>
                        </CardContent>
                        <CardActions className={classes.followContainer}>
                            <div className={classes.followLength}>
                                <Link to={`/${user.name}/followee/${user.id}`}>
                                    <Typography>
                                        フォロー数:
                                        {followLength.followeeLength}
                                    </Typography>
                                </Link>
                                <Link to={`/${user.name}/follower/${user.id}`}>
                                    <Typography>
                                        フォロワー数:
                                        {followLength.followerLength}
                                    </Typography>
                                </Link>
                            </div>
                            {isCanFollow(user.id) ? null : isFollow ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onRemoveFollow(user.id)}
                                >
                                    フォローはずす
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => onFollow(user.id)}
                                >
                                    フォローする
                                </Button>
                            )}
                        </CardActions>
                    </Card>
                </Grid>
            )}
            <InfiniteScroll
                loadMore={loadMore} //項目を読み込む際に処理するコールバック関数
                hasMore={!isFetching && user && hasMore} // isFetchingを判定条件に追加
                loader={loader}
                useWindow={false}
            >
                <Grid container>
                    {/* 読み込み最中に表示する項目 */}
                    {posts[0] &&
                        posts.map((post, i) => {
                            return (
                                <Grid
                                    item
                                    key={i}
                                    xs={12}
                                    className={classes.grid}
                                >
                                    <Card className={classes.card}>
                                        <CardContent
                                            className={classes.cardContent}
                                        >
                                            <Link
                                                to={{
                                                    pathname: `/${post.user.name}/user/${post.user.id}`,
                                                    state: post.user
                                                }}
                                            >
                                                <div
                                                    className={
                                                        classes.profileContent
                                                    }
                                                >
                                                    <Avatar
                                                        alt="image"
                                                        src={
                                                            post.user
                                                                .profile_image
                                                        }
                                                    />
                                                    <Typography>
                                                        {post.user.name}
                                                    </Typography>
                                                </div>
                                            </Link>
                                            <a
                                                href={post.post.url}
                                                target="_blank"
                                            >
                                                <Typography
                                                    gutterBottom
                                                    variant="h5"
                                                    component="h2"
                                                >
                                                    {post.post.title}
                                                </Typography>

                                                <CardMedia
                                                    className={
                                                        classes.cardMedia
                                                    }
                                                    image={post.post.image}
                                                    title="Image title"
                                                />
                                            </a>

                                            <Link
                                                to={{
                                                    pathname: `/${post.user.name}/post/${post.post.id}`,
                                                    state: {
                                                        post: post.post,
                                                        user: post.user,
                                                        likes: post.likes
                                                    }
                                                }}
                                            >
                                                <Typography>
                                                    {post.post.body}
                                                </Typography>
                                            </Link>
                                            {getDate(post.post.updated_at)}
                                        </CardContent>
                                        <CardActions>
                                            {isLikedBefore(post) ? (
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => {
                                                        onRemoveLike(
                                                            post.post.id,
                                                            i
                                                        );
                                                    }}
                                                >
                                                    いいねはずす
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => {
                                                        onAddLike(
                                                            post.post.id,
                                                            i
                                                        );
                                                    }}
                                                >
                                                    いいね
                                                </Button>
                                            )}
                                        </CardActions>

                                        <p>いいね数：{post.likes.length}</p>
                                    </Card>
                                </Grid>
                            );
                        })}
                </Grid>
            </InfiniteScroll>
        </>
    );
};

export default User;
