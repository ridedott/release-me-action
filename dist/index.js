require('./sourcemap-register.js');module.exports=function(e,t){"use strict";var s={};function __webpack_require__(t){if(s[t]){return s[t].exports}var r=s[t]={i:t,l:false,exports:{}};e[t].call(r.exports,r,r.exports,__webpack_require__);r.l=true;return r.exports}__webpack_require__.ab=__dirname+"/";function startup(){return __webpack_require__(325)}return startup()}({1:function(e,t,s){"use strict";var r=this&&this.__awaiter||function(e,t,s,r){function adopt(e){return e instanceof s?e:new s(function(t){t(e)})}return new(s||(s=Promise))(function(s,n){function fulfilled(e){try{step(r.next(e))}catch(e){n(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){n(e)}}function step(e){e.done?s(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});const n=s(129);const i=s(622);const o=s(669);const c=s(672);const u=o.promisify(n.exec);function cp(e,t,s={}){return r(this,void 0,void 0,function*(){const{force:r,recursive:n}=readCopyOptions(s);const o=(yield c.exists(t))?yield c.stat(t):null;if(o&&o.isFile()&&!r){return}const u=o&&o.isDirectory()?i.join(t,i.basename(e)):t;if(!(yield c.exists(e))){throw new Error(`no such file or directory: ${e}`)}const a=yield c.stat(e);if(a.isDirectory()){if(!n){throw new Error(`Failed to copy. ${e} is a directory, but tried to copy without recursive flag.`)}else{yield cpDirRecursive(e,u,0,r)}}else{if(i.relative(e,u)===""){throw new Error(`'${u}' and '${e}' are the same file`)}yield copyFile(e,u,r)}})}t.cp=cp;function mv(e,t,s={}){return r(this,void 0,void 0,function*(){if(yield c.exists(t)){let r=true;if(yield c.isDirectory(t)){t=i.join(t,i.basename(e));r=yield c.exists(t)}if(r){if(s.force==null||s.force){yield rmRF(t)}else{throw new Error("Destination already exists")}}}yield mkdirP(i.dirname(t));yield c.rename(e,t)})}t.mv=mv;function rmRF(e){return r(this,void 0,void 0,function*(){if(c.IS_WINDOWS){try{if(yield c.isDirectory(e,true)){yield u(`rd /s /q "${e}"`)}else{yield u(`del /f /a "${e}"`)}}catch(e){if(e.code!=="ENOENT")throw e}try{yield c.unlink(e)}catch(e){if(e.code!=="ENOENT")throw e}}else{let t=false;try{t=yield c.isDirectory(e)}catch(e){if(e.code!=="ENOENT")throw e;return}if(t){yield u(`rm -rf "${e}"`)}else{yield c.unlink(e)}}})}t.rmRF=rmRF;function mkdirP(e){return r(this,void 0,void 0,function*(){yield c.mkdirP(e)})}t.mkdirP=mkdirP;function which(e,t){return r(this,void 0,void 0,function*(){if(!e){throw new Error("parameter 'tool' is required")}if(t){const t=yield which(e,false);if(!t){if(c.IS_WINDOWS){throw new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also verify the file has a valid extension for an executable file.`)}else{throw new Error(`Unable to locate executable file: ${e}. Please verify either the file path exists or the file can be found within a directory specified by the PATH environment variable. Also check the file mode to verify the file is executable.`)}}}try{const t=[];if(c.IS_WINDOWS&&process.env.PATHEXT){for(const e of process.env.PATHEXT.split(i.delimiter)){if(e){t.push(e)}}}if(c.isRooted(e)){const s=yield c.tryGetExecutablePath(e,t);if(s){return s}return""}if(e.includes("/")||c.IS_WINDOWS&&e.includes("\\")){return""}const s=[];if(process.env.PATH){for(const e of process.env.PATH.split(i.delimiter)){if(e){s.push(e)}}}for(const r of s){const s=yield c.tryGetExecutablePath(r+i.sep+e,t);if(s){return s}}return""}catch(e){throw new Error(`which failed with message ${e.message}`)}})}t.which=which;function readCopyOptions(e){const t=e.force==null?true:e.force;const s=Boolean(e.recursive);return{force:t,recursive:s}}function cpDirRecursive(e,t,s,n){return r(this,void 0,void 0,function*(){if(s>=255)return;s++;yield mkdirP(t);const r=yield c.readdir(e);for(const i of r){const r=`${e}/${i}`;const o=`${t}/${i}`;const u=yield c.lstat(r);if(u.isDirectory()){yield cpDirRecursive(r,o,s,n)}else{yield copyFile(r,o,n)}}yield c.chmod(t,(yield c.stat(e)).mode)})}function copyFile(e,t,s){return r(this,void 0,void 0,function*(){if((yield c.lstat(e)).isSymbolicLink()){try{yield c.lstat(t);yield c.unlink(t)}catch(e){if(e.code==="EPERM"){yield c.chmod(t,"0666");yield c.unlink(t)}}const s=yield c.readlink(e);yield c.symlink(s,t,c.IS_WINDOWS?"junction":null)}else if(!(yield c.exists(t))||s){yield c.copyFile(e,t)}})}},9:function(e,t,s){"use strict";var r=this&&this.__awaiter||function(e,t,s,r){function adopt(e){return e instanceof s?e:new s(function(t){t(e)})}return new(s||(s=Promise))(function(s,n){function fulfilled(e){try{step(r.next(e))}catch(e){n(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){n(e)}}function step(e){e.done?s(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});const n=s(87);const i=s(614);const o=s(129);const c=s(622);const u=s(1);const a=s(672);const l=process.platform==="win32";class ToolRunner extends i.EventEmitter{constructor(e,t,s){super();if(!e){throw new Error("Parameter 'toolPath' cannot be null or empty.")}this.toolPath=e;this.args=t||[];this.options=s||{}}_debug(e){if(this.options.listeners&&this.options.listeners.debug){this.options.listeners.debug(e)}}_getCommandString(e,t){const s=this._getSpawnFileName();const r=this._getSpawnArgs(e);let n=t?"":"[command]";if(l){if(this._isCmdFile()){n+=s;for(const e of r){n+=` ${e}`}}else if(e.windowsVerbatimArguments){n+=`"${s}"`;for(const e of r){n+=` ${e}`}}else{n+=this._windowsQuoteCmdArg(s);for(const e of r){n+=` ${this._windowsQuoteCmdArg(e)}`}}}else{n+=s;for(const e of r){n+=` ${e}`}}return n}_processLineBuffer(e,t,s){try{let r=t+e.toString();let i=r.indexOf(n.EOL);while(i>-1){const e=r.substring(0,i);s(e);r=r.substring(i+n.EOL.length);i=r.indexOf(n.EOL)}t=r}catch(e){this._debug(`error processing line. Failed with error ${e}`)}}_getSpawnFileName(){if(l){if(this._isCmdFile()){return process.env["COMSPEC"]||"cmd.exe"}}return this.toolPath}_getSpawnArgs(e){if(l){if(this._isCmdFile()){let t=`/D /S /C "${this._windowsQuoteCmdArg(this.toolPath)}`;for(const s of this.args){t+=" ";t+=e.windowsVerbatimArguments?s:this._windowsQuoteCmdArg(s)}t+='"';return[t]}}return this.args}_endsWith(e,t){return e.endsWith(t)}_isCmdFile(){const e=this.toolPath.toUpperCase();return this._endsWith(e,".CMD")||this._endsWith(e,".BAT")}_windowsQuoteCmdArg(e){if(!this._isCmdFile()){return this._uvQuoteCmdArg(e)}if(!e){return'""'}const t=[" ","\t","&","(",")","[","]","{","}","^","=",";","!","'","+",",","`","~","|","<",">",'"'];let s=false;for(const r of e){if(t.some(e=>e===r)){s=true;break}}if(!s){return e}let r='"';let n=true;for(let t=e.length;t>0;t--){r+=e[t-1];if(n&&e[t-1]==="\\"){r+="\\"}else if(e[t-1]==='"'){n=true;r+='"'}else{n=false}}r+='"';return r.split("").reverse().join("")}_uvQuoteCmdArg(e){if(!e){return'""'}if(!e.includes(" ")&&!e.includes("\t")&&!e.includes('"')){return e}if(!e.includes('"')&&!e.includes("\\")){return`"${e}"`}let t='"';let s=true;for(let r=e.length;r>0;r--){t+=e[r-1];if(s&&e[r-1]==="\\"){t+="\\"}else if(e[r-1]==='"'){s=true;t+="\\"}else{s=false}}t+='"';return t.split("").reverse().join("")}_cloneExecOptions(e){e=e||{};const t={cwd:e.cwd||process.cwd(),env:e.env||process.env,silent:e.silent||false,windowsVerbatimArguments:e.windowsVerbatimArguments||false,failOnStdErr:e.failOnStdErr||false,ignoreReturnCode:e.ignoreReturnCode||false,delay:e.delay||1e4};t.outStream=e.outStream||process.stdout;t.errStream=e.errStream||process.stderr;return t}_getSpawnOptions(e,t){e=e||{};const s={};s.cwd=e.cwd;s.env=e.env;s["windowsVerbatimArguments"]=e.windowsVerbatimArguments||this._isCmdFile();if(e.windowsVerbatimArguments){s.argv0=`"${t}"`}return s}exec(){return r(this,void 0,void 0,function*(){if(!a.isRooted(this.toolPath)&&(this.toolPath.includes("/")||l&&this.toolPath.includes("\\"))){this.toolPath=c.resolve(process.cwd(),this.options.cwd||process.cwd(),this.toolPath)}this.toolPath=yield u.which(this.toolPath,true);return new Promise((e,t)=>{this._debug(`exec tool: ${this.toolPath}`);this._debug("arguments:");for(const e of this.args){this._debug(`   ${e}`)}const s=this._cloneExecOptions(this.options);if(!s.silent&&s.outStream){s.outStream.write(this._getCommandString(s)+n.EOL)}const r=new ExecState(s,this.toolPath);r.on("debug",e=>{this._debug(e)});const i=this._getSpawnFileName();const c=o.spawn(i,this._getSpawnArgs(s),this._getSpawnOptions(this.options,i));const u="";if(c.stdout){c.stdout.on("data",e=>{if(this.options.listeners&&this.options.listeners.stdout){this.options.listeners.stdout(e)}if(!s.silent&&s.outStream){s.outStream.write(e)}this._processLineBuffer(e,u,e=>{if(this.options.listeners&&this.options.listeners.stdline){this.options.listeners.stdline(e)}})})}const a="";if(c.stderr){c.stderr.on("data",e=>{r.processStderr=true;if(this.options.listeners&&this.options.listeners.stderr){this.options.listeners.stderr(e)}if(!s.silent&&s.errStream&&s.outStream){const t=s.failOnStdErr?s.errStream:s.outStream;t.write(e)}this._processLineBuffer(e,a,e=>{if(this.options.listeners&&this.options.listeners.errline){this.options.listeners.errline(e)}})})}c.on("error",e=>{r.processError=e.message;r.processExited=true;r.processClosed=true;r.CheckComplete()});c.on("exit",e=>{r.processExitCode=e;r.processExited=true;this._debug(`Exit code ${e} received from tool '${this.toolPath}'`);r.CheckComplete()});c.on("close",e=>{r.processExitCode=e;r.processExited=true;r.processClosed=true;this._debug(`STDIO streams have closed for tool '${this.toolPath}'`);r.CheckComplete()});r.on("done",(s,r)=>{if(u.length>0){this.emit("stdline",u)}if(a.length>0){this.emit("errline",a)}c.removeAllListeners();if(s){t(s)}else{e(r)}})})})}}t.ToolRunner=ToolRunner;function argStringToArray(e){const t=[];let s=false;let r=false;let n="";function append(e){if(r&&e!=='"'){n+="\\"}n+=e;r=false}for(let i=0;i<e.length;i++){const o=e.charAt(i);if(o==='"'){if(!r){s=!s}else{append(o)}continue}if(o==="\\"&&r){append(o);continue}if(o==="\\"&&s){r=true;continue}if(o===" "&&!s){if(n.length>0){t.push(n);n=""}continue}append(o)}if(n.length>0){t.push(n.trim())}return t}t.argStringToArray=argStringToArray;class ExecState extends i.EventEmitter{constructor(e,t){super();this.processClosed=false;this.processError="";this.processExitCode=0;this.processExited=false;this.processStderr=false;this.delay=1e4;this.done=false;this.timeout=null;if(!t){throw new Error("toolPath must not be empty")}this.options=e;this.toolPath=t;if(e.delay){this.delay=e.delay}}CheckComplete(){if(this.done){return}if(this.processClosed){this._setResult()}else if(this.processExited){this.timeout=setTimeout(ExecState.HandleTimeout,this.delay,this)}}_debug(e){this.emit("debug",e)}_setResult(){let e;if(this.processExited){if(this.processError){e=new Error(`There was an error when attempting to execute the process '${this.toolPath}'. This may indicate the process failed to start. Error: ${this.processError}`)}else if(this.processExitCode!==0&&!this.options.ignoreReturnCode){e=new Error(`The process '${this.toolPath}' failed with exit code ${this.processExitCode}`)}else if(this.processStderr&&this.options.failOnStdErr){e=new Error(`The process '${this.toolPath}' failed because one or more lines were written to the STDERR stream`)}}if(this.timeout){clearTimeout(this.timeout);this.timeout=null}this.done=true;this.emit("done",e,this.processExitCode)}static HandleTimeout(e){if(e.done){return}if(!e.processClosed&&e.processExited){const t=`The STDIO streams did not close within ${e.delay/1e3} seconds of the exit event from process '${e.toolPath}'. This may indicate a child process inherited the STDIO streams and has not yet exited.`;e._debug(t)}e._setResult()}}},87:function(e){e.exports=require("os")},129:function(e){e.exports=require("child_process")},183:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:true});const r=s(986);const n=s(622);t.installDependencies=(async()=>{const e=n.resolve(__dirname,"../");await r.exec(n.resolve(e,"scripts","install-dependencies.sh"),[e])})},216:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:true});t.generatePlugins=(({commitAssets:e,isNodeModule:t,releaseAssets:s})=>{return["@semantic-release/commit-analyzer","@semantic-release/release-notes-generator","@semantic-release/changelog",["@semantic-release/exec",{prepareCmd:"npx prettier --write CHANGELOG.md"}],...t===true?[["@semantic-release/npm",{npmPublish:false}]]:[],["@semantic-release/git",{assets:["./CHANGELOG.md",...e,...t?["./package.json","./package-lock.json","./yarn-lock.yaml"]:[]],message:"chore(release): v${nextRelease.version}"}],["@semantic-release/github",{assets:s,failComment:false,releasedLabels:false,successComment:false}]]})},325:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:true});const r=s(470);const n=s(216);const i=s(765);const o=s(183);const c=s(974);const u={mergeCorrespondence:["id","source"],mergePattern:/^Merge pull request #(\d+) from (.*)$/};const a=[{release:"patch",scope:"deps",type:"chore"},{release:"patch",type:"improvement"},{release:"patch",type:"refactor"}];const l={transform:c.transform};t.release=(async()=>{await o.installDependencies();const e=await Promise.resolve().then(()=>s(549));const t=i.parseInputReleaseBranch();await e({...t===undefined?{}:{branches:t},dryRun:i.parseInputDryRun(),parserOpts:u,plugins:n.generatePlugins({commitAssets:i.parseInputCommitAssets(),isNodeModule:i.parseInputNodeModule(),releaseAssets:i.parseInputReleaseAssets()}),releaseRules:a,writerOpts:l})});t.release().catch(e=>{r.setFailed(JSON.stringify(e))})},357:function(e){e.exports=require("assert")},431:function(e,t,s){"use strict";var r=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var s in e)if(Object.hasOwnProperty.call(e,s))t[s]=e[s];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const n=r(s(87));function issueCommand(e,t,s){const r=new Command(e,t,s);process.stdout.write(r.toString()+n.EOL)}t.issueCommand=issueCommand;function issue(e,t=""){issueCommand(e,{},t)}t.issue=issue;const i="::";class Command{constructor(e,t,s){if(!e){e="missing.command"}this.command=e;this.properties=t;this.message=s}toString(){let e=i+this.command;if(this.properties&&Object.keys(this.properties).length>0){e+=" ";let t=true;for(const s in this.properties){if(this.properties.hasOwnProperty(s)){const r=this.properties[s];if(r){if(t){t=false}else{e+=","}e+=`${s}=${escapeProperty(r)}`}}}}e+=`${i}${escapeData(this.message)}`;return e}}function escapeData(e){return(e||"").replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A")}function escapeProperty(e){return(e||"").replace(/%/g,"%25").replace(/\r/g,"%0D").replace(/\n/g,"%0A").replace(/:/g,"%3A").replace(/,/g,"%2C")}},470:function(e,t,s){"use strict";var r=this&&this.__awaiter||function(e,t,s,r){function adopt(e){return e instanceof s?e:new s(function(t){t(e)})}return new(s||(s=Promise))(function(s,n){function fulfilled(e){try{step(r.next(e))}catch(e){n(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){n(e)}}function step(e){e.done?s(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};var n=this&&this.__importStar||function(e){if(e&&e.__esModule)return e;var t={};if(e!=null)for(var s in e)if(Object.hasOwnProperty.call(e,s))t[s]=e[s];t["default"]=e;return t};Object.defineProperty(t,"__esModule",{value:true});const i=s(431);const o=n(s(87));const c=n(s(622));var u;(function(e){e[e["Success"]=0]="Success";e[e["Failure"]=1]="Failure"})(u=t.ExitCode||(t.ExitCode={}));function exportVariable(e,t){process.env[e]=t;i.issueCommand("set-env",{name:e},t)}t.exportVariable=exportVariable;function setSecret(e){i.issueCommand("add-mask",{},e)}t.setSecret=setSecret;function addPath(e){i.issueCommand("add-path",{},e);process.env["PATH"]=`${e}${c.delimiter}${process.env["PATH"]}`}t.addPath=addPath;function getInput(e,t){const s=process.env[`INPUT_${e.replace(/ /g,"_").toUpperCase()}`]||"";if(t&&t.required&&!s){throw new Error(`Input required and not supplied: ${e}`)}return s.trim()}t.getInput=getInput;function setOutput(e,t){i.issueCommand("set-output",{name:e},t)}t.setOutput=setOutput;function setFailed(e){process.exitCode=u.Failure;error(e)}t.setFailed=setFailed;function isDebug(){return process.env["RUNNER_DEBUG"]==="1"}t.isDebug=isDebug;function debug(e){i.issueCommand("debug",{},e)}t.debug=debug;function error(e){i.issue("error",e)}t.error=error;function warning(e){i.issue("warning",e)}t.warning=warning;function info(e){process.stdout.write(e+o.EOL)}t.info=info;function startGroup(e){i.issue("group",e)}t.startGroup=startGroup;function endGroup(){i.issue("endgroup")}t.endGroup=endGroup;function group(e,t){return r(this,void 0,void 0,function*(){startGroup(e);let s;try{s=yield t()}finally{endGroup()}return s})}t.group=group;function saveState(e,t){i.issueCommand("save-state",{name:e},t)}t.saveState=saveState;function getState(e){return process.env[`STATE_${e}`]||""}t.getState=getState},549:function(e){e.exports=require("semantic-release")},614:function(e){e.exports=require("events")},622:function(e){e.exports=require("path")},669:function(e){e.exports=require("util")},672:function(e,t,s){"use strict";var r=this&&this.__awaiter||function(e,t,s,r){function adopt(e){return e instanceof s?e:new s(function(t){t(e)})}return new(s||(s=Promise))(function(s,n){function fulfilled(e){try{step(r.next(e))}catch(e){n(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){n(e)}}function step(e){e.done?s(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};var n;Object.defineProperty(t,"__esModule",{value:true});const i=s(357);const o=s(747);const c=s(622);n=o.promises,t.chmod=n.chmod,t.copyFile=n.copyFile,t.lstat=n.lstat,t.mkdir=n.mkdir,t.readdir=n.readdir,t.readlink=n.readlink,t.rename=n.rename,t.rmdir=n.rmdir,t.stat=n.stat,t.symlink=n.symlink,t.unlink=n.unlink;t.IS_WINDOWS=process.platform==="win32";function exists(e){return r(this,void 0,void 0,function*(){try{yield t.stat(e)}catch(e){if(e.code==="ENOENT"){return false}throw e}return true})}t.exists=exists;function isDirectory(e,s=false){return r(this,void 0,void 0,function*(){const r=s?yield t.stat(e):yield t.lstat(e);return r.isDirectory()})}t.isDirectory=isDirectory;function isRooted(e){e=normalizeSeparators(e);if(!e){throw new Error('isRooted() parameter "p" cannot be empty')}if(t.IS_WINDOWS){return e.startsWith("\\")||/^[A-Z]:/i.test(e)}return e.startsWith("/")}t.isRooted=isRooted;function mkdirP(e,s=1e3,n=1){return r(this,void 0,void 0,function*(){i.ok(e,"a path argument must be provided");e=c.resolve(e);if(n>=s)return t.mkdir(e);try{yield t.mkdir(e);return}catch(r){switch(r.code){case"ENOENT":{yield mkdirP(c.dirname(e),s,n+1);yield t.mkdir(e);return}default:{let s;try{s=yield t.stat(e)}catch(e){throw r}if(!s.isDirectory())throw r}}}})}t.mkdirP=mkdirP;function tryGetExecutablePath(e,s){return r(this,void 0,void 0,function*(){let r=undefined;try{r=yield t.stat(e)}catch(t){if(t.code!=="ENOENT"){console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${t}`)}}if(r&&r.isFile()){if(t.IS_WINDOWS){const t=c.extname(e).toUpperCase();if(s.some(e=>e.toUpperCase()===t)){return e}}else{if(isUnixExecutable(r)){return e}}}const n=e;for(const i of s){e=n+i;r=undefined;try{r=yield t.stat(e)}catch(t){if(t.code!=="ENOENT"){console.log(`Unexpected error attempting to determine if executable file exists '${e}': ${t}`)}}if(r&&r.isFile()){if(t.IS_WINDOWS){try{const s=c.dirname(e);const r=c.basename(e).toUpperCase();for(const n of yield t.readdir(s)){if(r===n.toUpperCase()){e=c.join(s,n);break}}}catch(t){console.log(`Unexpected error attempting to determine the actual case of the file '${e}': ${t}`)}return e}else{if(isUnixExecutable(r)){return e}}}}return""})}t.tryGetExecutablePath=tryGetExecutablePath;function normalizeSeparators(e){e=e||"";if(t.IS_WINDOWS){e=e.replace(/\//g,"\\");return e.replace(/\\\\+/g,"\\")}return e.replace(/\/\/+/g,"/")}function isUnixExecutable(e){return(e.mode&1)>0||(e.mode&8)>0&&e.gid===process.getgid()||(e.mode&64)>0&&e.uid===process.getuid()}},747:function(e){e.exports=require("fs")},765:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:true});const r=s(470);const n=s(747);var i;(function(e){e["DryRun"]="dry-run";e["ReleaseBranches"]="release-branches";e["CommitAssets"]="commit-assets";e["ReleaseAssets"]="release-assets";e["NodeModule"]="node-module"})(i||(i={}));const o=e=>e.split("\n").map(e=>e.trim()).filter(e=>e.length>0).reduce((e,t)=>{if(n.existsSync(t)){return[...e,t]}return e},[]);t.parseInputNodeModule=(()=>r.getInput(i.NodeModule)==="true");t.parseInputDryRun=(()=>r.getInput(i.DryRun)==="true");t.parseInputReleaseBranch=(()=>{const e=r.getInput(i.ReleaseBranches);if(e.length===0){return undefined}try{return JSON.parse(e)}catch(t){return[{name:e,prerelease:false}]}});t.parseInputCommitAssets=(()=>o(r.getInput(i.CommitAssets)));t.parseInputReleaseAssets=(()=>o(r.getInput(i.ReleaseAssets)))},974:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:true});const s=e=>{if(e.commit===null||e.commit===undefined){return undefined}return e.commit.short};const r=e=>{switch(e.type){case"build":return"Build System";case"chore":return"Chores";case"ci":return"Continuous Integration";case"docs":return"Documentation";case"feat":return"Features";case"fix":return"Bug Fixes";case"improvement":return"Improvements";case"perf":return"Performance";case"refactor":return"Code Refactoring";case"revert":return"Reverts";case"style":return"Code Style";case"test":return"Tests";default:return"Other"}};t.transform=(e=>{const t=r(e);const n=s(e);return{...e,...n===undefined?{}:{shortHash:n},type:t}})},986:function(e,t,s){"use strict";var r=this&&this.__awaiter||function(e,t,s,r){function adopt(e){return e instanceof s?e:new s(function(t){t(e)})}return new(s||(s=Promise))(function(s,n){function fulfilled(e){try{step(r.next(e))}catch(e){n(e)}}function rejected(e){try{step(r["throw"](e))}catch(e){n(e)}}function step(e){e.done?s(e.value):adopt(e.value).then(fulfilled,rejected)}step((r=r.apply(e,t||[])).next())})};Object.defineProperty(t,"__esModule",{value:true});const n=s(9);function exec(e,t,s){return r(this,void 0,void 0,function*(){const r=n.argStringToArray(e);if(r.length===0){throw new Error(`Parameter 'commandLine' cannot be null or empty.`)}const i=r[0];t=r.slice(1).concat(t||[]);const o=new n.ToolRunner(i,t,s);return o.exec()})}t.exec=exec}});
//# sourceMappingURL=index.js.map