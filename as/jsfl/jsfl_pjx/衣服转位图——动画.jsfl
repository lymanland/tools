/*
	author; hekehui
*/
fl.outputPanel.clear();
fl.trace("*************************************************************************************");
fl.trace("此工具只操作可写的fla文件");
fl.trace("美术命名要求：(注意！编号长度为6位，不足6位在前面补0)");
fl.trace("	文件名:	a编号");
fl.trace("	Part：	a编号0(前), a编号1(后)...，找不到Part拒绝折腾，旧文件就有点悲剧了...得折腾啊！");
fl.trace("   		对于旧文件会读取ClothesPartsDatas.as文件");
fl.trace("	其他：	参考原有衣服规范");
fl.trace("*************************************************************************************");
fl.trace("");

var doc;
var lib;

var regFlagName = "dev/RegFlag";
var scriptURL = fl.scriptURI;
var index = scriptURL.indexOf("/tools/");
var folderURL = scriptURL.substring(0, index) + "/assets/skin";
fl.trace("folderURL:" + folderURL);


var pngURL = folderURL + "/png";
FLfile.createFolder(pngURL);

index = scriptURL.indexOf("/tools/");
var partDatasURL = scriptURL.substring(0, index) + "/as/materialdata/mmo/materialdata/ClothesPartsDatas.as";
var partDatas = FLfile.read(partDatasURL);

var errorFiles = [];
main();

function main(){
	fl.trace("目录： " + folderURL);
	var fileList1 = FLfile.listFolder(folderURL, "files");
	var totalFile = 0;
	for (var fileIndex = 0; fileIndex < fileList1.length; fileIndex++)
	{
		var fileURL = folderURL + "/" + fileList1[fileIndex];
		var extension = fileURL.substring(fileURL.lastIndexOf(".") + 1);
		if(extension == "fla"){
			var attr = FLfile.getAttributes(fileURL);
			//fl.trace("——");			
			if (attr && (attr.indexOf("R") != -1)) { 
				//fl.trace("只读文件:" + fileURL + " ...");
			}else{
				convertFile(fileURL);
				totalFile ++;
			}
		}
	}
	
	fl.trace(totalFile + " 处理完成 ");
	fl.trace(errorFiles.length + " 处理错误" + errorFiles); 
}

function convertFile(fileURL){
	var no = fileURL.substring(fileURL.lastIndexOf("/") + 1, fileURL.lastIndexOf("."));	
	fl.trace("文件编号:" + no + "\t" + fileURL);
	
	
	fl.openDocument(fileURL);
	doc = fl.getDocumentDOM();
	lib = doc.library;
	
	lib.newFolder("source")	
	lib.newFolder("png");	
	lib.newFolder("dev");
	lib.newFolder("art");	
	
	createRegFlag();
	var index = 0;
	while(true){
		if(!checkPart(no, index)){
			if(index == 0){
				errorFiles[errorFiles.length] = no;
			}
			break;
		}
		index ++;
	}
	
	
	doc.width = 960;
	doc.height = 560;
	
	lib.deleteItem(regFlagName);
	doc.saveAndCompact();		
	doc.publish();
	doc.close();
}

function createRegFlag(){
	if(lib.itemExists(regFlagName)){ 
		// 在根下找到美术元件
		lib.deleteItem(regFlagName);
	}
	lib.addNewItem("movie clip", regFlagName);
	lib.editItem(regFlagName)
	doc.addNewRectangle({left:0, top:0, right:10, bottom:10}, 0, false, true);
	doc.selectAll();
	doc.setFillColor('#ffffff00');
	doc.exitEditMode();	
}

function checkPart(no, partIndex){
	var sPartName = no + partIndex;
	var clsName = sPartName + "_C";
	if(lib.itemExists(sPartName)){ 
		// 在根下找到美术元件
		lib.moveToFolder("source", sPartName, true);
	}
	
	if(lib.itemExists("source/" + sPartName)){ 
		// 在source下找到美术元件
		fl.trace("find source");
	}else{
		// 旧文件会找到原有的导出类，后面延用旧文件内的导出类
		clsName = findClothesPart(no, partIndex, sPartName)
		if(clsName == null){
			return false;
		}
	}
	
	lib.selectItem("source/" + sPartName);
	clearExport();			
	convertPart(partIndex, sPartName, clsName);	
	
	// 将根目标下元件全部转到art目标
	for(var index = 0; index < lib.items.length; index ++){	
		var item = lib.items[index];
		if(!(item.name.substring(0,6) == "source" || item.name.substring(0,3) == "dev" 
			|| item.name.substring(0,3) == "art" || item.name.substring(0,3) == "png")){
			lib.moveToFolder("art", item.name);
		}	
	}
	
	return true;	
}

