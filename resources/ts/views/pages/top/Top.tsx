import React, { useEffect, useState } from "react";
import axios from "axios";
import { POST, USER, LIKE, MIXED_POST_DATA } from "../../../utils/type";
import { Link } from "react-router-dom";
import { RootState } from "../../../store";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { set_posts } from "../../../store/counter/post/action";
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
    profileContent: {
        display: "flex"
    },
    grid: {
        marginBottom: "30px"
    }
}));
const Top: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user.user);
    const allPosts = useSelector((state: RootState) => state.posts);
    const [posts, setPosts] = useState<MIXED_POST_DATA[]>([]);
    const [likes, setLikes] = useState<LIKE[]>([]);
    const [isNewer, setIsNewer] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [isFetching, setIsFetching] = useState(false);
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
    //ロード中に表示する項目
    const loader = (
        <div className="loader" key={0}>
            Loading ...
        </div>
    );
    //項目を読み込むときのコールバック
    const loadMore = async (page: number) => {
        setIsFetching(true);
        const data: MIXED_POST_DATA = await axios
            .get("/api/get/post/scroll", { params: { number: page } })
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
        console.log(posts);
        setIsFetching(false);
        console.log(page);
    };
    return (
        <>
            <InfiniteScroll
                loadMore={loadMore} //項目を読み込む際に処理するコールバック関数
                hasMore={!isFetching && hasMore} // isFetchingを判定条件に追加
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

export default Top;
