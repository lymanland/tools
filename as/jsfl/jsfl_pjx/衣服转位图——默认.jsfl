/*
	author; hekehui
*/
fl.outputPanel.clear();
fl.trace("*************************************************************************************");
fl.trace("´Ë¹¤¾ßÖ»²Ù×÷¿ÉÐ´µÄflaÎÄ¼þ");
fl.trace("ÃÀÊõÃüÃûÒªÇó£º(×¢Òâ£¡±àºÅ³¤¶ÈÎª6Î»£¬²»×ã6Î»ÔÚÇ°Ãæ²¹0)");
fl.trace("	ÎÄ¼þÃû:	a±àºÅ");
fl.trace("	Part£º	a±àºÅ0(Ç°), a±àºÅ1(ºó)...£¬ÕÒ²»µ½Part¾Ü¾øÕÛÌÚ£¬¾ÉÎÄ¼þ¾ÍÓÐµã±¯¾çÁË...µÃÕÛÌÚ°¡£¡");
fl.trace("   		¶ÔÓÚ¾ÉÎÄ¼þ»á¶ÁÈ¡ClothesPartsDatas.asÎÄ¼þ");
fl.trace("	ÆäËû£º	²Î¿¼Ô­ÓÐÒÂ·þ¹æ·¶");
fl.trace("*************************************************************************************");
fl.trace("");

var doc;
var lib;

var scriptURL = fl.scriptURI;
var regFlagName = "dev/RegFlag";
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
	fl.trace("Ä¿Â¼£º " + folderURL);
	var fileList1 = FLfile.listFolder(folderURL, "files");
	var totalFile = 0;
	for (var fileIndex = 0; fileIndex < fileList1.length; fileIndex++)
	{
		var fileURL = folderURL + "/" + fileList1[fileIndex];
		var extension = fileURL.substring(fileURL.lastIndexOf(".") + 1);
		if(extension == "fla"){
			var attr = FLfile.getAttributes(fileURL);
			//fl.trace("¡ª¡ª");			
			if (attr && (attr.indexOf("R") != -1)) { 
				//fl.trace("Ö»¶ÁÎÄ¼þ:" + fileURL + " ...");
			}else{
				convertFile(fileURL);
				totalFile ++;
			}
		}
	}
	
	fl.trace(totalFile + " ´¦ÀíÍê³É ");
	fl.trace(errorFiles.length + " ´¦Àí´íÎó" + errorFiles); 
}

function convertFile(fileURL){
	var no = fileURL.substring(fileURL.lastIndexOf("/") + 1, fileURL.lastIndexOf("."));	
	fl.trace("ÎÄ¼þ±àºÅ:" + no + "\t" + fileURL);
	
	
	fl.openDocument(fileURL);
	doc = fl.getDocumentDOM();
	lib = doc.library;

	lib.newFolder("source")	
	lib.newFolder("png");	
	lib.newFolder("dev");
	lib.newFolder("art");	
	
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
	fl.trace("±¦Ê¯ÁË£¡");
	doc.save();		
	doc.publish();
	doc.close();	
}

