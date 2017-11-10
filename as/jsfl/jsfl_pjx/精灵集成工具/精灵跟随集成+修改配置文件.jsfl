/**
 * 亚比跟随集成须知：
 * fla名称说明：a020458.fla
 * a02-->亚比衣服前缀编号(按照ClothesData中的亚比衣服id递增下去)
 * 0458-->衣服id（注意：一定是四位数字，不够的话前面补零）
 *
 * 使用：美术发来的文件已经按照本集成文件的命名需求，将其直接放在文件夹中即可
 *       集成完成后将flash输出的信息添加到：ClothesPartsDatas.as以及ClothesData.as
 *
 * 文件存放：skin目录下
 *
 * AS修改：在interfaces/pet/data/PetClothesMap.as下加入相应配置
 */
const DEFAULT_SAVE_RUL = "file:///E|/vstsworkspace/projectX/source/assets/skin";
const CLOTHESDATA_URL = "file:///E|/vstsworkspace/projectX/source/as/materialdata/mmo/materialdata/ClothesData.as";
const PARTDATA_URL = "file:///E|/vstsworkspace/projectX/source/as/materialdata/mmo/materialdata/ClothesPartsDatas.as";

var fileURL = fl.browseForFolderURL("请选择跟随资源的路径：", "selest file");
var fileList = FLfile.listFolder(fileURL, "files");

var finConfig = true;
var configData;
var allItems;

if(fileURL != null)
{
	var confarr = [];
	for(var j =0;j < fileList.length; j++)
	{
		var filearr = fileList[j].split('_');
		var str = filearr[1];
		var add0Num = 4 - str.length;
		var fileName = "2";
		for(var k=0;k<add0Num;k++)
		{
			fileName = fileName + "0";
		}
		confarr.push(fileName+str);
	}
	
	for(var j =0;j < fileList.length; j++)
	{
		
		var doc = fl.openDocument(fileURL+ '/' + fileList[j]);
		doc.selectAll();
		new_doc = fl.createDocument();
		doc.clipCopy();
		//new_doc.clipPaste(true);
		new_doc.library.addNewItem("movie clip", confarr[j] + "_C");
		new_doc.library.editItem(confarr[j] + "_C");
		new_doc.clipPaste(true);
		var selArr = new_doc.library.items;
		for(var i = 0; i< selArr.length; i++)
		{
			if(selArr[i].name == confarr[j] + "_C")
			{
				selArr[i].linkageExportForAS = true;
				selArr[i].linkageExportForRS = false;
				selArr[i].linkageClassName = "a0" + confarr[j] + "0_C";
				selArr[i].linkageBaseClass = "flash.display.MovieClip";
				selArr[i].linkageExportInFirstFrame = true;
				selArr[i].name = "a0" + confarr[j] + "0_C";
			}
		}
		fl.saveDocument(new_doc, DEFAULT_SAVE_RUL + '/' + "a0" + confarr[j] + '.fla');
		fl.closeDocument(new_doc);
		fl.closeDocument(doc,false);
	}
	
	var attr = FLfile.getAttributes(CLOTHESDATA_URL);
	if (attr == null || (attr.indexOf("R") != -1)) {
    	finConfig = false;
		fl.trace("ClothesData is read only!");
		for(var j =0;j < fileList.length; j++)
		{
			var filearr = fileList[j].split('_');
			fl.trace("			\"" + confarr[j] + "\": new Clothes(" + confarr[j] + ", \"" + filearr[2] + "\", 0, 0, false, false),");
		}
    } else {
		configData = FLfile.read(CLOTHESDATA_URL);
		// 全局查找精灵的id串
		var reg = new RegExp("\"2[0-9]{4}\"", "g");
		allItems = configData.match(reg);
		parseToIntegers();
		for(var j = 0; j < confarr.length; j++) {
			var filearr = fileList[j].split('_');
			var info = "\n			\"" + confarr[j] + "\": new Clothes(" + confarr[j] + ", \"" + filearr[2] + "\", 0, 0, false, false),";
			var id = parseInt(confarr[j]);
			if(allItems.indexOf(id) >= 0) {
				continue;
			}
			var index = getClothesConfigIndex(id);
			configData = configData.substring(0, index) + info + configData.substring(index)
		}
		FLfile.write(CLOTHESDATA_URL, configData);
	}
	
	var attr = FLfile.getAttributes(PARTDATA_URL);
	if (attr == null || (attr.indexOf("R") != -1)) {
		finConfig = false;
		for(var j =0;j < fileList.length; j++)
		{
			var filearr = fileList[j].split('_');
			fl.trace("				\"" + confarr[j]+"\":\n					"  +
					"[[new ClothesParts(\"a0"+ confarr[j] + "0\", SkinPosInfo.QI_CHONG__QIAN, SkinInfoFactory.SCENE_PET_STAND_MOVIE\n						" +
						", ClothesSideTypes.TWO, \"" + filearr[4].substr(0, filearr[4].length - 4) +"\")],\n					"+
					"\"a0"+confarr[j]+"\"],");
		}
	} else {
		configData = FLfile.read(PARTDATA_URL);
		// 全局查找精灵的id串
		var reg = new RegExp("\"2[0-9]{4}\"", "g");
		allItems = configData.match(reg);
		parseToIntegers();
		for(var j = 0; j < confarr.length; j++) {
			var filearr = fileList[j].split('_');
			var info = "\n				\"" + confarr[j]+"\":\n				"  +
					"[[new ClothesParts(\"a0"+ confarr[j] + "0\", SkinPosInfo.QI_CHONG__QIAN, SkinInfoFactory.SCENE_PET_STAND_MOVIE\n					" +
						", ClothesSideTypes.TWO, \"" + filearr[4].substr(0, filearr[4].length - 4) +"\")],\n					"+
					"\"a0"+confarr[j]+"\"],";
			var id = parseInt(confarr[j]);
			if(allItems.indexOf(id) >= 0) {
				continue;
			}
			var index = getPartConfigIndex(id);
			configData = configData.substring(0, index) + info + configData.substring(index)
		}
		FLfile.write(PARTDATA_URL, configData);
	}
	if(!finConfig) {
		alert("配置文件没更新，现更新配置再'用衣服转位图——默认.jsfl'转位图吧");
	} else {
		fl.runScript("file:///E|/vstsworkspace/projectX/source/tools/jsfl/衣服转位图——默认.jsfl");
	}
}