function clearExport(){
	if(lib.getItemProperty("linkageExportForAS")){
		lib.setItemProperty("linkageClassName", "");								
		lib.setItemProperty("linkageExportForAS", false);
	}
}

function findClothesPart(no, partIndex, sPartName){
	var datas = getPartDatas(no);
	
	fl.trace("datas:" + datas);	
	
	var partKey = "ClothesParts(\"";
	var index = 0;
	for(var pIndex = 0; pIndex <= partIndex; pIndex ++){
		if(pIndex > 0){
			datas = datas.substring(index + partKey.length);
		}
		index = datas.indexOf(partKey);
		if(index == -1){
			fl.trace("part " + partIndex + " can not find for " + no);
			return null;
		}		
	}
	var endIndex = datas.indexOf("\"", index + partKey.length);
	var partClassName = datas.substring(index + partKey.length, endIndex) + "_C";
	fl.trace("part " + partIndex + " ClassName:" + partClassName)
	for(var index = 0; index < lib.items.length; index ++){
		var item = lib.items[index];
		lib.selectItem(item.name);
		var isExport = lib.getItemProperty("linkageExportForAS");
		//fl.trace("item name" + item.name);
		if(isExport){
			var clsName = lib.getItemProperty("linkageClassName");
			if(clsName == partClassName){
				lib.moveToFolder("source");
				lib.renameItem(sPartName);
			}
		}
	}
	
	return partClassName;
}

function getPartDatas(no){
	var findKey = "\"" + no + "\"";
	var endIndex = partDatas.lastIndexOf(findKey) ;
	var datas = partDatas.substring(0, endIndex + findKey.length);
	var startIndex = datas.lastIndexOf("[[new ClothesParts");
	var datas = datas.substring(startIndex);
	
	return datas;
}

function convertPart(partIndex, sPartName, clsName){
	fl.trace("	convertPart" + partIndex + ":" + sPartName + " clsName:" + clsName);	
	
	var partFolder = pngURL + "/" + sPartName;
	FLfile.createFolder(partFolder);
	
	var itemRegPoint = exportPNG(partIndex, sPartName, partFolder);
	importPNG(partIndex, sPartName, clsName, partFolder, itemRegPoint);
}

function exportPNG(partIndex, sPartName, partFolder)
{	
	var sourceNamePath = "source/" + sPartName;	
	lib.editItem(sourceNamePath);
	var items = doc.getTimeline().layers[0].frames[0].elements;
	var itemRegPoint = [];
	for(var index = 0; index < items.length; index ++){
		doc.selectNone()

		var item = items[index];
		item.selected = true;
		
		doc.enterEditMode("inPlace")
		doc.selectAll();
		var rect = doc.getSelectionRect();
		
		var outputStr = "left: " + rect.left + " top: " + rect.top + " right: " + rect.right + " bottom: " + rect.bottom; 
		//fl.trace(outputStr);
		lib.selectItem(regFlagName, true, true);
		lib.addItemToDocument({x:0, y:0});
		var point = itemRegPoint[index];
		doc.selection[0].name = "regFlag";
		doc.selection[0].x = Math.ceil((rect.left - 4) / 2) * 2;
		doc.selection[0].y = Math.ceil((rect.top - 4) / 2)  * 2;		
		
		doc.selectAll();
		rect = doc.getSelectionRect();		
		var outputStr = "left: " + rect.left + " top: " + rect.top + " right: " + rect.right + " bottom: " + rect.bottom; 
		//fl.trace(outputStr);
		
		var point = {x:rect.left, y:rect.top};		
		itemRegPoint[index] = point;		
		
		doc.exitEditMode();		
		
		var tmpSymbolName = "TempSymbol" + partIndex + "_" + index;
		if(lib.itemExists(tmpSymbolName)){
			lib.deleteItem(tmpSymbolName)
		}		
		doc.convertToSymbol("graphic", tmpSymbolName, "top left");		
		
		//fl.trace(index + "itemRegPoint x:" + point.x + " y:" + point.y);
	}
	
	doc.exitEditMode();	
	for(var index = 0; index < items.length; index ++){
		var tmpSymbolName = "TempSymbol" + partIndex + "_" + index;
		lib.selectItem(tmpSymbolName, true, true);
		
		lib.addItemToDocument({x:0, y:0});
		var item = doc.selection[0];
		item.x = 0;
		item.y = 0;
		
		doc.width =  Math.ceil(item.width) + 2 ;
		doc.height = Math.ceil(item.height) + 2;
		
		var fileURL = partFolder + "/" + tmpSymbolName + ".png";		
		doc.exportPNG(fileURL, true);
		
		doc.enterEditMode("inPlace")
		doc.selectAll()
		doc.enterEditMode("inPlace")
		doc.selectAll()
		
		var firstItem = doc.selection[0];
		doc.selectNone()
		firstItem.selected = true;
		doc.deleteSelection();
		
		doc.exitEditMode();		
		doc.exitEditMode();		
				
		doc.selectAll();
		doc.deleteSelection();
	}
		
	return itemRegPoint;
}

