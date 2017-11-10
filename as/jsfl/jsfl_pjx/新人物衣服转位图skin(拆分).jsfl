/*
	author; hekehui
	editor: huangchubiao
*/
fl.outputPanel.clear();
fl.trace("*************************************************************************************");
fl.trace("�˹���ֻ������д��fla�ļ�");
fl.trace("��������Ҫ��");
fl.trace("	�ļ���:	���ص�a��� (ע�⣡��ų���Ϊ6λ������6λ��ǰ�油0)");
fl.trace("	Part��	�����skinPosList");
fl.trace("	������	�ο��·��淶");
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
	skinPosList[0] = {name:"��裨ǰ��", value:"SkinPosInfo.QI_CHONG__QIAN"};
	skinPosList[1] = {name:"��Ч01", value:"SkinPosInfo.TE_XIAO_01"};
	skinPosList[2] = {name:"������ǰ��", value:"SkinPosInfo.BEI_BU__QIAN"};
	skinPosList[3] = {name:"ͷ����ǰ��", value:"SkinPosInfo.TOU_FA__QIAN"};
	skinPosList[4] = {name:"���Σ�ǰ��", value:"SkinPosInfo.PEI_SHI__QIAN"};	
	skinPosList[5] = {name:"������Ʒ��ǰ��", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_QIAN"};
	skinPosList[6] = {name:"�·�������ǰ��", value:"SkinPosInfo.YI_FU__XIU_ZI_QIAN"};
	skinPosList[7] = {name:"��ɫ���ֱ�ǰ��", value:"SkinPosInfo.DI_SE__SHOU_BI_QIAN"};
	skinPosList[8] = {name:"�沿װ��", value:"SkinPosInfo.MIAN_BU_ZHUANG_SHI"};
	skinPosList[9] = {name:"��ɫ��ͷ����", value:"SkinPosInfo.DI_SE__TOU_BU"};
	skinPosList[10] = {name:"������Ʒ����", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_HOU"};
	skinPosList[11] = {name:"ȹ��", value:"SkinPosInfo.QUN_BAI"};
	skinPosList[12] = {name:"ѥ��", value:"SkinPosInfo.XUE_ZI"};
	skinPosList[13] = {name:"�·������ɣ�", value:"SkinPosInfo.YI_FU__QU_GAN"};
	skinPosList[14] = {name:"Ь��", value:"SkinPosInfo.XIE_ZI"};
	skinPosList[15] = {name:"��ɫ�����ɣ�", value:"SkinPosInfo.DI_SE__QU_GAN"};
	skinPosList[16] = {name:"�ֳ�����", value:"SkinPosInfo.SHOU_CHI_WU_YUO"};
	skinPosList[17] = {name:"�·����Ӻ�", value:"SkinPosInfo.YI_FU__XIU_ZI_HOU"};
	skinPosList[18] = {name:"��ɫ���ֱۺ�", value:"SkinPosInfo.DI_SE__SHOU_BI_HOU"};
	skinPosList[19] = {name:"���Σ���", value:"SkinPosInfo.PEI_SHI__HOU"};	
	skinPosList[20] = {name:"ͷ������", value:"SkinPosInfo.TOU_FA__HOU"};
	skinPosList[21] = {name:"����(��)", value:"SkinPosInfo.BEI_BU__HOU"};
	skinPosList[22] = {name:"��Ч02", value:"SkinPosInfo.TE_XIAO_02"};
	skinPosList[23] = {name:"��裨��", value:"SkinPosInfo.QI_CHONG__HOU"};
	skinPosList[24] = {name:"��Ӱ", value:"SkinPosInfo.YIN_YING"};
	
	partConfig = new Date() + "\r\nexport config:\r\n"
}
function main(){
	fl.trace("Ŀ¼�� " + folderURL);
	var fileList = FLfile.listFolder(folderURL, "files");
	var totalFile = 0;
	for (var fileIndex = 0; fileIndex < fileList.length; fileIndex++)
	{
		var fileURL = folderURL + "/" + fileList[fileIndex];
		var extension = fileURL.substring(fileURL.lastIndexOf(".") + 1);
		if(extension == "fla"){
			var attr = FLfile.getAttributes(fileURL);
			//fl.trace("����");			
			if (attr && (attr.indexOf("R") != -1)) { 
				//fl.trace("ֻ���ļ�:" + fileURL + " ...");
			}else{
				convertFile(fileURL);
				totalFile ++;
				config += "<uri label=\"" + fileList[fileIndex]+ "\">" + folderURL + "/" + fileList[fileIndex]+ "</uri>\r";
			}
		}
	}
	
	fl.trace(totalFile + " ������� ");
	fl.trace(errorFiles.length + " �������" + errorFiles); 
	
	fl.trace(errorLogs.length + " Ԫ����ʽ����" +errorLogs);
	fl.trace("config:");
	fl.trace(partConfig);
	fl.trace("�������");
	fl.trace(config);

}

function convertFile(fileURL){
	var no = fileURL.substring(fileURL.lastIndexOf("/") + 1, fileURL.lastIndexOf("."));	
	var id = Number(no.substring(1));
	//fl.trace("�ļ����:" + no + "\t" + fileURL);
	
	
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
		// �ڸ����ҵ�����Ԫ��
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
	// ����Ŀ����Ԫ��ȫ��ת��artĿ��
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
		// û������ʱrectΪ0��ֱ����(0,0)
		if(rect == 0){
			doc.selection[0].x = 0;
			doc.selection[0].y = 0;
		}else{
			// ����4���أ�����2�ı���Ϊ����(����Ϊ4��6)
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
		a : Number ���Ż���תͼ��ʱӰ�������� x �ᶨλ��ֵ��  
	    b : Number ��ת����бͼ��ʱӰ�������� y �ᶨλ��ֵ��  
	    c : Number ��ת����бͼ��ʱӰ�������� x �ᶨλ��ֵ��  
	    d : Number ���Ż���תͼ��ʱӰ�������� y �ᶨλ��ֵ�� 		
		*/
		/*var outputStr = "(a=" + item.matrix.a + ", b=" + item.matrix.b 
			+ ", c=" + item.matrix.c + ", d="+ item.matrix.d 
			+ ", tx=" + item.matrix.tx + ", ty=" + item.matrix.ty + ")";
		if(item.matrix.a != 1 || item.matrix.d != 1){
			errorLogs[errorLogs.length] = "\r" + sourceName + " " + index
				+ " [" + item.libraryItem.sourceLibraryName + "] �����Ż���ת��" + outputStr;
		}
		if(item.matrix.b != 0 || item.matrix.c != 0){
			errorLogs[errorLogs.length] = "\r" + sourceName + " " + index
				+ " [" + item.libraryItem.sourceLibraryName + "] ����ת����б��" + outputStr;
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