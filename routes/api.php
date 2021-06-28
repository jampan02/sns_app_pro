<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
/*
Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});*/



Route::group(["middleware"=>"api"],function(){
	//ユーザー
	//Route::get("user","UserController@getUsers");
	Route::get("post_user","UserController@getPostUser");
	Route::get("get/user","UserController@getUser");
	Route::post("edit/user/name","UserController@editUserName");
	//投稿
	Route::get("get/posts/sort/new","PostController@getNewerPosts");
	Route::get("get/post","PostController@getPost");
	Route::get("get/post/scroll","PostController@getPostByScroll");
	Route::get("get/post/scroll/user","PostController@getPostByScrollInUser");
	Route::get("get/posts/sort/popular","PostController@getPopularPosts");
	Route::post("add","PostController@addPost");
	Route::post("edit/post","PostController@editPost");
	//Route::get("get/post/user","PostController@getPostsByUserId")
	//いいね
	Route::post("add/like","LikeController@addLike");
	Route::get("get/likes","LikeController@getLikes");
	Route::get("get/likes/post_id","LikeController@getLikesByPostId");
	Route::get("get/like/user","LikeController@getUserByLike");
	Route::post("del/like","LikeController@removeLike");
	Route::post("/add/like/view","LikeController@addLikeOnView");
	Route::post("/del/like/view","LikeController@deleteLikeOnView");
	//コメント
	Route::get("get/comment","CommentController@getComments");
	Route::post("add/comment","CommentController@addComment");
	//フォロー
	Route::post("add/follow","FollowController@addFollow");
	Route::get("get/follow","FollowController@getFollows");
	Route::post("del/follow","FollowController@removeFollow");
	Route::get("get/isfollow","FollowController@getIsFollow");
	Route::get("get/followee","FollowController@getFollowee");
	Route::get("get/follower","FollowController@getFollower");
	Route::post("add/follow/search","FollowController@addFollowSearch");
	Route::post("del/follow/search","FollowController@removeFollowSearch");
	//検索機能
	Route::get("get/post/search","PostController@getPostBySearch");
	Route::get("get/user/search","UserController@getUserBySearch");
});
