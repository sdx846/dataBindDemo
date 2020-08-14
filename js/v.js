class Vue {
    constructor(options) {
        const el = document.querySelector(options.el);
        const data = options.data;
        Object.keys(data).forEach(key => {
            //可以替换一次。如果{{data}}第二次出现，则无法成功。
            // el.innerHTML = el.innerHTML.replace(`{{${key}}}`,data[key]);
            //优化一：使用正则表达式替换，html中所有的{{data}}可以被替换为正确的值。
            el.innerHTML = el.innerHTML.replace(new RegExp(`{{${key}}}`, "g"), data[key]);
        });
    };
}
//优化二：innerHTML 开销很大，因为值会被解析为 HTML，所以我们应该使用 textContent 或 innerText。但是将 innerHTML 替换为 innerText 或 textContent后标记变得更加复杂就很快不够用了。
//一种解决方法是遍历 DOM，找到所有文本节点，然后替换文本。
// class Vue {
//     constructor(options) {
//         this.el = document.querySelector(options.el);
//         this.data = options.data;
//         this.replaceTemplateStrings();
//     };
//     replaceTemplateStrings(){
//         const stack=[this.el];
//         while (stack.length){
//             const n=stack.pop();
//             if(n.childNodes.length){
//                 stack.push(...n.childNodes);
//             }
//             if(n.nodeType===Node.TEXT_NODE){
//                 Object.keys(this.data).forEach(key=>{
//                     n.textContent=n.textContent.replace(
//                         new RegExp(`{{${key}}}`),
//                         this.data[key]
//                     );
//                 });
//             }
//         }
//     }
// }