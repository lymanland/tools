var toolTypeArr = ["action", "effect", "effect"];
var classNamePreFixArr = ["mmo.battle.action.Action", "mmo.effect.Effect", "mmo.effect.EffectName"];
var classFilterArr = [
	[], 
	["mmo.effect.EffectName","mmo.effect.EffectFullScreen"], 
	[]
]
var isNeedArr = [1, 1, 0];
var errDescArr = ["动作", "特效", "特效名"];
var errRecord = [];
var fileURL;

fileURL = fl.browseForFolderURL("请选择打开文件夹路径", "select file");
if(fileURL != null) {
	for(var i = 0; i<toolTypeArr.length; i++)
	{
		var fileMask = toolTypeArr[i] + "*.fla";
		var fileList = FLfile.listFolder(fileURL + "/" + fileMask, "files");
		handleBatchFile(fileList, i);
	}
	printErrRecord();
}

function handleBatchFile(fileList, type) {
	for each(var file in fileList) {
		handleSingleFile(file, type);
	}
}

function handleSingleFile(file, type) {
	var filename = file.replace(".fla", "");
	var id = filename.replace(toolTypeArr[type], "");
	var doc = fl.openDocument(fileURL +　"/" + file);
	var items = doc.library.items;
	var classNum = 0;
	for(var i = 0; i < items.length; i++) {
		var item = items[i];
		var className = item.linkageClassName;
		if(className == null)
		{
			continue;
		}
		if(isFilter(classFilterArr[type], className))
		{
			continue;
		}
		if(className.indexOf(classNamePreFixArr[type]) == -1)
		{
			continue;
		}
		classNum++;
		if(className != classNamePreFixArr[type] + id)
		{
			errRecord.push(errDescArr[type]+id+"导出类错误");
			if(classNum > 1)
			{
				errRecord.push(errDescArr[type]+id+"目标导出类超过一个");
				break;
			}
			/*item.linkageClassName = classNamePreFixArr[type] + id;
			doc.save();
			errRecord.push(errDescArr[type]+id+"已修复");*/
		}
	}
	if(classNum < 1 && isNeedArr[i] == 1)
	{
		errRecord.push(errDescArr[type]+id+"没有目标导出类");
	}
	fl.closeDocument(doc, false);
}

function isFilter(filter, className) {
	for(var i = 0; i < filter.length; i++)
	{
		if(className.indexOf(filter[i]) != -1)
		{
			return true;
		}
	}
	return false;
}

function printErrRecord() {
	var loggerName = fileURL + "/检测日志.txt";
	if(errRecord.length == 0) {
		var message = "--------------------- 无错误信息 -------------------------";
		fl.trace(message);
		if(FLfile.exists(loggerName)) {
			FLfile.write(loggerName, message, "append");
		} else {
			FLfile.write(loggerName, message + "\r\n");
		}
		return;
	}
	fl.trace("\n--------------------- 错误信息列表 -------------------------");
	for(var i = 0; i < errRecord.length; i++) {
		fl.trace(errRecord[i]);
		if(FLfile.exists(loggerName)) {
			FLfile.write(loggerName, errRecord[i] + "\r\n", "append");
		} else {
			FLfile.write(loggerName, errRecord[i] + "\r\n");
		}
	}
	fl.trace("--------------------- 错误信息列表 表尾-------------------------\n");
}