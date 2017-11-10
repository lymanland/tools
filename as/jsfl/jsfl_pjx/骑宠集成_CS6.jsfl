/*
	author; hekehui
*/
var debug = false;
var traceLog = true;
var errorBreak = false;

var doc;
var lib;

//trace(fl.scriptURI);
var RootFolder = "file:///E|/vstsworkspace/projectx/source/assets/ridepet";

var TextureRootFolder = RootFolder + "/textures";
var LogFileURL = RootFolder + "/log.txt";
var ResultLogURL = RootFolder + "/flog.txt";
var ReleaseConfig = "file:///E|/vstsworkspace/projectx/source/assets/ridepet/release_cs6.xml";
FLfile.createFolder(TextureRootFolder);

var RevisoryBorder = 10;
var Lib_SourceFolderName = "source";
var Lib_SourceActionNamePrefix = "source/Action";
var Lib_ArtFolderName = "art";
var Lib_DevFolderName = "dev";
var Lib_DevPngFolderName = "dev/png";
var ActionLayerBitmapClassNameFormat = "mmo.ridepet.pet#ID#.#ACTION#";

var Lib_ConfigSymbolName = "dev/Config";
var ConfigClassNameFormat = "mmo.ridepet.pet#ID#.Config";
var MovieXmlFileName = "Movie.xml";
var SkinInfoClassPathFormat = "file:///E|/vstsworkspace/projectx/source/as/ridepet/skinInfo/mmo/ridepet/pet#ID#/Pet#ID#_SkinInfo.as";

var processLog = "";
FLfile.write(LogFileURL, processLog);
var resultLog = "文件处理日志：\t"  + new Date();

var petId = 0;
var petOutFolder = "";
var layerOutFolder = "";
var layerOutFolder = "";
var petMovieConfig = "";

var petActionList = [];
var currentActionInfo = {};
var actionKeyFrameList = [];
var actionLayerList = [];
var actionSeatCount = 0;
var frameLabelMap = {};

var SpriteSheetCommand = '"C:/Program Files (x86)/CodeAndWeb/TexturePacker/bin/TexturePacker.exe" --data #Path#.xml --format sparrow --sheet #Path#.png --opt RGBA4444 --allow-free-size --max-width 4096 --max-height 4096 --algorithm MaxRects --maxrects-heuristics best --padding 0 --trim --size-constraints AnySize --force-publish --trim-mode Trim #Path#';
var PackResourceCommand = '"E:/vstsworkspace/projectX/source/tools/RidePetResourcePacker/exe/RidePetResourcePacker.exe" '
	+ FLfile.uriToPlatformPath(RootFolder) + ' ridepet#ID# /spritesheet /xml';
fl.outputPanel.clear();
trace("*************************************************************************************");
trace("新版骑宠集成脚本，只操作可写的fla文件");
trace("骑宠文件： " + FLfile.uriToPlatformPath(RootFolder + "/ridepet*.fla"));
trace("*************************************************************************************");
trace("");

init();
main();

function init(){
	trace("集成日志：\r\n集成开始-------------------------------" + new Date());
}

function main(){
	var fileList = FLfile.listFolder(RootFolder, "files");
	var totalFile = 0;
	var errorFile = 0;
	for (var fileIndex = 0; fileIndex < fileList.length; fileIndex++)
	{
		var fileUrl = RootFolder + "/" + fileList[fileIndex];
		if(!this.isNeedProcess(fileUrl)){
			continue;
		}
		var fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
			
		var result = processPetFile(fileUrl);
		if(result != ""){
			errorFile ++;
			trace(fileName + " 发生致命错误：" + result);
			this.writeResultLog(fileName + " \t" + result + "\t" + new Date());
			if(errorBreak){
				break;
			}else{
				fl.getDocumentDOM().close(false); 
			}
		}else{
			totalFile ++;
			this.writeResultLog(fileName + " \t[SUCCEED] \t"  + new Date());
		}
	}
	
	trace(totalFile + " 处理成功， " + errorFile + " 处理错误");
	trace("集成结束-------------------------------" + new Date());	
}

function isNeedProcess(fileUrl){
	var extension = fileUrl.substring(fileUrl.lastIndexOf(".") + 1);
	var fileName = fileUrl.substring(fileUrl.lastIndexOf("/") + 1);
	if(extension != "fla"){
		return false;
	}
	var attr = FLfile.getAttributes(fileUrl);
	if (attr && (attr.indexOf("R") != -1)) { 
		return false;
	}
	return true;
}

