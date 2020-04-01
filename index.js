//全局对象
var $bannerbox=(function(){
    //组件绘制--操作DOM节点
    var html=$(
        '<div class="slider" id="slider">'+
            '<div class="slide"><img src="img/b5.png" alt=""></div>'+
            '<div class="slide"><img src="img/b1.png" alt=""></div>'+
            '<div class="slide"><img src="img/b2.png" alt=""></div>'+
            '<div class="slide"><img src="img/b3.png" alt=""></div>'+
            '<div class="slide"><img src="img/b4.png" alt=""></div>'+
            '<div class="slide"><img src="img/b5.png" alt=""></div>'+
            '<div class="slide"><img src="img/b1.png" alt=""></div>'+
        '</div>'+
        '<span id="left"><</span>'+
        '<span id="right">></span>'+
        '<ul class="nav" id="navs">'+
            '<li>1</li>'+
            '<li>2</li>'+
            '<li>3</li>'+
            '<li>4</li>'+
            '<li>5</li>'+
        '</ul>'
    );
    var $bhtml=$(html);
    //组件样式--外部样式表+内部样式
    //组件封装
    var cfg={
        //组件的容器
        container:'#box',
        //轮播切换的时长
        interval:3000
    }
    var $oNavlist=$bhtml.find('li');
    var index = 1;
    var timer;
    var isMoving = false;
    //切换下一张
    function next(){
        if(isMoving){
            return;
        }
        isMoving = true;
        index++;
        navmove();
        animate(slider,{left:-1200*index},function(){
            if(index>$oNavlist.length){
                slider.style.left = '-1200px';
                index = 1;
            }
            isMoving = false;
        });
    }
    //切换上一张
    function prev(){
        if(isMoving){
            return;
        }
        isMoving = true;
        index--;
        navmove();
        animate(slider,{left:-1200*index},function(){
            if(index==0){
                slider.style.left = -1200*$oNavlist.length+"px";
                index = $oNavlist.length;
            }
            isMoving = false;
        });
    }
    //按钮切换事件
    function navmove(){
        for( var i=0; i<$oNavlist.length; i++ ){
            $oNavlist[i].className = "";
        }
        if(index >$oNavlist.length ){
            $oNavlist[0].className = "active";
        }else if(index<=0){
            $oNavlist[$oNavlist.length-1].className = "active";
        }else {
            $oNavlist[index-1].className = "active";
        }
    }
    function getStyle(obj, attr){
        if(obj.currentStyle){
            return obj.currentStyle[attr];
        } else {
            return getComputedStyle(obj, null)[attr];
        }
    }
    function animate(obj,json,callback){
        clearInterval(obj.timer);
        obj.timer = setInterval(function(){
            var isStop = true;
            for(var attr in json){
                var now = 0;
                if(attr == 'opacity'){
                    now = parseInt(getStyle(obj,attr)*100);
                }else{
                    now = parseInt(getStyle(obj,attr));
                }
                var speed = (json[attr] - now) / 8;
                speed = speed>0?Math.ceil(speed):Math.floor(speed);
                var cur = now + speed;
                if(attr == 'opacity'){
                    obj.style[attr] = cur / 100;
                }else{
                    obj.style[attr] = cur + 'px';
                }
                if(json[attr] !== cur){
                    isStop = false;
                }
            }
            if(isStop){
                clearInterval(obj.timer);
                callback&&callback();
            }
        }, 30)
    }
    function show(conf){
        $.extend(cfg, conf);
        $(cfg.container).append($bhtml);
        $oNavlist[0].className="active";
        //鼠标移入事件
        $(cfg.container).mouseover(function(){
            animate(left,{opacity:50})
            animate(right,{opacity:50})
            clearInterval(timer)
        });
        //鼠标移出事件
        $(cfg.container).mouseout(function(){
            animate(left,{opacity:0})
            animate(right,{opacity:0})
            timer = setInterval(next, cfg.interval);
        });
        //点击切换下一张
        $(cfg.container).on('click','#right',next);
        //点击切换上一张
        $(cfg.container).on('click','#left',prev);
        for( var i=0; i<$oNavlist.length; i++ ){
            (function(i){
                $oNavlist[i].onclick = function(){
                    index = i+1;
                    navmove();
                    animate(slider,{left:-1200*index});
                }
            })(i);
        }
        timer = setInterval(next, cfg.interval);
    }
    return {
        show:show
    }
}());