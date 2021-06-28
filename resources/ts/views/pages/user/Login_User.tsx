import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router";
import { RootState } from "../../../store";
import axios from "axios";
import { FOLLOW, LIKE, MIXED_POST_DATA, POST, USER } from "../../../utils/type";
import { Link } from "react-router-dom";
import { login_user } from "../../../store/counter/user/action";
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
import TextField from "@material-ui/core/TextField";

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
        display: "flex",
        flexDirection: "column",
        marginBottom: "10px"
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
    editNameText: {
        marginBottom: "10px"
    },
    editIntroductionText: {},
    nameText: {
        marginBottom: "20px"
    },
    introductionText: {
        marginLeft: "5px"
    },
    cardAction: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    textContainer: {
        display: "flex",
        marginLeft: "10px",
        flexDirection: "column"
    },
    avatarContainer: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",

        alignItems: "center"
    }
}));
type FollowLength = {
    followeeLength: number;
    followerLength: number;
};

const Login_User = () => {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const userData = useSelector((state: RootState) => state.user.user);
    const [isFetching, setIsFetching] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [user, setUser] = useState<USER>();
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);

    const [followLength, setFollowLength] = useState<FollowLength>({
        followerLength: 0,
        followeeLength: 0
    });

    const [isEditMode, setIsEditMode] = useState(false);
    const [newUserName, setNewUserName] = useState("");
    const [newSelfIntroduction, setNewSelfIntroduction] = useState("");
    const [newProfileImage, setNewProfileImage] = useState("");
    useEffect(() => {
        //パラメーターに則ったユーザー情報取得
        // alert("fuck");
        const f = async () => {
            if (userData) {
                setUser(userData);
                await axios
                    .get("/api/get/user", { params: { userId: userData.id } })
                    .then(res => {
                        const data = res.data;
                        //そのユーザーの投稿全部取得
                        setPosts(data.posts);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                //該当のユーザーの、フォロー・フォロワー数取得
                await axios
                    .get("/api/get/follow", { params: { userId: userData.id } })
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
            }
        };
        f();
    }, [userData]);
    //名前変更差踏みっと
    const onChangeName = () => {
        if (newUserName === "") {
            return;
        }
        axios
            .post("/api/edit/user/name", {
                id: userData && userData.id,
                name: newUserName,
                profile_image: newProfileImage,
                self_introduction: newSelfIntroduction
            })
            .then(res => {
                dispatch(login_user(res.data));
                setUser(res.data);
                setIsEditMode(false);
            })
            .catch(error => {
                console.log(error);
            });
    };
    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        var files = e.target.files;

        const image_url = files && window.URL.createObjectURL(files[0]);
        image_url && setNewProfileImage(image_url);
    };
    const onSetUserData = () => {
        if (user) {
            setIsEditMode(true);
            console.log("aaaa");
            setNewUserName(user.name);

            setNewProfileImage(user.profile_image);
            user.self_introduction &&
                setNewSelfIntroduction(user.self_introduction);
            console.log(newProfileImage);
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
        <div>
            {user && (
                <Grid item xs={12} className={classes.grid}>
                    <Card className={classes.card}>
                        <CardContent className={classes.cardContent}>
                            {isEditMode ? (
                                <>
                                    <div className={classes.avatarContainer}>
                                        <CardActions>
                                            <Button
                                                variant="contained"
                                                component="label"
                                            >
                                                <Avatar
                                                    alt="image"
                                                    src={newProfileImage}
                                                    className={classes.large}
                                                >
                                                    <input
                                                        type="file"
                                                        hidden
                                                        onChange={e =>
                                                            onChangeFile(e)
                                                        }
                                                    />
                                                </Avatar>
                                            </Button>
                                        </CardActions>

                                        <TextField
                                            className={classes.editNameText}
                                            type="text"
                                            defaultValue={newUserName}
                                            onChange={(
                                                e: React.ChangeEvent<
                                                    HTMLInputElement
                                                >
                                            ) => setNewUserName(e.target.value)}
                                        />
                                    </div>
                                    <TextField
                                        className={classes.editIntroductionText}
                                        defaultValue={newSelfIntroduction}
                                        onChange={(
                                            e: React.ChangeEvent<
                                                HTMLInputElement
                                            >
                                        ) =>
                                            setNewSelfIntroduction(
                                                e.target.value
                                            )
                                        }
                                        multiline
                                        rows={4}
                                        variant="outlined"
                                    />

                                    <CardActions>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={onChangeName}
                                        >
                                            変更
                                        </Button>
                                    </CardActions>
                                </>
                            ) : (
                                <>
                                    <div className={classes.avatarContainer}>
                                        <Avatar
                                            alt="image"
                                            src={user.profile_image}
                                            className={classes.large}
                                        />

                                        <Typography
                                            className={classes.nameText}
                                            variant="h4"
                                            gutterBottom
                                        >
                                            {user.name}
                                        </Typography>
                                    </div>

                                    <Typography
                                        className={classes.introductionText}
                                    >
                                        {user.self_introduction}
                                    </Typography>
                                    <CardActions className={classes.cardAction}>
                                        <Button onClick={onSetUserData}>
                                            編集
                                        </Button>
                                    </CardActions>
                                </>
                            )}

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
                        </CardContent>
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
        </div>
    );
};

export default Login_User;
