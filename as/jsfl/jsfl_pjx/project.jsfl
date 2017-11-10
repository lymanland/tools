//fl.trace(fl.scriptURI);
var myName = "liziqiang";
var orgUri = "file:///E|/vstsworkspace/projectX/source";
var folderURI = orgUri + "/project";
var validateURI= orgUri + "/assets"
var fileURI = folderURI+"/dateReplace/"+myName+"/.flashProjectProperties"; 
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
FLfile.setAttributes(URI, "V");
var xml = XML(FLfile.read(fileURI)); 
var doc = fl.getDocumentDOM();
var curUri = doc.pathURI;
curUri = curUri.replace("projectx", "projectX");
var arr = curUri.split("/");
fileXml = new XML("<uri>"+curUri+"</uri>");
fileXml.@label = arr[arr.length - 1];
var isEnd = false;
if(curUri.indexOf(validateURI) == -1)
{
	alert("路径错误！");
}
else{
	for each(var xml2 in xml.compileList.uri)
	{
		if(xml2 == curUri)
		{
			isEnd = true;
		}
	}
	if(!isEnd)
	{
		xml.compileList.appendChild(fileXml);
		if(FLfile.write(fileURI, xml))
		{
			fl.trace(arr[arr.length - 1]+" 加入变更集成功！");
			
		}
		else
		{
			alert("变更集没签出");
		}
	}
	else
	{
		alert("已在变更集中！");
	}
}