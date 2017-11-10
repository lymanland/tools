//20140714

var xmlName = "jimianban.xml";
var scriptName = fl.scriptURI.split("/")[fl.scriptURI.split("/").length - 1];
var patt = new RegExp(scriptName,"g");
var xmlUri = fl.scriptURI.replace(patt, xmlName);
var xml = XML(FLfile.read(xmlUri));
if(!FLfile.exists(xmlUri)){
	alert("no XML");
}

var _linkASPre = xml.linkageAsPre;
var _needNewDoc = (xml.needNewDoc == "true");
var _symbolName = "";
var _linkage = "";

var oriDocId = fl.getDocumentDOM().id;
var doc = fl.findDocumentDOM(oriDocId);
var newDoc;
if(_needNewDoc){
	newDoc = fl.createDocument();
	var desDocId = newDoc.id;
	fl.setActiveWindow(doc);
}

if(doc.getTimeline() != undefined){
	doc.getTimeline().setSelectedFrames(0, 1);
	var aLayers = doc.getTimeline().layers;
	for(var i = 0; i< aLayers.length; i++){
		checkLayer(aLayers[i], i);
	}
}

if(_needNewDoc){
	fl.setActiveWindow(newDoc);
	cleanLibrary(newDoc);
}else{
	//fl.setActiveWindow(doc);
	//cleanLibrary(doc);
}


function checkLayer(aLayer, idx)
{
	var isInXml = false;
	var defaultContent;
	var funcName;
	for each(var l in xml.layer.l){
		if(aLayer.name == l.@layername){
			funcName = l.@func;
			_symbolName = l.@name;
			_linkage = l.@linkage;
			var needMcContainer = l.@needMcContainer; 
			var spritePerFrame = l.@spritePerFrame; 
			this[funcName].apply(null, [aLayer, idx, needMcContainer, spritePerFrame]);
			
			fl.setActiveWindow(doc);
			isInXml = true;
		}
		if("default" == l.@layername){
			defaultContent = l;
		}
	}
	if(!isInXml){
		funcName = defaultContent.@func;
		_symbolName = defaultContent.@name;
		_linkage = defaultContent.@linkage;
		this[funcName].apply(null, [aLayer, idx]);
	}
}

function makeOtherResFromLayer(aLayer, idx, undef1, undef2)
{
	var aFrames = aLayer.frames;
	for(var j = 0; j< aFrames.length; j++){
		doc.getTimeline().setSelectedFrames(j, j+1);
		var aElements = aFrames[j].elements;
		for(var k = 0; k< aElements.length; k++){
			var idx = ""+i+j+k;
			checkGroup(aElements[k], idx);
		}
	}
}

function checkGroup(aElement, idx)
{
	if(aElement.isGroup){
		copyGroupToDoc(aElement, idx);
	}
}

function copyGroupToDoc(aElement, idx)
{
	fl.setActiveWindow(doc);
	doc.selectNone();
	aElement.selected = true;
	doc.enterEditMode('inPlace');
	doc.selectAll();
	doc.clipCopy();
	aElement.selected = false;
	var linkage = "" + _linkASPre + _linkage + idx;
	makeMcRes(doc, newDoc, true, _symbolName + idx, linkage); //复制
	fl.setActiveWindow(doc);
	doc.exitEditMode();
	doc.selectNone();
}

