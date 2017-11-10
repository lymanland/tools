fl.outputPanel.clear();
var doc = fl.getDocumentDOM();
var lib = doc.library;
var filePath = doc.pathURI;
fl.trace("File:\r\t"+ filePath);

var folderURL = filePath.substring(0, filePath.lastIndexOf("/"));
fl.trace("folderURL:" + folderURL);

var fileList1 = FLfile.listFolder(folderURL, "files");
var totalFile = 0;
for (var fileIndex = 0; fileIndex < fileList1.length; fileIndex++)
{
	var fileURL = folderURL + "/" + fileList1[fileIndex];
	var extension = fileURL.substring(fileURL.lastIndexOf(".") + 1);
	if(extension == "fla"){
		fl.trace("build file:" + fileURL + "    \t" +  (fileIndex + 1) + "/" + fileList1.length);
		fl.openDocument(fileURL);
		
		var doc = fl.getDocumentDOM();
		doc.publish();
		doc.close();	
	}
}