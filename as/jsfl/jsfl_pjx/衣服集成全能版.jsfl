var skinPosList = [];
var partDatasURL = "file:///E|/vstsworkspace/projectX/source/as/materialdata/mmo/materialdata/ClothesPartsDatas.as";
var partDatas = FLfile.read(partDatasURL);
var skinPartNum = 10;
var nullMc;
function init(){
	skinPosList = [
		{name:"标签", value:"SkinPosInfo.BIAO_QIAN"},
		{name:"特效01", value:"SkinPosInfo.TE_XIAO_01"},
		{name:"翅膀（前）", value:"SkinPosInfo.CHI_BANG_QIAN"},
		{name:"骑宠（前）", value:"SkinPosInfo.QI_CHONG__QIAN"},
		{name:"脸部装饰(前)", value:"SkinPosInfo.MIAN_BU_ZHUANG_SHI"},
		{name:"背部配件(前)", value:"SkinPosInfo.BEI_BU_PEI_JIAN_QIAN"},
		{name:"背部(前)", value:"SkinPosInfo.BEI_BU__QIAN"},
		{name:"头部(前)", value:"SkinPosInfo.TOU_FA__QIAN"},
		{name:"配饰(前)", value:"SkinPosInfo.PEI_SHI__QIAN"},
		{name:"左手饰品（前）", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_QIAN"},
		{name:"衣服（袖子前）", value:"SkinPosInfo.YI_FU__XIU_ZI_QIAN"},
		{name:"底色（手臂前）", value:"SkinPosInfo.DI_SE__SHOU_BI_QIAN"},
		{name:"底色（头部）", value:"SkinPosInfo.DI_SE__TOU_BU"},
		{name:"面部装饰(后)", value:"SkinPosInfo.MIAN_BU_ZHUANG_SHI_HOU"},
		{name:"左手饰品（后）", value:"SkinPosInfo.SHOU_CHI_WU_ZUO_HOU"},
		{name:"裙摆", value:"SkinPosInfo.QUN_BAI"},
		{name:"靴子", value:"SkinPosInfo.XUE_ZI"},
		{name:"衣服（躯干）", value:"SkinPosInfo.YI_FU__QU_GAN"},
		{name:"鞋子", value:"SkinPosInfo.XIE_ZI"},
		{name:"底色（躯干）", value:"SkinPosInfo.DI_SE__QU_GAN"},
		{name:"手持物右", value:"SkinPosInfo.SHOU_CHI_WU_YUO"},
		{name:"衣服袖子后 ", value:"SkinPosInfo.YI_FU__XIU_ZI_HOU"},
		{name:"底色（手臂后）", value:"SkinPosInfo.DI_SE__SHOU_BI_HOU"},
		{name:"配饰（后）", value:"SkinPosInfo.PEI_SHI__HOU"},
		{name:"头发（后）", value:"SkinPosInfo.TOU_FA__HOU"},
		{name:"背部(后)", value:"SkinPosInfo.BEI_BU__HOU"},
		{name:"背部配件(后) ", value:"SkinPosInfo.BEI_BU_PEI_JIAN_HOU"},
		{name:"翅膀（后）", value:"SkinPosInfo.CHI_BANG_HOU"},
		{name:"骑宠（后）", value:"SkinPosInfo.QI_CHONG__HOU"},
		{name:"特效02", value:"SkinPosInfo.TE_XIAO_02"},
		{name:"阴影", value:"SkinPosInfo.YIN_YING"},
		{name:"背景", value:"SkinPosInfo.BEI_JING"}
		];
	
	partConfig = new Date() + "\r\nexport config:\r\n"
}

function main()
{
	init();
	var doc = fl.getDocumentDOM();
	if(!doc.library.itemExists("衣服空元件"))
	{
		doc.library.addNewItem("movie clip", "衣服空元件");
		doc.library.selectItem("衣服空元件")
		var tmpArr = doc.library.getSelectedItems();
		nullMc = tmpArr[0];
	}
	fl.outputPanel.clear();
	fl.setActiveWindow(doc);
	doc.selectAll();
	var selectArr = doc.selection;
	sortByY(selectArr);
	
	var conf = prompt("输入衣服配置格式如下", "id,id,id:true/false(convert bitmap)");
	var convert = conf.split(":")[1];
	conf = conf.split(":")[0];
	var arr = parseConf(conf);
	var saveURL = fl.browseForFolderURL("open", "SaveURL");
	var iconArr = selectArr.slice(skinPartNum+1);
	if(selectArr.length >skinPartNum)
	{
		var viewArr = [selectArr[skinPartNum]];
		editLayer(doc,viewArr,"skinview",arr,conf,saveURL);
	}
	selectArr.splice(skinPartNum,selectArr.length-skinPartNum);
	editLayer(doc,selectArr,"skin",arr,conf,saveURL);
	if(null != iconArr)
	{
		buildSkinIcon(doc,iconArr,conf);
	}
	if(convert)
	{
		fl.runScript("file:///E|/vstsworkspace/projectX/source/tools/jsfl/衣服转位图——默认.jsfl");
	}
}

function editLayer(doc,selectArr,type,arr,conf,saveURL)
{	
	for(var i = 0; i < arr.length; i++)
	{
		fl.setActiveWindow(doc);
		for(var idx = 0; idx < selectArr.length; idx ++)
		{
			if(isBlankLayer(doc,selectArr[idx],arr[i]))
			{
				doc.selectNone();
				//var itemIndex = doc.library.findItemIndex("衣服空元件"); 
				//var theItem = doc.library.items[itemIndex]; 
				doc.library.addItemToDocument({x:0,y:0}, "衣服空元件");
			}
		}
		var newDoc = fl.createDocument();
		enterEdit(newDoc, arr[i], doc,selectArr);
		fl.trace("准备保存！");
		fl.saveDocument(newDoc, saveURL + '/' +  arr[i] + '.fla');
		fl.closeDocument(newDoc,false);
	}
	var savePath = "file:///E|/vstsworkspace/projectX/source/assets/"+type;
	var arr2 = conf.split(",")
	for(var j = 0; j < arr2.length; j++)
	{
		var fileName = getFileName(arr2[j]);
		var datas = getPartDatas(arr2[j]);
		var arr4 = getClothesIds(datas);
		new_doc = fl.createDocument();
		for(var k = 0; k < arr4.length; k ++)
		{
			fl.trace(saveURL+ '/' + arr4[k]+'.fla');
			var doc2 = fl.openDocument(saveURL+ '/' + arr4[k]+'.fla');
			fl.setActiveWindow(doc2);
			doc2.selectAll();
			doc2.clipCopy();
			var clsName = fileName + k;
			fl.setActiveWindow(new_doc);
			if("skin" == type)
			{
				new_doc.library.addNewItem("movie clip", "source/"+clsName);
				new_doc.library.editItem("source/"+clsName);
			}
			else
			{
				new_doc.library.addNewItem("movie clip", "source/"+clsName);
				new_doc.library.editItem("source/"+clsName);
			}
			new_doc.clipPaste(true);
			var selArr = new_doc.library.items;
			for(var l = 0; l< selArr.length; l++)
			{
				if(-1 != selArr[l].name.indexOf(clsName) && 'skinview' == type)
				{
					selArr[l].linkageExportForAS = true;
					selArr[l].linkageExportForRS = false;
					if("skinview" == type)
					{
						selArr[l].linkageClassName = clsName+'_B';
					}
					selArr[l].linkageBaseClass = "flash.display.MovieClip";
					selArr[l].linkageExportInFirstFrame = true;
				}
			}
			fl.closeDocument(doc2, false);
		}
		fl.saveDocument(new_doc, savePath + '/' + fileName + '.fla');
		if("skinview" == type)
		{
			new_doc.publish();
		}
		fl.closeDocument(new_doc, false);
	}
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
		if(arr.length == 0)
		{
			fl.trace("第"+i+"个"+layerName+"层 没有元件");
			doc.selectNone();
			setSelectLayer(tl, layerName);
			//var itemIndex = doc.library.findItemIndex("衣服空元件"); 
			//var theItem = doc.library.items[itemIndex]; 
			doc.library.addItemToDocument({x:0,y:0}, "衣服空元件");
			doc.selectAll();
			fl.setActiveWindow(doc);
			doc.clipCopy();
			fl.setActiveWindow(newDoc);
			newDoc.clipPaste();
			newDoc.selection[0].y = i * 100;
			newDoc.selection[0].x = 0;
			newDoc.selectNone();
			fl.setActiveWindow(doc);
		}
		else
		{
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
					fl.trace("第"+i+"个"+layerName+"层" +arr[j]+"帧 多于1个!");
					var k = getLargestSelection(newArr);
					doc.selectNone();
					doc.selection = [k];
				}
				else if(newArr.length == 0)
				{
					fl.trace("第"+i+"个"+layerName+"层" +arr[j]+"帧 没有元件");
					doc.selectNone();
					setSelectLayer(tl, layerName);
					//var itemIndex = doc.library.findItemIndex("衣服空元件"); 
					//var theItem = doc.library.items[itemIndex]; 
					doc.library.addItemToDocument({x:0,y:0}, "衣服空元件");
					doc.selectAll();
				}
				else if(newArr[0].elementType != "instance")
				{
					fl.trace("第"+i+"个"+layerName+"层" +arr[j]+"帧 不是元件");
					doc.selectNone();
					setSelectLayer(tl, layerName);
					//var itemIndex = doc.library.findItemIndex("衣服空元件"); 
					//var theItem = doc.library.items[itemIndex]; 
					doc.library.addItemToDocument({x:0,y:0}, "衣服空元件");
					doc.selectAll();
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
	var idx;
	for(var i = 0 ; i < tl.layers.length; i++)
	{
		var bool = (checkTwoPrefix(tl.layers[i].name , layerName));
		tl.layers[i].locked = !bool;
		tl.layers[i].visible = true;
		if(bool)
		{
			idx = i;
		}
	}
	tl.setSelectedLayers(idx);
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
	if(layer.frameCount == 0)
	{
		fl.getDocumentDOM().getTimeline().insertBlankKeyframe(0)
	}
	doc.selectNone();
	doc.exitEditMode();
	return true;
}

function buildSkinIcon(doc,iconArr,conf)
{
	var arr2 = conf.split(",");	
	var savePath = "file:///E|/vstsworkspace/projectX/source/assets/skinicon/";
	for(var i = 0; i < iconArr.length; i++)
	{
		fl.trace("正在处理图标:"+i+" 衣服图标iconArr.length:"+iconArr.length);
		var new_doc = fl.createDocument();		
		doc.selectNone();
		fl.setActiveWindow(doc);
		var arr = [iconArr[i]];
		doc.selectNone();
		doc.selection = arr;
		fl.setActiveWindow(doc);
		doc.clipCopy();	
		var fileName = getFileName(arr2[i]);
		var linkageExportForASName = fileName + "0_A";
		new_doc.library.addNewItem("movie clip", linkageExportForASName);
		new_doc.library.editItem(linkageExportForASName);
		new_doc.clipPaste();
		fl.setActiveWindow(new_doc);
		new_doc.selection[0].y = 0;
		new_doc.selection[0].x = 0;
		new_doc.selectAll();
		new_doc.moveSelectionBy({x:-(new_doc.getSelectionRect().left),y:-(new_doc.getSelectionRect().top)});
		var selArr = new_doc.library.items;

		for(var k = 0; k< selArr.length; k++)
		{
			if(selArr[k].name == linkageExportForASName)
			{
				selArr[k].linkageExportForAS = true;
				selArr[k].linkageExportForRS = false;
				selArr[k].linkageClassName = linkageExportForASName;
				selArr[k].linkageBaseClass = "flash.display.MovieClip";
				selArr[k].linkageExportInFirstFrame = true;
			}
		}
		fl.saveDocument(new_doc, savePath+fileName+ '.fla');
		new_doc.publish();
		fl.closeDocument(new_doc,false);
	}
}

function getNullMc(doc)
{
	if(!doc.library.itemExists("衣服空元件"))
	{
		doc.library.addNewItem("movie clip", "衣服空元件");
	}
	doc.library.selectItem("衣服空元件");
	var tmparr = doc.library.getSelectedItems();
	fl.trace("空元件："+tmparr[0])
	return tmparr[0]; 
}

main();