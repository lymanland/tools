var libName = "技能图标";
var clsName = "mmo.iconservice.res.SkillIcon_#raceId#";
var outputURL = "file:///E|/projectio/dev/source/assets/iconservice/res/skillicon_#raceId#.fla";
var filePrefix = "skillicon-";
var defaultRaceId = 0;
var defaultFilePath = "";

function exportPetIcon(raceId, filePath)
{
	//fl.outputPanel.clear();
	var doc;
	//fl.trace("888888888888 = " + raceId);
	if (raceId == 0)
	{
		//raceId = prompt("raceid:", "0");
		var fileName = fl.getDocumentDOM().name.split(".fla")[0];
		defaultRaceId = fileName.split(filePrefix)[1];
		raceId = prompt("skillID", defaultRaceId);
		if (raceId == null || raceId == "")
		{
			return;
		}
		//fl.trace("111111111111 = " + raceId);
		doc = fl.getDocumentDOM();
	}
	else
	{
		//fl.trace("2222222 = " + raceId);
		doc = fl.openDocument(filePath);
	}
	//fl.trace(name);
	clsName = clsName.replace("#raceId#", raceId);
	doc.library.selectItem(libName);
	fl.getDocumentDOM().library.addItemToDocument({x: 0, y: 0});
	doc.clipCopy();

	var newDoc = fl.createDocument();
	newDoc.clipPaste();
	newDoc.selectAll();
	//var item = newDoc.selection[0];
	//item.linkageClassName = "mmo.peticon.PetIcon" + raceId + "_res";
	newDoc.deleteSelection();
	var lib = newDoc.library;
	lib.selectItem(libName);
	lib.setItemProperty('linkageExportForAS', true);
	lib.setItemProperty('linkageExportInFirstFrame', true);
	lib.setItemProperty('linkageClassName', clsName);


	fl.saveDocument(newDoc, outputURL.replace("#raceId#", raceId));
	newDoc.publish();
	fl.closeDocument(doc, false);
	fl.closeDocument(newDoc, false);
	fl.trace("aOK! raceId:" + raceId);
}

exportPetIcon(defaultRaceId, defaultFilePath);
