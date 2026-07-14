import{z as o,F as p,A as m,C as T,D as r,E as y,r as b,j as a,H as n,B as i,T as j}from"./index-BgASrpq4.js";const s={all:["templates"],lists:()=>[...s.all,"list"],list:e=>[...s.lists(),e??{}],details:()=>[...s.all,"detail"],detail:e=>[...s.details(),e]},u=`
  fragment TemplateFields on Template {
    id
    slug
    name
    channel
    subject
    bodyHtml
    bodyText
    variables {
      key
      label
      required
      defaultValue
    }
    isActive
  }
`,f=`
  ${u}
  query Templates($channel: TemplateChannel, $activeOnly: Boolean) {
    templates(channel: $channel, activeOnly: $activeOnly) {
      ...TemplateFields
    }
  }
`;async function g(e){return(await o(f,{})).templates}const D=`
  ${u}
  query Template($id: ID!) {
    template(id: $id) {
      ...TemplateFields
    }
  }
`;async function P(e){return(await o(D,{id:e})).template}const C=`
  ${u}
  mutation UpdateTemplate($input: UpdateTemplateInput!) {
    updateTemplate(input: $input) {
      ...TemplateFields
    }
  }
`;async function $(e){return(await o(C,{input:e})).updateTemplate}const q=`
  mutation DeleteTemplate($id: ID!) {
    deleteTemplate(id: $id) {
      message
      success
    }
  }
`;async function F(e){return(await o(q,{id:e})).deleteTemplate}function L(e){return p({queryKey:s.list(e),queryFn:()=>g()})}function O(e){return p({queryKey:s.detail(e),queryFn:()=>P(e),enabled:!!e})}function Q(){const e=m();return T({mutationFn:t=>$(t),onSuccess:t=>{e.invalidateQueries({queryKey:s.lists()}),e.setQueryData(s.detail(t.id),t),r.success("Template updated")},onError:t=>{r.error(y(t,"Failed to update template"))}})}function A(){const e=m();return T({mutationFn:t=>F(t),onSuccess:()=>{e.invalidateQueries({queryKey:s.lists()}),r.success("Template deleted")},onError:t=>{r.error(y(t,"Failed to delete template"))}})}function U({template:e,disabled:t,onDeleted:d,triggerVariant:h="icon"}){const[x,c]=b.useState(!1),l=A(),E=async()=>{await l.mutateAsync(e.id),c(!1),d==null||d()};return a.jsxs(n,{open:x,onOpenChange:c,children:[a.jsx(n.Trigger,{asChild:!0,children:h==="button"?a.jsx(i,{type:"button",variant:"destructive",disabled:t||l.isPending,children:"Delete"}):a.jsx(i,{type:"button",variant:"outline",className:"h-auto border-0 bg-transparent p-2 text-primary shadow-none hover:bg-transparent hover:text-primary/80",disabled:t||l.isPending,onClick:v=>v.stopPropagation(),"aria-label":`Delete ${e.name}`,children:a.jsx(j,{className:"size-icon-sm","aria-hidden":!0})})}),a.jsxs(n.Portal,{children:[a.jsx(n.Overlay,{}),a.jsxs(n.Content,{size:"sm",children:[a.jsx(n.CloseIcon,{}),a.jsxs(n.Header,{children:[a.jsx(n.Title,{children:"Delete template"}),a.jsxs(n.Description,{children:["Delete ",a.jsx("span",{className:"font-medium text-foreground",children:e.name}),"? This action cannot be undone."]})]}),a.jsxs(n.Footer,{children:[a.jsx(n.Close,{asChild:!0,children:a.jsx(i,{type:"button",variant:"outline",disabled:l.isPending,children:"Cancel"})}),a.jsx(i,{type:"button",variant:"destructive",disabled:l.isPending,onClick:()=>void E(),children:l.isPending?"Deleting…":"Delete template"})]})]})]})]})}export{U as D,O as a,Q as b,L as u};
