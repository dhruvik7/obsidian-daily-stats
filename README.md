The Obsidian-Excalidraw plugin integrates [Excalidraw](https://excalidraw.com/), a feature rich sketching tool, into Obsidian. You can store and edit Excalidraw files in your vault, you can embed drawings into your documents, and you can link to documents and other drawings to/and from Excalidraw. For a showcase of Excalidraw features, please read my blog post [here](https://www.zsolt.blog/2021/03/showcasing-excalidraw.html) and/or watch the videos below.

Please upgrade to Obsidian v0.12.19 or higher to get the latest release. 

![image](https://user-images.githubusercontent.com/14358394/125159831-336d6880-e17a-11eb-8a3d-ceabc2555a08.png)

# Video walkthrough
| | | |
|----|----|----|
|[![Obsidian-Excalidraw 1.2.0 update - Major IMPROVEMENTS](https://user-images.githubusercontent.com/14358394/124356817-7b3f3d80-dc18-11eb-932d-363bb373c5ab.jpg)](https://youtu.be/UxJLLYtgDKE)|[![1  Getting Started](https://user-images.githubusercontent.com/14358394/125160304-7f211180-e17c-11eb-8363-c52723de1ffd.jpg)](https://youtu.be/sY4FoflGaiM)|[![2  Basic shapes and features](https://user-images.githubusercontent.com/14358394/125160312-8a743d00-e17c-11eb-9fa2-490ef4cbd59e.jpg)](https://youtu.be/Iy_oVTq12Gw)|
|[![3  Groups](https://user-images.githubusercontent.com/14358394/125160323-96f89580-e17c-11eb-9bce-8eb1067a51bb.jpg)](https://youtu.be/QOL1KF7-kdc)|[![4  Stencil](https://user-images.githubusercontent.com/14358394/125160332-9f50d080-e17c-11eb-98e9-fec60fe147d9.jpg)](https://youtu.be/aSgcbfspvfo)|[![5  embedding](https://user-images.githubusercontent.com/14358394/125160341-a546b180-e17c-11eb-9de8-d87fdc844c9c.jpg)](https://youtu.be/MaJ5jJwBRWs)|
|[![6  Links](https://user-images.githubusercontent.com/14358394/125160346-aa0b6580-e17c-11eb-930b-4024807040d1.jpg)](https://youtu.be/MXzeCOEExNo)|[![7  Markdown](https://user-images.githubusercontent.com/14358394/125160354-b2fc3700-e17c-11eb-81af-9e71e461f6dd.jpg)](https://youtu.be/R0IAg0s-wQE)|[![8  Templates](https://user-images.githubusercontent.com/14358394/125160360-b8f21800-e17c-11eb-8bd8-79d4e3f6e92d.jpg)](https://youtu.be/ibdS7ykwpW4)|
|[![9  Excalidraw Automate](https://user-images.githubusercontent.com/14358394/125160367-bdb6cc00-e17c-11eb-92f1-6f59faea85fd.jpg)](https://youtu.be/VRZVujfVab0)|[![10  Miscellaneous](https://user-images.githubusercontent.com/14358394/125160374-c3141680-e17c-11eb-8cc2-dfaffd903d15.jpg)](https://youtu.be/D1iBYo1_jjc)|[![Image Elements](https://user-images.githubusercontent.com/14358394/138607067-ccb62f92-48a4-4880-ac6e-68c1bf86ac2c.png)](https://www.youtube.com/watch?v=_c_0zpBJ4Xc&)|
|[![LaTex Demo](https://user-images.githubusercontent.com/14358394/143732412-1c65227e-4381-406d-847a-b001ab3506ca.jpg)](https://youtu.be/r08wk-58DPk)|[![markdown embeds](https://user-images.githubusercontent.com/14358394/143732440-90bfa029-8615-462e-ada3-c903d71a82c9.jpg)](https://youtu.be/tsecSfnTMow)|[![markdownAdvanced](https://user-images.githubusercontent.com/14358394/143783906-15cee494-c6d5-4495-a2ca-74634e4e7355.jpg)](https://youtu.be/K6qZkTz8GHs)|


# Key features
- The plugin aims to integrate Excalidraw seamlessly into Obsidian including Command Palette actions, File Explorer features, Option Menu commands, and the Ribbon Button.
- CTRL/CMD+Click on the ribbon button, or in the file explorer to create / open drawings in a new pane.
- Settings will allow you to customize Excalidraw to your needs:
  - Default folder for new drawings and define custom filename pattern for new drawings.
  - Template for new drawings. The template will restore stroke properties. This means you can set up defaults in your template for stroke color, stroke width, opacity, font family, font size, fill style, stroke style, etc. This also applies to ExcalidrawAutomate.
  - If portability is important to you: Auto-export SVG and/or PNG files including keep-in-sync feature so you can embed SVG/PNG into your documents instead of embedding excalidraw files.
  - Specify the default width of embedded drawings.
  - Compatibility features to auto-export and keep in sync markdown excalidraw files and legacy .excalidraw files.
  - Experimental feature to add custom TAG to file explorer to mark drawing files.
  - Enable / disable autosave.
- You can customize the size and position of the embedded images using the `[[image.excalidraw|100]]`, `[[image.excalidraw|100x100]]`, `[[image.excalidraw|100|left]]`, `[[image.excalidraw|right-wrap]]`, formatting options. `[[<filename.excalidraw>|<width>x<height>|<alignment>]]`. You can add your custom alignment via CSS. Any text that appears in `<alignment>` will be added to the rendered SVG element style and to the wrapper DIV element. Check below and styles.css for more insight.
- Supports hyperlinks e.g. `https://zsolt.blog`, `[Obsidian](https://obsidian.md)`, and internal links e.g. `[[My file in vault|Alias]]` in drawing text. 
  - Links will update when files are moved or renamed, if you have the Obsidian setting Files & Links/Automatically Update Internal Links enabled.
  - Links in drawings will show up in backlinks of documents
  - Transclusions are supported 
    - `![[myfile#^blockref]]` will convert in the drawing into the transcluded text of the block
    - `![[myfile#section]]` also works, this will transclude the section
    - you can also specify word wrapping for transcluded text by adding the max character count in curly brackets right after the transclusion e.g. `![[myfile#^blockref]]{40}` will wrap text at 40 characters.
  - For convenience you can also use the command palette to insert links into drawings
  - CTRL/CMD + hover to bring up the Obsidian quick preview for the link. (On Mac it is CTRL+CMD+hover).
  - CTRL/CMD + CLICK a text element to open it as a link.
  - CTRL/CMD + ALT + CLICK to create the file (if it does not yet exist) and open it
  - CTRL/CMD + SHIFT + CLICK to open the file in a new pane
  - CTRL/CMD + ALT + SHIFT + CLICK to create the file (if it does not yet exist) and open it in a new pane
- Using the block reference you can also reference & transclude text that appears on drawings, in other documents
- Insert LaTeX formulas using the Command Palette action "Insert LaTeX formula". You can edit formulas either in Markdown view, or by CTRL/CMD + Click on the formula.
- Drag & Drop support
  - You can drag files from the Obsidian file explorer and they will become links to those files in Excalidraw.
  - Dragging image files (PNG, SVG, JPG, Excalidraw) from obsidian files explorer while pressing the CTRL/CMD button will embed the image into your drawing.
  - You can drag and drop images from outside obsidian onto Excalidraw. These images will be embedded into your drawing and saved to Obsidian.
  - You can drag and drop text from Markdown views onto Excalidraw.
  - You can drag and drop web addresses from your browser and they will become links.
- Image support
  - On iOS and Android you can add images from your camera by pressing the add image button in Excalidraw.
  - You can copy/paste images into your drawing. Images will be saved in your vault.
  - You can drag and drop images as explained above.
- Since 1.2.0 Drawing files are stored in Markdown files
  - You can add tags to drawings
  - You can add metadata to the YAML front matter of drawings
  - Anything you add between the frontmatter and the `# Text Elements` heading will be ignored by Excalidraw, i.e. you can add whatever you like here, it will be preserved as part of the document.
  - Excalidraw documents now show in graph view.
  - The following front matter keys will customize how the drawing is displayed - overriding general settings:
    - `excalidraw-link-prefix: "📍"` preview prefix for internal links
    - `excalidraw-url-prefix: "🌐"` preview prefix for external links
    - `excalidraw-link-brackets: true|false` whether or not to display brackets around links in preview
- Embed complete markdown files into your drawings
  - Drag from the desired file from the Obsidian file explorer and hold down CTRL/CMD while dropping the file onto the canvas.
  - Use the command palette action: `Insert markdown file from vault`
  - Use custom woff, woff2 or TTF font to display the document, you can set the default font to use under Excalidraw Settings.
  - You can set a custom css for rendering the snapshot image of your markdown document. Only operating system standard fonts are supported as the font-family ([Win10](https://docs.microsoft.com/en-us/typography/fonts/windows_10_font_list), [Mac & iOS](https://developer.apple.com/fonts/system-fonts/)), plus you can set one additional custom font using the setting explained above. (for a demonstration watch this [video](https://youtu.be/K6qZkTz8GHs) and check out this [sample css](https://github.com/zsviczian/obsidian-excalidraw-plugin/discussions/281)).
    - To help with styling you can observe the SVG snapshot of the markdown document created by Excalidraw. Open Obsidian Developer Console (CTRL+Shift+i) and execute the following command: `ExcalidrawAutomate.mostRecentMarkdownSVG`
  - You can control appearance of the embedded markdown file on a file by file bases by adding the following front matter keys to your markdown document:
    - `excalidraw-font: Virgil|Cascadia|font_file_name.extension`
    - `excalidraw-font-color: css-color-name|#HEXcolor|any-other-html-standard-format`, you can find css color names [here](https://www.w3schools.com/colors/colors_names.asp).
    - `excalidraw-css: "css-filename|css snippet"`
  - Switch to markdown view or use CTRL/CMD+ALT/OPT click on the image to edit properties of the embed: `[[filename#^blockref|WIDTHxMAXHEIGHT]]`
- Includes full [QuickAdd](https://github.com/chhoumann/quickadd), [Templater](https://silentvoid13.github.io/Templater/) and [Dataview](https://blacksmithgu.github.io/obsidian-dataview/docs/api/intro/) support through ExcalidrawAutomate. Check out the [detailed help + examples](https://zsviczian.github.io/obsidian-excalidraw-plugin/). I also have a [YouTube ExcalidrawAutomate Playlist](https://www.youtube.com/playlist?list=PL6mqgtMZ4NP1IR4nXxSlMA4PA5E-qpyHZ) with lots of examples.
- REQUIRES AN OBSIDIAN SYNC SUBSCRIPTION: Full drawing file history and synchronization between devices
- Multilanguage support: if you'd like to help out by translating the plugin, please get in contact with me.

# Known issues
- Mobile support
  - Partially mitigated in 1.0.10 by the introduction of autosave: Your drawing will not be saved when you terminate the mobile app by closing the Obsidian task. 
- Text elements "jumps off screen" when editing, if drawing is zoomed in and text element does not fit the visible screen area. I am working on a resolution.

# Tips and tricks
- [Ozan's Image in Editor Plugin](https://github.com/ozntel/oz-image-in-editor-obsidian). In a nice collaboration with Ozan, his Image-in-Editor plugin now supports Excalidraw. I recommend installing his plugin to display drawings also in Edit mode. 

# Feedback, questions, ideas, problems
Join the conversation about the Excalidraw plugin on [forum.obsidian.md](https://forum.obsidian.md/t/excalidraw-full-featured-sketching-plugin-in-obsidian)

Please head over to [GitHub](https://github.com/zsviczian/obsidian-excalidraw-plugin/issues) to report a bug or request an enhancement.

# Say Thank You
If you are enjoying Excalidraw then please support my work and enthusiasm by buying me a coffee on [https://ko-fi/zsolt](https://ko-fi.com/zsolt).

Please also help spread the word by sharing about the Obsidian Excalidraw Plugin on Twitter, Reddit, or any other social media platform you regularly use. 

You can find me on Twitter [@zsviczian](https://twitter.com/zsviczian), and on my blog [zsolt.blog](https://zsolt.blog).

[<img style="float:left" src="https://user-images.githubusercontent.com/14358394/115450238-f39e8100-a21b-11eb-89d0-fa4b82cdbce8.png" width="200">](https://ko-fi.com/zsolt)
