import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router";
import { Link } from "react-router-dom";
import { RootState } from "../../../store";
import {
    COMMENT,
    LIKE,
    MIXED_POST_DATA,
    POST,
    USER
} from "../../../utils/type";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Hidden from "@material-ui/core/Hidden";
import CardActions from "@material-ui/core/CardActions";

const useStyles = makeStyles({
    card: {
        diplay: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    cardContent: {
        display: "flex",
        flexDirection: "column"
    },
    cardDetails: {
        flex: 1
    },
    cardMedia: {
        width: 160
    },
    text: {
        // marginBottom: "10px"
    },
    button: {
        diplay: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "15px"
    }
});
const Edit = () => {
    const classes = useStyles();
    const history = useHistory();
    const user = useSelector((state: RootState) => state.user);
    const location: {
        pathname: string;
        state: { post: POST; user: USER };
    } = useLocation();
    const [body, setBody] = useState("");
    const [url, setUrl] = useState("");
    const userData = location.state.user;
    const postData = location.state.post;
    useEffect(() => {
        if (user.user) {
            if (user.user.id === userData.id) {
                //正しい場合
                setBody(postData.body);
                setUrl(postData.url);
            } else {
                history.push("/");
            }
        } else {
            history.push("/");
        }
    }, []);

    const onEditPost = () => {
        axios
            .post("/api/edit/post", { url, body, post_id: postData.id })
            .then(res => {
                history.push("/");
            })
            .catch(error => {
                console.log(error);
            });
    };
    return (
        <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
                <TextField
                    id="standard-basic"
                    label="リンク"
                    onChange={e => setUrl(e.target.value)}
                    autoFocus={true}
                    className={classes.text}
                    defaultValue={url}
                />
                <TextField
                    id="standard-multiline-static"
                    label="どんなサイト？"
                    multiline
                    rows={4}
                    onChange={e => setBody(e.target.value)}
                    className={classes.text}
                    defaultValue={body}
                />
            </CardContent>
            <CardActions className={classes.button}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onEditPost}
                >
                    更新
                </Button>
            </CardActions>
        </Card>
    );
};

export default Edit;