function processPetFile(fileUrl){	
	var value = fileUrl.substring(fileUrl.lastIndexOf("/ridepet") + 8, fileUrl.lastIndexOf("."));	
	petId = Number(value);
	trace("\r\n集成骑宠 id:" + petId + + " " + new Date());
	
	var result = this.preProcess(fileUrl);
	if(result != ""){
		return result;
	}
	
	petMovieConfig = '<RidePet petId="' + petId + '">';
	
	result = this.gatherActionList();
	if(result != ""){
		return result;
	}
	
	for(var index = 0; index < petActionList.length; index ++){
		currentActionInfo = petActionList[index];
		if(currentActionInfo == null){
			continue;
		}
		result = this.processAction();
		if(result != ""){
			return result;
		}
	}
	
	petMovieConfig += "\r\n</RidePet>";
	FLfile.write(petOutFolder + "/" + MovieXmlFileName, petMovieConfig);
	
	this.packResource();	
	this.createConfig();
	
	doc.width = 1;
	doc.height = 1;
	this.toStageAndClear();
	
	moveToArt();
	
	if(!debug){
		fl.saveDocument(doc);
		doc.publish();
		doc.close();
	}
	
	trace("\r\n完成pet" + petId + "-------------------------------" + new Date());;	
	
	//trace(petMovieConfig);
	return "";
}

function preProcess(fileUrl){
	trace("\n*预处理文件结构 " + FLfile.uriToPlatformPath(fileUrl));
	fl.openDocument(fileUrl);
	doc = fl.getDocumentDOM();
	lib = doc.library;
	this.changeProfile();
	
	// folders
	petOutFolder =  TextureRootFolder + "/ridepet" + petId;
	FLfile.remove(petOutFolder);		
	FLfile.createFolder(petOutFolder);		
	
	lib.deleteItem(Lib_DevFolderName);
	lib.newFolder(Lib_DevFolderName);
	lib.deleteItem(Lib_DevPngFolderName);
	lib.newFolder(Lib_DevPngFolderName);
	
	lib.newFolder(Lib_ArtFolderName);	
	
	// 先删除，不然资源已经删除，但引用还在，导出时有错误警告
	lib.deleteItem(Lib_ConfigSymbolName);

	if(!lib.itemExists(Lib_SourceFolderName)){
		var message = "[ERROR]文件内没有目录：" + Lib_SourceFolderName;
		trace("\t" + message);
		return message;
	}

	this.toStageAndClear();
	return "";
}

function gatherActionList(){
	trace("\n*收集骑宠动作");
	var items = lib.items;
	for(var index = 0; index < items.length; index ++){
		var item = items[index];
		if(item.name.substring(0, Lib_SourceActionNamePrefix.length) == Lib_SourceActionNamePrefix){
			var actionName = item.name.substring(Lib_SourceFolderName.length + 1);
			if(actionName.indexOf(" ") != -1){
				continue;
			}
			petActionList[petActionList.length] = {"actionName": actionName, "symbolName":item.name};
			trace("\taction:" + actionName + " symbolName:" + item.name);
		}
	}
	trace("*骑宠有效动作数：" + petActionList.length);
	return "";
}

function processAction(){
	trace("\n* 开始处理动作:“" + currentActionInfo.symbolName + "” " + new Date());	
	
	actionOutFolder = petOutFolder + "/" + currentActionInfo.actionName;
	FLfile.createFolder(actionOutFolder);
		
	lib.selectItem(currentActionInfo.symbolName, true, true);
	var libSymbol = lib.getSelectedItems()[0];
	var result = this.gatherActionInfo(libSymbol);
	if(result != ""){
		return result;
	}

	this.exportActionLayers();
	this.generateActionConfig();
	trace("* 动作:“" + currentActionInfo.actionName + "” 处理完成" + "\t" + new Date());	
		
	return "";
}

function gatherActionInfo(libSymbol){
	var timeLine = libSymbol.timeline;
	if(timeLine.layers.length < 3){
		return "[ERROR]动作 "+ currentActionInfo.actionName + ") 缺少必须的图层，3层以上";
	}
	var result = this.gatherActionKeyFrameList(libSymbol);
	if(result != ""){
		return result;
	}
	var result = this.gatherActionLayers(libSymbol);
	if(result != ""){
		return result;
	}
	result = this.gatherActionFrameLabels(libSymbol);
	return result;
}

