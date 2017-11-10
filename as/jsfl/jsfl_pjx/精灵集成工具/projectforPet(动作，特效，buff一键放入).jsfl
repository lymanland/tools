fl.outputPanel.clear(); 
var sucRecord = [];
var errRecord = [];
var myName = "linkaichao";
var orgUri = "file:///E|/vstsworkspace/projectX/source";
var folderURI = orgUri + "/project";
var validateURI= orgUri + "/assets"
var typeArr = ["action", "effect", "buffer"];
var pathUri = "E:/vstsworkspace/projectX/source";
var pathPreFixArr = [
					 pathUri + "/assets/battleaction/", 
					 pathUri + "/assets/battleeffect/", 
					 pathUri + "/assets/battlebuffer/"
					 ];
var savePreFixArr = [
					 orgUri + "/assets/battleaction/", 
					 orgUri + "/assets/battleeffect/", 
					 orgUri + "/assets/battlebuffer/"
					 ];					 
var fileURI = folderURI+"/dateReplace/"+myName+"/.settings/com.adobe.flexbuilder.flashbridge.prefs"; 
var fileList2 = FLfile.listFolder(folderURI, "directories"); //folders 
fileList2.sort();
for(var idx = fileList2.length - 1; idx >= 0; idx--)
{
	if(fileList2[idx].indexOf("_") == -1)
	{
		break;
	}
}
fileURI = fileURI.replace("dateReplace", fileList2[idx]);
if(FLfile.exists(fileURI))
{
	fl.trace(fileURI+"\n");
	var str = FLfile.read(fileURI);
	var fileAddURL = fl.browseForFolderURL("请选择打开文件夹路径", "select file");
	if(fileAddURL != null) {
		for(var i = 0; i<typeArr.length; i++)
		{
			var fileMask = typeArr[i] + "*.fla";
			var fileAddList = FLfile.listFolder(fileAddURL + "/" + fileMask, "files");
			handleBatchFile(fileAddList, i);
		}
		if(FLfile.write(fileURI, str))
		{
			printRecord();
		}
		else
		{
			var tmpfileURI = fileURI.replace("file:///", "");
			tmpfileURI = tmpfileURI.replace("|/", ":/");
			var command = '"C:/Program Files/Microsoft Visual Studio 8/Common7/IDE/tf.exe" checkout '+tmpfileURI;
			FLfile.runCommandLine(command);
			FLfile.write(fileURI, str)
			fl.trace("签出变更集！");
			fl.trace(tmpfileURI+" 加入变更集成功！");

		}
	}
}
else
{
	fl.trace(fileURI+"\n变更集不存在");
}

function handleBatchFile(fileAddList, type) {
	for each(var file in fileAddList) {
		handleSingleFile(file, type);
	}
}

function handleSingleFile(file, type) {
	var curUri = pathPreFixArr[type]+file;
	var temp;
	var pathsStart = "flashProFiles/paths=";
	var pathsEnd = "flashProFiles/flashProID="
	var indexPathsStart = str.indexOf(pathsStart);
	var indexPathsEnd = str.indexOf(pathsEnd);
	var tempFileList = str.slice(indexPathsStart+pathsStart.length, indexPathsEnd-1);
	var tempFileListArray = tempFileList.split(";");
	var hasTempFile = false;
	for each(var tempFile in tempFileListArray )
	{
		if(tempFile == curUri)
		{
			hasTempFile = true;
		}
	}
	saveFile(file, type)
	if(!hasTempFile)
	{
		tempFileList = tempFileList + ";" + curUri;
//		saveFile(file, type)
		sucRecord.push(file);
	}
	else
	{
		errRecord.push(file+"已在变更集中！");
	}
	temp = str.slice(0, indexPathsStart+pathsStart.length);
	temp += tempFileList;
	temp += str.slice(indexPathsEnd-1, str.length-1);
	str = temp;
	
	//var fileXml = new XML("<uri>"+curUri+"</uri>");
	//fileXml.@label = file;
	//var isEnd = false;
	//for each(var xml2 in xml.compileList.uri)
	//{
	//	if(xml2 == curUri)
	//	{
	//		isEnd = true;
	//	}
	//}
	//if(!isEnd)
	//{
	//	xml.compileList.appendChild(fileXml);
	//	sucRecord.push(file);
	//}
	//else
	//{
	//	errRecord.push(file+"已在变更集中！");
	//}
}

function saveFile(file, type){
	var isHad = false;
	var command = '"C:/Program Files/Microsoft Visual Studio 8/Common7/IDE/tf.exe" add '+ pathPreFixArr[type] + file;
	if(FLfile.exists(savePreFixArr[type] + file)){
		isHad = true;
		command = '"C:/Program Files/Microsoft Visual Studio 8/Common7/IDE/tf.exe" checkout '+ pathPreFixArr[type] + file;
	}
	if(isHad){
		errRecord.push("签出并覆盖" + savePreFixArr[type] + file);
		FLfile.runCommandLine(command);
	}
	var url=fileAddURL + "/" + file;
	var doc = fl.openDocument(url); 
	fl.saveDocument(doc,savePreFixArr[type]  + file);
	doc.publish();
	fl.closeDocument(doc, false);
	
	if(!isHad){
		FLfile.runCommandLine(command);
	}
}

function printRecord() {
	fl.trace("--------------------- 成功加入变更集列表 -------------------------");
	for(var i = 0; i < sucRecord.length; i++) {
		fl.trace(sucRecord[i]);
	}
	fl.trace("--------------------- 成功加入变更集列表 表尾-------------------------\n");
	fl.trace("--------------------- 错误信息列表 -------------------------");
	for(var j = 0; j < errRecord.length; j++) {
		fl.trace(errRecord[j]);
	}
	fl.trace("--------------------- 错误信息列表 表尾-------------------------\n");
}