function makeTipResFromLayer(aLayer, idx, needMcContainer, spritePerFrame)
{
	if(needMcContainer == "true"){
		needMcContainer = true;
	}else{
		needMcContainer = false;
	}
	if(spritePerFrame == "true"){
		spritePerFrame = true;
	}else{
		spritePerFrame = false;
	}
	doc.selectNone();
	var aFrame = aLayer.frames[0];
	
	var i = 0;
	var aElements = [];
	var alength = aFrame.elements.length;
	for(i = 0; i< alength; i++){
		aElements[i] = aFrame.elements[i];
	}
	for(i = 0; i< alength - 1; i++){
		var eleTo = aElements[i];
		var mm = -1;
		for(var m = i + 1; m< alength; m++){
			if(eleTo.left > aElements[m].left){
				eleTo = aElements[m];
				mm = m;
			}
		}
		if(mm != -1){
			aElements[mm] = aElements[i];
			aElements[i] = eleTo;
		}
	}
	
	for(i = 0; i< aFrame.elements.length; i++){
		aFrame.elements[i].selected = true;
	}
	
	doc.group();
	doc.enterEditMode();
	doc.selectNone();
	
	aElements[0].selected = true;
	doc.clipCopy();
	doc.exitEditMode();
	doc.clipPaste();
	
	doc.unGroup();
	if(spritePerFrame){
		doc.convertToSymbol("movie clip", "", "top left");
	}
	var newMc;
	if(needMcContainer){
		newMc = doc.convertToSymbol("movie clip", "", "top left");
	}
	newMc = doc.convertToSymbol("movie clip", _symbolName, "top left");
	newMc.linkageExportForAS = true;
	newMc.linkageExportInFirstFrame = true;
	var linkage = "" + _linkASPre + _linkage;
	newMc.linkageClassName = linkage;
	doc.selectNone();
	
	var groupElement;
	var mcElement ;
	for(i = 0; i < aFrame.elements.length; i++){
		if(!aFrame.elements[i].isGroup){
			mcElement = aFrame.elements[i];
		}else{
			groupElement = aFrame.elements[i];
		}
	}

	for(i = 1; i< aElements.length; i++){
		addFrameSymbol(doc, mcElement, groupElement, aElements[i], i, needMcContainer, spritePerFrame);
	}
	
	doc.selectNone();
	groupElement.selected = true;
	doc.unGroup();
	doc.selectNone();
	mcElement.selected = true;
	doc.clipCopy();
	makeMcRes(doc, newDoc, false, null, null);  //复制
	fl.setActiveWindow(doc);
	
	doc.deleteSelection();
	doc.library.deleteItem(newMc.name);		
}

/* 向mc插入一帧， groupElement组中的aElement。*/
function addFrameSymbol(aDoc, mc, groupElement, aElement, i, needMcContainer, spritePerFrame)
{
	aDoc.selectNone();
	groupElement.selected = true;
	aDoc.enterEditMode();
	aDoc.selectNone();
	aElement.selected = true;
	aDoc.clipCopy();
	aDoc.exitEditMode();
	aDoc.selectNone();
	mc.selected = true;
	aDoc.enterEditMode();
	if(needMcContainer){
		fl.trace(needMcContainer);
		aDoc.selectAll();
		aDoc.enterEditMode('inPlace');
	}
	
	aDoc.getTimeline().insertBlankKeyframe(i);
	aDoc.clipPaste();
	aDoc.moveSelectionBy({x:-aDoc.selection[0].left, y:-aDoc.selection[0].top});
	
	aDoc.unGroup();
	if(spritePerFrame){
		doc.convertToSymbol("movie clip", "", "top left");
	}
	aDoc.exitEditMode();
	if(needMcContainer){
		aDoc.exitEditMode();
	}
}


function makeMcRes(fromDoc, desDoc, needConvert, symbolName, linkAs)
{
	if(_needNewDoc){
		copyToNewDoc(fromDoc, desDoc, needConvert, symbolName, linkAs);
	}else{
		copyToThisDoc(fromDoc, needConvert, symbolName, linkAs);
	}
}

/* 复制到新文件 */
function copyToNewDoc(fromDoc, desDoc, needConvert, symbolName, linkAs)
{
	fl.setActiveWindow(desDoc);
	desDoc.clipPaste();	
	if(needConvert){	
		var newMc = desDoc.convertToSymbol("movie clip", symbolName, "top left");
		newMc.linkageExportForAS = true;
		newMc.linkageExportInFirstFrame = true;
		newMc.linkageClassName = linkAs;	
	}
	desDoc.selectAll();
	desDoc.deleteSelection();
}

/* 复制在本文档并生成新mc */
function copyToThisDoc(fromDoc, needConvert, symbolName, linkAs)
{
	if(needConvert){	
		fromDoc.selectNone();
		fromDoc.clipPaste();	
		var newMc = fromDoc.convertToSymbol("movie clip", symbolName, "top left");
		newMc.linkageExportForAS = true;
		newMc.linkageExportInFirstFrame = true;
		newMc.linkageClassName = linkAs;	
		fromDoc.deleteSelection();
	}
}

/* 整理库文件夹 */
function cleanLibrary(aDoc) 
{
	var lib = aDoc.library;
	lib.newFolder("dev");
	lib.newFolder("art");
	var allItem = lib.items;
	for(var i = 0; i < allItem.length; i++) {
		var item = allItem[i];
		if(item.itemType == 'folder') {
			continue;
		}
		if(item.linkageExportForAS == true) {
			lib.moveToFolder("dev", item.name, false);
		} else{
			lib.moveToFolder("art", item.name, false);
		}
	}
}