/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
import $ from"jquery";import moment from"moment";import Md5 from"@typo3/backend/hashing/md5.js";import DocumentSaveActions from"@typo3/backend/document-save-actions.js";import Modal from"@typo3/backend/modal.js";import Severity from"@typo3/backend/severity.js";export default(function(){const FormEngineValidation={rulesSelector:"[data-formengine-validation-rules]",inputSelector:"[data-formengine-input-params]",markerSelector:".t3js-formengine-validation-marker",groupFieldHiddenElement:".t3js-formengine-field-group input[type=hidden]",relatedFieldSelector:"[data-relatedfieldname]",errorClass:"has-error",lastYear:0,lastDate:0,lastTime:0,passwordDummy:"********"},customEvaluations=new Map;return FormEngineValidation.initialize=function(){$(document).find("."+FormEngineValidation.errorClass).removeClass(FormEngineValidation.errorClass),FormEngineValidation.initializeInputFields().promise().done((function(){$(document).on("change",FormEngineValidation.rulesSelector,e=>{FormEngineValidation.validateField(e.currentTarget),FormEngineValidation.markFieldAsChanged(e.currentTarget)}),FormEngineValidation.registerSubmitCallback()}));const e=new Date;FormEngineValidation.lastYear=FormEngineValidation.getYear(e),FormEngineValidation.lastDate=FormEngineValidation.getDate(e),FormEngineValidation.lastTime=0,FormEngineValidation.validate()},FormEngineValidation.initializeInputFields=function(){return $(document).find(FormEngineValidation.inputSelector).each((function(e,n){const t=$(n).data("formengine-input-params"),a=t.field,i=$('[name="'+a+'"]');void 0===i.data("main-field")&&(i.data("main-field",a),i.data("config",t),FormEngineValidation.initializeInputField(a))}))},FormEngineValidation.initializeInputField=function(e){const n=$('[name="'+e+'"]'),t=$('[data-formengine-input-name="'+e+'"]');let a=$('[name="'+n.data("main-field")+'"]');0===a.length&&(a=n);const i=a.data("config");if(void 0!==i){const e=FormEngineValidation.trimExplode(",",i.evalList);let a=n.val();for(let n=0;n<e.length;n++)a=FormEngineValidation.formatValue(e[n],a,i);a.length&&"password"!==t.attr("type")&&t.val(a)}t.data("main-field",e),t.data("config",i),t.on("change",(function(){FormEngineValidation.updateInputField(t.attr("data-formengine-input-name"))})),t.attr("data-formengine-input-initialized","true")},FormEngineValidation.registerCustomEvaluation=function(e,n){customEvaluations.has(e)||customEvaluations.set(e,n)},FormEngineValidation.formatValue=function(e,n,t){let a,i,o="";switch(e){case"date":if(n.toString().indexOf("-")>0){o=moment.utc(n).format("DD-MM-YYYY")}else{if(a=1*n,!a)return"";i=new Date(1e3*a);o=i.getUTCDate().toString(10).padStart(2,"0")+"-"+(i.getUTCMonth()+1).toString(10).padStart(2,"0")+"-"+this.getYear(i)}break;case"datetime":if(n.toString().indexOf("-")<=0&&!("number"==typeof n?n:parseInt(n)))return"";o=FormEngineValidation.formatValue("time",n,t)+" "+FormEngineValidation.formatValue("date",n,t);break;case"time":case"timesec":let r;if(n.toString().indexOf("-")>0)r=moment.utc(n);else{if(a="number"==typeof n?n:parseInt(n),!a&&"0"!==n.toString())return"";r=moment.unix(a).utc()}o="timesec"===e?r.format("HH:mm:ss"):r.format("HH:mm");break;case"password":o=n?FormEngineValidation.passwordDummy:"";break;default:o=n}return o},FormEngineValidation.updateInputField=function(e){const n=$('[name="'+e+'"]');let t=$('[name="'+n.data("main-field")+'"]');0===t.length&&(t=n);const a=$('[data-formengine-input-name="'+t.attr("name")+'"]'),i=t.data("config");if(void 0!==i){const e=FormEngineValidation.trimExplode(",",i.evalList);let n=a.val();for(let t=0;t<e.length;t++)n=FormEngineValidation.processValue(e[t],n,i);let o=n;for(let n=0;n<e.length;n++)o=FormEngineValidation.formatValue(e[n],o,i);t.val(n),t.get(0).dispatchEvent(new Event("change")),a.val(o)}},FormEngineValidation.validateField=function(e,n){const t=e instanceof $?e.get(0):e;if(n=n||t.value||"",void 0===t.dataset.formengineValidationRules)return n;const a=JSON.parse(t.dataset.formengineValidationRules);let i,o,r,l=!1,s=0,m=n;$.isArray(n)||(n=FormEngineValidation.ltrim(n)),$.each(a,(function(e,a){if(l)return!1;switch(a.type){case"required":""===n&&(l=!0,t.closest(FormEngineValidation.markerSelector).classList.add(FormEngineValidation.errorClass));break;case"range":if(""!==n){if((a.minItems||a.maxItems)&&(i=$(document).find('[name="'+t.dataset.relatedfieldname+'"]'),s=i.length?FormEngineValidation.trimExplode(",",i.val()).length:t.value,void 0!==a.minItems&&(o=1*a.minItems,!isNaN(o)&&s<o&&(l=!0)),void 0!==a.maxItems&&(r=1*a.maxItems,!isNaN(r)&&s>r&&(l=!0))),void 0!==a.lower){const e=1*a.lower;!isNaN(e)&&n<e&&(l=!0)}if(void 0!==a.upper){const e=1*a.upper;!isNaN(e)&&n>e&&(l=!0)}}break;case"select":case"category":(a.minItems||a.maxItems)&&(i=$(document).find('[name="'+t.dataset.relatedfieldname+'"]'),s=i.length?FormEngineValidation.trimExplode(",",i.val()).length:t instanceof HTMLSelectElement?t.querySelectorAll("option:checked").length:t.querySelectorAll("input[value]:checked").length,void 0!==a.minItems&&(o=1*a.minItems,!isNaN(o)&&s<o&&(l=!0)),void 0!==a.maxItems&&(r=1*a.maxItems,!isNaN(r)&&s>r&&(l=!0)));break;case"group":case"inline":(a.minItems||a.maxItems)&&(s=FormEngineValidation.trimExplode(",",t.value).length,void 0!==a.minItems&&(o=1*a.minItems,!isNaN(o)&&s<o&&(l=!0)),void 0!==a.maxItems&&(r=1*a.maxItems,!isNaN(r)&&s>r&&(l=!0)))}}));const d=!l;return t.closest(FormEngineValidation.markerSelector).classList.toggle(FormEngineValidation.errorClass,!d),FormEngineValidation.markParentTab($(t),d),$(document).trigger("t3-formengine-postfieldvalidation"),m},FormEngineValidation.processValue=function(e,n,t){let a="",i="",o="",r=0,l=n;switch(e){case"alpha":case"num":case"alphanum":case"alphanum_x":for(a="",r=0;r<n.length;r++){const t=n.substr(r,1);let i="_"===t||"-"===t,o=t>="a"&&t<="z"||t>="A"&&t<="Z",l=t>="0"&&t<="9";switch(e){case"alphanum":i=!1;break;case"alpha":l=!1,i=!1;break;case"num":o=!1,i=!1}(o||l||i)&&(a+=t)}a!==n&&(l=a);break;case"is_in":if(t.is_in){i=""+n,t.is_in=t.is_in.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");const e=new RegExp("[^"+t.is_in+"]+","g");a=i.replace(e,"")}else a=i;l=a;break;case"nospace":l=(""+n).replace(/ /g,"");break;case"md5":""!==n&&(l=Md5.hash(n));break;case"upper":l=n.toUpperCase();break;case"lower":l=n.toLowerCase();break;case"int":""!==n&&(l=FormEngineValidation.parseInt(n));break;case"double2":""!==n&&(l=FormEngineValidation.parseDouble(n));break;case"trim":l=String(n).trim();break;case"datetime":""!==n&&(o=n.substr(0,1),l=FormEngineValidation.parseDateTime(n));break;case"date":""!==n&&(o=n.substr(0,1),l=FormEngineValidation.parseDate(n));break;case"time":case"timesec":""!==n&&(o=n.substr(0,1),l=FormEngineValidation.parseTime(n,e));break;case"year":""!==n&&(o=n.substr(0,1),l=FormEngineValidation.parseYear(n));break;case"null":case"password":break;default:customEvaluations.has(e)?l=customEvaluations.get(e).call(null,n):"object"==typeof TBE_EDITOR&&void 0!==TBE_EDITOR.customEvalFunctions&&"function"==typeof TBE_EDITOR.customEvalFunctions[e]&&(l=TBE_EDITOR.customEvalFunctions[e](n))}return l},FormEngineValidation.validate=function(e){(void 0===e||e instanceof Document)&&$(document).find(FormEngineValidation.markerSelector+", .t3js-tabmenu-item").removeClass(FormEngineValidation.errorClass).removeClass("has-validation-error");const n=e||document;$(n).find(FormEngineValidation.rulesSelector).each((e,n)=>{const t=$(n);if(!t.closest(".t3js-flex-section-deleted, .t3js-inline-record-deleted").length){let e=!1;const n=t.val(),a=FormEngineValidation.validateField(t,n);if($.isArray(a)&&$.isArray(n)){if(a.length!==n.length)e=!0;else for(let t=0;t<a.length;t++)if(a[t]!==n[t]){e=!0;break}}else a.length&&n!==a&&(e=!0);e&&t.val(a)}})},FormEngineValidation.markFieldAsChanged=function(e){if(e instanceof $&&(e=e.get(0)),!(e instanceof HTMLElement))return;e.closest(".t3js-formengine-palette-field").classList.add("has-change")},FormEngineValidation.trimExplode=function(e,n){const t=[],a=n.split(e);for(let e=0;e<a.length;e++){const n=a[e].trim();n.length>0&&t.push(n)}return t},FormEngineValidation.parseInt=function(e){let n;return e?(n=parseInt(""+e,10),isNaN(n)?0:n):0},FormEngineValidation.parseDouble=function(e){let n=""+e;n=n.replace(/[^0-9,\.-]/g,"");const t="-"===n.substring(0,1);n=n.replace(/-/g,""),n=n.replace(/,/g,"."),-1===n.indexOf(".")&&(n+=".0");const a=n.split("."),i=a.pop();let o=Number(a.join("")+"."+i);return t&&(o*=-1),n=o.toFixed(2),n},FormEngineValidation.ltrim=function(e){return e?(""+e).replace(/^\s+/,""):""},FormEngineValidation.btrim=function(e){return e?(""+e).replace(/\s+$/,""):""},FormEngineValidation.parseDateTime=function(e){const n=e.indexOf(" ");if(-1!==n){const t=FormEngineValidation.parseDate(e.substr(n,e.length));FormEngineValidation.lastTime=t+FormEngineValidation.parseTime(e.substr(0,n),"time")}else FormEngineValidation.lastTime=FormEngineValidation.parseDate(e);return FormEngineValidation.lastTime},FormEngineValidation.parseDate=function(e){const n=new Date;let t=FormEngineValidation.split(e);if(t.values[1]&&t.values[1].length>2){const e=t.values[1];t=FormEngineValidation.splitSingle(e)}const a=t.values[3]?FormEngineValidation.parseInt(t.values[3]):FormEngineValidation.getYear(n),i=t.values[2]?FormEngineValidation.parseInt(t.values[2]):n.getUTCMonth()+1,o=t.values[1]?FormEngineValidation.parseInt(t.values[1]):n.getUTCDate(),r=moment.utc();return r.year(parseInt(a)).month(parseInt(i)-1).date(parseInt(o)).hour(0).minute(0).second(0),FormEngineValidation.lastDate=r.unix(),FormEngineValidation.lastDate},FormEngineValidation.parseTime=function(e,n){const t=new Date;let a=FormEngineValidation.split(e);if(a.values[1]&&a.values[1].length>2){const e=a.values[1];a=FormEngineValidation.splitSingle(e)}const i=a.values[3]?FormEngineValidation.parseInt(a.values[3]):t.getUTCSeconds(),o=a.values[2]?FormEngineValidation.parseInt(a.values[2]):t.getUTCMinutes(),r=a.values[1]?FormEngineValidation.parseInt(a.values[1]):t.getUTCHours(),l=moment.utc();return l.year(1970).month(0).date(1).hour(r).minute(o).second("timesec"===n?i:0),FormEngineValidation.lastTime=l.unix(),FormEngineValidation.lastTime<0&&(FormEngineValidation.lastTime+=86400),FormEngineValidation.lastTime},FormEngineValidation.parseYear=function(e){const n=new Date,t=FormEngineValidation.split(e);return FormEngineValidation.lastYear=t.values[1]?FormEngineValidation.parseInt(t.values[1]):FormEngineValidation.getYear(n),FormEngineValidation.lastYear},FormEngineValidation.getYear=function(e){return null===e?null:e.getUTCFullYear()},FormEngineValidation.getDate=function(e){const n=new Date(FormEngineValidation.getYear(e),e.getUTCMonth(),e.getUTCDate());return FormEngineValidation.getTimestamp(n)},FormEngineValidation.pol=function(foreign,value){return eval(("-"==foreign?"-":"")+value)},FormEngineValidation.convertClientTimestampToUTC=function(e,n){const t=new Date(1e3*e);return t.setTime(1e3*(e-60*t.getTimezoneOffset())),n?FormEngineValidation.getTime(t):FormEngineValidation.getTimestamp(t)},FormEngineValidation.getTimestamp=function(e){return Date.parse(e instanceof Date?e.toISOString():e)/1e3},FormEngineValidation.getTime=function(e){return 60*e.getUTCHours()*60+60*e.getUTCMinutes()+FormEngineValidation.getSecs(e)},FormEngineValidation.getSecs=function(e){return e.getUTCSeconds()},FormEngineValidation.getTimeSecs=function(e){return 60*e.getHours()*60+60*e.getMinutes()+e.getSeconds()},FormEngineValidation.markParentTab=function(e,n){e.parents(".tab-pane").each((function(e,t){const a=$(t);n&&(n=0===a.find(".has-error").length);const i=a.attr("id");$(document).find('a[href="#'+i+'"]').closest(".t3js-tabmenu-item").toggleClass("has-validation-error",!n)}))},FormEngineValidation.splitSingle=function(e){const n=""+e,t={values:[],pointer:3};return t.values[1]=n.substr(0,2),t.values[2]=n.substr(2,2),t.values[3]=n.substr(4,10),t},FormEngineValidation.splitStr=function(e,n,t){const a=""+e,i=n.length;let o=-i;t<1&&(t=1);for(let e=1;e<t;e++)if(o=a.indexOf(n,o+i),-1==o)return null;let r=a.indexOf(n,o+i);return-1==r&&(r=a.length),a.substring(o+i,r)},FormEngineValidation.split=function(e){const n={values:[],valPol:[],pointer:0,numberMode:0,theVal:""};e+=" ";for(let t=0;t<e.length;t++){const a=e.substr(t,1);a<"0"||a>"9"?(n.numberMode&&(n.pointer++,n.values[n.pointer]=n.theVal,n.theVal="",n.numberMode=0),"+"!=a&&"-"!=a||(n.valPol[n.pointer+1]=a)):(n.theVal+=a,n.numberMode=1)}return n},FormEngineValidation.registerSubmitCallback=function(){DocumentSaveActions.getInstance().addPreSubmitCallback((function(e){$("."+FormEngineValidation.errorClass).length>0&&(Modal.confirm(TYPO3.lang.alert||"Alert",TYPO3.lang["FormEngine.fieldsMissing"],Severity.error,[{text:TYPO3.lang["button.ok"]||"OK",active:!0,btnClass:"btn-default",name:"ok"}]).on("button.clicked",(function(){Modal.dismiss()})),e.stopImmediatePropagation())}))},FormEngineValidation}());