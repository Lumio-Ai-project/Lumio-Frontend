import{c as d,s as i,j as e,t as r,R as t,a,v as c,S as l,w as h,O as x}from"./index-BgASrpq4.js";/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const m=[["path",{d:"M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z",key:"1rqfz7"}],["path",{d:"M14 2v4a2 2 0 0 0 2 2h4",key:"tnqrlb"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]],u=d("FileText",m);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const f=[["path",{d:"m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4",key:"g0fldk"}],["path",{d:"m21 2-9.6 9.6",key:"1j0ho8"}],["circle",{cx:"7.5",cy:"15.5",r:"5.5",key:"yqb3hr"}]],b=d("Key",f);/**
 * @license lucide-react v0.475.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]],y=d("Users",p),j="lumio:dashboard-sidebar-open",n=({isActive:s})=>a("flex items-center gap-stack-sm rounded-md px-3 py-2 text-sm transition-colors duration-normal",s?"bg-accent font-medium text-accent-foreground":"text-muted-foreground hover:bg-accent/50 hover:text-foreground");function k(){const{isAdmin:s,isModerator:o}=i();return e.jsxs("nav",{className:"flex flex-col gap-1 px-3 py-2",children:[s?e.jsxs(r,{to:t.DASHBOARD_USERS,className:n,children:[e.jsx(y,{className:"size-icon-sm shrink-0","aria-hidden":!0}),"Users"]}):null,e.jsxs(r,{to:t.DASHBOARD_API_KEYS,className:n,children:[e.jsx(b,{className:"size-icon-sm shrink-0","aria-hidden":!0}),"API Keys"]}),s||o?e.jsxs(r,{to:t.DASHBOARD_TEMPLATES,className:n,children:[e.jsx(u,{className:"size-icon-sm shrink-0","aria-hidden":!0}),"Templates"]}):null]})}function g(){const{isOpen:s}=c();return e.jsx(e.Fragment,{children:e.jsx("aside",{className:a("flex h-full shrink-0 flex-col overflow-hidden border-r border-border bg-card transition-[width] duration-normal ease-default",s?"w-sidebar":"w-14"),children:e.jsxs("div",{className:a("flex h-full flex-col",s?"w-sidebar":"w-14"),children:[e.jsxs("div",{className:a("flex h-header shrink-0 items-center border-b border-border",s?"justify-between gap-stack-sm px-page":"justify-center"),children:[s?e.jsx("p",{className:"text-sm font-semibold text-foreground",children:"Dashboard"}):null,e.jsx(l,{})]}),s?e.jsx(k,{}):null]})})})}function N(){return e.jsx(h,{storageKey:j,children:e.jsxs("div",{className:"flex h-full min-h-0 gap-0",children:[e.jsx(g,{}),e.jsx("div",{className:a("min-w-0 flex-1 overflow-auto p-page"),children:e.jsx(x,{})})]})})}export{N as DashboardLayout};