function gatherActionKeyFrameList(libSymbol){
	trace("\n\t#收集关键帧:");	
	actionKeyFrameList = [];
	var bitmapIndex = -1;
	var keyFrameCount = 0;
	
	var timeLine = libSymbol.timeline;
	var layer = timeLine.layers[0];
	actionTotalFrames = layer.frameCount;
	for(var frameIndex = 0; frameIndex < layer.frameCount; frameIndex ++){
		var frame = layer.frames[frameIndex];
		if(frame.startFrame != frameIndex){ // 非关键帧
			continue;
		}
		bitmapIndex ++;
		var frameInfo = {"frameIndex":frameIndex, "duration":frame.duration}
		frameInfo["bitmapIndex"] = bitmapIndex;
		trace("\t\tkeyFrame index:" + frameIndex + " duration:" + frame.duration + " bitmapIndex:" + bitmapIndex);
		actionKeyFrameList[actionKeyFrameList.length] = frameInfo;
	}
	trace("\t#收集关键帧完成 keyFrame count:"+ actionKeyFrameList.length);
	return "";
}

function gatherActionLayers(libSymbol){
	trace("\n\t#收集动作层次");	
	actionLayerList = [];
	actionSeatCount = 0;
	
	var timeLine = libSymbol.timeline;
	
	var layerInfo = {"startIndex":0}
	for(var layerIndex = 0; layerIndex < timeLine.layers.length; layerIndex ++){
		var layer = timeLine.layers[layerIndex];
		var layerNamePrefix = layer.name.substr(0, 2);
		if(layerNamePrefix == "座位" || layerNamePrefix == "分层"){
			// 前面有未处理的层
			if(layerIndex != layerInfo.startIndex){
				layerInfo.endIndex = layerIndex - 1;
				layerInfo.type = "movie";
				layerInfo.layerIndex = actionLayerList.length;
				trace("\t\tlayer type:" + layerInfo.type 
					  + " startIndex:" + layerInfo.startIndex
					  + " endIndex:" + layerInfo.endIndex);
				actionLayerList[actionLayerList.length] = layerInfo;
			}
			if(layerNamePrefix == "座位"){
				var seatIndex = Number(layer.name.substr(4))
				layerInfo = {"startIndex":layerIndex, "endIndex":layerIndex
					, type:"seat", "seatIndex":seatIndex, "layerIndex":actionLayerList.length}
				actionLayerList[actionLayerList.length] = layerInfo;
				trace("\t\tlayer type:" + layerInfo.type 
					  + " startIndex:" + layerInfo.startIndex
					  + " endIndex:" + layerInfo.endIndex
					  + " seatIndex:" + seatIndex);
				actionSeatCount ++;
			}
			layerInfo = {"startIndex":layerIndex + 1}
		}
		if(layerIndex == timeLine.layers.length -1){
			layerInfo.endIndex = layerIndex;
			layerInfo.type = "movie";
			layerInfo.layerIndex = actionLayerList.length;
			trace("\t\tlayer type:" + layerInfo.type 
				 + " startIndex:" + layerInfo.startIndex
				 + " endIndex:" + layerInfo.endIndex);
			actionLayerList[actionLayerList.length] = layerInfo;			
		}
	}
	if(actionSeatCount <= 0){
		return "[ERROR]动作 "+ currentActionInfo.actionName + ") 没有定义座位";
	}
	trace("\t#收集动作层次完成 layer count:" + actionLayerList.length);	
	currentActionInfo.layerList = actionLayerList;
	return "";
}

function gatherActionFrameLabels(libSymbol){
	trace("\n\t#收集帧标签");	
	frameLabelMap = {};
	var timeLine = libSymbol.timeline;
	for(var layerIndex = 0; layerIndex < timeLine.layers.length; layerIndex ++){
		var layer = timeLine.layers[layerIndex];
		var layerFrames = layer.frames;
		for(var frameIndex = 0; frameIndex < layerFrames.length; frameIndex ++){
			var layerFrame = layerFrames[frameIndex];
			if(layerFrame.startFrame != frameIndex || layerFrame.name == ""){
				continue;
			}		
			var frameLabels = frameLabelMap[frameIndex];
			if(frameLabels == undefined){
				frameLabels = [layerFrame.name];
			}else{
				frameLabels[frameLabels.length] = layerFrame.name;
			}
			frameLabelMap[frameIndex] = frameLabels;
			trace("\t\tframe:" + frameIndex + " frameLabel:" + layerFrame.name);
		}
	}
	trace("\t#收集帧标签完成");	
	return "";
}

