var doc = fl.getDocumentDOM();
var lib = doc.library;
var myItems = lib.items;
var devFolder = "dev";
var artFolder = "art";
if (!lib.itemExists(artFolder))
{
	lib.newFolder(artFolder);
}
if (!lib.itemExists(devFolder))
{
	lib.newFolder(devFolder);
}
clear();
deleteOtherFolder();

function clear()
{
	for (var i = 0; i < myItems.length; i++)
	{
		if (myItems[i].linkageExportForAS == true)
		{
			if (myItems[i].name.indexOf(devFolder + "/") == -1)//在dev文件夹下面的不管
			{
				lib.moveToFolder(devFolder, myItems[i].name, false);
			}
		}
		else if (myItems[i].itemType != "folder")
		{
			if (myItems[i].name.indexOf(devFolder + "/") == -1)//不在dev文件夹下面的才move到art文件夹
			{
				lib.moveToFolder(artFolder, myItems[i].name, false);
			}
		}
	}
}

function deleteOtherFolder()
{
	for (var i = 0; i < myItems.length; i++)
	{
		if (myItems[i].itemType == "folder" && myItems[i].name != artFolder && myItems[i].name.indexOf(devFolder) == -1)
		{
			lib.deleteItem(myItems[i].name);
		}
	}
}

//function oldClear()
//{
//	for (var i = 0; i < myItems.length; i++)
//	{
//		if ((myItems[i].itemType != "folder") && myItems[i].name.indexOf("/") == -1 && myItems[i].linkageClassName == null && myItems[i].linkageExportForAS == false)
//		{
//			lib.moveToFolder(artFolder, myItems[i].name, false);
//		}
//		else if ((myItems[i].itemType != "folder") && myItems[i].name.indexOf("/") == -1 && myItems[i].linkageClassName != null && myItems[i].linkageExportForAS == true)
//		{
//			lib.moveToFolder(devFolder, myItems[i].name, false);
//		}
//	}
//}


