import './polyfills.server.mjs';
import{d as V}from"./chunk-2PBHEWFQ.mjs";import{c as E}from"./chunk-GZNZ2YCR.mjs";import{n as S,ra as D}from"./chunk-2EOGU6FE.mjs";import{i as x}from"./chunk-QN4G4UWW.mjs";import{E as s,F as r,Fb as A,Ga as y,H as m,L as R,M as i,Nb as b,Ob as I,Pb as w,Ub as N,V as C,Vb as F,Wb as H,Y as j,Yb as L,_b as l,ac as h}from"./chunk-Q7XQSINL.mjs";var n=class t{constructor(e){this.router=e;this.router.events.subscribe(o=>{o instanceof H&&(this.lastValidRoute=o.urlAfterRedirects)})}lastValidRoute=null;getLastValidRoute(){return this.lastValidRoute}static \u0275fac=function(o){return new(o||t)(m(l))};static \u0275prov=s({token:t,factory:t.\u0275fac,providedIn:"root"})};var c=class t{constructor(e){this.injector=e}handleError(e){let o=this.injector.get(l),M=this.injector.get(n);if(e.message.includes("Cannot match any routes")){let v=M.getLastValidRoute();v?o.navigate([v]):o.navigate(["/landing"])}else console.error(e)}static \u0275fac=function(o){return new(o||t)(m(C))};static \u0275prov=s({token:t,factory:t.\u0275fac})};var B=[{path:"",loadChildren:()=>import("./chunk-ILZMJB5X.mjs").then(t=>t.LandingPageModule)},{path:"login",loadChildren:()=>import("./chunk-UQAXOGNU.mjs").then(t=>t.LoginModule)},{path:"about-us",loadChildren:()=>import("./chunk-OSMG3HRJ.mjs").then(t=>t.AboutUsModule)},{path:"register",loadChildren:()=>import("./chunk-V3PO5RHL.mjs").then(t=>t.RegisterModule)},{path:"dashboard/:id",loadChildren:()=>import("./chunk-ZZ5722EM.mjs").then(t=>t.DashboardModule)},{path:"forgot-password",loadChildren:()=>import("./chunk-OM6O2M5J.mjs").then(t=>t.ForgotPasswordModule)},{path:"**",redirectTo:"",pathMatch:"full"}],d=class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=i({type:t});static \u0275inj=r({providers:[{provide:j,useClass:c},n],imports:[h.forRoot(B),h]})};var p=class t{title="EcoRAEE";static \u0275fac=function(o){return new(o||t)};static \u0275cmp=R({type:t,selectors:[["app-root"]],decls:1,vars:0,template:function(o,M){o&1&&y(0,"router-outlet")},dependencies:[L]})};var u=class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=i({type:t});static \u0275inj=r({imports:[A,S,V,D]})};var f=class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=i({type:t,bootstrap:[p]});static \u0275inj=r({providers:[F(),b(I())],imports:[N,d,u,w,x]})};var g=class t{static \u0275fac=function(o){return new(o||t)};static \u0275mod=i({type:t,bootstrap:[p]});static \u0275inj=r({imports:[f,E]})};export{g as a};
