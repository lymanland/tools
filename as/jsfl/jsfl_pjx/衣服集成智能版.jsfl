var skinPosList = [];
var partDatasURL = "file:///E|/vstsworkspace/projectX/source/as/materialdata/mmo/materialdata/ClothesPartsDatas.as";
var partDatas = FLfile.read(partDatasURL);
function init(){
	skinPosList[0] = {name:"特效01", value:"SkinPosInfo.TE_XIAO_01"};
	skinPosList[1] = {name:"骑宠（前）", value:"SkinPosInfo.QI_CHONG__QIAN"};
	skinPosList[2] = {name:"背部（前）", value:"SkinPosInfo.BEI_BU__QIAN"};
	skinPosList[3] = {name:"头发（前）", value:"SkinPosInfo.TOU_FA__QIAN"};
	skinPosList[4] = {name:"左手饰品（前）", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_QIAN"};
	skinPosList[5] = {name:"衣服（袖子前）", value:"SkinPosInfo.YI_FU__XIU_ZI_QIAN"};
	skinPosList[6] = {name:"底色（手臂前）", value:"SkinPosInfo.DI_SE__SHOU_BI_QIAN"};
	skinPosList[7] = {name:"面部装饰", value:"SkinPosInfo.MIAN_BU_ZHUANG_SHI"};
	skinPosList[8] = {name:"底色（头部）", value:"SkinPosInfo.DI_SE__TOU_BU"};
	skinPosList[9] = {name:"左手饰品（后）", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_HOU"};
	skinPosList[10] = {name:"靴子", value:"SkinPosInfo.XUE_ZI"};
	skinPosList[11] = {name:"衣服（躯干）", value:"SkinPosInfo.YI_FU__QU_GAN"};
	skinPosList[12] = {name:"鞋子", value:"SkinPosInfo.XIE_ZI"};
	skinPosList[13] = {name:"底色（躯干）", value:"SkinPosInfo.DI_SE__QU_GAN"};
	skinPosList[14] = {name:"手持物右", value:"SkinPosInfo.SHOU_CHI_WU_YUO"};
	skinPosList[15] = {name:"衣服袖子后", value:"SkinPosInfo.YI_FU__XIU_ZI_HOU"};
	skinPosList[16] = {name:"底色（手臂后）", value:"SkinPosInfo.DI_SE__SHOU_BI_HOU"};
	skinPosList[17] = {name:"头发（后）", value:"SkinPosInfo.TOU_FA__HOU"};
	skinPosList[18] = {name:"背部(后)", value:"SkinPosInfo.BEI_BU__HOU"};
	skinPosList[19] = {name:"骑宠（后）", value:"SkinPosInfo.QI_CHONG__HOU"};
	skinPosList[20] = {name:"特效02", value:"SkinPosInfo.TE_XIAO_02"};
	skinPosList[21] = {name:"阴影", value:"SkinPosInfo.YIN_YING"};
	
	partConfig = new Date() + "\r\nexport config:\r\n"
}

function main()
{
	init();
	fl.outputPanel.clear();
	var doc = fl.getDocumentDOM();
	doc.selectAll();
	var selectArr = doc.selection;
	sortByY(selectArr);
	editLayer(doc,selectArr);
}

function cnLayerName(){
	return ['1.特效01',
		'2.背部(翅膀前)',
		'3.头部(前)',
		'4.衣服(袖子前)',
		'5.▲皮肤(手臂前)',
		'6.脸部装饰',
		'7.眼睛嘴巴',
		'8.▲皮肤(头部)',
		'9.左手饰品',
		'10.靴子',
		'11.衣服(躯干)',
		'12.鞋子',
		'13.▲皮肤(躯干)',
		'14.右手持物',
		'15.衣服(袖子后)',
		'16.▲皮肤(手臂后)',
		'17.头部(后) ',
		'18.背部(翅膀后)',
		'19.特效02'];
}

function editLayer(doc,selectArr)
{
	var arr = cnLayerName();
	var conf = prompt("输入衣服配置格式如下", "id,id,id");
	arr = parseConf(conf);
	var saveURL = fl.browseForFolderURL("open", "SaveURL");
	fl.trace("arr:"+arr);
	for(var i = 0; i < arr.length; i++)
	{
		fl.trace("现在i:"+arr[i]);
		fl.setActiveWindow(doc);
		if(isBlankLayer(doc,selectArr[0],arr[i]))
		{
			fl.trace("跳出:"+arr[i]);
			if(!doc.library.itemExists("衣服空元件"))
			{
				doc.library.addNewItem("movie clip", "衣服空元件");
			}
			doc.library.addItemToDocument({x:0, y:0},"衣服空元件");
		}
		var newDoc = fl.createDocument();
		fl.trace("arr[0]:"+arr[i]);
		enterEdit(newDoc, arr[i], doc,selectArr);
		fl.trace("准备保存！");
		fl.saveDocument(newDoc, saveURL + '/' +  arr[i] + '.fla');
		fl.closeDocument(newDoc,false);
	}
	var savePath = "file:///E|/vstsworkspace/projectX/source/assets/skin";
	var arr2 = conf.split(",")
	for(var j = 0; j < arr2.length; j++)
	{
		var fileName = getFileName(arr2[j]);
		var datas = getPartDatas(arr2[j]);
		var arr4 = getClothesIds(datas);
		new_doc = fl.createDocument();
		fl.trace("现在正在做" + fileName);
		for(var k = 0; k < arr4.length; k ++)
		{
			fl.trace(saveURL+ '/' + arr4[k]+'.fla');
			var doc2 = fl.openDocument(saveURL+ '/' + arr4[k]+'.fla');
			fl.setActiveWindow(doc2);
			doc2.selectAll();
			doc2.clipCopy();
			var clsName = fileName + k;
			fl.setActiveWindow(new_doc);
			new_doc.library.addNewItem("movie clip", "source/"+skinPosList[arr4[k]].name+clsName);
			new_doc.library.editItem("source/"+skinPosList[arr4[k]].name+clsName);
			new_doc.clipPaste(true);
			var selArr = new_doc.library.items;
			for(var l = 0; l< selArr.length; l++)
			{
				if(selArr[l].name == clsName)
				{
					selArr[l].linkageExportForAS = true;
					selArr[l].linkageExportForRS = false;
					selArr[l].linkageClassName = clsName;
					selArr[l].linkageBaseClass = "flash.display.MovieClip";
					selArr[l].linkageExportInFirstFrame = true;
				}
			}
			fl.closeDocument(doc2, false);
		}
		fl.saveDocument(new_doc, savePath + '/' + fileName + '.fla');
		fl.closeDocument(new_doc, false);
	}
	//fl.runScript("file:///E|/vstsworkspace/projectX/source/tools/jsfl/新人物衣服转位图skin(拆分).jsfl");
}

function parseConf(conf)
{
	var arr = conf.split(",");
	var newArr = [];
	for(var i = 0; i < arr.length; i++)
	{
		var datas = getPartDatas(arr[i]);
		var tmp = getClothesIds(datas);
		for(var j = 0; j < tmp.length; j++)
		{
			newArr.push(tmp[j]);
		}
	}
	return newArr;
}

function getFileName(id)
{
	var l = id.length;
	var str = "a";
	for(var i = 0; i < 6-l; i++)
	{
		str += "0";
	}
	str += id;
	return str;
}

function getPartDatas(no){
	var findKey = "\"" + no + "\"";
	var endIndex = partDatas.lastIndexOf(getFileName(no))
	var datas = partDatas.substring(0, endIndex + findKey.length);
	var startIndex = partDatas.lastIndexOf(findKey)
	var datas = datas.substring(startIndex);
	
	return datas;
}

function getClothesIds(datas)
{
	var arr = [];
	for(var i = 0; i < skinPosList.length; i++)
	{
		var k = datas.lastIndexOf(skinPosList[i].value);
		if( k != -1)
		{
			arr.push({"id":k, "desc":i});
		}
	}
	sortById(arr);
	var newarr = [];
	for(var j = 0; j < arr.length; j++)
	{
		newarr.push(arr[j].desc);
	}
	return newarr;
}



function enterEdit(newDoc,layerName,doc,selectArr)
{
	for(var i = 0; i < selectArr.length; i++)
	{
		doc.selectNone();
		fl.setActiveWindow(doc);
		doc.selection = [selectArr[i]];
		fl.setActiveWindow(doc);
		doc.enterEditMode("inPlace");
		var tl = doc.getTimeline();
		setSelectLayer(tl, layerName);
		var arr = getKeyFrame(doc, layerName);
		for(var j = 0; j < arr.length; j++)
		{
			if(arr[j] > tl.frameCount)
			{
				break;
			}
			tl.setSelectedFrames(arr[j],arr[j],true);
			doc.selectAll();
			var newArr= doc.selection;
			if(newArr.length > 1)
			{
				fl.trace("第"+i+"个"+layerName+" 多于1个!");
				var k = getLargestSelection(newArr);
				doc.selectNone();
				doc.selection = [k];
			}
			fl.setActiveWindow(doc);
			doc.clipCopy();
			fl.setActiveWindow(newDoc);
			newDoc.clipPaste();
			newDoc.selection[0].y = i * 100;
			newDoc.selection[0].x = j * 150;
			newDoc.selectNone();
			fl.setActiveWindow(doc);
		}
		doc.exitEditMode();
	}
}

function getLargestSelection(selectArr)
{
	var a = selectArr[0];
	for(var i = 1; i < selectArr.length; i++)
	{
		if(selectArr[i].width > a.width)
		{
			a = selectArr[i];
		}
	}
	return a;
}

function setSelectLayer(tl, layerName)
{
	for(var i = 0 ; i < tl.layers.length; i++)
	{
		tl.layers[i].locked = !(checkTwoPrefix(tl.layers[i].name , layerName));
		tl.layers[i].visible = true;
	}
}

function checkTwoPrefix(str1, str2)
{
	str2 = ""+str2;
	var arr1 = str1.split(".");
	var arr2 = str2.split(".");
	if(arr1[0] == arr2[0])
	{
		return true;
	}
	else
	{
		return false;
	}
}

function sortByY(selectArr)
{
	for(var i = 1; i < selectArr.length; i++)
	{
		for(var j = 0; j < selectArr.length - i; j++)
		{
			if(selectArr[j].y > selectArr[j+1].y || (selectArr[j].y == selectArr[j+1].y && selectArr[j].x > selectArr[j+1].x))
			{
				var tmp = selectArr[j];
				selectArr[j]  = selectArr[j+1];
				selectArr[j+1] = tmp;
			}
		}
	}
}

function sortById(selectArr)
{
	for(var i = 1; i < selectArr.length; i++)
	{
		for(var j = 0; j < selectArr.length - i; j++)
		{
			if(selectArr[j].id > selectArr[j+1].id)
			{
				var tmp = selectArr[j];
				selectArr[j]  = selectArr[j+1];
				selectArr[j+1] = tmp;
			}
		}
	}
}


function getKeyFrame(doc, layerName)
{
	var tl = doc.getTimeline();
	for( i = 0; i < tl.layers.length; i++)
	{
		if(checkTwoPrefix(tl.layers[i].name , layerName))
		{
			var frameArray = tl.layers[i].frames;
		}
	}
	if(frameArray == null)
	{
		return [];
	}
	var n = frameArray.length; 
	var arr = [];
	for (i=0; i<n; i++) { 
	    if (i==frameArray[i].startFrame) { 
		arr.push(i);
	    } 
	}
	return arr;
}

function creatNewFla(saveURL, layerName)
{
	var newDoc = fl.createDocument();
	fl.trace("url:"+saveURL+"  newdoc:"+newDoc);
	return newDoc;
}

function isBlankLayer(doc,selectMc,layerName){
	fl.setActiveWindow(doc);
	doc.selectNone();
	doc.selection =[selectMc];
	doc.enterEditMode("inPlace");
	var index = -1;
	var tl = doc.getTimeline();
	for(var i = 0 ; i < tl.layers.length; i++)
	{
		if(checkTwoPrefix(tl.layers[i].name , layerName))
		{
			var layer = tl.layers[i];
			index = i;
		}
		tl.layers[i].locked = true;
		tl.layers[i].visible = true;
		
	}
	if(index == -1)
	{
		doc.selectNone();
		doc.exitEditMode();
		return true;
	}
	tl.setSelectedLayers(index,true);
	layer.locked = false;
	layer.visible = true;
	fl.setActiveWindow(doc);
	tl.setSelectedFrames(0,0,true);
	doc.selectNone();
	doc.selectAll();
	if(doc.selection.length > 0){
		doc.selectNone();
		doc.exitEditMode();
		return false;
	}
	
	doc.selectNone();
	doc.exitEditMode();
	return true;
}

main();