function importPNG(partIndex, sPartName, clsName, partFolder, itemRegPoint){
	for(var index = 0; index < itemRegPoint.length; index ++){
		var tmpSymbolName = "TempSymbol" + partIndex + "_" + index;		
		var fileName = tmpSymbolName + ".png";
		var fileURL = partFolder + "/" + fileName;				
		var pngName = "png/" + fileName;
		if(lib.itemExists(pngName)){
			lib.deleteItem(pngName)
		}		
		document.importFile(fileURL, true);
		lib.selectItem(fileName);
		lib.moveToFolder("png");
		
		lib.setItemProperty('linkageExportForAS', true);
		lib.setItemProperty('linkageExportInFirstFrame', true);
		lib.setItemProperty('linkageClassName', clsName + "_" + partIndex + "_" + index);				
		
		var viewPng = "png/ViewPng" + partIndex + "_" + index;
		if(lib.itemExists(viewPng)){
			lib.deleteItem(viewPng)
		}
		lib.addNewItem("movie clip", viewPng);
		lib.editItem(viewPng);
		lib.addItemToDocument({x:0, y:0}, "png/" + fileName);
		var item = doc.selection[0];		
		var regPoint = itemRegPoint[index];
		regPoint.x = getNumber(regPoint.x);
		regPoint.y = getNumber(regPoint.y);		
		item.x = regPoint.x;
		item.y = regPoint.y;
		
		fl.trace("reg point:" + regPoint.x + "," + regPoint.y);
	}	
	
	var devNamePath = "dev/" + sPartName + "_C";
	if(!lib.itemExists(devNamePath)){
		lib.addNewItem("movie clip", devNamePath);
		lib.setItemProperty('linkageExportForAS', true);
		lib.setItemProperty('linkageExportInFirstFrame', true);
		lib.setItemProperty('linkageClassName', clsName);		
	}else{
		lib.editItem(devNamePath);
		doc.selectAll();
		if(doc.selection.length > 0){
			doc.deleteSelection();
		}
	}
	
	var sourceNamePath = "source/" + sPartName;	
	lib.editItem(sourceNamePath);
	doc.selectAll();	
	doc.breakApart();
	doc.clipCopy();
	
	lib.editItem(devNamePath);
	doc.clipPaste(true);
	
	var items = doc.getTimeline().layers[0].frames[0].elements;
	for(var index = 0; index < items.length; index ++){
		doc.selectNone()
		var item = items[index];
		item.selected = true;
		//fl.trace("x" + item.matrix.a);
		if(item.matrix.a == -1){
			doc.scaleSelection(-1, 1);
		}
		
		var viewPng = "png/ViewPng" + partIndex + "_" + index;
		doc.swapElement(viewPng);
		
		var tmpSymbolName = "TempSymbol" + partIndex + "_" + index;
		lib.deleteItem(tmpSymbolName);
	}
}

function getNumber(number){
	return Math.round(number * 100) / 100.0;
}

function tobreak(){
	var ss;
	ss.test1();
}