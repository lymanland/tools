setMid();
function setMid(){
drawRect();
var prefix = prompt("需要居中？", "確定(居中)，取消(不居中)");
if(prefix == null)
{
}

else
{
	var doc = fl.getDocumentDOM();
	doc.selectNone();
	doc.selectAll();
	var rec = doc.getSelectionRect();

	var docRecList = [0,0,1000,600];
	var tx = (docRecList[2] - (rec.right - rec.left)) * 0.5 + docRecList[0] - rec.left;
	var ty = (docRecList[3] - (rec.bottom - rec.top)) * 0.5 + docRecList[1] - rec.top;
	doc.moveSelectionBy({"x":tx, "y":ty});
	doc.save();
}

	
}

function drawRect(){
	var doc = fl.getDocumentDOM();
	doc.getTimeline().setSelectedFrames([]);
	doc.getTimeline().addNewLayer();
	doc.addNewRectangle({left:0, top:0, right:1000, bottom:600}, 0, true);
	doc.getTimeline().setLayerProperty('layerType', 'guide');
	doc.getTimeline().setLayerProperty('locked', true);
	doc.getTimeline().setLayerProperty('name', '屏幕边界');
	doc.save();
}