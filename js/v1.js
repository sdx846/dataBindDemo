class Vue {
    constructor(options) {
        this.el = document.querySelector(options.el);
        this.template=this.el.innerHTML;
        this.data = options.data;
        this.methods=options.methods;
        this.watchers = [];//内容变动时，可以做的一系列操作集合
        //用于管理watcher的Dep对象
        this.dep = {
            add: (watcher) => {
                this.watchers.push(watcher)
            },
            notify: (newValue) => {
                this.watchers.forEach( (fn)=>{
                    fn.bind(this)(newValue);
                })
            }
        };
        this.init();
    };
    init() {
        let that = this;
        that.replaceTemplateStrings();
        that.initData();
    }

    //初始化数据
    initData() {
        let that = this;
        //将解析出来的watcher存入Dep中待用
        // this.dep.add(this.renderInput);
        that.dep.add(that.replaceTemplateStrings);

        Object.keys(that.data).forEach(key => {
            that.observer(that.data, key, that.data[key])
        });
    }
    //数据可响应
    observer(vm, key, value) {
        let that = this;
        Object.defineProperty(vm, key, {
            enumerable: true,
            configurable: true,
            get: function () {
                console.log('Get');
                return value
            },
            set: function (newValue) {
                if (value !== newValue) {
                    value = newValue;
                    console.log('Update')
                    that.el.innerHTML=that.template;
                    //将变动通知给相关的订阅者
                    that.dep.notify(newValue);
                }
            }
        })
    }

    // 模拟compile,通过对Html的解析生成一系列订阅者（watcher）
    renderInput(newValue) {
        console.log(newValue)
    }
    //根据不同的节点做不同的数据绑定
    replaceTemplateStrings() {
        let that = this;
        const stack = [that.el];
        while (stack.length) {
            const n = stack.pop();
            if (n.childNodes.length) {
                stack.push(...n.childNodes);
            }
            //纯文本节点数据绑定
            if (n.nodeType === Node.TEXT_NODE) {
                that.replaceText(n);
            }
            //表单节点数据绑定
            if (n.nodeName === 'INPUT' && n.hasAttribute('v-model')) {
                that.replaceModel(n);
            }
            //监听元素节点绑定的事件
            if(n.nodeType===Node.ELEMENT_NODE){
                for(let i=0;i<n.attributes.length;i++){
                    let key=n.attributes[i].name;
                    if(key.indexOf('@')===0){
                        n.addEventListener(key.split("@")[1], function (e) {
                            that.methods[n.getAttribute(key)].bind(that)(e);
                        });
                    }
                }
            }
        }
    }
    //纯文本节点的{{}}绑定数据
    replaceText(n) {
        //读取文本，根据文本替换{{}}，而不是根据js中的数据数目，减少循环次数。
        let keys = n.textContent.match(/(?<={{).*?(?=}})/g);
        if (keys&&keys.length) {
            keys = Array.from(new Set(keys));//去重，减少下面循环次数
            keys.forEach(key => {
                n.textContent = n.textContent.replace(
                    new RegExp(`{{${key}}}`, 'g'),
                    this.data[key]
                );
            });
        }
    }
    //表单节点的v-model绑定数据
    replaceModel(n) {
        let that = this;
        n.setAttribute('value', that.data[n.getAttribute('v-model')]);
        n.addEventListener('input', function (e) {
            that.data[n.getAttribute('v-model')] = e.target.value;
        });
    }
}