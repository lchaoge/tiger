var flag=false;
	var index=0;	
//			var TextNum2;
	var newArr = []; //-443,-886,-1329,-1772,-2215,-2658
	
	window.onload = function(){
		initFunc()
	}
	window.onresize = function(){
		initFunc()
	}
	function initFunc(){
		var w = $('.box').width();
		var h = $('.box').height()
		$('.num-img .item').css({
			width:w,
			height:h,
			lineHeight:h+"px"
		})
		$(".tiger-body-left").html("");
		$(".tiger-body-right").html("");
		$(".tiger-body-top").html("");
		$(".tiger-body-bottom").html("");
		for(var i =0;i<16;i++){
			if(i<6){
				$(".tiger-body-left").append('<div class="ball"></div>');
				$(".tiger-body-right").append('<div class="ball"></div>');
			}
			if(i<8){
				// 奖品位置
				var num = h*i;
				newArr.push('-'+num);
			}
			$(".tiger-body-top").append('<div class="ball"></div>');
			$(".tiger-body-bottom").append('<div class="ball"></div>');
		}
	}
	
	// 抽奖
	$("#luck-draw").click(function(){
		$("#home-prize").hide()
		$("#myModalQualifications").modal("hide");
		$(".tiger-footer-stall").addClass("active");
		$(".tiger-body .ball").addClass("active");
		if(!flag){
			flag=true;
			reset();
			letGo();
			setTimeout(function () {
				flag=false;
			},2000);
			index++;
		}
	})
	
	function letGo(){
//					$.ajax({
//						type: 'GET',
//				        url: '/storelottery/doDraw',
//						dataType: 'json',
//						async: true,
//						cache: false,
//						 data: {
//				            id: global.id,
//				            sid: global.sid,
//				            sbValue: global.ticketValue,
//				            sbNumber: global.memberNo
//				        },
//						contentType: 'application/json;charset=utf-8',
//						success: function (data) {
//						    if(data.code=="0000"){
					$(".num-con2").animate({"top":newArr[7]},800,"linear", function () {
						var that = $(this)
					   	// 摇中小球
//						var prize = data.Prize.degree;
				       	var prize=parseInt(Math.random()*5)
				       	var num2=newArr[prize-1];	
						$(that).css("top",0).animate({"top":num2},1500,"linear",function(){
							$('#cas').firemaks({
								color: 'random',
								type: 'random',
								color_child: 'random',
								type_child: 'random',
								boom_count: 10
							});
							// 展示奖品
							var i = 5;
							// 倒计时定时器
							var t = setInterval(function(){
								if(i==5){
								   	$(".prize").addClass("active");
								   	 //判断奖品
								   	 if (prize === 1) {
			                            $(".prize-content .prize-box").addClass("prize1");
			                       	} else if (prize === 2) {
			                            $(".prize-content .prize-box").addClass("prize2");
			                        } else if (prize === 3) {
			                            $(".prize-content .prize-box").addClass("prize3");
			                        } else if (prize === 4) {
			                            $(".prize-content .prize-box").addClass("prize4");
			                        } else if (prize === 5) {
			                            $(".prize-content .prize-box").addClass("prize5");
			                        } else if (prize === 6) {
			                            $(".prize-content .prize-box").addClass("prize6");
			                        } else if (prize === 7) {
			                            $(".prize-content .prize-box").addClass("prize7");
			                        } else if (prize === 8) {
			                            $(".prize-content .prize-box").addClass("prize8");
			                        } else if (prize === 9) {
			                            $(".prize-content .prize-box").addClass("prize9");
			                        }
								}
						   		if(i==0){
						   			clearInterval(t);
//						   		 	window.location.reload();
						   		}
						   		$(".prize-close").text(i+"s后继续抽奖");
						   		i--;
							},1000);
		
						});
					});	   
							
//						    }else{
//						        alert(data.msg);
//						    }
//						},
//						error: function () {
//						    alert("请求发生错误！");
//						    window.location.reload();
//						}
//					});
			
			
		
		
	}
	function reset(){
		$(".num-con2").css({"top":0});
	}
	// 查询用户信息
	$("#query").click(queryEvt);
	function queryEvt(){
		$("#luck-draw").removeClass("btn-default").addClass("btn-success");
	    $("#luck-draw").attr("disabled",false);
//				var obj = {
//					receipt:$("#receipt").val().trim()
//				}
//				if(obj.receipt===""){
//					alert("请输入或扫描小票");
//					return false;
//				}
//				$.ajax({
//			        type: 'GET',
//			        url: 'http://10.110.81.34:8020/wm-ball/mokeData/index.json',
//			        dataType: 'json',
//			        async: true,
//			        cache: false,
//			        data: 'receipt='+obj.receipt,
//			        contentType: 'application/json;charset=utf-8',
//			        success: function (data) {
//			            if(data.code=="0000"){
//							$(".form-group.msgDiv").hide();
//			            	// 开启抽奖按钮
//			            	$("#luck-draw").removeClass("btn-default").addClass("btn-success");
//			            	$("#luck-draw").attr("disabled",false);
//			            	// 赋值
//			            	$(".modal-body .form-group .name").text(data.data.name);
//			            	$(".modal-body .form-group .phone").text(data.data.phone);
//			            	$(".modal-body .form-group .money").text(data.data.money);
//			            	$(".modal-body .form-group .account").text(data.data.account);
//			            }else{
//				          	$(".form-group.msgDiv .msg").text(data.msg);
//			            	$(".form-group.msgDiv").show();
//			            }
//			        },
//			        error: function () {
//			        	alert("请求发生错误！")
//			        }
//			    });
	}
	// 打开抽奖模态框
	$('.play-btn').click(function(){
		$(this).addClass("active");
		
		setTimeout(function(){
			$("#myModalQualifications").modal("show");	
		},500)
		
	})
	// 模态框关闭清空
	$('#myModalQualifications').on('hide.bs.modal', function (event) {
	  var modal = $(this);
	  modal.find('.modal-body input').val("");
	  modal.find('.modal-body .item').html("--");
	  $('.play-btn').removeClass("active");
	})
	//监听模态框开启
	$('#myModalQualifications').on('show.bs.modal', function (event) {
		$("#receipt").focus();
	})
	$(document).keydown(function(e) {  
      	if (e.keyCode == 13) {  
            queryEvt()
      	}  
    })
