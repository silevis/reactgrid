(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1298],{29295:function(e,t,n){Promise.resolve().then(n.bind(n,52908))},27036:function(e,t,n){"use strict";n.d(t,{default:function(){return l.a}});var r=n(11307),l=n.n(r)},15050:function(e,t,n){"use strict";var r,l;e.exports=(null==(r=n.g.process)?void 0:r.env)&&"object"==typeof(null==(l=n.g.process)?void 0:l.env)?n.g.process:n(59295)},59295:function(e){!function(){var t={229:function(e){var t,n,r,l=e.exports={};function a(){throw Error("setTimeout has not been defined")}function i(){throw Error("clearTimeout has not been defined")}function o(e){if(t===setTimeout)return setTimeout(e,0);if((t===a||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(n){try{return t.call(null,e,0)}catch(n){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:a}catch(e){t=a}try{n="function"==typeof clearTimeout?clearTimeout:i}catch(e){n=i}}();var s=[],c=!1,u=-1;function d(){c&&r&&(c=!1,r.length?s=r.concat(s):u=-1,s.length&&f())}function f(){if(!c){var e=o(d);c=!0;for(var t=s.length;t;){for(r=s,s=[];++u<t;)r&&r[u].run();u=-1,t=s.length}r=null,c=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===i||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function m(e,t){this.fun=e,this.array=t}function h(){}l.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];s.push(new m(e,t)),1!==s.length||c||o(f)},m.prototype.run=function(){this.fun.apply(null,this.array)},l.title="browser",l.browser=!0,l.env={},l.argv=[],l.version="",l.versions={},l.on=h,l.addListener=h,l.once=h,l.off=h,l.removeListener=h,l.removeAllListeners=h,l.emit=h,l.prependListener=h,l.prependOnceListener=h,l.listeners=function(e){return[]},l.binding=function(e){throw Error("process.binding is not supported")},l.cwd=function(){return"/"},l.chdir=function(e){throw Error("process.chdir is not supported")},l.umask=function(){return 0}}},n={};function r(e){var l=n[e];if(void 0!==l)return l.exports;var a=n[e]={exports:{}},i=!0;try{t[e](a,a.exports,r),i=!1}finally{i&&delete n[e]}return a.exports}r.ab="//";var l=r(229);e.exports=l}()},22475:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return a}});let r=n(74849);n(37821),n(58078);let l=r._(n(52078));function a(e,t){var n;let r={loading:e=>{let{error:t,isLoading:n,pastDelay:r}=e;return null}};"function"==typeof e&&(r.loader=e);let a={...r,...t};return(0,l.default)({...a,modules:null==(n=a.loadableGenerated)?void 0:n.modules})}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},11307:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var n in t)Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}(t,{default:function(){return s},getImageProps:function(){return o}});let r=n(74849),l=n(72628),a=n(573),i=r._(n(39044));function o(e){let{props:t}=(0,l.getImgProps)(e,{defaultLoader:i.default,imgConf:{deviceSizes:[640,750,828,1080,1200,1920,2048,3840],imageSizes:[16,32,48,64,96,128,256,384],path:"",loader:"akamai",dangerouslyAllowSVG:!1,unoptimized:!1}});for(let[e,n]of Object.entries(t))void 0===n&&delete t[e];return{props:t}}let s=a.Image},62209:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"BailoutToCSR",{enumerable:!0,get:function(){return l}});let r=n(51905);function l(e){let{reason:t,children:n}=e;if("undefined"==typeof window)throw new r.BailoutToCSRError(t);return n}},52078:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return c}});let r=n(37821),l=n(58078),a=n(62209),i=n(33178);function o(e){return{default:e&&"default"in e?e.default:e}}let s={loader:()=>Promise.resolve(o(()=>null)),loading:null,ssr:!0},c=function(e){let t={...s,...e},n=(0,l.lazy)(()=>t.loader().then(o)),c=t.loading;function u(e){let o=c?(0,r.jsx)(c,{isLoading:!0,pastDelay:!0,error:null}):null,s=t.ssr?(0,r.jsxs)(r.Fragment,{children:["undefined"==typeof window?(0,r.jsx)(i.PreloadCss,{moduleIds:t.modules}):null,(0,r.jsx)(n,{...e})]}):(0,r.jsx)(a.BailoutToCSR,{reason:"next/dynamic",children:(0,r.jsx)(n,{...e})});return(0,r.jsx)(l.Suspense,{fallback:o,children:s})}return u.displayName="LoadableComponent",u}},33178:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"PreloadCss",{enumerable:!0,get:function(){return a}});let r=n(37821),l=n(44116);function a(e){let{moduleIds:t}=e;if("undefined"!=typeof window)return null;let n=(0,l.getExpectedRequestStore)("next/dynamic css"),a=[];if(n.reactLoadableManifest&&t){let e=n.reactLoadableManifest;for(let n of t){if(!e[n])continue;let t=e[n].files.filter(e=>e.endsWith(".css"));a.push(...t)}}return 0===a.length?null:(0,r.jsx)(r.Fragment,{children:a.map(e=>(0,r.jsx)("link",{precedence:"dynamic",rel:"stylesheet",href:n.assetPrefix+"/_next/"+encodeURI(e),as:"style"},e))})}},64842:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"RouterContext",{enumerable:!0,get:function(){return r}});let r=n(74849)._(n(58078)).default.createContext(null)},52908:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return h}});var r=n(37821),l=n(42612),a={src:"/_next/static/media/check-icon.b9780d98.svg",height:16,width:16,blurWidth:0,blurHeight:0},i={src:"/_next/static/media/dot-icon.8579c469.svg",height:16,width:16,blurWidth:0,blurHeight:0},o=n(27036),s=n(22475),c=n.n(s),u=n(15050);let d=c()(()=>n.e(3762).then(n.bind(n,33762)).then(e=>e.LiquidityPlanner),{loadableGenerated:{webpack:()=>[33762]},loading:()=>(0,r.jsx)("div",{className:"flex min-h-[750px] w-full 2xl:w-[1280px]"}),ssr:!1}),f=["This liquidity planner example shows the possibility of calculating values of all aggregation fields in a reactive way.","You can place new values only in light green cells (credit line, opening balance) or white cells (cash inflows and outflows). Grayed-out cells are read-only.","Groups are aggregated vertically into total inflows and outflows per month, with yearly totals presented in the last column.","The 'Total' row sums up 'Cash in' and 'Cash out' and updates automatically when data changes.","The 'Cumulative row' calculates the running total by adding 'Cash in' and subtracting 'Cash out' from the cash in the bank.","Users can update the credit line, which remains constant across all months, and the 'Credit line overdraft' cell displays if the cumulative value exceeds the credit line.","Use key shortcuts to quickly navigate and perform actions within the planner."],m=[{name:"Multiple cell templates",docs:u.env.NEXT_PUBLIC_BASE_URL+"/docs/5.0/3-cell-templates"},{name:"Sticky row and column",docs:u.env.NEXT_PUBLIC_BASE_URL+"/docs/5.0/2-implementing-core-features/4-sticky"},{name:"Range and row selection",docs:""},{name:"Fill handle",docs:u.env.NEXT_PUBLIC_BASE_URL+"/docs/5.0/2-implementing-core-features/5-fill-handle"},{name:"Copy/cut/paste",docs:u.env.NEXT_PUBLIC_BASE_URL+"/docs/5.0/2-implementing-core-features/10-copy-cut-paste"},{name:"Touch capability",docs:""}];function h(){return(0,r.jsxs)("section",{children:[(0,r.jsxs)("div",{className:"grid grid-cols-main pt-12 md:pt-32 pb-[40px]",children:[(0,r.jsx)("h1",{className:"col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-xl md:text-2xl font-bold text-center text-green-primary p-4",children:"ReactGrid Demo"}),(0,r.jsx)("p",{className:"col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary text-center text-xs md:text-sm px-4",children:"ReactGrid enables you to create custom layouts with flexible cell ordering. Unlike many React components and tools that require consistent data structures across all rows, our component offers greater flexibility. As an example, we'll show you how to build a liquidity planner—an app that helps you plan for your long-term financial goals. Our app allows you to input, aggregate, and analyze projected cash flows"})]}),(0,r.jsx)("div",{className:"relative grid grid-cols-main react-grid-sample2 2xl:justify-items-center",children:(0,r.jsxs)("div",{className:"col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 h-full shadow-reactgrid-sample rounded-t-[16px] text-[#a5a5a5] font-bold text-xl bg-white-primary max-w-[1280px]",children:[(0,r.jsx)("div",{className:"h-[60px] flex items-center ps-5",children:(0,r.jsx)(o.default,{src:l.default,alt:"ReactGrid"})}),(0,r.jsx)("div",{id:"liquidity-planner-container",className:"flex",style:{maxHeight:750,width:"100%",overflow:"auto"},children:(0,r.jsx)(d,{})})]})}),(0,r.jsx)("div",{className:"grid grid-cols-main pt-[80px] bg-white-secondary4",children:(0,r.jsxs)("div",{className:"col-start-1 col-end-13 sm:col-start-2 sm:col-end-12 xl:col-start-3 xl:col-end-11 text-black-secondary flex gap-x-16 mb-[128px] flex-col md:flex-row px-4",children:[(0,r.jsxs)("div",{className:"flex-1",children:[(0,r.jsx)("h2",{className:"text-green-primary font-bold text-sm",children:"What does the above example illustrate?"}),(0,r.jsx)("ul",{children:f.map((e,t)=>(0,r.jsxs)("li",{className:"my-8 flex items-start",children:[(0,r.jsx)(o.default,{src:i,alt:"ReactGrid"}),e]},t))})]}),(0,r.jsxs)("div",{className:"flex-1",children:[(0,r.jsx)("h2",{className:"text-green-primary font-bold text-sm",children:"Core features (applied)"}),(0,r.jsx)("ul",{children:m.map((e,t)=>(0,r.jsxs)("li",{className:"my-8 flex items-start",children:[(0,r.jsx)(o.default,{src:a,alt:"ReactGrid"}),e.name,e.docs&&(0,r.jsx)("a",{href:e.docs,target:"_blank",rel:"noreferrer",className:"text-green-primary underline ml-2",children:"(check docs)"})]},t))})]})]})})]})}},42612:function(e,t,n){"use strict";n.r(t),t.default={src:"/_next/static/media/logo-green.307c8742.svg",height:24,width:21,blurWidth:0,blurHeight:0}}},function(e){e.O(0,[573,7115,3205,1744],function(){return e(e.s=29295)}),_N_E=e.O()}]);