var doc = fl.getDocumentDOM();
var allItems = doc.library.items;

var conf = prompt("����ʲô���㶮�ģ�", "");
for(var i=0;i<allItems.length;i++)
{
	k = i+1;
	allItems[i].name = conf+" " +k;
}