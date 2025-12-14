import{t as c,D as u,a as y,r as k,u as b,j as C}from"./index-DjLJklN1.js";import{a as w,g as x,s as R,m as S,d as M,e as $}from"./Box-Ceze8w59.js";import{c as U}from"./createReactComponent-B5Bwwah4.js";function A(t){return String(t).match(/[\d.\-+]*\s*(.*)/)[1]||""}function I(t){return parseFloat(t)}function N(t){return x("MuiSkeleton",t)}w("MuiSkeleton",["root","text","rectangular","rounded","circular","pulse","wave","withChildren","fitContent","heightAuto"]);const X=t=>{const{classes:e,variant:a,animation:n,hasChildren:o,width:i,height:s}=t;return $({root:["root",a,n,o&&"withChildren",o&&!i&&"fitContent",o&&!s&&"heightAuto"]},N,e)},r=c`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`,l=c`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`,j=typeof r!="string"?u`
        animation: ${r} 2s ease-in-out 0.5s infinite;
      `:null,B=typeof l!="string"?u`
        &::after {
          animation: ${l} 2s linear 0.5s infinite;
        }
      `:null,D=R("span",{name:"MuiSkeleton",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:a}=t;return[e.root,e[a.variant],a.animation!==!1&&e[a.animation],a.hasChildren&&e.withChildren,a.hasChildren&&!a.width&&e.fitContent,a.hasChildren&&!a.height&&e.heightAuto]}})(S(({theme:t})=>{const e=A(t.shape.borderRadius)||"px",a=I(t.shape.borderRadius);return{display:"block",backgroundColor:t.vars?t.vars.palette.Skeleton.bg:y(t.palette.text.primary,t.palette.mode==="light"?.11:.13),height:"1.2em",variants:[{props:{variant:"text"},style:{marginTop:0,marginBottom:0,height:"auto",transformOrigin:"0 55%",transform:"scale(1, 0.60)",borderRadius:`${a}${e}/${Math.round(a/.6*10)/10}${e}`,"&:empty:before":{content:'"\\00a0"'}}},{props:{variant:"circular"},style:{borderRadius:"50%"}},{props:{variant:"rounded"},style:{borderRadius:(t.vars||t).shape.borderRadius}},{props:({ownerState:n})=>n.hasChildren,style:{"& > *":{visibility:"hidden"}}},{props:({ownerState:n})=>n.hasChildren&&!n.width,style:{maxWidth:"fit-content"}},{props:({ownerState:n})=>n.hasChildren&&!n.height,style:{height:"auto"}},{props:{animation:"pulse"},style:j||{animation:`${r} 2s ease-in-out 0.5s infinite`}},{props:{animation:"wave"},style:{position:"relative",overflow:"hidden",WebkitMaskImage:"-webkit-radial-gradient(white, black)","&::after":{background:`linear-gradient(
                90deg,
                transparent,
                ${(t.vars||t).palette.action.hover},
                transparent
              )`,content:'""',position:"absolute",transform:"translateX(-100%)",bottom:0,left:0,right:0,top:0}}},{props:{animation:"wave"},style:B||{"&::after":{animation:`${l} 2s linear 0.5s infinite`}}}]}})),W=k.forwardRef(function(e,a){const n=b({props:e,name:"MuiSkeleton"}),{animation:o="pulse",className:i,component:s="span",height:p,style:m,variant:f="text",width:g,...h}=n,d={...n,animation:o,component:s,variant:f,hasChildren:!!h.children},v=X(d);return C.jsx(D,{as:s,ref:a,className:M(v.root,i),ownerState:d,...h,style:{width:g,height:p,...m}})});var F=U("notebook","IconNotebook",[["path",{d:"M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18",key:"svg-0"}],["path",{d:"M13 8l2 0",key:"svg-1"}],["path",{d:"M13 12l2 0",key:"svg-2"}]]);export{F as I,W as S};
