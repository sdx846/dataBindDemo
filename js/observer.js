class Observer{
    constructor(data){
        this.walk(data);
    }
    walk(data){
        //判断data是否是对象
        if(!data||typeof data!=='object'){
            return
        }
        //遍历data的所有属性
        Object.keys(data).forEach(key=>{
            this.defineReactive(data,key,data[key]);
        });
    }
    defineReactive(obj,key,val){
        let that=this;
        let dep=new Dep();
        //如果val是对象，对象的属性也将转换为getter和sette
        this.walk(val);
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                Dep.target && dep.addSub(Dep.target);//收集依赖。Dep.target是watcher对象。
                return val;
            },
            set(newVal){
                if(newVal===val){
                    return
                }
                val=newVal;
                //对data中的属性赋值成一个对象，把对象变成响应式的
                that.walk(newVal);
                //发送通知
                dep.notify();
            }
        })
    }
}