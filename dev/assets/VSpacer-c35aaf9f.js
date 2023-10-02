import{q as J,s as q,t as Q,S as K,T as X,y as ee,bh as he,D as me,i as ge,c as $e,U as ye,Q as pe,R as Me,aa as ve}from"./index-0545ea52.js";var Se=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};function we(o){return o&&o.__esModule&&Object.prototype.hasOwnProperty.call(o,"default")?o.default:o}var te={exports:{}};(function(o,k){(function(p,M){o.exports=M()})(Se,function(){var p=1e3,M=6e4,w=36e5,T="millisecond",O="second",D="minute",s="hour",l="day",f="week",d="month",g="quarter",S="year",L="date",j="Invalid Date",le=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,ce=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,fe={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(i){var n=["th","st","nd","rd"],e=i%100;return"["+i+(n[(e-20)%10]||n[e]||n[0])+"]"}},P=function(i,n,e){var r=String(i);return!r||r.length>=n?i:""+Array(n+1-r.length).join(e)+i},de={s:P,z:function(i){var n=-i.utcOffset(),e=Math.abs(n),r=Math.floor(e/60),t=e%60;return(n<=0?"+":"-")+P(r,2,"0")+":"+P(t,2,"0")},m:function i(n,e){if(n.date()<e.date())return-i(e,n);var r=12*(e.year()-n.year())+(e.month()-n.month()),t=n.clone().add(r,d),a=e-t<0,u=n.clone().add(r+(a?-1:1),d);return+(-(r+(e-t)/(a?t-u:u-t))||0)},a:function(i){return i<0?Math.ceil(i)||0:Math.floor(i)},p:function(i){return{M:d,y:S,w:f,d:l,D:L,h:s,m:D,s:O,ms:T,Q:g}[i]||String(i||"").toLowerCase().replace(/s$/,"")},u:function(i){return i===void 0}},I="en",V={};V[I]=fe;var R=function(i){return i instanceof E},x=function i(n,e,r){var t;if(!n)return I;if(typeof n=="string"){var a=n.toLowerCase();V[a]&&(t=a),e&&(V[a]=e,t=a);var u=n.split("-");if(!t&&u.length>1)return i(u[0])}else{var h=n.name;V[h]=n,t=h}return!r&&t&&(I=t),t||!r&&I},$=function(i,n){if(R(i))return i.clone();var e=typeof n=="object"?n:{};return e.date=i,e.args=arguments,new E(e)},c=de;c.l=x,c.i=R,c.w=function(i,n){return $(i,{locale:n.$L,utc:n.$u,x:n.$x,$offset:n.$offset})};var E=function(){function i(e){this.$L=x(e.locale,null,!0),this.parse(e)}var n=i.prototype;return n.parse=function(e){this.$d=function(r){var t=r.date,a=r.utc;if(t===null)return new Date(NaN);if(c.u(t))return new Date;if(t instanceof Date)return new Date(t);if(typeof t=="string"&&!/Z$/i.test(t)){var u=t.match(le);if(u){var h=u[2]-1||0,m=(u[7]||"0").substring(0,3);return a?new Date(Date.UTC(u[1],h,u[3]||1,u[4]||0,u[5]||0,u[6]||0,m)):new Date(u[1],h,u[3]||1,u[4]||0,u[5]||0,u[6]||0,m)}}return new Date(t)}(e),this.$x=e.x||{},this.init()},n.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},n.$utils=function(){return c},n.isValid=function(){return this.$d.toString()!==j},n.isSame=function(e,r){var t=$(e);return this.startOf(r)<=t&&t<=this.endOf(r)},n.isAfter=function(e,r){return $(e)<this.startOf(r)},n.isBefore=function(e,r){return this.endOf(r)<$(e)},n.$g=function(e,r,t){return c.u(e)?this[r]:this.set(t,e)},n.unix=function(){return Math.floor(this.valueOf()/1e3)},n.valueOf=function(){return this.$d.getTime()},n.startOf=function(e,r){var t=this,a=!!c.u(r)||r,u=c.p(e),h=function(N,b){var _=c.w(t.$u?Date.UTC(t.$y,b,N):new Date(t.$y,b,N),t);return a?_:_.endOf(l)},m=function(N,b){return c.w(t.toDate()[N].apply(t.toDate("s"),(a?[0,0,0,0]:[23,59,59,999]).slice(b)),t)},y=this.$W,v=this.$M,C=this.$D,Y="set"+(this.$u?"UTC":"");switch(u){case S:return a?h(1,0):h(31,11);case d:return a?h(1,v):h(0,v+1);case f:var A=this.$locale().weekStart||0,F=(y<A?y+7:y)-A;return h(a?C-F:C+(6-F),v);case l:case L:return m(Y+"Hours",0);case s:return m(Y+"Minutes",1);case D:return m(Y+"Seconds",2);case O:return m(Y+"Milliseconds",3);default:return this.clone()}},n.endOf=function(e){return this.startOf(e,!1)},n.$set=function(e,r){var t,a=c.p(e),u="set"+(this.$u?"UTC":""),h=(t={},t[l]=u+"Date",t[L]=u+"Date",t[d]=u+"Month",t[S]=u+"FullYear",t[s]=u+"Hours",t[D]=u+"Minutes",t[O]=u+"Seconds",t[T]=u+"Milliseconds",t)[a],m=a===l?this.$D+(r-this.$W):r;if(a===d||a===S){var y=this.clone().set(L,1);y.$d[h](m),y.init(),this.$d=y.set(L,Math.min(this.$D,y.daysInMonth())).$d}else h&&this.$d[h](m);return this.init(),this},n.set=function(e,r){return this.clone().$set(e,r)},n.get=function(e){return this[c.p(e)]()},n.add=function(e,r){var t,a=this;e=Number(e);var u=c.p(r),h=function(v){var C=$(a);return c.w(C.date(C.date()+Math.round(v*e)),a)};if(u===d)return this.set(d,this.$M+e);if(u===S)return this.set(S,this.$y+e);if(u===l)return h(1);if(u===f)return h(7);var m=(t={},t[D]=M,t[s]=w,t[O]=p,t)[u]||1,y=this.$d.getTime()+e*m;return c.w(y,this)},n.subtract=function(e,r){return this.add(-1*e,r)},n.format=function(e){var r=this,t=this.$locale();if(!this.isValid())return t.invalidDate||j;var a=e||"YYYY-MM-DDTHH:mm:ssZ",u=c.z(this),h=this.$H,m=this.$m,y=this.$M,v=t.weekdays,C=t.months,Y=t.meridiem,A=function(b,_,U,H){return b&&(b[_]||b(r,a))||U[_].slice(0,H)},F=function(b){return c.s(h%12||12,b,"0")},N=Y||function(b,_,U){var H=b<12?"AM":"PM";return U?H.toLowerCase():H};return a.replace(ce,function(b,_){return _||function(U){switch(U){case"YY":return String(r.$y).slice(-2);case"YYYY":return c.s(r.$y,4,"0");case"M":return y+1;case"MM":return c.s(y+1,2,"0");case"MMM":return A(t.monthsShort,y,C,3);case"MMMM":return A(C,y);case"D":return r.$D;case"DD":return c.s(r.$D,2,"0");case"d":return String(r.$W);case"dd":return A(t.weekdaysMin,r.$W,v,2);case"ddd":return A(t.weekdaysShort,r.$W,v,3);case"dddd":return v[r.$W];case"H":return String(h);case"HH":return c.s(h,2,"0");case"h":return F(1);case"hh":return F(2);case"a":return N(h,m,!0);case"A":return N(h,m,!1);case"m":return String(m);case"mm":return c.s(m,2,"0");case"s":return String(r.$s);case"ss":return c.s(r.$s,2,"0");case"SSS":return c.s(r.$ms,3,"0");case"Z":return u}return null}(b)||u.replace(":","")})},n.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},n.diff=function(e,r,t){var a,u=this,h=c.p(r),m=$(e),y=(m.utcOffset()-this.utcOffset())*M,v=this-m,C=function(){return c.m(u,m)};switch(h){case S:a=C()/12;break;case d:a=C();break;case g:a=C()/3;break;case f:a=(v-y)/6048e5;break;case l:a=(v-y)/864e5;break;case s:a=v/w;break;case D:a=v/M;break;case O:a=v/p;break;default:a=v}return t?a:c.a(a)},n.daysInMonth=function(){return this.endOf(d).$D},n.$locale=function(){return V[this.$L]},n.locale=function(e,r){if(!e)return this.$L;var t=this.clone(),a=x(e,r,!0);return a&&(t.$L=a),t},n.clone=function(){return c.w(this.$d,this)},n.toDate=function(){return new Date(this.valueOf())},n.toJSON=function(){return this.isValid()?this.toISOString():null},n.toISOString=function(){return this.$d.toISOString()},n.toString=function(){return this.$d.toUTCString()},i}(),G=E.prototype;return $.prototype=G,[["$ms",T],["$s",O],["$m",D],["$H",s],["$W",l],["$M",d],["$y",S],["$D",L]].forEach(function(i){G[i[1]]=function(n){return this.$g(n,i[0],i[1])}}),$.extend=function(i,n){return i.$i||(i(n,E,$),i.$i=!0),$},$.locale=x,$.isDayjs=R,$.unix=function(i){return $(1e3*i)},$.en=V[I],$.Ls=V,$.p={},$})})(te);var be=te.exports;const z=we(be),Ae=()=>{const o=J("$window"),k=J("$mainUrl");return{parseJsonTofield:(s,l)=>{let f=null;switch(l.type){case"Lookup":s&&(f={title:s.Title,value:s.Id});break;case"LookupMulti":s?f=s.map(d=>Object({title:d.Title,value:d.Id})):f=[];break;case"MultiChoice":s?f=s.results:f=[];break;case"DateTime":s&&(l.format=="DateTime"?f=z(s).format("YYYY-MM-DDTHH:mm"):f=z(s).format("YYYY-MM-DD"));break;case"User":s&&(f={title:s.Title,value:s.Id});break;case"UserMulti":s?f=s.map(d=>Object({title:d.Title,value:d.Id})):f=[];break;case"Note":s&&(f=s.replace(/<\/?[^>]+(>|$)/g,""));break;default:s!=null&&(f=s)}return f},openExternalLink:s=>{o.open(s,"_blank")},getListItemType:async s=>{const l=await q.get(k+"/_api/web/lists/getbytitle('"+s+"')/?$select=ListItemEntityTypeFullName");if(l.data)return{type:l.data.ListItemEntityTypeFullName};throw"Invalid result!"},getFileBuffer:s=>new Promise((l,f)=>{let d=new FileReader;d.onload=g=>{var S;return l((S=g.target)==null?void 0:S.result)},d.onerror=g=>{var S;return f((S=g.target)==null?void 0:S.error)},d.readAsArrayBuffer(s)}),getListColumnsInfo:async s=>{const l=await q.get(k+"/_api/web/lists/getbytitle('"+s+"')/fields?$filter=Hidden eq false"),f=new DOMParser;let d=[];for(let g of l.data.value){const L=f.parseFromString(g.SchemaXml,"application/xml").getElementsByTagName("Field")[0];d.push({staticName:g.StaticName,label:g.Title,defaultValue:g.DefaultValue,required:g.Required,type:L.getAttribute("Type"),format:L.getAttribute("Format")||L.getAttribute("RichTextMode"),userSelectionScope:L.getAttribute("UserSelectionScope"),userSelectionMode:L.getAttribute("UserSelectionMode"),choices:g==null?void 0:g.Choices,lookupField:g.LookupField,lookupList:g.LookupList?g.LookupList.replaceAll(/{|}/g,""):null})}return d},parseColVal:(s,l,f)=>l&&(s=="User"||s=="Lookup"||s=="LookupTask"?l.Title:(s=="UserMulti"||s=="LookupMulti")&&Array.isArray(l)?l.map(d=>d.Title).join(", "):s=="Number"&&f=="Currency"?parseFloat(l).toFixed(2):s=="Number"?parseFloat(l):s=="Calculated"?l:s=="DateTime"||f=="DateOnly"?new Date(l).toLocaleString("pl-PL",{dateStyle:"short",timeStyle:f=="DateOnly"?void 0:"short",hour12:!1}):l)}};const ke=Q({fluid:{type:Boolean,default:!1},...K(),...X()},"VContainer"),Ne=ee()({name:"VContainer",props:ke(),setup(o,k){let{slots:p}=k;const{rtlClasses:M}=he();return me(()=>ge(o.tag,{class:["v-container",{"v-container--fluid":o.fluid},M.value,o.class],style:o.style},p)),{}}}),W=["start","end","center"],ne=["space-between","space-around","space-evenly"];function B(o,k){return pe.reduce((p,M)=>{const w=o+Me(M);return p[w]=k(),p},{})}const Le=[...W,"baseline","stretch"],re=o=>Le.includes(o),se=B("align",()=>({type:String,default:null,validator:re})),Ce=[...W,...ne],ie=o=>Ce.includes(o),ae=B("justify",()=>({type:String,default:null,validator:ie})),Oe=[...W,...ne,"stretch"],ue=o=>Oe.includes(o),oe=B("alignContent",()=>({type:String,default:null,validator:ue})),Z={align:Object.keys(se),justify:Object.keys(ae),alignContent:Object.keys(oe)},De={align:"align",justify:"justify",alignContent:"align-content"};function Te(o,k,p){let M=De[o];if(p!=null){if(k){const w=k.replace(o,"");M+=`-${w}`}return M+=`-${p}`,M.toLowerCase()}}const _e=Q({dense:Boolean,noGutters:Boolean,align:{type:String,default:null,validator:re},...se,justify:{type:String,default:null,validator:ie},...ae,alignContent:{type:String,default:null,validator:ue},...oe,...K(),...X()},"VRow"),Ye=ee()({name:"VRow",props:_e(),setup(o,k){let{slots:p}=k;const M=$e(()=>{const w=[];let T;for(T in Z)Z[T].forEach(O=>{const D=o[O],s=Te(T,O,D);s&&w.push(s)});return w.push({"v-row--no-gutters":o.noGutters,"v-row--dense":o.dense,[`align-${o.align}`]:o.align,[`justify-${o.justify}`]:o.justify,[`align-content-${o.alignContent}`]:o.alignContent}),w});return()=>{var w;return ye(o.tag,{class:["v-row",M.value,o.class],style:o.style},(w=p.default)==null?void 0:w.call(p))}}}),Ie=ve("v-spacer","div","VSpacer");export{Ie as V,Ye as a,Ne as b,z as d,Ae as u};
