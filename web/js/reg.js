jQuery(function($){

	// 去除首尾空格
	$('.deng').on('click',function(){
		 console.log(66);
		location.href = 'login.html';
							
	})
	$('.biao').on('click','.btn',function(){
		var $username = $('#username').val();
		var $password = $('#password').val();
		var $checkbox = $('#checkbox');
		var $modalBody = $('.MB');
		if($username.trim()==''||$password.trim()==""){
			$('#myModal').modal();
			disabled="disabled"
			$('.deng').attr({disabled:"disabled"});
			//$('.deng').css({display:'none'});
			$modalBody.html('输入的密码不能为空');
			return false;
		}

		if(!/^[\u2E80-\u9FFF]+$/.test($username)){
			$('#myModal').modal();
			//$('.deng').css({display:'none'});
			$modalBody.html('输入的昵称有误');
			return false;
		}
		
		//密码不能有空格，长度在20位以内
		if(!/^[^\s]{1,19}$/.test($password)){
			$('#myModal').modal();
			console.log($('.deng'));
			$('.deng').attr({disabled:"disabled"});
			$modalBody.html('你输入的密码不符合要求');
			return false;
		}
		var $radio = $('input:radio[name="position"]:checked').val();

		if($radio == null){
			$('#myModal').modal();
			$('.deng').attr({disabled:"disabled"});
			$modalBody.html('请选择职位');
			return false;
		}
		/*console.log($radio);*/
		if($("input[type='checkbox']").is(':checked')){
			// location.href('login.html');
			$.ajax({
				url:global.apiBaseUrl+'register',
				data:{
					position:$radio,
					username:$username,
					password:$password
				},
				type:'post',
				success:function(res){
					console.log(res)
					if(res.status){
                       /* window.localStorage.setItem('token', res.data.token);*/
                       // window.location.href = 'login.html';
                        $('#myModal').modal();
                        $('.deng').removeAttr('disabled');
						$modalBody.html('恭喜您注册成功');
                    } else {
                     	 $('#myModal').modal();
                     	  $('.deng').attr({disabled:'disabled'});
						$modalBody.html('此用户名已被注册');
                        //$.alert('用户名或密码不正确');
                    }
				}
			})
			return false;
			
		}else{
			$('#myModal').modal();
			$modalBody.html('请认真阅读协议并同意');
			return false;
		}
		
	})
})