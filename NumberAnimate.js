/**
 * Created by shikuan on 2017/7/12.
 */
var NumbersAnimate={
	Target:null,
	Numbers:'000000',
	Duration:500,
	fill:function (number) {
		if(number.toString().length<6) {
            for (var i = 0; i <= 6 - number.toString().length; i++) {
                number='0'+number;
            }
        }
        return number;
    },
	Animate:function(number){
        NumbersAnimate.Numbers= NumbersAnimate.fill(NumbersAnimate.Numbers)
		var array=NumbersAnimate.Numbers.toString().split("");
		//遍历数组
		for(var i=0;i<array.length;i++){
			var currentN=array[i];
			//数字append进容器
			var t=$("<span></span>");
			$(t).append("<span class=\"childNumber\">"+array[i]+"</span>");
			$(t).css("left",41*i+"px");
			$(NumbersAnimate.Target).append(t);
			//生成滚动数字,根据当前数字大小来定
			for(var j=0;j<=currentN;j++){
				var tt;
				if(j==currentN){
					tt=$("<span class=\"main\"><span class=' numbg numword'>"+j+"</span></span>");
				}else{
					tt=$("<span class=\"childNumber\">"+j+"</span>");
				}

				$(t).append(tt);

			}
			$(t).animate({marginTop:48+"px"},1,function(){
				$(this).find(".childNumber").remove();
			});
			$('.textNum .main').css("top",-48+"px");
            $('.textNum .main').css("left","0px");
		}
	},
	ChangeNumber:function(){
        numbers=NumbersAnimate.fill(NumbersAnimate.Numbers-0+1);
		var oldArray=NumbersAnimate.fill(NumbersAnimate.Numbers).toString().split("");
		var newArray=numbers.toString().split("");
		for(var i=0;i<oldArray.length;i++){
			var o=oldArray[i];
			var n=newArray[i]=="0"&&o=="9"?10:newArray[i];
			if(o!=n){
				var c=$($(".main")[i]);
				var num=parseInt($(c).html());
				var top=parseInt($($(c).find("span")[0]).css("marginTop").replace('px', ''));

				for(var j=o;j<=n;j++){
					var nn=$("<span class=' numbg numword'>"+j+"</span>");
					if(j==n){
						nn=$("<span class=' numbg numword'>"+(j==10?'0':j)+"</span>");
					}else{
						nn=$("<span class=\"yy  numbg numword\">"+j+"</span>");
					}
					$(c).append(nn);
					$(nn).css("margin-top",(j-o)*48+"px");
				}
				var margintop=parseInt($(c).css("marginTop").replace('px', ''));
				$(c).animate({top:-96+"px"},NumbersAnimate.Duration,function(){
					$($(this).find("span")[0]).remove();
					$(".yy").remove();
					$($(this).find("span")).css("margin-top","0px");
					$(this).css("top","-48px");
				});
			}
		}
		NumbersAnimate.Numbers=numbers;
	},

	RandomNum:function(m,a){
		var Range = a - m;
		var Rand = Math.random();
		return(m + Math.round(Rand * Range));
	}
}