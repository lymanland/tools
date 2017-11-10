function main()
{
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
	var saveURL = fl.browseForFolderURL("open", "SaveURL");
	fl.trace("saveURL:"+saveURL);
	if(saveURL == null)
	{
		return;
	}
	for(var i = 0; i < arr.length; i++)
	{
		fl.trace("现在i:"+i);
		fl.setActiveWindow(doc);
		if(isBlankLayer(doc,selectArr[0],arr[i]))
		{
			fl.trace("tiaochu:"+arr[i])
			continue;
		}
		var newDoc = fl.createDocument();
		fl.trace("arr[0]:"+arr[i]);
		enterEdit(newDoc, arr[i], doc,selectArr);
		fl.trace("准备保存！");
		fl.saveDocument(newDoc, saveURL + '/' +  arr[i] + '.fla');
		fl.closeDocument(newDoc,false);
	}
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
		fl.trace("framecount:"+tl.frameCount);
		var arr = getKeyFrame(doc, layerName);
		for(var j = 0; j < arr.length; j++)
		{
			if(arr[j] > tl.frameCount)
			{
				break;
			}
			tl.setSelectedFrames(arr[j],arr[j],true);
			doc.selectAll();
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
	fl.trace("doc::selection"+doc.selection)
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
	fl.trace("选择长度："+doc.selection);
	if(doc.selection.length > 0){
		doc.selectNone();
		doc.exitEditMode();
		return false;
	}
	
	fl.trace("空层:"+layer.name);
	doc.selectNone();
	doc.exitEditMode();
	return true;
}

main();