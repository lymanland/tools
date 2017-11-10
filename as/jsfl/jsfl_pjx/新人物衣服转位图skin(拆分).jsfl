/*
	author; hekehui
	editor: huangchubiao
*/
fl.outputPanel.clear();
fl.trace("*************************************************************************************");
fl.trace("此工具只操作可写的fla文件");
fl.trace("美术命名要求：");
fl.trace("	文件名:	挂载点a编号 (注意！编号长度为6位，不足6位在前面补0)");
fl.trace("	Part：	请对照skinPosList");
fl.trace("	其他：	参考衣服规范");
fl.trace("*************************************************************************************");
fl.trace("");

var doc;
var lib;

fl.trace(fl.scriptURI);
var regFlagName = "dev/RegFlag";
var folderURL = "file:///E|/vstsworkspace/projectx/source/assets/skin";
var pngURL = folderURL + "/png";
var partDatasURL = "file:///E|/vstsworkspace/projectx/source/as/materialdata/mmo/materialdata/ClothesPartsDatas.as";
var config = "";

var errorFiles = [];

var skinPosList = [];

var partConfig = "";

var errorLogs = [];
init();
main();
function init(){
	skinPosList[0] = {name:"骑宠（前）", value:"SkinPosInfo.QI_CHONG__QIAN"};
	skinPosList[1] = {name:"特效01", value:"SkinPosInfo.TE_XIAO_01"};
	skinPosList[2] = {name:"背部（前）", value:"SkinPosInfo.BEI_BU__QIAN"};
	skinPosList[3] = {name:"头发（前）", value:"SkinPosInfo.TOU_FA__QIAN"};
	skinPosList[4] = {name:"配饰（前）", value:"SkinPosInfo.PEI_SHI__QIAN"};	
	skinPosList[5] = {name:"左手饰品（前）", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_QIAN"};
	skinPosList[6] = {name:"衣服（袖子前）", value:"SkinPosInfo.YI_FU__XIU_ZI_QIAN"};
	skinPosList[7] = {name:"底色（手臂前）", value:"SkinPosInfo.DI_SE__SHOU_BI_QIAN"};
	skinPosList[8] = {name:"面部装饰", value:"SkinPosInfo.MIAN_BU_ZHUANG_SHI"};
	skinPosList[9] = {name:"底色（头部）", value:"SkinPosInfo.DI_SE__TOU_BU"};
	skinPosList[10] = {name:"左手饰品（后）", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_HOU"};
	skinPosList[11] = {name:"裙摆", value:"SkinPosInfo.QUN_BAI"};
	skinPosList[12] = {name:"靴子", value:"SkinPosInfo.XUE_ZI"};
	skinPosList[13] = {name:"衣服（躯干）", value:"SkinPosInfo.YI_FU__QU_GAN"};
	skinPosList[14] = {name:"鞋子", value:"SkinPosInfo.XIE_ZI"};
	skinPosList[15] = {name:"底色（躯干）", value:"SkinPosInfo.DI_SE__QU_GAN"};
	skinPosList[16] = {name:"手持物右", value:"SkinPosInfo.SHOU_CHI_WU_YUO"};
	skinPosList[17] = {name:"衣服袖子后", value:"SkinPosInfo.YI_FU__XIU_ZI_HOU"};
	skinPosList[18] = {name:"底色（手臂后）", value:"SkinPosInfo.DI_SE__SHOU_BI_HOU"};
	skinPosList[19] = {name:"配饰（后）", value:"SkinPosInfo.PEI_SHI__HOU"};	
	skinPosList[20] = {name:"头发（后）", value:"SkinPosInfo.TOU_FA__HOU"};
	skinPosList[21] = {name:"背部(后)", value:"SkinPosInfo.BEI_BU__HOU"};
	skinPosList[22] = {name:"特效02", value:"SkinPosInfo.TE_XIAO_02"};
	skinPosList[23] = {name:"骑宠（后）", value:"SkinPosInfo.QI_CHONG__HOU"};
	skinPosList[24] = {name:"阴影", value:"SkinPosInfo.YIN_YING"};
	
	partConfig = new Date() + "\r\nexport config:\r\n"
}
function main(){
	fl.trace("目录： " + folderURL);
	var fileList = FLfile.listFolder(folderURL, "files");
	var totalFile = 0;
	for (var fileIndex = 0; fileIndex < fileList.length; fileIndex++)
	{
		var fileURL = folderURL + "/" + fileList[fileIndex];
		var extension = fileURL.substring(fileURL.lastIndexOf(".") + 1);
		if(extension == "fla"){
			var attr = FLfile.getAttributes(fileURL);
			//fl.trace("——");			
			if (attr && (attr.indexOf("R") != -1)) { 
				//fl.trace("只读文件:" + fileURL + " ...");
			}else{
				convertFile(fileURL);
				totalFile ++;
				config += "<uri label=\"" + fileList[fileIndex]+ "\">" + folderURL + "/" + fileList[fileIndex]+ "</uri>\r";
			}
		}
	}
	
	fl.trace(totalFile + " 处理完成 ");
	fl.trace(errorFiles.length + " 处理错误" + errorFiles); 
	
	fl.trace(errorLogs.length + " 元件格式问题" +errorLogs);
	fl.trace("config:");
	fl.trace(partConfig);
	fl.trace("变更集：");
	fl.trace(config);

}

function convertFile(fileURL){
	var no = fileURL.substring(fileURL.lastIndexOf("/") + 1, fileURL.lastIndexOf("."));	
	var id = Number(no.substring(1));
	//fl.trace("文件编号:" + no + "\t" + fileURL);
	
	
	fl.openDocument(fileURL);
	doc = fl.getDocumentDOM();
	lib = doc.library;
	
	lib.newFolder("source")	
	lib.newFolder("png");	
	lib.newFolder("dev");
	lib.newFolder("art");	
	
	createRegFlag();
	
	if(partConfig != ""){
		partConfig += "\r";
	}
	var findCount = 0;
	partConfig += "				\"" + id + "\":\r					[[";
	var findCount = 0;
	while(1)
	{
		for(var skinPos = 0; skinPos < skinPosList.length; skinPos ++){
			if(checkPart(id, no, skinPos, findCount)){
				break;
			}
		}
		if(skinPos == skinPosList.length)
		{
			break;
		}
		findCount ++;
	}
	partConfig += "],\r\"" + no + "\",\"undefine\"]," +"\r";
	
	doc.width = 960;
	doc.height = 560;
	
	lib.deleteItem(regFlagName);
	moveToArt();
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
	doc.addNewRectangle({left:0, top:0, right:2, bottom:2}, 0, false, true);
	doc.selectAll();	
	doc.setFillColor('#ffffff00');
	doc.exitEditMode();	
}

function moveToArt(){
	// 将根目标下元件全部转到art目标
	for(var index = 0; index < lib.items.length; index ++){	
		var item = lib.items[index];
		if(!(item.name.substring(0,6) == "source" || item.name.substring(0,3) == "dev" 
			|| item.name.substring(0,3) == "art" || item.name.substring(0,3) == "png")){
			lib.moveToFolder("art", item.name);
		}	
	}	
}

function checkPart(id, no,skinPos,findCount){
	var sourceName = "source/" +  skinPosList[skinPos].name+no+findCount;
	var clsName = no + "" + findCount + "_C";
	var partNo = no + "" + findCount;
	if(!lib.itemExists(sourceName)){ 
		return false;
	}
	
	lib.selectItem(sourceName);
	clearExport();				
	convertPart(id, no,findCount,sourceName, clsName);	
	if(findCount > 0){
		partConfig += ",\r					  ";
	}
	partConfig += "new ClothesParts(\"" + partNo + "\", " + skinPosList[skinPos].value + ")";
	return true;	
}

function clearExport(){
	if(lib.getItemProperty("linkageExportForAS")){
		lib.setItemProperty("linkageClassName", "");								
		lib.setItemProperty("linkageExportForAS", false);
	}
}

function convertPart(id, no, skinPos, sourceName, clsName){
	//fl.trace("	convertPart" + ":" + sourceName + " clsName:" + clsName);	
	
	var partFolder = pngURL + "/" + no + "/part" + skinPos;
	FLfile.createFolder(partFolder);
	
	var itemRegPoint = exportPNG(skinPos, sourceName, partFolder);
	importPNG(skinPos, sourceName, clsName, partFolder, itemRegPoint);
	
	//FLfile.remove(partFolder);
}

function exportPNG(skinPos, sourceName, partFolder)
{	
	lib.editItem(sourceName);
	var items = doc.getTimeline().layers[0].frames[0].elements;
	var itemRegPoint = [];
	for(var index = 0; index < items.length; index ++){
		doc.selectNone();

		var item = items[index];
		item.selected = true;
		doc.enterEditMode("inPlace")
		doc.getTimeline().setLayerProperty('locked', false, 'all');
		doc.getTimeline().setLayerProperty('visible', true, 'all');
		doc.selectNone();
		var inSideItem = doc.getTimeline().layers[0].frames[0].elements;
		for(var idx2 = 0; idx2 < inSideItem.length; idx2++)
		{
			if(inSideItem[idx2].name == "regFlag")
			{
				doc.selection = [inSideItem[idx2]];
				doc.deleteSelection();
			}
		}
		doc.selectAll();
		var rect = doc.getSelectionRect();		
		var outputStr = "left: " + rect.left + " top: " + rect.top + " right: " + rect.right + " bottom: " + rect.bottom; 
		fl.trace("1.bound2:" + outputStr);
		
		lib.selectItem(regFlagName, true, true);
		lib.addItemToDocument({x:0, y:0});
		var point = itemRegPoint[index];
		doc.selection[0].name = "regFlag";
		// 没有内容时rect为0，直接用(0,0)
		if(rect == 0){
			doc.selection[0].x = 0;
			doc.selection[0].y = 0;
		}else{
			// 左上4像素，再以2的倍数为座标(可能为4或6)
			doc.selection[0].x = Math.ceil((rect.left - 4) / 2) * 2;
			doc.selection[0].y = Math.ceil((rect.top - 4) / 2)  * 2;		
		}
		doc.selectAll();
		rect = doc.getSelectionRect();		
		var outputStr = "left: " + rect.left + " top: " + rect.top + " right: " + rect.right + " bottom: " + rect.bottom; 
		fl.trace("2.bound2:" + outputStr);
		
		var point = {x:rect.left, y:rect.top};		
		itemRegPoint[index] = point;		
		
		doc.exitEditMode();		
		
		var tmpSymbolName = "TempSymbol" + skinPos + "_" + index;
		if(lib.itemExists(tmpSymbolName)){
			lib.deleteItem(tmpSymbolName)
		}		
		doc.convertToSymbol("graphic", tmpSymbolName, "top left");	
		fl.trace(index + " regpoint x:" + point.x + " y:" + point.y);
	}
	
	exitEditModeAndClear();
	for(var index = 0; index < items.length; index ++){
		var tmpSymbolName = "TempSymbol" + skinPos + "_" + index;
		lib.selectItem(tmpSymbolName, true, true);
		
		lib.addItemToDocument({x:0, y:0});
		var item = doc.selection[0];
		item.x = 0;
		item.y = 0;
		
		doc.width =  Math.ceil(item.width) + 2 ;
		doc.height = Math.ceil(item.height) + 2;
		
		var fileURL = partFolder + "/" + tmpSymbolName + ".png";		
		doc.exportPNG(fileURL, true);
		
		exitEditModeAndClear();
	}

	return itemRegPoint;
}

function exitEditModeAndClear(){
	doc.exitEditMode();
	doc.selectAll();
	if(doc.selection.length > 0){
		doc.deleteSelection();
	}
	doc.selectNone();
}

function importPNG(skinPos, sourceName, clsName, partFolder, itemRegPoint){
	for(var index = 0; index < itemRegPoint.length; index ++){
		var tmpSymbolName = "TempSymbol" + skinPos + "_" + index;		
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
		lib.setItemProperty('linkageClassName', clsName + "_" + index);				
		
		var viewPng = "png/ViewPng" + skinPos + "_" + index;
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
		
		//fl.trace("reg point:" + regPoint.x + "," + regPoint.y);
	}	
	
	var devNamePath = "dev/" + clsName;
	if(!lib.itemExists(devNamePath)){
		lib.addNewItem("movie clip", devNamePath);
		lib.setItemProperty('linkageExportForAS', true);
		lib.setItemProperty('linkageExportInFirstFrame', true);
		lib.setItemProperty('linkageClassName', clsName);		
	}else{
		lib.editItem(devNamePath);
		doc.getTimeline().setLayerProperty('locked', false, 'all');
		doc.selectAll();
		if(doc.selection.length > 0){
			doc.deleteSelection();
		}
	}
	
	lib.editItem(sourceName);
	doc.getTimeline().setLayerProperty('locked', false, 'all');
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
		/*
		a : Number 缩放或旋转图像时影响像素沿 x 轴定位的值。  
	    b : Number 旋转或倾斜图像时影响像素沿 y 轴定位的值。  
	    c : Number 旋转或倾斜图像时影响像素沿 x 轴定位的值。  
	    d : Number 缩放或旋转图像时影响像素沿 y 轴定位的值。 		
		*/
		/*var outputStr = "(a=" + item.matrix.a + ", b=" + item.matrix.b 
			+ ", c=" + item.matrix.c + ", d="+ item.matrix.d 
			+ ", tx=" + item.matrix.tx + ", ty=" + item.matrix.ty + ")";
		if(item.matrix.a != 1 || item.matrix.d != 1){
			errorLogs[errorLogs.length] = "\r" + sourceName + " " + index
				+ " [" + item.libraryItem.sourceLibraryName + "] 有缩放或旋转！" + outputStr;
		}
		if(item.matrix.b != 0 || item.matrix.c != 0){
			errorLogs[errorLogs.length] = "\r" + sourceName + " " + index
				+ " [" + item.libraryItem.sourceLibraryName + "] 有旋转或倾斜！" + outputStr;
		}
		*/
		var viewPng = "png/ViewPng" + skinPos + "_" + index;
		doc.swapElement(viewPng);
		
		var tmpSymbolName = "TempSymbol" + skinPos + "_" + index;
		lib.deleteItem(tmpSymbolName);
	}
}

function getNumber(number){
	return Math.round(number * 100) / 100.0;
}