function exportActionLayers(){
	trace("\n\t#导出位图资源");		
	var tempSymbolName = Lib_SourceFolderName + "/exportTemp";
	for(var layerIndex = 0; layerIndex < actionLayerList.length; layerIndex ++){
		var layerInfo = actionLayerList[layerIndex];
		lib.selectItem(currentActionInfo.symbolName, true, true);
		if(layerInfo.type == "seat"){
			this.gatherSeatInfo(layerInfo);
			continue;
		}
		lib.deleteItem(tempSymbolName);
		lib.duplicateItem();
		lib.renameItem("exportTemp");
		this.clearLinkClass();
			
		this.exportLayerBimtap(layerInfo);
		
		lib.deleteItem(tempSymbolName);
	}
	trace("\t#导出位图资源完成");		
}

function gatherSeatInfo(layerInfo){
	var libSymbol = lib.getSelectedItems()[0];
	var timeLine = libSymbol.timeline;
	var layer = timeLine.layers[layerInfo.startIndex];
	var frameList = layer.frames;
	var frameInfoList = [];
	for(var index = 0; index < actionKeyFrameList.length; index ++){
		var keyFrameInfo = actionKeyFrameList[index];
		var frameInfo = {"frameIndex":keyFrameInfo.frameIndex, "duration":keyFrameInfo.duration}
		var frame = frameList[frameInfo.frameIndex];
		var seatSymbol = frame.elements[0];
		frameInfo.x = seatSymbol.x;
		frameInfo.y = seatSymbol.y;
		frameInfo.matrix = seatSymbol.matrix;
		frameInfo.visible = seatSymbol.visible;
		frameInfo.alpha = 100;
		if(seatSymbol.colorMode == "alpha"){
			frameInfo.alpha = seatSymbol.colorAlphaPercent;
		}
		frameInfoList[frameInfoList.length] = frameInfo;
	}
	layerInfo.frameList = frameInfoList;
}

function exportLayerBimtap(layerInfo){
	trace("\n\t\t#导出层:" + layerInfo.layerIndex + " 的位图资源");		
	var libSymbol = lib.getSelectedItems()[0];
	var timeLine = libSymbol.timeline;
	for(var layerIndex = 0; layerIndex < timeLine.layers.length; layerIndex ++){
		if(layerIndex < layerInfo.startIndex || layerIndex > layerInfo.endIndex){
			var layer = timeLine.layers[layerIndex];
			layer.layerType = 'guide';
		}
	}
	
	this.toStageAndClear();
	lib.addItemToDocument({x:0, y:0});
	doc.setElementProperty('symbolType', 'graphic');
	var item = doc.selection[0];

	var layerFrameList = [];
	for(var index = 0; index < actionKeyFrameList.length; index ++){
		var keyFrameInfo = actionKeyFrameList[index];
		var frameInfo = {"frameIndex":keyFrameInfo.frameIndex, "duration":keyFrameInfo.duration, "bitmapIndex":keyFrameInfo.bitmapIndex}
		var bitmapIndex = frameInfo.bitmapIndex;	
		trace("\t\tkeyFrame " + frameInfo.frameIndex + " bitmapIndex:" + bitmapIndex);		
		item.x = 0;
		item.y = 0;		
		doc.selectAll();
		item = doc.selection[0];
		doc.setElementProperty('firstFrame', frameInfo.frameIndex);
		var rect = doc.getSelectionRect();
		var rectStr = "left:" + rect.left + " top:" + rect.top 
			+ " right:" + rect.right + " bottom:" + rect.bottom 
			+ " width:" + item.width + " height:" + item.height;
		trace("\t\trect:" + rectStr);			
		if(rect == 0 || rect.left == rect.right || rect.top == rect.bottom){
			doc.width = 2;
			doc.height = 2;
			trace("\t\tnull");
		}else{
			item.x = Math.round(-rect.left + RevisoryBorder);
			item.y = Math.round(-rect.top + RevisoryBorder);
			rect = doc.getSelectionRect();
			doc.width = getEvenNumber(rect.right + RevisoryBorder);
			doc.height = getEvenNumber(rect.bottom + RevisoryBorder);
		}
		var offsetX = -(item.x);
		var offsetY = -(item.y);
		trace("\t\toffset x:" + offsetX + " y:" + offsetY);
		frameInfo["offsetX"] = offsetX;
		frameInfo["offsetY"] = offsetY;		
		frameInfo["width"] = doc.width;
		frameInfo["height"] = doc.height;
		layerFrameList[layerFrameList.length] = frameInfo;
		// export
		var pngUrl =  actionOutFolder + "/Layer" + layerInfo.layerIndex + "_Bitmap" + bitmapIndex + ".png"
		fl.trace("pngUrl:" + FLfile.uriToPlatformPath(pngUrl));
		fl.trace("width:" + doc.width + " height:" + doc.height);
		doc.exportPNG(pngUrl, true, true);
	}
	layerInfo.frameList = layerFrameList;
	trace("\t\t#导出层:" + layerInfo.layerIndex + " 的位图资源完成");		
}

