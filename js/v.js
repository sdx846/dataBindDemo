class Vue {
    constructor(options) {
        this.el = document.querySelector(options.el);
        this.data = {};
        this.init(options.data);
    };
    async init(data) {
        await this.responseData(data);
        await this.replaceTemplateStrings();
    }
    replaceTemplateStrings() {
        const stack = [this.el];
        while (stack.length) {
            const n = stack.pop();
            if (n.childNodes.length) {
                stack.push(...n.childNodes);
            }
            //纯文本节点
            if (n.nodeType === Node.TEXT_NODE) {
                this.replaceText(n);
            }
            //表单节点
            if (n.nodeName === 'INPUT' && n.hasAttribute('v-model')) {
                this.replaceModel(n);
            }
        }
    }
    //纯文本节点的{{}}绑定数据
    replaceText(n) {
        //读取文本，根据文本替换{{}}，而不是根据js中的数据数目，减少循环次数。
        let keys = n.textContent.match(/(?<={{).*?(?=}})/g);
        if (keys.length) {
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
        n.setAttribute('value', this.data[n.getAttribute('v-model')]);
    }
    //数据可响应
    responseData(obj) {
        Object.keys(obj).forEach(key => {
            Object.defineProperty(obj, key, {
                enumerable: true,
                configurable: true,
                get: function () {
                   return this.data;
                },
                set: function (newVal) {
                   this.data[key]=newVal;
                }
            });
        });
    }
}