function checkPart(no, partIndex){
	var sPartName = no + partIndex;
	var clsName = sPartName + "_C";
	if(lib.itemExists(sPartName)){ 
		// ÔÚ¸ùÏÂÕÒµ½ÃÀÊõÔª¼þ
		lib.moveToFolder("source", sPartName, true);
	}
	
	if(lib.itemExists("source/" + sPartName)){ 
		// ÔÚsourceÏÂÕÒµ½ÃÀÊõÔª¼þ
		fl.trace("find source");
	}else{
		// ¾ÉÎÄ¼þ»áÕÒµ½Ô­ÓÐµÄµ¼³öÀà£¬ºóÃæÑÓÓÃ¾ÉÎÄ¼þÄÚµÄµ¼³öÀà
		clsName = findClothesPart(no, partIndex, sPartName)
		if(clsName == null){
			return false;
		}
	}
	
	lib.selectItem("source/" + sPartName);
	clearExport();			
	convertPart(partIndex, sPartName, clsName);	
	
	// ½«¸ùÄ¿±êÏÂÔª¼þÈ«²¿×ªµ½artÄ¿±ê
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
	
	//fl.trace("datas:" + datas);	
	
	var partKey = "ClothesParts(\"";
	var index = 0;
	for(var pIndex = 0; pIndex <= partIndex; pIndex ++){
		if(pIndex > 0){
			datas = datas.substring(index + partKey.length);
		}
		index = datas.indexOf(partKey);
		if(index == -1){
			//fl.trace("part " + partIndex + " can not find for " + no);
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
	createRegFlag();
	var itemRegPoint = exportToPNG(partIndex, sPartName, partFolder);
	if(lib.itemExists(regFlagName)){ 
		// ÔÚ¸ùÏÂÕÒµ½ÃÀÊõÔª¼þ
		lib.deleteItem(regFlagName);
	}
	importPNG(partIndex, sPartName, clsName, partFolder, itemRegPoint);
}

function exportToPNG(partIndex, sPartName, partFolder)
{	
	var sourceNamePath = "source/" + sPartName;	
	lib.editItem(sourceNamePath);
	var items = doc.getTimeline().layers[0].frames[0].elements;
	var itemRegPoint = [];

	var preItem = null;
	var rowIndex = 0;
	var colIndex = -1;

	for(var index = 0; index < items.length; index ++){
		doc.selectNone()

		var item = items[index];
		item.selected = true;
		var point = {x:item.x, y:item.y};	
		fl.trace("[exportToPNG] preItem:" + preItem);	
		if(preItem != null && preItem.y != item.y){
			rowIndex = rowIndex + 1;
			colIndex = -1;
		}
		colIndex = colIndex + 1;
		preItem = item;
		var tmpSymbolName = "TempSymbol" + partIndex + "_" + rowIndex + "_" + colIndex;


		fl.trace("[exportToPNG] row:" + row + ", col:" + col + ", tmpSymbolName:" + tmpSymbolName + ", index:" + index);
		if(lib.itemExists(tmpSymbolName)){
			lib.deleteItem(tmpSymbolName)
		}
		var rect = doc.getSelectionRect();
		var regFlag;
		if(rect != 0){
			lib.selectItem(regFlagName, true, true);
			lib.addItemToDocument({x:0, y:0});
			// ×óÉÏ4ÏñËØ£¬ÔÙÒÔ2µÄ±¶ÊýÎª×ù±ê(¿ÉÄÜÎª4»ò6)
			doc.selection[0].x = Math.ceil((rect.left - 4) / 2) * 2;
			doc.selection[0].y = Math.ceil((rect.top - 4) / 2)  * 2;
			regFlag = doc.selection[0]
			doc.selection = [regFlag, item];
		}
		else
		{
			doc.selection = [item];
		}
		var newItem = doc.convertToSymbol("graphic", tmpSymbolName, "top left");		
		var container = doc.selection[0];

		point.x = container.x - getNumber(point.x) -1;
		point.y = container.y - getNumber(point.y) -1;
		itemRegPoint[index] = {"rowcol":""+rowIndex + "_" + colIndex, "point":point};
	}
	
	doc.exitEditMode();	
	for(var index = 0; index < items.length; index ++){
		var rowcol = itemRegPoint[index].rowcol;
		var row = rowcol.split("_")[0];
		var col = rowcol.split("_")[1];
		//var tmpSymbolName = "TempSymbol" + partIndex + "_" + index;
		var tmpSymbolName = "TempSymbol" + partIndex + "_" + row + "_" + col;
		lib.selectItem(tmpSymbolName, true, true);
		
		fl.trace("[exportToPNG -- exitEditMode.split] row:" + row + ", col:" + col + ", tmpSymbolName:" + tmpSymbolName + ", index:" + index);

		lib.addItemToDocument({x:0, y:0});
		var item = doc.selection[0];
		doc.moveSelectionBy({x:-item.x + 1, y:-item.y + 1})
		
		doc.width =  Math.ceil(item.width) + 2;
		doc.height = Math.ceil(item.height) + 2;
		var fileURL = partFolder + "/" + tmpSymbolName + ".png";		
		doc.exportPNG(fileURL, false, true);
		
		doc.selectAll();
		doc.deleteSelection();
	}
		
	return itemRegPoint;
}

function createRegFlag(){
	if(lib.itemExists(regFlagName)){ 
		// ÔÚ¸ùÏÂÕÒµ½ÃÀÊõÔª¼þ
		lib.deleteItem(regFlagName);
	}
	lib.addNewItem("movie clip", regFlagName);
	lib.editItem(regFlagName)
	doc.addNewRectangle({left:0, top:0, right:2, bottom:2}, 0, false, true);
	doc.selectAll();	
	doc.setFillColor('#ffffff00');
	doc.exitEditMode();	
}

function importPNG(partIndex, sPartName, clsName, partFolder, itemRegPoint){
	for(var index = 0; index < itemRegPoint.length; index ++){
		var rowcol = itemRegPoint[index].rowcol;
		var row = rowcol.split("_")[0];
		var col = rowcol.split("_")[1];

		fl.trace("row:" + row + ", col:" + col);
		var regPoint = itemRegPoint[index].point;


		var tmpSymbolName = "TempSymbol" + partIndex + "_" + row + "_" + col;	
		fl.trace("[importPNG] row:" + row + ", col:" + col + ", tmpSymbolName:" + tmpSymbolName);

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
		lib.setItemProperty('linkageClassName', clsName + "_" + partIndex + "_" + row + "_" + col);				
		
		var viewPng = "png/ViewPng" + partIndex + "_" + row + "_" + col;
		if(lib.itemExists(viewPng)){
			lib.deleteItem(viewPng)
		}
		lib.addNewItem("movie clip", viewPng);
		lib.editItem(viewPng);
		lib.addItemToDocument({x:0, y:0}, "png/" + fileName);
		var item = doc.selection[0];		
		doc.moveSelectionBy({x:-item.x, y:-item.y})
		//doc.moveSelectionBy(itemRegPoint[index]);
		doc.moveSelectionBy(regPoint);
		
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
		
		var rowcol = itemRegPoint[index].rowcol;
		var row = rowcol.split("_")[0];
		var col = rowcol.split("_")[1];

		var viewPng = "png/ViewPng" + partIndex + "_" + row + "_" + col;
		doc.swapElement(viewPng);
		
		var tmpSymbolName = "TempSymbol" + partIndex + "_" + row + "_" + col;
		lib.deleteItem(tmpSymbolName);
	}
}

function getNumber(number){
	return Math.round(number * 100) / 100.0;
}