function convertToSpriteSheet(){
	var command = SpriteSheetCommand.replace(/#Path#/g, FLfile.uriToPlatformPath(actionOutFolder));
	fl.trace("convertToSpriteSheet command:" + command);
	FLfile.runCommandLine(command)
}

function generateActionConfig(){
	trace("\n\t#生成动作配置:");			
	petMovieConfig += "\r\n  <Action name=\"" + currentActionInfo.actionName 
		+ "\" totalFrames=\"" + actionTotalFrames + '">';	
	
	petMovieConfig += '\r\n    <Layers layerCount="' + actionLayerList.length + '" >';	
	for(var layerIndex = 0; layerIndex < actionLayerList.length; layerIndex ++){
		var layerInfo = actionLayerList[layerIndex];
		petMovieConfig += "\r\n      <Layer layerIndex=\"" + layerInfo.layerIndex 
			+ '" type="' + layerInfo.type + '"';
		if(layerInfo.type == "seat"){
			petMovieConfig += ' seatIndex="' + layerInfo. seatIndex + '"';	
		}			
		petMovieConfig += ' >';	
		var layerFrameList = layerInfo.frameList;
		petMovieConfig += "\r\n        <TimeLine totalFrames=\"" + actionTotalFrames + "\" >";	
		for(var layerFrameIndex = 0; layerFrameIndex < layerFrameList.length; layerFrameIndex++){
			var layerFrameInfo = layerFrameList[layerFrameIndex];
			petMovieConfig += "\r\n\          <KeyFrame index=\"" + layerFrameInfo.frameIndex + '"';
			petMovieConfig += " duration=\"" + layerFrameInfo.duration + "\"";
			if(layerInfo.type == "seat"){
				petMovieConfig += '  matrix="' + toMatrixStr(layerFrameInfo.matrix) + '"';
				petMovieConfig += ' visible="' + layerFrameInfo.visible + '"';
				petMovieConfig += ' alpha="' + layerFrameInfo.alpha + '"';
			}else{
				petMovieConfig += '  bIndex="' + layerFrameInfo.bitmapIndex + '"';		
				petMovieConfig += '  offsetX="' + layerFrameInfo.offsetX + '"';
				petMovieConfig += '  offsetY="' + layerFrameInfo.offsetY + '"';			
			}
			petMovieConfig +=  " />"
		}
		petMovieConfig += "\r\n        </TimeLine>";	
		petMovieConfig += "\r\n      </Layer>";	
	}	
	petMovieConfig += "\r\n    </Layers>";	
	
	petMovieConfig += "\r\n  <FrameLabels>";	
	for(var key in frameLabelMap){
		petMovieConfig += '\r\n\    <Frame index="' + key + '" label="' + frameLabelMap[key] + '" />';
	}
	petMovieConfig += "\r\n    </FrameLabels>";	
	
	petMovieConfig += "\r\n  </Action>";	
}

function packResource(){
	trace("\n*打包资源");		
	var command = PackResourceCommand.replace("#ID#",  petId);
	trace("\t#packResource command:" + command);
	FLfile.runCommandLine(command)
	
	trace("\n\t#导入位图资源");
	for(var actionIndex = 0; actionIndex < petActionList.length; actionIndex ++){
		var actionInfo = petActionList[actionIndex];
		var fileName = actionInfo.actionName + ".png";
		var fileUrl = petOutFolder + "/" + fileName;
		
		trace("\n\t\t#导入位图:" + fileUrl);
		doc.importFile(fileUrl, true);
		lib.selectItem(fileName);
		lib.moveToFolder(Lib_DevPngFolderName);

		// 无损
		lib.setItemProperty('allowSmoothing', false);
		lib.setItemProperty('compressionType', 'lossless');

		// 导出类
		var className = ActionLayerBitmapClassNameFormat.replace("#ID#", petId);
		className = className.replace("#ACTION#", actionInfo.actionName);
		this.setLinkClass(className);
	}
	trace("\n\t#导入位图资源完成");
	trace("\n*打包资源完成");		
}

function createConfig(){
	trace("\n*配置xml为嵌入资源:");		
	lib.deleteItem(Lib_ConfigSymbolName);
	lib.addNewItem("movie clip", Lib_ConfigSymbolName);	
	lib.selectItem(Lib_ConfigSymbolName, true, true);
	
	var className = ConfigClassNameFormat.replace("#ID#", petId);
	this.setLinkClass(className);
	var script = '[Embed("../../as/ridepet/skininfo/mmo/ridepet/pet' + petId +'/ridepet'+petId +'.xml", mimeType="application/octet-stream")]\rvar ConfigRes:Class;';
	var skinInfoClassName = SkinInfoClassPathFormat.replace(/#ID#/g, petId);
	if(FLfile.exists(skinInfoClassName)){
		script += "\nvar skinInfo:Pet" + petId + "_SkinInfo;";
	}
	
	var timeLine = lib.getSelectedItems()[0].timeline;
	var layer = timeLine.layers[0];	
	var frame = layer.frames[0];
	frame.actionScript = script;
}

function setLinkClass(className){
	lib.setItemProperty('linkageExportForAS', true);
	lib.setItemProperty('linkageExportInFirstFrame', true);
	lib.setItemProperty('linkageClassName', className);					
}

function moveToArt(){
	// 将根目标下元件全部转到art目标
	for(var index = 0; index < lib.items.length; index ++){	
		var item = lib.items[index];
		if(!(item.name.substring(0, Lib_SourceFolderName.length) == Lib_SourceFolderName 
			|| item.name.substring(0, Lib_ArtFolderName.length) == Lib_ArtFolderName 															
			|| item.name.substring(0, Lib_DevFolderName.length) == Lib_DevFolderName )){
			lib.moveToFolder("art", item.name);
		}	
	}	
}

function clearLinkClass(){
	if(lib.getItemProperty("linkageExportForAS")){
		lib.setItemProperty("linkageClassName", "");								
		lib.setItemProperty("linkageExportForAS", false);
	}
}

function toStageAndClear(){
	doc.editScene(0);
	var timeLine = doc.getTimeline();
	for each(var layer in timeLine.layers){
		layer.locked = false;
		layer.visible = true;
		layer.outline = false;
	}
	doc.selectAll();
	if(doc.selection.length > 0){
		doc.deleteSelection();
	}
	doc.selectNone();
}

function changeProfile(){
	doc.importPublishProfile(ReleaseConfig);
}

function getNumber(number){
	return Math.round(number * 100) / 100.0;
}

function getEvenNumber(number){
	var value =  Math.round(number);
	var m = value % 2;
	if(m != 0){
		value = value + (2-m);
	}
	return value;
}

function trace(info){
	processLog += "\r\n" + info;
	this.writeLog();
	
	if(traceLog){
		fl.trace(info);
	}
}

function writeLog(){
	FLfile.write(LogFileURL, processLog, true);
	processLog = "";
}


function writeResultLog(info){
	resultLog += "\r\n" + info;
	FLfile.write(ResultLogURL, resultLog) 
}

function trim(str){
	return str.replace(/(^\s*)|(\s*$)/g, "")
}

function toMatrixStr(matrix){
	return getNumber(matrix.a) + "," + getNumber(matrix.b) + "," + getNumber(matrix.c) + ","
		+ getNumber(matrix.d) + "," + getNumber(matrix.tx) + "," + getNumber(matrix.ty);
}

function toBreak(){
	var ss;
	ss.test1();
}