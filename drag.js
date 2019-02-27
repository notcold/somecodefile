/**
 *
 */

 var drag={
    bind: function(el, binding) {

            // 拖拽/缩放
            var type = binding.value.type;
            // 回调函数
            var cbFn = binding.value.cb;
            // 缩放dom的className

            var className = binding.value.className || '';
            var imgStyle = binding.value.imgStyle;
            // 缩放的dom
            var $el = null;
            var startX = 0,
                startY = 0,
                left = 0,
                top = 0,
                moveabled = false;
            var $elWidth = 0,
                $elHeight = 0;
            // 鼠标按下
            el.addEventListener('mousedown', function(event){
                console.log(el);
                //阻止默认事件/冒泡
                event.stopPropagation();
                event.preventDefault();
                $el = document.getElementsByClassName(className)[0] || el;
                left = $el.offsetLeft;
                top = $el.offsetTop;
                if($el){
                    //缩放
                    $elWidth = $el.offsetWidth;
                    $elHeight = $el.offsetHeight;
                }
                moveabled = true;
                startX = event.clientX ;
                startY = event.clientY ;
                var fnMove = function(event){
                    event.stopPropagation();
                    event.preventDefault();
                    if(moveabled){
                        var x = event.clientX - startX + left,
                            y = event.clientY - startY + top;
                        if(type === 'scale'){
                            //缩放比例同步，防止变形
                            x = event.clientX - startX + left,
                            y = event.clientX - startX + top;
                            imgStyle.width = $el.style.width = $elWidth - x + left + 'px';
                            imgStyle.height = $el.style.height = $elHeight - y + top + 'px';
                            imgStyle.size = ($elWidth - x + left)/400;
                        }
                        imgStyle.left = $el.style.left = x + 'px',
                        imgStyle.top = $el.style.top = y + 'px';
                    }
                }
                var fnUp = function(event){

                    if(moveabled){
                        binding.value.cb(imgStyle)
                    }
                    moveabled = false;
                    document.removeEventListener('mouseup',fnMove,false);
                    document.removeEventListener('mousemove',fnUp,false);
                    return false;
                }
                document.addEventListener('mousemove', fnMove, false);
                // 鼠标抬起
                document.addEventListener('mouseup', fnUp, false);

            }, false);


     }
  }

