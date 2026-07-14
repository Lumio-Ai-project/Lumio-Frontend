import{y as g,z as h,A as U,C as y,D as u,E as C,F as _,j as e,U as R,G as m,a as O,r as A,H as a,B as c,T as q,u as M}from"./index-BgASrpq4.js";import{u as I,a as $,o as k,_ as Q,s as j}from"./schemas-BBO4aEbr.js";import{L as K}from"./label-LZ1QNeJ2.js";import{P as z}from"./PasswordInput-XAKth1aW.js";import{A as D}from"./AuthFormField-DV0QMc_A.js";import{D as B}from"./DataTable-DC2B6D5z.js";import{C as G,a as H,b as V,d as Y}from"./card-C-xhw2x_.js";import"./eye-DIJbJnn2.js";const p={all:["users"],list:()=>[...p.all,"list"]};function Z(s){return s.map(g)}const b=`
  fragment UserFields on User {
    id
    name
    email
    role
    createdAt
  }
`,J=`
  ${b}
  query Users {
    users {
      ...UserFields
    }
  }
`;async function W(){const s=await h(J);return Z(s.users)}const X=`
  ${b}
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      ...UserFields
    }
  }
`;async function ee(s){const r=await h(X,{input:s});return g(r.createUser)}const se=`
  ${b}
  mutation UpdateUserRole($input: UpdateUserRoleInput!) {
    updateUserRole(input: $input) {
      ...UserFields
    }
  }
`;async function re(s){const r=await h(se,{input:s});return g(r.updateUserRole)}const te=`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      message
      success
    }
  }
`;async function ae(s){return(await h(te,{id:s})).deleteUser}function ne(){return _({queryKey:p.list(),queryFn:W})}function ie(){const s=U();return y({mutationFn:r=>ee(r),onSuccess:()=>{s.invalidateQueries({queryKey:p.list()}),u.success("User created successfully")},onError:r=>{u.error(C(r,"Failed to create user"))}})}function oe(){const s=U();return y({mutationFn:r=>re(r),onSuccess:()=>{s.invalidateQueries({queryKey:p.list()}),u.success("User role updated")},onError:r=>{u.error(C(r,"Failed to update user role"))}})}function le(){const s=U();return y({mutationFn:r=>ae(r),onSuccess:()=>{s.invalidateQueries({queryKey:p.list()}),u.success("User deleted")},onError:r=>{u.error(C(r,"Failed to delete user"))}})}const de={admin:"Admin",moderator:"Moderator",guest:"Guest"};function F({value:s,onChange:r,disabled:d,className:i,id:n}){return e.jsx("select",{id:n,value:m(s),disabled:d,onChange:t=>{const o=R.find(x=>m(x)===t.target.value);o&&r(o)},className:O("flex h-input w-full rounded-md border border-input bg-inherit px-3 py-2 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",i),children:R.map(t=>e.jsx("option",{value:m(t),children:de[t]},t))})}const ce=k({name:j().trim().min(2).max(100),email:j().trim().email(),password:j().min(8).regex(/[A-Z]/,"Must contain uppercase").regex(/[a-z]/,"Must contain lowercase").regex(/[0-9]/,"Must contain number"),role:Q(["admin","moderator","guest"])});function ue({onSuccess:s}){var v,E,w;const[r,d]=A.useState(!1),i=ie(),{register:n,handleSubmit:t,reset:o,watch:x,setValue:N,formState:{errors:f,isSubmitting:S}}=I({resolver:$(ce),defaultValues:{name:"",email:"",password:"",role:"guest"}}),T=x("role"),P=async l=>{await i.mutateAsync({name:l.name,email:l.email,password:l.password,role:m(l.role)}),o(),d(!1),s==null||s()},L=l=>{d(l),l||o()};return e.jsxs(a,{open:r,onOpenChange:L,children:[e.jsx(a.Trigger,{asChild:!0,children:e.jsx(c,{type:"button",children:"Create user"})}),e.jsxs(a.Portal,{children:[e.jsx(a.Overlay,{}),e.jsxs(a.Content,{size:"half",children:[e.jsx(a.CloseIcon,{}),e.jsxs(a.Header,{children:[e.jsx(a.Title,{children:"Create user"}),e.jsx(a.Description,{children:"Add a new account with name, email, password, and role."})]}),e.jsx(a.Body,{children:e.jsxs("form",{id:"create-user-form",onSubmit:t(P),className:"flex flex-col gap-stack",children:[e.jsx(D,{label:"Name",error:(v=f.name)==null?void 0:v.message,...n("name")}),e.jsx(D,{label:"Email",type:"email",error:(E=f.email)==null?void 0:E.message,...n("email")}),e.jsx(z,{label:"Password",error:(w=f.password)==null?void 0:w.message,...n("password")}),e.jsxs("div",{className:"flex flex-col gap-stack-sm",children:[e.jsx(K,{htmlFor:"create-user-role",children:"Role"}),e.jsx(F,{id:"create-user-role",value:T,onChange:l=>N("role",l)})]})]})}),e.jsxs(a.Footer,{children:[e.jsx(a.Close,{asChild:!0,children:e.jsx(c,{type:"button",variant:"outline",children:"Cancel"})}),e.jsx(c,{type:"submit",form:"create-user-form",disabled:S||i.isPending,children:i.isPending?"Creating…":"Create user"})]})]})]})]})}function me({user:s,disabled:r}){const[d,i]=A.useState(!1),n=le(),t=async()=>{await n.mutateAsync(s.id),i(!1)};return e.jsxs(a,{open:d,onOpenChange:i,children:[e.jsx(a.Trigger,{asChild:!0,children:e.jsx(c,{type:"button",variant:"outline",className:"h-auto border-0 bg-transparent p-2 text-primary shadow-none hover:bg-transparent hover:text-primary/80",disabled:r||n.isPending,onClick:o=>o.stopPropagation(),"aria-label":`Delete ${s.name}`,children:e.jsx(q,{className:"size-icon-sm","aria-hidden":!0})})}),e.jsxs(a.Portal,{children:[e.jsx(a.Overlay,{}),e.jsxs(a.Content,{size:"sm",children:[e.jsx(a.CloseIcon,{}),e.jsxs(a.Header,{children:[e.jsx(a.Title,{children:"Delete user"}),e.jsxs(a.Description,{children:["Delete ",e.jsx("span",{className:"font-medium text-foreground",children:s.name}),"? This action cannot be undone."]})]}),e.jsxs(a.Footer,{children:[e.jsx(a.Close,{asChild:!0,children:e.jsx(c,{type:"button",variant:"outline",disabled:n.isPending,children:"Cancel"})}),e.jsx(c,{type:"button",variant:"destructive",disabled:n.isPending,onClick:()=>void t(),children:n.isPending?"Deleting…":"Delete user"})]})]})]})]})}function pe(s){return new Date(s).toLocaleDateString(void 0,{year:"numeric",month:"short",day:"numeric"})}function he(){const{user:s}=M(),{data:r=[],isLoading:d}=ne(),i=oe(),n=[{id:"name",header:"Name",cell:t=>e.jsx("span",{className:"font-medium",children:t.name})},{id:"email",header:"Email",cell:t=>t.email},{id:"role",header:"Role",cell:t=>e.jsx(F,{value:t.role,disabled:i.isPending,onChange:o=>{i.mutateAsync({id:t.id,role:m(o)})},className:"max-w-40"})},{id:"createdAt",header:"Created",cell:t=>pe(t.createdAt)},{id:"actions",header:"Actions",className:"w-[6rem]",sticky:"right",cell:t=>e.jsx(me,{user:t,disabled:t.id===(s==null?void 0:s.id)})}];return e.jsxs(G,{children:[e.jsx(H,{children:e.jsx(V,{children:"All users"})}),e.jsx(Y,{children:e.jsx(B,{data:r,columns:n,getRowKey:t=>t.id,isLoading:d,emptyMessage:"No users found"})})]})}function ve(){return e.jsxs("div",{className:"flex flex-col gap-stack",children:[e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-stack-sm",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold",children:"Users"}),e.jsx("p",{className:"mt-stack-sm text-sm text-muted-foreground",children:"Manage user accounts, roles, and access."})]}),e.jsx(ue,{})]}),e.jsx(he,{})]})}export{ve as UsersPage};
