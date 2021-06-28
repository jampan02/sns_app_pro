import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";
import { RootState } from "../../../store";
import {
    COMMENT,
    LIKE,
    MIXED_POST_DATA,
    POST,
    USER
} from "../../../utils/type";
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
import TextField from "@material-ui/core/TextField";
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
        flexDirection: "column"
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
    profileContent: {
        display: "flex"
    }
}));
type DATA = {
    like: LIKE;
    user: USER;
};

type USERCOMMENT = {
    user: USER;
    comment: COMMENT;
};

const View = () => {
    const classes = useStyles();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);
    const location: {
        pathname: string;
        state: MIXED_POST_DATA;
    } = useLocation();
    const [likes, setLikes] = useState<LIKE[]>([]);
    const [comments, setComments] = useState<USERCOMMENT[]>([]);
    const [isOpenComment, setIsOpenComment] = useState(false);
    const [comment, setComment] = useState("");
    const params: { id: string } = useParams();
    const [post, setPost] = useState<POST>();
    const [postUser, setPostUser] = useState<USER>();
    const id = params.id;
    useEffect(() => {
        const f = async () => {
            //直リンの場合
            if (!location.state) {
                await axios
                    .get("/api/get/post", { params: { id } })
                    .then(res => {
                        const data = res.data;
                        console.log("DAta=", data);
                        setPost(data.post);
                        setPostUser(data.user);
                        setLikes(data.likes);
                    })
                    .catch(error => {
                        console.log(error);
                    });
                await axios
                    .get("/api/get/comment", {
                        params: { postId: id }
                    })
                    .then(res => {
                        setComments(res.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            } else {
                console.log("whaaa");
                console.log(location.state);
                //そうじゃない場合(通常の画面遷移)
                setPost(location.state.post);
                setPostUser(location.state.user);

                if (location.state.likes.length > 0) {
                    const locationLikes = location.state.likes;
                    setLikes(locationLikes);
                } else {
                    //likes取得
                    const postId = location.state.post.id;
                    await axios
                        .get("/api/get/likes/post_id", {
                            params: { post_id: postId }
                        })
                        .then(res => {
                            setLikes(res.data);
                        })
                        .catch(error => {
                            console.log(error);
                        });
                }
                await axios
                    .get("/api/get/comment", {
                        params: { postId: location.state.post.id }
                    })
                    .then(res => {
                        setComments(res.data);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        };
        f();
    }, []);
    //コメント送信機能
    const onAddComment = () => {
        if (comment === "") {
            return;
        }
        if (user.user) {
            const data = {
                comment,
                user_id: user.user.id,
                post_id: location.state.post.id
            };
            axios
                .post("/api/add/comment", data)
                .then(res => {
                    setComments(res.data);
                    setComment("");
                })
                .catch(error => {
                    console.log(error);
                });
        }
    };
    const getDate = (date: string) => {
        const toDate = new Date(date);
        const month = toDate.getMonth() + 1;
        const day = toDate.getDate();
        const h = toDate.getHours() + 9;
        const year = toDate.getFullYear();
        const minutes = toDate.getMinutes();
        return (
            <Typography>
                {year}年　{month}月 {day}日　
                {h < 12 ? `午前${h}時` : `午後${h - 12}時`}
                {minutes}分
            </Typography>
        );
    };
    const getEditButton = (userId: number, postId: number) => {
        if (user.user) {
            if (user.user.id === userId && postUser) {
                return (
                    <Link
                        to={{
                            pathname: `/${postUser.name}/edit/${postUser.id}`,
                            state: {
                                post: post,
                                user: postUser
                            }
                        }}
                    >
                        編集
                    </Link>
                );
            }
        } else {
            console.log("fuck");
        }
    };
    const onAddLike = (post_id: number) => {
        if (user.user) {
            const user_id = user.user.id;
            axios
                .post("/api/add/like/view", {
                    user_id,
                    post_id
                })
                .then(res => {
                    console.log(res.data);
                    setLikes(res.data);
                })
                .catch(error => console.log(error));
        } else {
            history.push("/register");
        }
    };
    //いいね解除
    const onRemoveLike = (post_id: number) => {
        if (user.user) {
            const user_id = user.user.id;
            console.log(post_id, user_id);
            axios
                .post("/api/del/like/view", {
                    user_id,
                    post_id
                })
                .then(res => {
                    setLikes(res.data);
                });
        } else {
            history.push("/register");
        }
    };
    //いいねしたことあるか、
    const isLikedBefore = () => {
        console.log(user, likes);
        const even = (like: LIKE) => user.user && like.user_id == user.user.id;
        const isLiked = likes.some(even);
        return isLiked;
    };
    return (
        <>
            {postUser && post && (
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                        <Link
                            to={{
                                pathname: `/${postUser.name}/user/${postUser.id}`,
                                state: postUser
                            }}
                        >
                            <div className={classes.profileContent}>
                                <Avatar
                                    alt="image"
                                    src={postUser.profile_image}
                                />
                                <Typography>{postUser.name}</Typography>
                            </div>
                        </Link>
                        {getEditButton(post.user_id, post.id)}
                        <a href={post.url} target="_blank">
                            <Typography
                                gutterBottom
                                variant="h5"
                                component="h2"
                            >
                                {post.title}
                            </Typography>

                            <CardMedia
                                className={classes.cardMedia}
                                image={post.image}
                                title="Image title"
                            />
                        </a>

                        <Typography>{post.body}</Typography>

                        {getDate(post.updated_at)}
                    </CardContent>
                    <CardActions>
                        {isLikedBefore() ? (
                            <Button
                                size="small"
                                color="primary"
                                onClick={() => {
                                    onRemoveLike(post.id);
                                }}
                            >
                                いいねはずす
                            </Button>
                        ) : (
                            <Button
                                size="small"
                                color="primary"
                                onClick={() => {
                                    onAddLike(post.id);
                                }}
                            >
                                いいね
                            </Button>
                        )}
                        <Button
                            onClick={() => {
                                if (!user.isLogin) {
                                    //ログインされてない場合
                                    history.push("/register");
                                }
                                setIsOpenComment(!isOpenComment);
                            }}
                        >
                            コメントする
                        </Button>

                        {isOpenComment && (
                            <>
                                <TextField
                                    placeholder="コメント"
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                />
                                <Button onClick={onAddComment}>送信</Button>
                            </>
                        )}
                    </CardActions>
                    <Typography>{likes.length}いいね</Typography>
                </Card>
            )}

            {comments[0] &&
                comments.map((comment, i) => (
                    <Card key={i}>
                        <Link
                            to={`/${comment.user.name}/user/${comment.user.id}`}
                        >
                            {" "}
                            <div className={classes.profileContent}>
                                <Avatar
                                    alt="image"
                                    src={comment.user.profile_image}
                                />
                                <Typography>{comment.user.name}</Typography>
                            </div>
                        </Link>

                        <Typography>{comment.comment.comment}</Typography>
                        {getDate(comment.comment.updated_at)}
                    </Card>
                ))}
        </>
    );
};

export default View;
