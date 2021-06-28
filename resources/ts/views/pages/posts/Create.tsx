import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router";
import { RootState } from "../../../store/index";
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
type DATA = {
    title: string | null;
};

const Create = () => {
    const classes = useStyles();
    const history = useHistory();
    const [body, setBody] = useState("");
    const [url, setUrl] = useState("");
    //ユーザー情報
    const user = useSelector((state: RootState) => state.user.user);
    const onCreatePost = async () => {
        //e.preventDefault();
        const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
        let site_name: string | null = null;
        let title: string | null = null;
        let image: string | null = null;
        //スクレイピング
        await fetch(CORS_PROXY + url, { mode: "cors" })
            .then(res => res.text())
            .then(text => {
                const el = new DOMParser().parseFromString(text, "text/html");
                const headEls = el.head.children;
                Array.from(headEls).map(v => {
                    const prop = v.getAttribute("property");
                    if (!prop) return;
                    console.log(prop, v.getAttribute("content"));
                    switch (prop) {
                        case "og:title":
                            title = v.getAttribute("content");
                            break;
                        case "og:site_name":
                            site_name = v.getAttribute("content");
                            break;
                        case "og:image":
                            image = v.getAttribute("content");
                            break;
                        default:
                            return;
                    }
                });
            });
        //ユーザーID取得
        if (user) {
            const userId = user.id;
            const data = {
                user_id: userId,
                site_name,
                title,
                image,
                url,
                body
            };
            //投稿
            axios
                .post("/api/add", data)
                .then(() => {
                    history.push("/");
                })
                .catch(error => {
                    console.log(error);
                });
        }
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
                />
                <TextField
                    id="standard-multiline-static"
                    label="どんなサイト？"
                    multiline
                    rows={4}
                    onChange={e => setBody(e.target.value)}
                    className={classes.text}
                />
            </CardContent>
            <CardActions className={classes.button}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onCreatePost}
                >
                    投稿
                </Button>
            </CardActions>
        </Card>
    );
};

export default Create;
