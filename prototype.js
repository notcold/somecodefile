
foo(); //123
var foo =function(){
    console.log(3)
}

function foo(){
    console.log(123)
}

foo() //3



//-------------------------

var SuperTtype=function(){
    this.time=1;
}

SuperTtype.protoType.haha = function() {
    console.log(1);
};

var SubTtype=function(){

}

var A = new SubTtype();
SubTtype.protoType = new SuperTtype();
var B = new SubTtype();
console.log(A.haha)// undefined
console.log(A.time) //undefined
console.log(B.time) //1


//--------------------------------
f(n,v)   [ v,v,v,v,v] length = n; （不能用for循环）

function arr (n,v) {//只能实现简单数据类型
    let a = Array(n+1),
        str = a.join(v),//'vvvvvv'
        res = str.split('');
    return res;
}

function createArr(n,v) {
    if(n===1) return [v];
    return [ v,...createArr(n-1,v)];
}