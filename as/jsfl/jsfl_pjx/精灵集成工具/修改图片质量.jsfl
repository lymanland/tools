var fileMask = "*.fla";
var fileURL = fl.browseForFolderURL("请选择打开文件夹路径", "select file");
var quality = parseInt(prompt('请输入图片质量(1-100)'));
if(fileURL != null && !isNaN(quality)) {
	var fileList = FLfile.listFolder(fileURL + "/" + fileMask, "files");
	handleBatchFile(fileList);
}

function handleBatchFile(fileList) {
	for each(var file in fileList) {
		handleSingleFile(file);
	}
}

function handleSingleFile(file) {
	var doc = fl.openDocument(fileURL +　"/" + file);
	var lib = doc.library;
	for each(var item in lib.items) {
		if(item.itemType == "bitmap") {
			lib.selectItem(item.name, true);
			lib.setItemProperty('allowSmoothing', false);
			lib.setItemProperty('compressionType', 'photo');
			lib.setItemProperty('useImportedJPEGQuality', false);
			lib.setItemProperty('quality', quality);
		}
	}
	doc.publish();
	fl.saveDocument(doc);
	fl.closeDocument(doc, false);
}