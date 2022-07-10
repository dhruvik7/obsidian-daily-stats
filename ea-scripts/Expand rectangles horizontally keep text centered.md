/*

![](https://raw.githubusercontent.com/zsviczian/obsidian-excalidraw-plugin/master/images/scripts-download-raw.jpg)

Download this file and save to your Obsidian Vault including the first line, or open it in "Raw" and copy the entire contents to Obsidian.

![](https://raw.githubusercontent.com/zsviczian/obsidian-excalidraw-plugin/master/images/scripts-expand-rectangles.gif)

This script expands the width of the selected rectangles until they are all the same width and keep the text centered.

See documentation for more details:
https://zsviczian.github.io/obsidian-excalidraw-plugin/ExcalidrawScriptsEngine.html

```javascript
*/

const elements = ea.getViewSelectedElements();
const topGroups = ea.getMaximumGroups(elements);
const allIndividualArrows = ea.getMaximumGroups(ea.getViewElements())
	.reduce((result, group) => (group.length === 1 && (group[0].type === 'arrow')) ? 
			    [...result, group[0]] : result, []);

const groupWidths = topGroups
  .map((g) => {
    if(g.length === 1 && (g[0].type === 'arrow' || g[0].type === 'line')) {
      // ignore individual lines
      return { minLeft: 0, maxRight: 0 };
    }
    return g.reduce(
      (pre, cur, i) => {
        if (i === 0) {
          return {
            minLeft: cur.x,
            maxRight: cur.x + cur.width,
            index: i,
          };
        } else {
          return {
            minLeft: cur.x < pre.minLeft ? cur.x : pre.minLeft,
            maxRight:
              cur.x + cur.width > pre.maxRight
                ? cur.x + cur.width
                : pre.maxRight,
            index: i,
          };
        }
      },
      { minLeft: 0, maxRight: 0 }
    );
  })
  .map((r) => {
    r.width = r.maxRight - r.minLeft;
    return r;
  });

const maxGroupWidth = Math.max(...groupWidths.map((g) => g.width));

for (var i = 0; i < topGroups.length; i++) {
  const rects = topGroups[i]
    .filter((el) => el.type === "rectangle")
    .sort((lha, rha) => lha.x - rha.x);
  const texts = topGroups[i]
    .filter((el) => el.type === "text")
    .sort((lha, rha) => lha.x - rha.x);
  const groupWith = groupWidths[i].width;
  if (groupWith < maxGroupWidth) {
    const distance = maxGroupWidth - groupWith;
    const perRectDistance = distance / rects.length;
    const textsWithRectIndex = [];
    for (var j = 0; j < rects.length; j++) {
      const rect = rects[j];
      const rectLeft = rect.x;
      const rectTop = rect.y;
      const rectRight = rect.x + rect.width;
      const rectBottom = rect.y + rect.height;

      const textsWithRect = texts.filter(text => text.x >= rectLeft && text.x <= rectRight
        && text.y >= rectTop && text.y <= rectBottom);

      textsWithRectIndex[j] = textsWithRect;
    }
    for (var j = 0; j < rects.length; j++) {
      const rect = rects[j];
      rect.x = rect.x + perRectDistance * j - perRectDistance / 2;
      rect.width += perRectDistance;
      
      const textsWithRect = textsWithRectIndex[j];

      if(textsWithRect) {
        for(const text of textsWithRect) {
          text.x = text.x + perRectDistance * j;
        }
      }

      // recalculate the position of the points
      const startBindingLines = allIndividualArrows.filter(el => (el.startBinding||{}).elementId === rect.id);
     	for(startBindingLine of startBindingLines) {
     		recalculateStartPointOfLine(startBindingLine, rect);
     	}
     
     	const endBindingLines = allIndividualArrows.filter(el => (el.endBinding||{}).elementId === rect.id);
     	for(endBindingLine of endBindingLines) {
     		recalculateEndPointOfLine(endBindingLine, rect);
     	}
    }
  }
}

ea.copyViewElementsToEAforEditing(elements);
await ea.addElementsToView(false, false);

function recalculateStartPointOfLine(line, el) {
	const aX = el.x + el.width/2;
    const bX = line.x + line.points[1][0];
    const aY = el.y + el.height/2;
    const bY = line.y + line.points[1][1];

	line.startBinding.gap = 8;
	line.startBinding.focus = 0;
	const intersectA = ea.intersectElementWithLine(
            	el,
				[bX, bY],
            	[aX, aY],
            	line.startBinding.gap
          	);

    if(intersectA.length > 0) {
		line.points[0] = [0, 0];
		for(var i = 1; i<line.points.length; i++) {
			line.points[i][0] -= intersectA[0][0] - line.x;
			line.points[i][1] -= intersectA[0][1] - line.y;
		}
		line.x = intersectA[0][0];
		line.y = intersectA[0][1];
	}
}

function recalculateEndPointOfLine(line, el) {
	const aX = el.x + el.width/2;
    const bX = line.x + line.points[line.points.length-2][0];
    const aY = el.y + el.height/2;
    const bY = line.y + line.points[line.points.length-2][1];

	line.endBinding.gap = 8;
	line.endBinding.focus = 0;
	const intersectA = ea.intersectElementWithLine(
            	el,
				[bX, bY],
            	[aX, aY],
            	line.endBinding.gap
          	);

    if(intersectA.length > 0) {
    	line.points[line.points.length - 1] = [intersectA[0][0] - line.x, intersectA[0][1] - line.y];
	}
}