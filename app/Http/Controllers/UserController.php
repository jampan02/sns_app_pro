<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Post;
use App\Like;
use App\Follow;
class UserController extends Controller
{
    //
	/*public function getUsers(){
	  if (Auth::check()) {
		return Auth::user()->toJson();
	  }else{
		  return "nologined";
	  }
		
	}*/
	public function json(){
		if (Auth::check()) {
		return Auth::user()->toJson();
		}
	}
	public function getPostUser(Request $request){
		$users=User::all();
		return $users;
	}
	//個別のアカウント情報取得
	public function getUser(Request $request){
		$userId=$request->userId;
		$user=User::where("id",$userId)->first();
		//投稿取得
		$postDatas=array();
		$posts=Post::where("user_id",$userId)->get();
		$data=array();
		$data["user"]=$user;
		foreach($posts as $post){
			$posterId=$post->user_id;
			$user=User::where("id",$posterId)->first();
			$likes=Like::where("post_id",$post->id)->get();
			$postData=array();
			$postData["post"]=$post;
			$postData["user"]=$user;
			$postData["likes"]=$likes;
			$postDatas[]=$postData;
		}
		$data["posts"]=$postDatas;
		return $data;
	}

	//検索機能
	public function getUserBySearch(Request $request){
		$number=$request->number-1;
		$queryS=$request->q;
		$user_id=$request->user_id;

		$user=User::orderBy("updated_at","DESC")->where("name","like","%{$queryS}%")->skip($number)->first();
		$follow=Follow::where("followee_id",$user_id)->where("follower_id",$user->id)->first();
		$result=array();
		$result["user"]=$user;
		$result["follow"]=$follow;
		return $result;
	}
	//名前変更
	public function editUserName(Request $request){
		$user_id=$request->id;
		$new_user_name=$request->name;
		$new_profile_image=$request->profile_image;
		$new_self_introduction=$request->self_introduction;
		$user=User::where("id",$user_id)->first();
		$user->name=$new_user_name;
		$user->profile_image=$new_profile_image;
		$user->self_introduction=$new_self_introduction;
		$user->save();
		return $user;
	}
}
