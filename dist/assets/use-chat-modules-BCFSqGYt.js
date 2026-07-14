import{z as u,F as r,A as o,C as i,D as l,E as s}from"./index-BgASrpq4.js";const a={all:["chat-modules"],lists:()=>[...a.all,"list"],list:()=>[...a.lists(),"admin"],available:()=>[...a.all,"available"]};function c(e){return{id:e.id,name:e.name,slug:e.slug,description:e.description??null,provider:e.provider,model:e.model,isActive:e.isActive,isDefault:e.isDefault,isGlobal:e.isGlobal??!1,hasApiKey:e.hasApiKey,maskedApiKey:e.maskedApiKey??null,apiKey:e.apiKey??null,createdAt:e.createdAt}}function d(e){return e.map(c)}function C(e){return e.map(t=>({id:t.id,name:t.name,description:t.description??null,provider:t.provider,model:t.model,isDefault:t.isDefault,isGlobal:t.isGlobal??!1}))}const n=`
  fragment ChatModuleFields on ChatModule {
    id
    name
    slug
    description
    provider
    model
    isActive
    isDefault
    isGlobal
    hasApiKey
    maskedApiKey
    apiKey
    createdAt
  }
`,M=`
  fragment ChatModuleOptionFields on ChatModuleOption {
    id
    name
    description
    provider
    model
    isDefault
    isGlobal
  }
`,p=`
  ${n}
  query ChatModules {
    chatModules {
      ...ChatModuleFields
    }
  }
`,h=`
  ${M}
  query AvailableChatModules {
    availableChatModules {
      ...ChatModuleOptionFields
    }
  }
`;async function y(){const e=await u(p);return d(e.chatModules)}async function A(){const e=await u(h);return C(e.availableChatModules)}const m=`
  ${n}
  mutation CreateChatModule($input: CreateChatModuleInput!) {
    createChatModule(input: $input) {
      ...ChatModuleFields
    }
  }
`,f=`
  ${n}
  mutation UpdateChatModule($input: UpdateChatModuleInput!) {
    updateChatModule(input: $input) {
      ...ChatModuleFields
    }
  }
`,v=`
  mutation DeleteChatModule($id: ID!) {
    deleteChatModule(id: $id) {
      success
      message
    }
  }
`;async function E(e){const t=await u(m,{input:e});return d([t.createChatModule])[0]}async function D(e){const t=await u(f,{input:e});return d([t.updateChatModule])[0]}async function _(e){return(await u(v,{id:e})).deleteChatModule}function T(){return r({queryKey:a.list(),queryFn:y})}function b(){return r({queryKey:a.available(),queryFn:A})}function I(){const e=o();return i({mutationFn:t=>E(t),onSuccess:()=>{e.invalidateQueries({queryKey:a.lists()}),e.invalidateQueries({queryKey:a.available()}),l.success("API key module created")},onError:t=>{l.error(s(t,"Failed to create API key module"))}})}function K(){const e=o();return i({mutationFn:t=>D(t),onSuccess:()=>{e.invalidateQueries({queryKey:a.all}),l.success("API key module updated")},onError:t=>{l.error(s(t,"Failed to update API key module"))}})}function O(){const e=o();return i({mutationFn:t=>_(t),onSuccess:()=>{e.invalidateQueries({queryKey:a.all}),l.success("API key module deleted")},onError:t=>{l.error(s(t,"Failed to delete API key module"))}})}export{I as a,O as b,K as c,T as d,b as u};
