import{c,r as m,j as e,e as x}from"./index-DKl5TGoD.js";import{L as p,I as u}from"./schemas-DiY2D7FV.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const h=[["path",{d:"M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",key:"ct8e1f"}],["path",{d:"M14.084 14.158a3 3 0 0 1-4.242-4.242",key:"151rxh"}],["path",{d:"M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",key:"13bj9a"}],["path",{d:"m2 2 20 20",key:"1ooewy"}]],y=c("EyeOff",h);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",key:"1nclc0"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]],j=c("Eye",f);function N({label:i,error:s,id:n,className:r,...a}){const[t,l]=m.useState(!1),o=n??a.name;return e.jsxs("div",{className:"flex flex-col gap-stack-sm",children:[e.jsx(p,{htmlFor:o,children:i}),e.jsxs("div",{className:"relative",children:[e.jsx(u,{id:o,type:t?"text":"password","aria-invalid":s?!0:void 0,className:x("pr-10",s&&"border-destructive",r),...a}),e.jsx("button",{type:"button",className:"absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors duration-normal hover:text-foreground",onClick:()=>l(d=>!d),"aria-label":t?"Hide password":"Show password",children:t?e.jsx(y,{className:"size-icon-sm"}):e.jsx(j,{className:"size-icon-sm"})})]}),s?e.jsx("p",{className:"text-sm text-destructive",children:s}):null]})}export{N as P};
