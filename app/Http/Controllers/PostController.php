<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Post;
use App\User;
use App\Like;
class PostController extends Controller
{
    //新しい純
	public function getNewerPosts(){
		$mixedPosts=array();
		$posts=Post::orderBy("updated_at","DESC")->take(10)->get();
		foreach($posts as $post){
			//Log::debug($post);
			$posterId=$post->user_id;
			$user=User::where("id",$posterId)->first();
			$likes=Like::where("post_id",$post->id)->get();
			$postData=array();
			$postData["post"]=$post;
			$postData["user"]=$user;
			$postData["likes"]=$likes;
			$mixedPosts[]=$postData;
			//$newArray=array("post"=>$post,"user"=>$user,"likes"=>$likes);
		}
		return $mixedPosts;
	}
	public function addPost(Request $request){
		$post=new Post;
		$post->user_id=$request->user_id;
		$post->site_name=$request->site_name;
		$post->title=$request->title;
		$post->image=$request->image;
		$post->url=$request->url;
		$post->body=$request->body;

		$post->save();
	}
	//検索結果一覧
	public function getPostBySearch(Request $request){
		$number=$request->number-1;
		$queryS=$request->q;
		$post=Post::orderBy("updated_at","DESC")->where("body","like","%{$queryS}%")->orWhere("title","like","%{$queryS}%")->skip($number)->first();
		if($post){
		$user=User::where("id",$post->user_id)->first();
		$likes=Like::where("post_id",$post->id)->get();
		$result=array();
		$result["post"]=$post;
		$result["user"]=$user;
		$result["likes"]=$likes;
		return $result;
		}
	}
	//編集
	public function editPost(Request $request){
		$url=$request->url;
		$body=$request->body;
		$id=$request->post_id;
		$post=Post::where("id",$id)->first();
		$post->url=$url;
		$post->body=$body;
		$post->save();
	}
	//スラッグでポスト取得
	public function getPost(Request $request){
		$post=Post::where("id",$request->id)->first();
		$user=User::where("id",$post->user_id)->first();
		$likes=Like::where("post_id",$request->id)->get();
		$result=array();
		$result["post"]=$post;
		$result["user"]=$user;
		$result["likes"]=$likes;
		return $result;
	}
	public function getPostByScroll(Request $request){
		$number=$request->number-1;
		Log::debug($number);
		$post=Post::orderBy("updated_at","DESC")->skip($number)->first();
		Log::debug($post);
		$user=User::where("id",$post->user_id)->first();
		$likes=Like::where("post_id",$post->id)->get();
		$result=array();
		$result["post"]=$post;
		$result["user"]=$user;
		$result["likes"]=$likes;
		return $result;
	}
 public function getPostByScrollInUser(Request $request){
	$number=$request->number-1;
	$user_id=$request->user_id;
	Log::debug($user_id);
	Log::debug($number);
	$post=Post::where("user_id",$user_id)->orderBy("updated_at","DESC")->skip($number)->first();

	if($post){
		Log::debug($post);
	$user=User::where("id",$post->user_id)->first();
	$likes=Like::where("post_id",$post->id)->get();
	$result=array();
	$result["post"]=$post;
	$result["user"]=$user;
	$result["likes"]=$likes;
	return $result;
	}
 }
}
