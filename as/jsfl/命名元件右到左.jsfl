var prefix = prompt("Enter a prefix", "");
if (prefix == null || prefix == "")
{
}
else
{
	var startIndex = Number(prompt("Enter startIndex", "0"));
	var selItems = fl.getDocumentDOM().selection;
	var i, j, temp;
	for (i = selItems.length - 1; i >= 1; i--)
	{
		for (j = 0; j < i; j++)
		{
			if (compare(selItems[j], selItems[j + 1]))
			{
				temp = selItems[j];
				selItems[j] = selItems[j + 1];
				selItems[j + 1] = temp;
			}
		}
	}
	for (var k = 0; k < selItems.length; k++)
	{
		selItems[k].name = prefix + (selItems.length - 1 - k + startIndex);
	}

}

function compare(a, b)
{
	if (Math.abs(a.y - b.y) > 5)
	{
		return a.y > b.y;
	}
	else
	{
		return a.x > b.x;
	}
}


