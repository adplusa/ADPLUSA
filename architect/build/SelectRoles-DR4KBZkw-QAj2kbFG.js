import{u as d,ah as p,j as e,W as i,aq as u,ar as g,b3 as f,b4 as m,i as h,b5 as x,b6 as b,I as M,aI as j,d as C,b7 as y}from"./strapi-CO0p2vBv.js";import{u as k}from"./useAdminRoles-C6Es4UUq-DzXfIFhx.js";const v=({children:a,target:o})=>{const{toggleNotification:n}=h(),{formatMessage:t}=d(),{copy:r}=x(),l=t({id:"app.component.CopyToClipboard.label",defaultMessage:"Copy to clipboard"}),c=async s=>{s.preventDefault(),await r(o)&&n({type:"info",message:t({id:"notification.link-copied"})})};return e.jsx(b,{endAction:e.jsx(M,{label:l,variant:"ghost",onClick:c,children:e.jsx(j,{})}),title:o,titleEllipsis:!0,subtitle:a,icon:e.jsx("span",{style:{fontSize:32},children:"✉️"}),iconBackground:"neutral100"})},I=({registrationToken:a})=>{const{formatMessage:o}=d(),n=`${window.location.origin}${f()}/auth/register?registrationToken=${a}`;return e.jsx(v,{target:n,children:o({id:"app.components.Users.MagicLink.connect",defaultMessage:"Copy and share this link to give access to this user"})})},E=({disabled:a})=>{const{isLoading:o,roles:n}=k(),{formatMessage:t}=d(),{value:r=[],onChange:l,error:c}=p("roles");return e.jsxs(i.Root,{error:c,hint:t({id:"app.components.Users.ModalCreateBody.block-title.roles.description",defaultMessage:"A user can have one or several roles"}),name:"roles",required:!0,children:[e.jsx(i.Label,{children:t({id:"app.components.Users.ModalCreateBody.block-title.roles",defaultMessage:"User's roles"})}),e.jsx(u,{disabled:a,onChange:s=>{l("roles",s)},placeholder:t({id:"app.components.Select.placeholder",defaultMessage:"Select"}),startIcon:o?e.jsx($,{}):void 0,value:r.map(s=>s.toString()),withTags:!0,children:n.map(s=>e.jsx(g,{value:s.id.toString(),children:t({id:`global.${s.code}`,defaultMessage:s.name})},s.id))}),e.jsx(i.Error,{}),e.jsx(i.Hint,{})]})},S=y`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
`,L=C.div`
  animation: ${S} 2s infinite linear;
`,$=()=>e.jsx(L,{children:e.jsx(m,{})});export{I as M,E as S,v as a};
