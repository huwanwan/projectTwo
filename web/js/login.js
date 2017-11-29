jQuery(function($){
	var $modalBody = $('.MB');
	$('.btn').click(function(){
		var $username = $('#dl_usename').val();
		var $password = $('#dl_password').val();
		console.log($username)
		if($username.trim()==''||$password.trim()==""){
			$('#myModal').modal();
		/*	$('.deng').css({display:'none'});*/
			$('.deng').attr({disabled:"disabled"});
			$modalBody.html('输入的用户名或密码不能为空');
			return false;
		}
		var $radio = $('input:radio[name="position"]:checked').val();
		console.log($radio)
		if($radio == null){
			$('.deng').attr({disabled:"disabled"});
			$('#myModal').modal();
			$modalBody.html('请选择职位');
			return false;
		}
		console.log(22)
		
		$.ajax({
			url:global.apiBaseUrl + 'login',
			data:{
				position:$radio,
				username: $username, 
				password: $password
			},
			type:'post',
			success:function(res){
				console.log(res)

				if(res.status){
					var token = res.data.token;
	                window.localStorage.setItem("token", token);
	                console.log(token)
	                $('#myModal').modal();
	                $('.deng').html('login...')
	                $('.deng').removeAttr('disabled');

					$modalBody.html('正在登陆中...');
					console.log($username)
					setTimeout(function(){
						  window.location.href = `../index.html?token=${token}`;
					},2000);
	              	
	            } else {
	            	$('#myModal').modal();
	            	 $('.deng').attr({disabled:"disabled"});
					$modalBody.html('输入信息有误');
					return false;
	            }
			}
		})
    })
})