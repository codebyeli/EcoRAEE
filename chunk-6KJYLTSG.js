import{a as B,e as T}from"./chunk-NNJTDUZN.js";import{Aa as D,Ba as V,a as w,b as M,d as F,e as x,g as S,h as I,i as E,m as L,n as N}from"./chunk-RZCM5SQZ.js";import{$a as _,Da as o,Ea as i,Fb as k,Gb as y,Hb as C,J as p,Ma as m,P as b,Q as d,Wa as l,Xa as P,ha as c,ia as g,pb as v,sa as O,sb as h,ua as s}from"./chunk-4H7K6CBI.js";var G=()=>["/forgot-password"],q=()=>["/register"];function A(r,t){r&1&&(o(0,"p",15),l(1,"Debes introducir un n\xFAmero de C\xE9dula v\xE1lido"),i())}var u=class r{constructor(t,e,n,a){this.fb=t;this.loginService=e;this._snackBar=n;this.router=a}loginForm;attemptedSubmit=!1;passwordFieldType="password";openSnackBar(t,e){this._snackBar.open(t,e,{duration:2e3})}ngOnInit(){this.loginForm=this.fb.group({username:["",[M.required,B]],password:["",M.required]})}formatID(t){let e=t.target,n=e.value.replace(/-/g,"");n.length>3&&(n=n.slice(0,3)+"-"+n.slice(3)),n.length>11&&(n=n.slice(0,11)+"-"+n.slice(11,12)),e.value=n,this.loginForm.get("username")?.setValue(n,{emitEvent:!1})}checkValidity(){let t=this.loginForm.get("username")?.valid,e=this.loginForm.get("password")?.valid;return!!(t&&e)}togglePasswordVisibility(){this.passwordFieldType=this.passwordFieldType==="password"?"text":"password"}login(){this.attemptedSubmit=!0,this.loginForm.valid&&this.loginService.login(this.loginForm.value).subscribe(t=>{t===!1?this.openSnackBar("Credenciales incorrectas","Cerrar"):t._id&&this.router.navigate(["/dashboard",t._id])})}static \u0275fac=function(e){return new(e||r)(g(L),g(T),g(D),g(k))};static \u0275cmp=b({type:r,selectors:[["app-login"]],decls:25,vars:9,consts:[[1,"login-container"],[1,"login-form"],[3,"formGroup"],[1,"form-group"],["for","username"],["type","username","id","username","formControlName","username","placeholder","Ingresa tu C\xE9dula",3,"input"],["class","error-message",4,"ngIf"],["for","password"],[1,"password-container"],["id","password","formControlName","password","placeholder","Ingresa tu contrase\xF1a",3,"input","type"],["type","button",1,"toggle-password",3,"click"],[1,"material-icons"],[1,"submit-btn",3,"click","disabled"],[1,"links"],[1,"link",3,"routerLink"],[1,"error-message"]],template:function(e,n){if(e&1&&(o(0,"div",0)(1,"section",1)(2,"h1"),l(3,"Iniciar Sesi\xF3n"),i(),o(4,"form",2)(5,"div",3)(6,"label",4),l(7,"C\xE9dula"),i(),o(8,"input",5),m("input",function(z){return n.checkValidity(),n.formatID(z)}),i(),O(9,A,2,0,"p",6),i(),o(10,"div",3)(11,"label",7),l(12,"Contrase\xF1a"),i(),o(13,"div",8)(14,"input",9),m("input",function(){return n.checkValidity()}),i(),o(15,"button",10),m("click",function(){return n.togglePasswordVisibility()}),o(16,"span",11),l(17),i()()()(),o(18,"button",12),m("click",function(){return n.login()}),l(19,"Inicia Sesi\xF3n"),i()(),o(20,"div",13)(21,"a",14),l(22,"\xBFOlvidaste tu contrase\xF1a?"),i(),o(23,"a",14),l(24,"\xBFNo tienes una cuenta? Reg\xEDstrate"),i()()()()),e&2){let a;c(4),s("formGroup",n.loginForm),c(5),s("ngIf",((a=n.loginForm.get("username"))==null?null:a.dirty)&&!((a=n.loginForm.get("username"))!=null&&a.valid)),c(5),s("type",n.passwordFieldType),c(3),P(n.passwordFieldType==="password"?"visibility":"visibility_off"),c(),s("disabled",!n.checkValidity()),c(3),s("routerLink",_(7,G)),c(2),s("routerLink",_(8,q))}},dependencies:[v,y,S,w,F,x,I,E],styles:[".login-container[_ngcontent-%COMP%]{display:flex;justify-content:center;align-items:center;min-height:100vh;background:url(/assets/hero-about-us.jpeg) no-repeat center;background-size:cover}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]{background-color:#fff;padding:40px;border-radius:8px;box-shadow:0 4px 10px #0000001a;width:100%;max-width:400px;text-align:center}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{color:#4caf50;font-size:2rem;margin-bottom:20px}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]{margin-bottom:20px;text-align:left}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%]{display:block;font-size:1rem;color:#333;margin-bottom:5px}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:100%;padding:12px;border:1px solid #ddd;border-radius:8px;font-size:1rem;margin-bottom:10px;box-sizing:border-box}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus{border-color:#4caf50;outline:none}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .submit-btn[_ngcontent-%COMP%]{background-color:#4caf50;color:#fff;padding:12px;font-size:1rem;border:none;border-radius:8px;cursor:pointer;width:100%;transition:background-color .3s ease}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .submit-btn[_ngcontent-%COMP%]:hover{background-color:#3d8b40}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .submit-btn[_ngcontent-%COMP%]:disabled{background-color:gray;color:#000;padding:12px;font-size:1rem;border:none;border-radius:8px;cursor:not-allowed;width:100%;transition:background-color .3s ease}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]{margin-top:15px}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]{color:#4caf50;font-size:.9rem;text-decoration:none;display:block;margin-top:10px}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .links[_ngcontent-%COMP%]   .link[_ngcontent-%COMP%]:hover{text-decoration:underline}.login-container[_ngcontent-%COMP%]   .login-form[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%]{color:red}.login-container[_ngcontent-%COMP%]   .password-container[_ngcontent-%COMP%]{position:relative}.login-container[_ngcontent-%COMP%]   .password-container[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{width:calc(100% - 40px);display:inline-block}.login-container[_ngcontent-%COMP%]   .password-container[_ngcontent-%COMP%]   .toggle-password[_ngcontent-%COMP%]{position:absolute;right:10px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;padding:0;margin:0}.login-container[_ngcontent-%COMP%]   .password-container[_ngcontent-%COMP%]   .material-icons[_ngcontent-%COMP%]{font-size:24px;color:#333}"]})};var H=[{path:"",component:u}],f=class r{static \u0275fac=function(e){return new(e||r)};static \u0275mod=d({type:r});static \u0275inj=p({imports:[C.forChild(H),C]})};var R=class r{static \u0275fac=function(e){return new(e||r)};static \u0275mod=d({type:r});static \u0275inj=p({imports:[h,f,N,V]})};export{R as LoginModule};