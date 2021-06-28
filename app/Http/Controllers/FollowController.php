<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Follow;
use App\User;
class FollowController extends Controller
{
	//フォロー・フォロワー数取得関数
	public function getFollows(Request $request){
		$user_id=$request->userId;
		//フォロー中
		$followee=Follow::where("followee_id",$user_id)->get();
		//フォロワー中
		$follower=Follow::where("follower_id",$user_id)->get();

		$followee_length=count($followee);
		$follower_length=count($follower);

		$result=array();
		$result["followee"]=$followee_length;
		$result["follower"]=$follower_length;
		return $result;
	}
    //フォロー関数
	public function addFollow(Request $request){
		$follow=new Follow;
		$followee=$request->followee;
		$follower=$request->follower;
		$follow->followee_id=$followee;
		$follow->follower_id=$follower;
		$follow->save();

	//フォロー数返す関数
	$follower_users=Follow::where("follower_id",$follower)->get();
	$followee_users=Follow::where("followee_id",$follower)->get();
	$result=array();
	$result["follower"]=count($follower_users);
	$result["followee"]=count($followee_users);
	Log::debug($result["follower"]);
	Log::debug($result["followee"]);
	return $result;
	}
	    //フォロー解除関数
		public function removeFollow(Request $request){
			$followee=$request->followee;
			$follower=$request->follower;

			Follow::where("followee_id",$followee)->where("follower_id",$follower)->delete();

				//フォロー数返す関数
	$follower_users=Follow::where("follower_id",$follower)->get();
	$followee_users=Follow::where("followee_id",$follower)->get();
	$result=array();
	$result["follower"]=count($follower_users);
	$result["followee"]=count($followee_users);
	Log::debug($result["followee"]);
	Log::debug($followee_users);
	//Log::debug($result);
	return $result;
		}
	//フォローしてあるか調べる関数
	public function getIsFollow(Request $request){
		$followee=$request->followee;
		$follower=$request->follower;
		$isFollow=Follow::where("followee_id",$followee)->where("follower_id",$follower)->first();
		Log::debug($isFollow);
		$followornor=false;
		if($isFollow === null){
			//フォローしてない場合
			return "no";
		}else{
			$followornor=true;
			return "yes";
		}
	}

	//フォロウィー(フォロー中のユーザー)のみ取得
	public function getFollowee(Request $request){
		$number=$request->number-1;
		$target_id=$request->targetId;
		$user_id=$request->user_id;
		$following_user=Follow::where("followee_id",$target_id)->skip($number)->first();
		Log::debug($following_user);
		$user=User::orderBy("updated_at","DESC")->where("id",$following_user->follower_id)->first();
		$follow=Follow::where("followee_id",$user_id)->where("follower_id",$user->id)->first();
		$result=array();
		$result["user"]=$user;
		$result["follow"]=$follow;
		if($result){
			return $result;
		}
	}
		//フォロワーユーザーのみ取得
		public function getFollower(Request $request){
			$number=$request->number-1;
			$target_id=$request->targetId;
			$user_id=$request->user_id;
			$following_user=Follow::where("follower_id",$target_id)->skip($number)->first();
			Log::debug($following_user);
			$user=User::orderBy("updated_at","DESC")->where("id",$following_user->followee_id)->first();
			$follow=Follow::where("follower_id",$user_id)->where("follower_id",$user->id)->first();
			$result=array();
			$result["user"]=$user;
			$result["follow"]=$follow;
			if($result){
				return $result;
			}


		
		}
		public function addFollowSearch(Request $request){
			$follow=new Follow;
			$followee=$request->followee;
			$follower=$request->follower;
			$follow->followee_id=$followee;
			$follow->follower_id=$follower;
			$follow->save();
			$data=Follow::where("followee_id",$followee)->where("follower_id",$follower)->first();
			return $data;

		}
		public function removeFollowSearch(Request $request){
			$followee=$request->followee;
			$follower=$request->follower;

			Follow::where("followee_id",$followee)->where("follower_id",$follower)->delete();

		}
}
