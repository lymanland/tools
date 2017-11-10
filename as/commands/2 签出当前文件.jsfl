var uriStr = "projectz/PJZdev/source";
var validateURI= "E:/"+uriStr+"/assets";
var doc = fl.getDocumentDOM();
var curUri = doc.pathURI;
//curUri = curUri.replace("projectx", "projectX");
curUri = curUri.replace("file:///", "");
curUri = curUri.replace("|/", ":/");
fl.trace(curUri);
if(curUri.indexOf(validateURI) == -1)
{
	alert("路径错误！");
}
else{
	var command = '"C:/Program Files (x86)/Microsoft Visual Studio 10.0/Common7/IDE/tf.exe" checkout '+curUri;
	FLfile.runCommandLine(command);
}