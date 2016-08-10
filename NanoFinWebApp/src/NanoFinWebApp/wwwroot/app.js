var app=angular.module("myApp",["ngRoute"]);app.config(function($routeProvider,$locationProvider){$routeProvider.when("/",{redirectTo:function(){return"/home"}}).when("/home",{title:"Insurance Manager",templateUrl:"/views/components/home/home.html",controller:"homePageController"}).when("/ProductManagement",{title:"Insurance Manager",templateUrl:"/views/components/home/productManagement.html",controller:"productManagementPageController"}).when("/Products",{title:"Insurance Manager",templateUrl:"/views/components/home/products.html",controller:"productsPageController"}).when("/addProduct",{title:"Insurance Manager",templateUrl:"/views/components/home/AddInsuranceProduct.html",controller:"AddProductPageController"}).when("/ProcessPurchases",{title:" home",templateUrl:"/views/components/home/viewiunprocessedapplications.html",controller:"insuranceApplicationsPageController"}).otherwise({templateUrl:"/views/components/home/home.html",controller:"homePageController"}),$locationProvider.html5Mode(!0)}),app.controller("homePageController",["$scope",function($scope){}]),app.controller("aboutPageController",["$scope",function($scope){}]),app.controller("productManagementPageController",["$scope",function($scope){}]),app.controller("productsPageController",["$scope",function($scope){}]),app.controller("AddProductPageController",["$scope",function($scope){}]),app.controller("contactPageController",["$scope",function($scope){$scope.title="contact"}]),app.controller("insuranceApplicationsPageController",["$scope",function($scope){}]),app.run(["$rootScope","$route",function($rootScope,$route){$rootScope.$on("$routeChangeSuccess",function(){document.title=$route.current.title})}]);var app=angular.module("myApp");app.controller("addProductController",["$scope","$http",function($scope,$http){$scope.product={Product_ID:0,ProductProvider_ID:11,ProductType_ID:1,productName:"",productDescription:"",productPolicyDocPath:"path",isAvailableForPurchase:!0},$scope.InsuranceProduct={InsuranceProduct_ID:0,ProductProvider_ID:11,InsuranceType_ID:0,Product_ID:0,ipCoverAmount:0,ipUnitCost:0,ipUnitType:0,ipMinimunNoOfUnits:0,ipClaimInfoPath:"string"},$scope.submitProductChanges=function(){$scope.product.isAvailableForPurchase=document.getElementById("sltAvailable").value;var req={method:"POST",url:"http://nanofinapi.azurewebsites.net/api/insuranceManager/Postproduct",headers:{"Content-Type":"application/json; charset=UTF-8"},data:JSON.stringify($scope.product)};$http(req).then(function(responce){$scope.InsuranceProduct.Product_ID=responce.data.Product_ID})},$scope.submitInsuranceProductChanges=function(){$scope.InsuranceProduct.InsuranceType_ID=document.getElementById("sltInsuranceType").value,$scope.InsuranceProduct.ipUnitType=document.getElementById("sltInsuranceType").value;var req={method:"POST",url:"http://nanofinapi.azurewebsites.net/api/insuranceManager/Postinsuranceproduct",headers:{"Content-Type":"application/json; charset=UTF-8"},data:JSON.stringify($scope.InsuranceProduct)};$http(req).then(function(responce){$scope.InsuranceProduct.Product_ID=262})}}]),angular.module("myApp").controller("dashboard",["$scope","$http",function($scope,$http){angular.element(document).ready(function(){});var errorCallBack=function(response){$scope.insuranceProductList=response.data},successCallBack=function(response){$scope.insuranceProductList=response.data;var mapMarkers=[];mapMarkers.push({latLng:[43.73,7.41],name:"Monaco"}),mapMarkers.push({latLng:[-.52,166.93],name:"Nauru"}),mapMarkers.push({latLng:[-8.51,179.21],name:"Tuvalu"}),mapMarkers.push({latLng:[43.93,12.46],name:"San Marino"}),mapMarkers.push({latLng:[47.14,9.52],name:"Liechtenstein"}),mapMarkers.push({latLng:[7.11,171.06],name:"Marshall Islands"}),mapMarkers.push({latLng:[17.3,-62.73],name:"Saint Kitts and Nevis"}),mapMarkers.push({latLng:[3.2,73.22],name:"Maldives"}),mapMarkers.push({latLng:[35.88,14.5],name:"Malta"}),mapMarkers.push({latLng:[12.05,-61.75],name:"Grenada"}),mapMarkers.push({latLng:[13.16,-61.23],name:"Saint Vincent and the Grenadines"}),mapMarkers.push({latLng:[13.16,-59.55],name:"Barbados"}),mapMarkers.push({latLng:[17.11,-61.85],name:"Antigua and Barbuda"}),mapMarkers.push({latLng:[-4.61,55.45],name:"Seychelles"}),mapMarkers.push({latLng:[42.5,1.51],name:"Andorra"}),mapMarkers.push({latLng:[14.01,-60.98],name:"Saint Lucia"}),mapMarkers.push({latLng:[6.91,158.18],name:"Federated States of Micronesia"}),mapMarkers.push({latLng:[1.3,103.8],name:"Singapore"}),mapMarkers.push({latLng:[1.46,173.03],name:"Kiribati"}),mapMarkers.push({latLng:[-21.13,-175.2],name:"Tonga"}),mapMarkers.push({latLng:[15.3,-61.38],name:"Dominica"}),mapMarkers.push({latLng:[-20.2,57.5],name:"Mauritius"}),mapMarkers.push({latLng:[26.02,50.55],name:"Bahrain"}),mapMarkers.push({latLng:[.33,6.73],name:"São Tomé and Príncipe"}),alert(response.data[0].address),$("#world-map-markers").vectorMap({map:"world_mill_en",normalizeFunction:"polynomial",hoverOpacity:.7,hoverColor:!1,backgroundColor:"transparent",regionStyle:{initial:{fill:"rgba(210, 214, 222, 1)","fill-opacity":1,stroke:"none","stroke-width":0,"stroke-opacity":1},hover:{"fill-opacity":.7,cursor:"pointer"},selected:{fill:"yellow"},selectedHover:{}},markerStyle:{initial:{fill:"#00a65a",stroke:"#111"}},markers:mapMarkers})};$http({method:"GET",url:"http://nanofinapi.azurewebsites.net/api/Reports/getBestReseller"}).then(successCallBack,errorCallBack)}]),angular.module("myApp").controller("insuranceProd",["$scope","$http",function($scope,$http){var errorCallBack=function(response){$scope.insuranceProductList=response.data},successCallBack=function(response){$scope.insuranceProductList=response.data};$http({method:"GET",url:"http://nanofinapi.azurewebsites.net/api/insuranceManager/Getinsuranceproducts?ProductProviderID=11"}).then(successCallBack,errorCallBack)}]),angular.module("myApp").controller("processApplications",["$scope","$http","$compile",function($scope,$http,$compile){function addRowHandlers(){var table=document.getElementById("tblApplications"),rows=table.getElementsByTagName("tr");for(i=1;i<rows.length-1;i++){var currentRow=table.rows[i],createClickHandler=function(row){return function(){var cell=row.getElementsByTagName("td")[0],id=cell.innerHTML;$scope.viewModal(id)}};currentRow.onclick=createClickHandler(currentRow)}}function findID(insuranceProductID){for(var r=0;r<unprocessedList.length;r++)if(unprocessedList[r].activeProductID==insuranceProductID)return id=insuranceProductID,unprocessedList[r]}var table,unprocessedList,lastPolicyDOc,id;angular.element(document).ready(function(){table=$("#tblApplications").DataTable({paging:!0,lengthChange:!1,searching:!0,ordering:!0,info:!0,autoWidth:!1,columns:[{data:"activeProductID"},{data:"customerIDNo"},{data:"customerName"},{data:"address"},{data:"InsurnceName"},{data:"startdate"}]})});var errorCallBack=function(response){$scope.uprocessedApplications=response.data},successCallBack=function(response,storage){unprocessedList=response.data.unprocessed,lastPolicyDOc=response.data.lastestPolicyNo,table.rows.add(unprocessedList),table.draw(),alert("data"),addRowHandlers()};$http({method:"GET",url:"http://nanofinwebapi2.azurewebsites.net/api/insuranceManager/getUnprocessedApplications?ProductProviderID=11"}).then(successCallBack,errorCallBack),$scope.viewModal=function(index){if(null!==index){var unprocessedApplication=findID(index);$scope.selectedApplication=unprocessedApplication;var html="";html+="<div class='modal fade' id='myModal' tabindex='-1' role='dialog' aria-labelledby='myModalLabel'>",html+="<div class='modal-dialog' role='document'>",html+="<div class='modal-content'>",html+="<div class='modal-header'>",html+="<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>",html+="<h4 class='modal-title' id='myModalLabel'>"+unprocessedApplication.customerName+"'s Insurance Application </h4>",html+="</div>",html+="<div class='modal-body'>",html+="<div class='row'> <div class='col-sm-5 col-sm-push-6'>    <p style='text-align: right'><strong>Lastest Policy#:"+lastPolicyDOc+" </strong<></p> </div></div>",html+="<div class='row'>",html+="<div class='form-group'>",html+="<label for='txtIDno' class='col-sm-3 control-label'>ID</label>",html+="<div class='col-sm-8'>",html+="<input type='text' class='form-control' value='"+unprocessedApplication.customerIDNo+"' disabled>",html+="</div>",html+="</div>",html+="</div>",html+="<div class='row'>",html+="<div class='form-group'>",html+="<br />",html+="<label for='txtAddress' class='col-sm-3 control-label'>Address</label>",html+="<div class='col-sm-8'>",html+="<input type='text' class='form-control' id='txtAddress' value='"+unprocessedApplication.address+"' disabled>",html+="</div>",html+="<br />",html+="</div>",html+="</div>",html+="<div class='row'>",html+="<div class='form-group'>",html+="<br />",html+="<label for='txtProductPurchase' class='col-sm-3 control-label'>Product Purchased</label>",html+="<div class='col-sm-8'>",html+="<input type='text' class='form-control' id='txtProductPurchase' value='"+unprocessedApplication.InsurnceName+"' disabled>",html+="</div>",html+="</div>",html+="</div>",html+="<div class='row'>",html+="<div class='form-group'>",html+="<br />",html+="<label for='txtStartDate' class='col-sm-3 control-label'>Product Purchased</label>",html+="<div class='col-sm-8'>",html+="<input type='text' class='form-control' id='txtStartDate' value='"+unprocessedApplication.startdate+"' disabled>",html+="</div>",html+="</div>",html+="</div>",html+="<div class='row'>",html+="<br />",html+="<div id='frmPolicyDoc' class='form-group'>",html+="<label for='txtPolicyNo' class='col-sm-3 control-label'>Assign Policy No</label>",html+="<div class='col-sm-8'>",html+="<input type='text' class='form-control' id='txtPolicyNo'>",html+="<div id='txtError'></div>",html+="</div>",html+="</div>",html+="</div>",html+="</div>",html+="<div class='modal-footer'>",html+="<div class='row'>",html+="<div class='col-sm-4 '>",html+="<button type='button' class='btn btn-danger ' data-dismiss='modal'>Decline Application</button>",html+="</div>",html+="<div class='col-sm-4 col-sm-push-4'>",html+="<button type='button' id='btnModalApprove' class='btn btn-success'>Approve Application</button>",html+="</div>",html+="</div>",html+="</div>",html+="</div>",html+="</div>",html+="</div>",$("#processApplicationModal").html(html),$("#myModal").modal(),document.getElementById("txtPolicyNo").required=!0;var invalidInput=function(errormessage){document.getElementById("frmPolicyDoc").className=" form-group has-error",document.getElementById("txtError").innerHTML=" <span class='help-block'>"+errormessage+"</span>"},modalButton=document.getElementById("btnModalApprove");modalButton.onclick=function(){var newPolicyNo=document.getElementById("txtPolicyNo").value;return""===newPolicyNo?void invalidInput("please enter a policy number"):void $http({method:"GET",url:"http://nanofinwebapi2.azurewebsites.net/api/insuranceManager/isPolicyNumberUnique?policyNo="+newPolicyNo}).then(function(responce){if(0==responce.data)invalidInput("The policy number entered already exist");else{var processApp={providerID:11,activeproductID:id,policyNo:newPolicyNo.toString()},req={method:"POST",url:"http://nanofinwebapi2.azurewebsites.net/api/insuranceManager/ProcessInsuranceProduct",headers:{"Content-Type":"application/json; charset=UTF-8"},data:JSON.stringify(processApp)};$http(req).then(function(responce){Boolean.valueOf(responce.data)===!0&&alert("happy!!!"),$("#myModal").modal("hide")})}})}}}}]),angular.module("myApp").controller("productManagement",["$scope","$http",function($scope,$http){var ID,insuranceProdID,VID=location.search.split("vid=")[1],PerrorCallBack=function(response){$scope.product=response.data},PsuccessCallBack=function(response){$scope.product=response.data,document.getElementById("sltAvailable").value=$scope.product.isAvailableForPurchase,$scope.pageHeader=$scope.product.productName,ID=$scope.product.Product_ID};$http({method:"GET",url:"http://nanofinapi.azurewebsites.net/api/insuranceManager/Getproduct/"+VID}).then(PsuccessCallBack,PerrorCallBack);var IPerrorCallBack=function(response){$scope.InsuranceProduct=response.data},IPsuccessCallBack=function(response){$scope.InsuranceProduct=response.data,insuranceProdID=$scope.InsuranceProduct.InsuranceProduct_ID,document.getElementById("sltInsuranceType").value=$scope.InsuranceProduct.InsuranceType_ID,document.getElementById("sltInsuranceType").value=$scope.InsuranceProduct.InsuranceType_ID};$http({method:"GET",url:"http://nanofinapi.azurewebsites.net/api/insuranceManager/Getinsuranceproduct?ProductProviderID=11&InsuranceProduct_ID=91"}).then(IPsuccessCallBack,IPerrorCallBack),$scope.submitProductChanges=function(){var xhr=new XMLHttpRequest;xhr.open("PUT","http://nanofinapi.azurewebsites.net/api/insuranceManager/Putproduct/"+ID,!0),xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8"),xhr.send(JSON.stringify($scope.product)),xhr.onloadend=function(){}},$scope.submitInsuranceProductChanges=function(){var xhr=new XMLHttpRequest;xhr.open("PUT","http://nanofinapi.azurewebsites.net/api/insuranceManager/Putinsuranceproduct?InsuranceProduct_ID="+insuranceProdID,!0),xhr.setRequestHeader("Content-Type","application/json; charset=UTF-8"),xhr.send(JSON.stringify($scope.InsuranceProduct)),xhr.onloadend=function(){}}}]),angular.module("myApp").controller("customerCtrl",["$scope","$http","$log",function($scope,$http,$log){$http({method:"GET",url:"http://nanofinapi.azurewebsites.net/api/TestManager/Getinsurancetype"}).then(function(response){$scope.insuranceTypes=response.data},function(){$log.info("ERROR:"+reason)})}]),angular.module("myApp").controller("insuranceProd",["$scope","$http",function($scope,$http){var errorCallBack=function(response){$scope.insuranceProductList=response.data},successCallBack=function(response){$scope.insuranceProductList=response.data};$http({method:"GET",url:"http://nanofinapi.azurewebsites.net/api/insuranceManager/Getinsuranceproducts?ProductProviderID=11"}).then(successCallBack,errorCallBack)}]),angular.module("myApp").controller("loginCtrl",["$scope","$http",function($scope,$http){$scope.login=function(){alert("I am an alert box!")}}]),angular.module("myApp").controller("resellerCtrl",["$scope","$http","$log",function($scope,$http,$log){var errorCallBack=function(response){$log.info("ERROR:"+reason)},successCallBack=function(response){$log.info("SUCCESS:"+reason)};$scope.buyBulk=function(amount,resellerID){$http({method:"POST",url:"http://localhost:10812/api/WalletHandler/buyBulkVoucher?userID=33&resellerID=1&BulkVoucherAmount="+amount+"&transactionType_ID=1"}).then(successCallBack,errorCallBack)},$scope.sendBulkVoucher=function(amount,resellerUserID,recipienDetails){$http({method:"POST",url:"http://localhost:10812/api/WalletHandler/sendBulkVoucher?resellerUserID="+resellerUserID+"&recipientDetails="+recipienDetails+"&transferAmount="+amount}).then(successCallBack,errorCallBack)}}]),function(){"use strict";function FastClick(layer,options){function bind(method,context){return function(){return method.apply(context,arguments)}}var oldOnClick;if(options=options||{},this.trackingClick=!1,this.trackingClickStart=0,this.targetElement=null,this.touchStartX=0,this.touchStartY=0,this.lastTouchIdentifier=0,this.touchBoundary=options.touchBoundary||10,this.layer=layer,this.tapDelay=options.tapDelay||200,this.tapTimeout=options.tapTimeout||700,!FastClick.notNeeded(layer)){for(var methods=["onMouse","onClick","onTouchStart","onTouchMove","onTouchEnd","onTouchCancel"],context=this,i=0,l=methods.length;i<l;i++)context[methods[i]]=bind(context[methods[i]],context);deviceIsAndroid&&(layer.addEventListener("mouseover",this.onMouse,!0),layer.addEventListener("mousedown",this.onMouse,!0),layer.addEventListener("mouseup",this.onMouse,!0)),layer.addEventListener("click",this.onClick,!0),layer.addEventListener("touchstart",this.onTouchStart,!1),layer.addEventListener("touchmove",this.onTouchMove,!1),layer.addEventListener("touchend",this.onTouchEnd,!1),layer.addEventListener("touchcancel",this.onTouchCancel,!1),Event.prototype.stopImmediatePropagation||(layer.removeEventListener=function(type,callback,capture){var rmv=Node.prototype.removeEventListener;"click"===type?rmv.call(layer,type,callback.hijacked||callback,capture):rmv.call(layer,type,callback,capture)},layer.addEventListener=function(type,callback,capture){var adv=Node.prototype.addEventListener;"click"===type?adv.call(layer,type,callback.hijacked||(callback.hijacked=function(event){event.propagationStopped||callback(event)}),capture):adv.call(layer,type,callback,capture)}),"function"==typeof layer.onclick&&(oldOnClick=layer.onclick,layer.addEventListener("click",function(event){oldOnClick(event)},!1),layer.onclick=null)}}var deviceIsWindowsPhone=navigator.userAgent.indexOf("Windows Phone")>=0,deviceIsAndroid=navigator.userAgent.indexOf("Android")>0&&!deviceIsWindowsPhone,deviceIsIOS=/iP(ad|hone|od)/.test(navigator.userAgent)&&!deviceIsWindowsPhone,deviceIsIOS4=deviceIsIOS&&/OS 4_\d(_\d)?/.test(navigator.userAgent),deviceIsIOSWithBadTarget=deviceIsIOS&&/OS [6-7]_\d/.test(navigator.userAgent),deviceIsBlackBerry10=navigator.userAgent.indexOf("BB10")>0;FastClick.prototype.needsClick=function(target){switch(target.nodeName.toLowerCase()){case"button":case"select":case"textarea":if(target.disabled)return!0;break;case"input":if(deviceIsIOS&&"file"===target.type||target.disabled)return!0;break;case"label":case"iframe":case"video":return!0}return/\bneedsclick\b/.test(target.className)},FastClick.prototype.needsFocus=function(target){switch(target.nodeName.toLowerCase()){case"textarea":return!0;case"select":return!deviceIsAndroid;case"input":switch(target.type){case"button":case"checkbox":case"file":case"image":case"radio":case"submit":return!1}return!target.disabled&&!target.readOnly;default:return/\bneedsfocus\b/.test(target.className)}},FastClick.prototype.sendClick=function(targetElement,event){var clickEvent,touch;document.activeElement&&document.activeElement!==targetElement&&document.activeElement.blur(),touch=event.changedTouches[0],clickEvent=document.createEvent("MouseEvents"),clickEvent.initMouseEvent(this.determineEventType(targetElement),!0,!0,window,1,touch.screenX,touch.screenY,touch.clientX,touch.clientY,!1,!1,!1,!1,0,null),clickEvent.forwardedTouchEvent=!0,targetElement.dispatchEvent(clickEvent)},FastClick.prototype.determineEventType=function(targetElement){return deviceIsAndroid&&"select"===targetElement.tagName.toLowerCase()?"mousedown":"click"},FastClick.prototype.focus=function(targetElement){var length;deviceIsIOS&&targetElement.setSelectionRange&&0!==targetElement.type.indexOf("date")&&"time"!==targetElement.type&&"month"!==targetElement.type?(length=targetElement.value.length,targetElement.setSelectionRange(length,length)):targetElement.focus()},FastClick.prototype.updateScrollParent=function(targetElement){var scrollParent,parentElement;if(scrollParent=targetElement.fastClickScrollParent,!scrollParent||!scrollParent.contains(targetElement)){parentElement=targetElement;do{if(parentElement.scrollHeight>parentElement.offsetHeight){scrollParent=parentElement,targetElement.fastClickScrollParent=parentElement;break}parentElement=parentElement.parentElement}while(parentElement)}scrollParent&&(scrollParent.fastClickLastScrollTop=scrollParent.scrollTop)},FastClick.prototype.getTargetElementFromEventTarget=function(eventTarget){return eventTarget.nodeType===Node.TEXT_NODE?eventTarget.parentNode:eventTarget},FastClick.prototype.onTouchStart=function(event){var targetElement,touch,selection;if(event.targetTouches.length>1)return!0;if(targetElement=this.getTargetElementFromEventTarget(event.target),touch=event.targetTouches[0],deviceIsIOS){if(selection=window.getSelection(),selection.rangeCount&&!selection.isCollapsed)return!0;if(!deviceIsIOS4){if(touch.identifier&&touch.identifier===this.lastTouchIdentifier)return event.preventDefault(),!1;this.lastTouchIdentifier=touch.identifier,this.updateScrollParent(targetElement)}}return this.trackingClick=!0,this.trackingClickStart=event.timeStamp,this.targetElement=targetElement,this.touchStartX=touch.pageX,this.touchStartY=touch.pageY,event.timeStamp-this.lastClickTime<this.tapDelay&&event.preventDefault(),!0},FastClick.prototype.touchHasMoved=function(event){var touch=event.changedTouches[0],boundary=this.touchBoundary;return Math.abs(touch.pageX-this.touchStartX)>boundary||Math.abs(touch.pageY-this.touchStartY)>boundary},FastClick.prototype.onTouchMove=function(event){return!this.trackingClick||((this.targetElement!==this.getTargetElementFromEventTarget(event.target)||this.touchHasMoved(event))&&(this.trackingClick=!1,this.targetElement=null),!0)},FastClick.prototype.findControl=function(labelElement){return void 0!==labelElement.control?labelElement.control:labelElement.htmlFor?document.getElementById(labelElement.htmlFor):labelElement.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")},FastClick.prototype.onTouchEnd=function(event){var forElement,trackingClickStart,targetTagName,scrollParent,touch,targetElement=this.targetElement;if(!this.trackingClick)return!0;if(event.timeStamp-this.lastClickTime<this.tapDelay)return this.cancelNextClick=!0,!0;if(event.timeStamp-this.trackingClickStart>this.tapTimeout)return!0;if(this.cancelNextClick=!1,this.lastClickTime=event.timeStamp,trackingClickStart=this.trackingClickStart,this.trackingClick=!1,this.trackingClickStart=0,deviceIsIOSWithBadTarget&&(touch=event.changedTouches[0],targetElement=document.elementFromPoint(touch.pageX-window.pageXOffset,touch.pageY-window.pageYOffset)||targetElement,targetElement.fastClickScrollParent=this.targetElement.fastClickScrollParent),targetTagName=targetElement.tagName.toLowerCase(),"label"===targetTagName){if(forElement=this.findControl(targetElement)){if(this.focus(targetElement),deviceIsAndroid)return!1;targetElement=forElement}}else if(this.needsFocus(targetElement))return event.timeStamp-trackingClickStart>100||deviceIsIOS&&window.top!==window&&"input"===targetTagName?(this.targetElement=null,!1):(this.focus(targetElement),this.sendClick(targetElement,event),deviceIsIOS&&"select"===targetTagName||(this.targetElement=null,event.preventDefault()),!1);return!(!deviceIsIOS||deviceIsIOS4||(scrollParent=targetElement.fastClickScrollParent,!scrollParent||scrollParent.fastClickLastScrollTop===scrollParent.scrollTop))||(this.needsClick(targetElement)||(event.preventDefault(),this.sendClick(targetElement,event)),!1)},FastClick.prototype.onTouchCancel=function(){this.trackingClick=!1,this.targetElement=null},FastClick.prototype.onMouse=function(event){return!this.targetElement||(!!event.forwardedTouchEvent||(!event.cancelable||(!(!this.needsClick(this.targetElement)||this.cancelNextClick)||(event.stopImmediatePropagation?event.stopImmediatePropagation():event.propagationStopped=!0,event.stopPropagation(),event.preventDefault(),!1))))},FastClick.prototype.onClick=function(event){var permitted;return this.trackingClick?(this.targetElement=null,this.trackingClick=!1,!0):"submit"===event.target.type&&0===event.detail||(permitted=this.onMouse(event),permitted||(this.targetElement=null),permitted)},FastClick.prototype.destroy=function(){var layer=this.layer;deviceIsAndroid&&(layer.removeEventListener("mouseover",this.onMouse,!0),layer.removeEventListener("mousedown",this.onMouse,!0),layer.removeEventListener("mouseup",this.onMouse,!0)),layer.removeEventListener("click",this.onClick,!0),layer.removeEventListener("touchstart",this.onTouchStart,!1),layer.removeEventListener("touchmove",this.onTouchMove,!1),layer.removeEventListener("touchend",this.onTouchEnd,!1),layer.removeEventListener("touchcancel",this.onTouchCancel,!1)},FastClick.notNeeded=function(layer){function getChromeVersion(){var raw=navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);return!!raw&&parseInt(raw[2],10)}var metaViewport,chromeVersion,blackberryVersion,firefoxVersion;if("undefined"==typeof window.ontouchstart)return!0;if(chromeVersion=getChromeVersion()){if(!deviceIsAndroid)return!0;if(metaViewport=document.querySelector("meta[name=viewport]")){if(metaViewport.content.indexOf("user-scalable=no")!==-1)return!0;if(chromeVersion>31&&document.documentElement.scrollWidth<=window.outerWidth)return!0}}if(deviceIsBlackBerry10&&(blackberryVersion=navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),blackberryVersion[1]>=10&&blackberryVersion[2]>=3&&(metaViewport=document.querySelector("meta[name=viewport]")))){if(metaViewport.content.indexOf("user-scalable=no")!==-1)return!0;if(document.documentElement.scrollWidth<=window.outerWidth)return!0}return"none"===layer.style.msTouchAction||"manipulation"===layer.style.touchAction||(firefoxVersion=20,!!(firefoxVersion>=27&&(metaViewport=document.querySelector("meta[name=viewport]"),metaViewport&&(metaViewport.content.indexOf("user-scalable=no")!==-1||document.documentElement.scrollWidth<=window.outerWidth)))||("none"===layer.style.touchAction||"manipulation"===layer.style.touchAction))},FastClick.attach=function(layer,options){return new FastClick(layer,options)},"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return FastClick}):"undefined"!=typeof module&&module.exports?(module.exports=FastClick.attach,module.exports.FastClick=FastClick):window.FastClick=FastClick}();