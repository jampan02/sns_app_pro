<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Like;
use App\User;
use App\Post;
class LikeController extends Controller
{
    //
	public function removeLike(Request $request){
		Log::debug($request->user_id);
		$like=Like::where("user_id",$request->user_id)->where("post_id",$request->post_id)->first();
		Log::debug($like);
		$like->delete();
		$postData=array();
		$post=Post::where("id",$request->post_id)->first();
		Log::debug("message");
		$likes=Like::where("post_id",$request->post_id)->get();
		$user=User::where("id",$post->user_id)->first();
		$postData["post"]=$post;
		$postData["user"]=$user;
		$postData["likes"]=$likes;
		return $postData;
	}
	public function addLike(Request $request){
		$like=new Like;
		$like->user_id=$request->user_id;
		$like->post_id=$request->post_id;
		$like->save();
		//return $likes;
		$postData=array();
		$post=Post::where("id",$request->post_id)->first();
		Log::debug("message");
		$likes=Like::where("post_id",$request->post_id)->get();
		$user=User::where("id",$post->user_id)->first();
		$postData["post"]=$post;
		$postData["user"]=$user;
		$postData["likes"]=$likes;
		return $postData;
	}
	public function getLikes(){
		$likes=Like::all();
		return $likes;
	}
	public function getUserByLike(Request $request){
		$likes=$request->data;
		$usersWithLikes=array();
		foreach($likes as $like){
			Log::debug($like);
			
			//Log::debug($likerId);
			$user=User::where("id",$like)->first();
			$newArray=array();
			$newArray["user"]=$user;
			$newArray["like"]=$like;
			$usersWithLikes[]=$newArray;
		}
		return $usersWithLikes;
	}
	public function getLikesByPostId(Request $request){
		$post_id=$request->post_id;
		$likes=Like::where("id",$post_id)->get();
		return $likes;
	}
	public function addLikeOnView(Request $request){
		$like=new Like;
		$like->user_id=$request->user_id;
		$like->post_id=$request->post_id;
		$like->save();
		$likes=Like::where("post_id",$request->post_id)->get();
		Log::debug($likes);
		return $likes;
	}
	public function deleteLikeOnView(Request $request){
		$like=Like::where("user_id",$request->user_id)->where("post_id",$request->post_id)->first();
		$like->delete();
		$likes=Like::where("post_id",$request->post_id)->get();
		return $likes;
	}
}