function parseToIntegers() {
	var temp = [];
	for(var i = 0; i < allItems.length; i++) {
		// id上有""，需要将其截去
		temp[i] = parseInt(allItems[i].substr(1, 5));
	}
	allItems = temp;
}

function getClothesConfigIndex(id) {
	var keyStr;
	if(id <= allItems[0]) {
		keyStr = "\"" + allItems[0] + "\"";
		allItems.unshift(id);
		return configData.indexOf(keyStr);
	} else {
		for(var i = allItems.length - 1; i >= 0; i--) {
			if(id >= allItems[i]) {
				keyStr = "\"" + allItems[i] + "\"";
				allItems.splice(i + 1, 0, id);
				break;
			}
		}
		i = configData.indexOf(keyStr);
		// 查找该配置项的结束位置
		// 例子："1":new Clothes(1, "头饰", 0, 1, false, false,0,""),
		while(configData.charAt(i) != ')') {
			i ++;
		}
		return i + 2;
	}
}

function getPartConfigIndex(id) {
	var keyStr;
	if(id <= allItems[0]) {
		keyStr = "\"" + allItems[0] + "\"";
		allItems.unshift(id);
		return configData.indexOf(keyStr);
	} else {
		for(var i = allItems.length - 1; i >= 0; i--) {
			if(id >= allItems[i]) {
				keyStr = "\"" + allItems[i] + "\"";
				allItems.splice(i + 1, 0, id);
				break;
			}
		}
		i = configData.indexOf(keyStr);
		var isFirst = false;
		// 查找该配置项的结束位置
		// 例子："1":[[new ClothesParts("a0000010", SkinPosInfo.QI_CHONG__QIAN)], "a000001"],
		while(true) {
			if(configData.charAt(i - 1) == '"' && configData.charAt(i) == ']') {
				break;
			}
			i ++;
		}
		return i + 2;
	}
}