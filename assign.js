function fn(){console.log(this.a)}

var obj ={a:1,alert:function(){
debugger;
console.log(this.a)}}

var obj2 ={alert:function(){
debugger;
console.log(this.a)}}

var fn1=fn.bind(obj)

Object.assign(fn1,obj2)