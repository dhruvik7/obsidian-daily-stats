/*
![](https://raw.githubusercontent.com/zsviczian/obsidian-excalidraw-plugin/master/images/scripts-download-raw.jpg)

Download this file and save to your Obsidian Vault including the first line, or open it in "Raw" and copy the entire contents to Obsidian.

![](https://raw.githubusercontent.com/zsviczian/obsidian-excalidraw-plugin/master/images/scripts-fix-space-demo.png)

The script arranges the selected elements horizontally with a fixed spacing.

When we create an architecture diagram or mind map, we often need to arrange a large number of elements in a fixed spacing. `Fixed spacing` and `Fixed vertical Distance` scripts can save us a lot of time.

```javascript
*/
if(!ea.verifyMinimumPluginVersion || !ea.verifyMinimumPluginVersion("1.5.21")) {
  new Notice("This script requires a newer version of Excalidraw. Please install the latest version.");
  return;
}
settings = ea.getScriptSettings();
//set default values on first run
if(!settings["Default spacing"]) {
	settings = {
	  "Prompt for spacing?": true,
	  "Default spacing" : {
		value: 10,
		description: "Fixed horizontal spacing between elements"
	  },
	  "Remember last spacing?": false
	};
	ea.setScriptSettings(settings);
}

let spacingStr = settings["Default spacing"].value.toString();
const rememberLastSpacing = settings["Remember last spacing?"];

if(settings["Prompt for spacing?"]) {
    spacingStr = await utils.inputPrompt("spacing?","number",spacingStr);
}

const spacing = parseInt(spacingStr);
if(isNaN(spacing)) {
  return;
}
if(rememberLastSpacing) {
	settings["Default spacing"].value = spacing;
	ea.setScriptSettings(settings);
}
const elements=ea.getViewSelectedElements();
const topGroups = ea.getMaximumGroups(elements)
    .filter(els => !(els.length === 1 && els[0].type ==="arrow")) // ignore individual arrows
    .filter(els => !(els.length === 1 && (els[0].containerId))); // ignore text in stickynote
    
const groups = topGroups.sort((lha,rha) => lha[0].x - rha[0].x);

for(var i=0; i<groups.length; i++) {
    if(i > 0) {
        const preGroup = groups[i-1];
        const curGroup = groups[i];

        const preRight = Math.max(...preGroup.map(el => el.x + el.width));
        const curLeft = Math.min(...curGroup.map(el => el.x));
        const distance = curLeft -  preRight - spacing;

        for(const curEl of curGroup) {
            curEl.x = curEl.x - distance;
        }
    }
}
ea.copyViewElementsToEAforEditing(elements);
await ea.addElementsToView(false, false);
