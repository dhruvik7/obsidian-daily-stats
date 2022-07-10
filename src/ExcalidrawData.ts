/** 
 ** About the various text fields of textElements
 ** rawText vs. text vs. original text
    text: The displyed text. This will have linebreaks if wrapped & will be the parsed text or the original-markup depending on Obsidian view mode
    originalText: this is the text without added linebreaks for wrapping. This will be parsed or markup depending on view mode
    rawText: text with original markdown markup and without the added linebreaks for wrapping
 */
import { App, TFile } from "obsidian";
import {
  nanoid,
  FRONTMATTER_KEY_CUSTOM_PREFIX,
  FRONTMATTER_KEY_CUSTOM_LINK_BRACKETS,
  FRONTMATTER_KEY_CUSTOM_URL_PREFIX,
  FRONTMATTER_KEY_DEFAULT_MODE,
  fileid,
  REG_BLOCK_REF_CLEAN,
  FRONTMATTER_KEY_LINKBUTTON_OPACITY,
  FRONTMATTER_KEY_ONLOAD_SCRIPT,
} from "./Constants";
import { _measureText } from "./ExcalidrawAutomate";
import ExcalidrawPlugin from "./main";
import { JSON_parse } from "./Constants";
import { TextMode } from "./ExcalidrawView";
import {
  compress,
  decompress,
  //getBakPath,
  getBinaryFileFromDataURL,
  getExportTheme,
  getLinkParts,
  hasExportTheme,
  LinkParts,
  wrapText,
} from "./utils/Utils";
import { getAttachmentsFolderAndFilePath, isObsidianThemeDark } from "./utils/ObsidianUtils";
import {
  ExcalidrawElement,
  ExcalidrawImageElement,
  FileId,
} from "@zsviczian/excalidraw/types/element/types";
import { BinaryFiles, SceneData } from "@zsviczian/excalidraw/types/types";
import { EmbeddedFile } from "./EmbeddedFileLoader";

type SceneDataWithFiles = SceneData & { files: BinaryFiles };

declare module "obsidian" {
  interface MetadataCache {
    blockCache: {
      getForFile(x: any, f: TAbstractFile): any;
    };
  }
}

export const REGEX_LINK = {
  //![[link|alias]] [alias](link){num}
  //      1   2    3           4             5         67         8  9
  EXPR: /(!)?(\[\[([^|\]]+)\|?([^\]]+)?]]|\[([^\]]*)]\(([^)]*)\))(\{(\d+)\})?/g, //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/187
  getRes: (text: string): IterableIterator<RegExpMatchArray> => {
    return text.matchAll(REGEX_LINK.EXPR);
  },
  isTransclusion: (parts: IteratorResult<RegExpMatchArray, any>): boolean => {
    return !!parts.value[1];
  },
  getLink: (parts: IteratorResult<RegExpMatchArray, any>): string => {
    return parts.value[3] ? parts.value[3] : parts.value[6];
  },
  isWikiLink: (parts: IteratorResult<RegExpMatchArray, any>): boolean => {
    return !!parts.value[3];
  },
  getAliasOrLink: (parts: IteratorResult<RegExpMatchArray, any>): string => {
    return REGEX_LINK.isWikiLink(parts)
      ? parts.value[4]
        ? parts.value[4]
        : parts.value[3]
      : parts.value[5]
      ? parts.value[5]
      : parts.value[6];
  },
  getWrapLength: (
    parts: IteratorResult<RegExpMatchArray, any>,
    defaultWrap: number,
  ): number => {
    const len = parseInt(parts.value[8]);
    if (isNaN(len)) {
      return defaultWrap > 0 ? defaultWrap : null;
    }
    return len;
  },
};

//added \n at and of DRAWING_REG: https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/357
const DRAWING_REG = /\n# Drawing\n[^`]*(```json\n)([\s\S]*?)```\n/gm; //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/182
const DRAWING_REG_FALLBACK = /\n# Drawing\n(```json\n)?(.*)(```)?(%%)?/gm;
const DRAWING_COMPRESSED_REG =
  /(\n# Drawing\n[^`]*(?:```compressed\-json\n))([\s\S]*?)(```\n)/gm; //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/182
const DRAWING_COMPRESSED_REG_FALLBACK =
  /(\n# Drawing\n(?:```compressed\-json\n)?)(.*)((```)?(%%)?)/gm;
export const REG_LINKINDEX_HYPERLINK = /^\w+:\/\//;

const isCompressedMD = (data: string): boolean => {
  return data.match(/```compressed\-json\n/gm) !== null;
};

const getDecompressedScene = (
  data: string,
): [string, IteratorResult<RegExpMatchArray, any>] => {
  let res = data.matchAll(DRAWING_COMPRESSED_REG);

  //In case the user adds a text element with the contents "# Drawing\n"
  let parts;
  parts = res.next();
  if (parts.done) {
    //did not find a match
    res = data.matchAll(DRAWING_COMPRESSED_REG_FALLBACK);
    parts = res.next();
  }
  if (parts.value && parts.value.length > 1) {
    return [decompress(parts.value[2]), parts];
  }
  return [null, parts];
};

export const changeThemeOfExcalidrawMD = (data: string): string => {
  const compressed = isCompressedMD(data);
  let scene = compressed ? getDecompressedScene(data)[0] : data;
  if (!scene) {
    return data;
  }
  if (isObsidianThemeDark) {
    if ((scene.match(/"theme"\s*:\s*"light"\s*,/g) || []).length === 1) {
      scene = scene.replace(/"theme"\s*:\s*"light"\s*,/, `"theme": "dark",`);
    }
  } else if ((scene.match(/"theme"\s*:\s*"dark"\s*,/g) || []).length === 1) {
    scene = scene.replace(/"theme"\s*:\s*"dark"\s*,/, `"theme": "light",`);
  }
  if (compressed) {
    return data.replace(DRAWING_COMPRESSED_REG, `$1${compress(scene)}$3`);
  }
  return scene;
};

export function getJSON(data: string): { scene: string; pos: number } {
  let res;
  if (isCompressedMD(data)) {
    const [result, parts] = getDecompressedScene(data);
    if (result) {
      return {
        scene: result.substring(0, result.lastIndexOf("}") + 1),
        pos: parts.value.index,
      }; //this is a workaround in case sync merges two files together and one version is still an old version without the ```codeblock
    }
    return { scene: data, pos: parts.value ? parts.value.index : 0 };
  }
  res = data.matchAll(DRAWING_REG);

  //In case the user adds a text element with the contents "# Drawing\n"
  let parts;
  parts = res.next();
  if (parts.done) {
    //did not find a match
    res = data.matchAll(DRAWING_REG_FALLBACK);
    parts = res.next();
  }
  if (parts.value && parts.value.length > 1) {
    const result = parts.value[2];
    return {
      scene: result.substr(0, result.lastIndexOf("}") + 1),
      pos: parts.value.index,
    }; //this is a workaround in case sync merges two files together and one version is still an old version without the ```codeblock
  }
  return { scene: data, pos: parts.value ? parts.value.index : 0 };
}

export function getMarkdownDrawingSection(
  jsonString: string,
  compressed: boolean,
) {
  return compressed
    ? `%%\n# Drawing\n\x60\x60\x60compressed-json\n${compress(
        jsonString,
      )}\n\x60\x60\x60\n%%`
    : `%%\n# Drawing\n\x60\x60\x60json\n${jsonString}\n\x60\x60\x60\n%%`;
}

/**
 *
 * @param text - TextElement.text
 * @param originalText - TextElement.originalText
 * @returns null if the textElement is not wrapped or the longest line in the text element
 */
const estimateMaxLineLen = (text: string, originalText: string): number => {
  if (!originalText || !text) {
    return null;
  }
  if (text === originalText) {
    return null;
  } //text will contain extra new line characters if wrapped
  let maxLineLen = 0; //will be non-null if text is container bound and multi line
  const splitText = text.split("\n");
  if (splitText.length === 1) {
    return null;
  }
  for (const line of splitText) {
    if (line.length > maxLineLen) {
      maxLineLen = line.length;
    }
  }
  return maxLineLen;
};

const wrap = (text: string, lineLen: number) =>
  lineLen ? wrapText(text, lineLen, false, 0) : text;

export class ExcalidrawData {
  public textElements: Map<
    string,
    { raw: string; parsed: string; wrapAt: number | null }
  > = null;
  public elementLinks: Map<string, string> = null;
  public scene: any = null;
  public deletedElements: ExcalidrawElement[] = [];
  private file: TFile = null;
  private app: App;
  private showLinkBrackets: boolean;
  private linkPrefix: string;
  private urlPrefix: string;
  private textMode: TextMode = TextMode.raw;
  public loaded: boolean = false;
  private files: Map<FileId, EmbeddedFile> = null; //fileId, path
  private equations: Map<FileId, { latex: string; isLoaded: boolean }> = null; //fileId, path
  private compatibilityMode: boolean = false;
  selectedElementIds: {[key:string]:boolean} = {}; //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/609

  constructor(
    private plugin: ExcalidrawPlugin,
  ) {
    this.app = plugin.app;
    this.files = new Map<FileId, EmbeddedFile>();
    this.equations = new Map<FileId, { latex: string; isLoaded: boolean }>();
  }

  /**
   * 1.5.4: for backward compatibility following the release of container bound text elements and the depreciation boundElementIds field
   */
  private initializeNonInitializedFields() {
    if (!this.scene || !this.scene.elements) {
      return;
    }

    const elements = this.scene.elements;
    for (const el of elements) {
      if (el.boundElements) {
        const map = new Map<string, string>();
        el.boundElements.forEach((item: { id: string; type: string }) => {
          map.set(item.id, item.type);
        });
        const boundElements = Array.from(map, ([id, type]) => ({ id, type }));
        if (boundElements.length !== el.boundElements.length) {
          el.boundElements = boundElements;
        }
      }

      //convert .boundElementIds to boundElements
      if (el.boundElementIds) {
        if (!el.boundElements) {
          el.boundElements = [];
        }
        el.boundElements = el.boundElements.concat(
          el.boundElementIds.map((id: string) => ({
            type: "arrow",
            id,
          })),
        );
        delete el.boundElementIds;
      }

      //add containerId to TextElements if missing
      if (el.type === "text" && !el.containerId) {
        el.containerId = null;
      }

      //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/494
      if (el.x === null) {
        el.x = 0;
      }
      if (el.y === null) {
        el.y = 0;
      }
      if (el.startBinding?.focus === null) {
        el.startBinding.focus = 0;
      }
      if (el.endBinding?.focus === null) {
        el.endBinding.focus = 0;
      }

      //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/497
      if (el.fontSize === null) {
        el.fontSize = 20;
      }
    }

    //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/569
    try {
      //Fix text elements that point to a container, but the container does not point back
      const textElWithOneWayLinkToContainer = elements.filter(
        (textEl: any) =>
          textEl.type === "text" &&
          textEl.containerId &&
          elements.some(
            (container: any) =>
              container.id === textEl.containerId &&
              container.boundElements.length > 0 &&
              container.boundElements.some(
                (boundEl: any) =>
                  boundEl.type === "text" &&
                  boundEl.id !== textEl.id &&
                  boundEl.id.length > 8,
              ),
          ),
      );
      //if(textElWithOneWayLinkToContainer.length>0) log({message: "cleanup", textElWithOneWayLinkToContainer});
      textElWithOneWayLinkToContainer.forEach((textEl: any) => {
        try {
          const container = elements.filter(
            (container: any) => container.id === textEl.containerId,
          )[0];
          const boundEl = container.boundElements.filter(
            (boundEl: any) =>
              !(
                boundEl.type === "text" &&
                !elements.some((el: any) => el.id === boundEl.id)
              ),
          );
          container.boundElements = [{ id: textEl.id, type: "text" }].concat(
            boundEl,
          );
        } catch (e) {}
      });

      //Remove from bound elements references that do not exist in the scene
      const containers = elements.filter(
        (container: any) =>
          container.boundElements && container.boundElements.length > 0,
      );
      containers.forEach((container: any) => {
        const filteredBoundElements = container.boundElements.filter(
          (boundEl: any) => elements.some((el: any) => el.id === boundEl.id),
        );
        if (filteredBoundElements.length !== container.boundElements.length) {
          //log({message: "cleanup",oldBound: container.boundElements, newBound: filteredBoundElements});
          container.boundElements = filteredBoundElements;
        }
      });

      //Clear the containerId for textElements if the referenced container does not exist in the scene
      elements
        .filter(
          (textEl: any) =>
            textEl.type === "text" &&
            textEl.containerId &&
            !elements.some(
              (container: any) => container.id === textEl.containerId,
            ),
        )
        .forEach((textEl: any) => {
          textEl.containerId = null;
        }); // log({message:"cleanup",textEl})});
    } catch {}
  }

  /**
   * Loads a new drawing
   * @param {TFile} file - the MD file containing the Excalidraw drawing
   * @returns {boolean} - true if file was loaded, false if there was an error
   */
  public async loadData(
    data: string,
    file: TFile,
    textMode: TextMode
  ): Promise<boolean> {
    if (!file) {
      return false;
    }
    this.loaded = false;
    this.selectedElementIds = {};
    this.textElements = new Map<
      string,
      { raw: string; parsed: string; wrapAt: number }
    >();
    this.elementLinks = new Map<string, string>();
    if (this.file != file) {
      //this is a reload - files and equations will take care of reloading when needed
      this.files.clear();
      this.equations.clear();
    }
    this.file = file;
    this.compatibilityMode = false;

    //I am storing these because if the settings change while a drawing is open parsing will run into errors during save
    //The drawing will use these values until next drawing is loaded or this drawing is re-loaded
    this.setShowLinkBrackets();
    this.setLinkPrefix();
    this.setUrlPrefix();

    this.scene = null;

    //In compatibility mode if the .excalidraw file was more recently updated than the .md file, then the .excalidraw file
    //should be loaded as the scene.
    //This feature is mostly likely only relevant to people who use Obsidian and Logseq on the same vault and edit .excalidraw
    //drawings in Logseq.
    if (this.plugin.settings.syncExcalidraw) {
      const excalfile = `${file.path.substring(
        0,
        file.path.lastIndexOf(".md"),
      )}.excalidraw`;
      const f = this.app.vault.getAbstractFileByPath(excalfile);
      if (f && f instanceof TFile && f.stat.mtime > file.stat.mtime) {
        //the .excalidraw file is newer then the .md file
        const d = await this.app.vault.read(f);
        this.scene = JSON.parse(d);
      }
    }

    // https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/396
    let sceneJSONandPOS = null;
    const loadJSON = (): { scene: string; pos: number } => {
      //Load scene: Read the JSON string after "# Drawing"
      const sceneJSONandPOS = getJSON(data);
      if (sceneJSONandPOS.pos === -1) {
        throw new Error("Excalidraw JSON not found in the file");
      }
      if (!this.scene) {
        this.scene = JSON_parse(sceneJSONandPOS.scene); //this is a workaround to address when files are mereged by sync and one version is still an old markdown without the codeblock ```
      }
      return sceneJSONandPOS;
    };
    sceneJSONandPOS = loadJSON();

    this.deletedElements = this.scene.elements.filter((el:ExcalidrawElement)=>el.isDeleted);
    this.scene.elements = this.scene.elements.filter((el:ExcalidrawElement)=>!el.isDeleted);

    if (!this.scene.files) {
      this.scene.files = {}; //loading legacy scenes that do not yet have the files attribute.
    }

    if (hasExportTheme(this.plugin, this.file)) {
      this.scene.appState.theme = getExportTheme(
        this.plugin,
        this.file,
        "light",
      );
    } else if (this.plugin.settings.matchThemeAlways) {
      this.scene.appState.theme = isObsidianThemeDark() ? "dark" : "light";
    }

    this.initializeNonInitializedFields();

    data = data.substring(0, sceneJSONandPOS.pos);

    //The Markdown # Text Elements take priority over the JSON text elements. Assuming the scenario in which the link was updated due to filename changes
    //The .excalidraw JSON is modified to reflect the MD in case of difference
    //Read the text elements into the textElements Map
    let position = data.search(/(^%%\n)?# Text Elements\n/m);
    if (position === -1) {
      await this.setTextMode(textMode, false);
      this.loaded = true;
      return true; //Text Elements header does not exist
    }
    position += data.match(/((^%%\n)?# Text Elements\n)/m)[0].length;

    data = data.substring(position);
    position = 0;

    //iterating through all the text elements in .md
    //Text elements always contain the raw value
    const BLOCKREF_LEN: number = " ^12345678\n\n".length;
    let res = data.matchAll(/\s\^(.{8})[\n]+/g);
    let parts;
    while (!(parts = res.next()).done) {
      const text = data.substring(position, parts.value.index);
      const id: string = parts.value[1];
      const textEl = this.scene.elements.filter((el: any) => el.id === id)[0];
      if (textEl) {
        if (textEl.type !== "text") {
          //markdown link attached to elements
          if (textEl.link !== text) {
            textEl.link = text;
            textEl.version++;
            textEl.versionNonce++;
          }
          this.elementLinks.set(id, text);
        } else {
          const wrapAt = estimateMaxLineLen(textEl.text, textEl.originalText);
          const parseRes = await this.parse(text);
          this.textElements.set(id, {
            raw: text,
            parsed: parseRes.parsed,
            wrapAt,
          });
          if (parseRes.link) {
            textEl.link = parseRes.link;
          }
          //this will set the rawText field of text elements imported from files before 1.3.14, and from other instances of Excalidraw
          if (textEl && (!textEl.rawText || textEl.rawText === "")) {
            textEl.rawText = text;
          }
        }
      }
      position = parts.value.index + BLOCKREF_LEN;
    }

    data = data.substring(
      data.indexOf("# Embedded files\n") + "# Embedded files\n".length,
    );
    //Load Embedded files
    const REG_FILEID_FILEPATH = /([\w\d]*):\s*\[\[([^\]]*)]]\n/gm;
    res = data.matchAll(REG_FILEID_FILEPATH);
    while (!(parts = res.next()).done) {
      const embeddedFile = new EmbeddedFile(
        this.plugin,
        this.file.path,
        parts.value[2],
      );
      this.setFile(parts.value[1] as FileId, embeddedFile);
    }

    //Load Equations
    const REG_FILEID_EQUATION = /([\w\d]*):\s*\$\$(.*)(\$\$\s*\n)/gm;
    res = data.matchAll(REG_FILEID_EQUATION);
    while (!(parts = res.next()).done) {
      this.setEquation(parts.value[1] as FileId, {
        latex: parts.value[2],
        isLoaded: false,
      });
    }

    //Check to see if there are text elements in the JSON that were missed from the # Text Elements section
    //e.g. if the entire text elements section was deleted.
    this.findNewTextElementsInScene();
    this.findNewElementLinksInScene(); //non-text element links
    await this.setTextMode(textMode, true);
    this.loaded = true;
    return true;
  }

  public async loadLegacyData(data: string, file: TFile): Promise<boolean> {
    if (!file) {
      return false;
    }
    this.loaded = false;
    this.selectedElementIds = {};
    this.compatibilityMode = true;
    this.file = file;
    this.textElements = new Map<
      string,
      { raw: string; parsed: string; wrapAt: number }
    >();
    this.elementLinks = new Map<string, string>();
    this.setShowLinkBrackets();
    this.setLinkPrefix();
    this.setUrlPrefix();
    this.scene = JSON.parse(data);
    if (!this.scene.files) {
      this.scene.files = {}; //loading legacy scenes without the files element
    }
    this.initializeNonInitializedFields();
    if (this.plugin.settings.matchThemeAlways) {
      this.scene.appState.theme = isObsidianThemeDark() ? "dark" : "light";
    }
    this.files.clear();
    this.equations.clear();
    this.findNewTextElementsInScene();
    this.findNewElementLinksInScene();
    await this.setTextMode(TextMode.raw, true); //legacy files are always displayed in raw mode.
    this.loaded = true;
    return true;
  }

  public async setTextMode(textMode: TextMode, forceupdate: boolean = false) {
    this.textMode = textMode;
    await this.updateSceneTextElements(forceupdate);
  }

  //update a single text element in the scene if the newText is different
  public updateTextElement(
    sceneTextElement: any,
    newText: string,
    newOriginalText: string,
    forceUpdate: boolean = false,
  ) {
    if (forceUpdate || newText != sceneTextElement.text) {
      const measure = _measureText(
        newText,
        sceneTextElement.fontSize,
        sceneTextElement.fontFamily,
      );
      sceneTextElement.text = newText;
      sceneTextElement.originalText = newOriginalText;

      if (!sceneTextElement.containerId) {
        //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/376
        //I leave the setting of text width to excalidraw, when text is in a container
        //because text width is fixed to the container width
        sceneTextElement.width = measure.w;
      }
      sceneTextElement.height = measure.h;
      sceneTextElement.baseline = measure.baseline;
    }
  }

  /**
   * Updates the TextElements in the Excalidraw scene based on textElements MAP in ExcalidrawData
   * Depending on textMode, TextElements will receive their raw or parsed values
   * @param forceupdate : will update text elements even if text contents has not changed, this will
   * correct sizing issues
   */
  private async updateSceneTextElements(forceupdate: boolean = false) {
    //update text in scene based on textElements Map
    //first get scene text elements
    const texts = this.scene.elements?.filter((el: any) => el.type === "text");
    for (const te of texts) {
      const originalText =
        (await this.getText(te.id, false)) ?? te.originalText ?? te.text;
      const wrapAt = this.textElements.get(te.id)?.wrapAt;
      this.updateTextElement(
        te,
        wrap(originalText, wrapAt),
        originalText,
        forceupdate,
      ); //(await this.getText(te.id))??te.text serves the case when the whole #Text Elements section is deleted by accident
    }
  }

  private async getText(
    id: string,
    wrapResult: boolean = true,
  ): Promise<string> {
    const text = this.textElements.get(id);
    if (!text) {
      return null;
    }
    if (this.textMode === TextMode.parsed) {
      if (!text.parsed) {
        this.textElements.set(id, {
          raw: text.raw,
          parsed: (await this.parse(text.raw)).parsed,
          wrapAt: text.wrapAt,
        });
      }
      //console.log("parsed",this.textElements.get(id).parsed);
      return wrapResult ? wrap(text.parsed, text.wrapAt) : text.parsed;
    }
    //console.log("raw",this.textElements.get(id).raw);
    return text.raw;
  }

  private findNewElementLinksInScene(): boolean {
    const elements = this.scene.elements?.filter((el: any) => {
      return (
        el.type !== "text" &&
        el.link &&
        el.link.startsWith("[[") &&
        !this.elementLinks.has(el.id)
      );
    });
    if (elements.length === 0) {
      return false;
    }

    let jsonString = JSON.stringify(this.scene);

    let id: string; //will be used to hold the new 8 char long ID for textelements that don't yet appear under # Text Elements
    for (const el of elements) {
      id = el.id;
      //replacing Excalidraw element IDs with my own nanoid, because default IDs may contain
      //characters not recognized by Obsidian block references
      //also Excalidraw IDs are inconveniently long
      if (el.id.length > 8) {
        id = nanoid();
        jsonString = jsonString.replaceAll(el.id, id); //brute force approach to replace all occurances (e.g. links, groups,etc.)
      }
      this.elementLinks.set(id, el.link);
    }
    this.scene = JSON.parse(jsonString);
    return true;
  }

  /**
   * check for textElements in Scene missing from textElements Map
   * @returns {boolean} - true if there were changes
   */
  private findNewTextElementsInScene(selectedElementIds: {[key: string]: boolean} = {}): boolean {
    //console.log("Excalidraw.Data.findNewTextElementsInScene()");
    //get scene text elements
    this.selectedElementIds = selectedElementIds;
    const texts = this.scene.elements?.filter((el: any) => el.type === "text");

    let jsonString = JSON.stringify(this.scene);

    let dirty: boolean = false; //to keep track if the json has changed
    let id: string; //will be used to hold the new 8 char long ID for textelements that don't yet appear under # Text Elements
    for (const te of texts) {
      id = te.id;
      //replacing Excalidraw text IDs with my own nanoid, because default IDs may contain
      //characters not recognized by Obsidian block references
      //also Excalidraw IDs are inconveniently long
      if (te.id.length > 8) {
        dirty = true;
        id = nanoid();
        if(this.selectedElementIds[te.id]) { //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/609
          delete this.selectedElementIds[te.id];
          this.selectedElementIds[id] = true;
        }
        jsonString = jsonString.replaceAll(te.id, id); //brute force approach to replace all occurances (e.g. links, groups,etc.)
        if (this.textElements.has(te.id)) {
          //element was created with onBeforeTextSubmit
          const text = this.textElements.get(te.id);
          this.textElements.set(id, {
            raw: text.raw,
            parsed: text.parsed,
            wrapAt: text.wrapAt,
          });
          this.textElements.delete(te.id); //delete the old ID from the Map
        }
        if (!this.textElements.has(id)) {
          const raw = te.rawText && te.rawText !== "" ? te.rawText : te.text; //this is for compatibility with drawings created before the rawText change on ExcalidrawTextElement
          const wrapAt = estimateMaxLineLen(te.text, te.originalText);
          this.textElements.set(id, { raw, parsed: null, wrapAt });
          this.parseasync(id, raw, wrapAt);
        }
      }
    }
    if (dirty) {
      //reload scene json in case it has changed
      this.scene = JSON.parse(jsonString);
    }

    return dirty;
  }

  private updateElementLinksFromScene() {
    for (const key of this.elementLinks.keys()) {
      //find element in the scene
      const el = this.scene.elements?.filter(
        (el: any) =>
          el.type !== "text" &&
          el.id === key &&
          el.link &&
          el.link.startsWith("[["),
      );
      if (el.length === 0) {
        this.elementLinks.delete(key); //if no longer in the scene, delete the text element
      } else {
        this.elementLinks.set(key, el[0].link);
      }
    }
  }

  /**
   * update text element map by deleting entries that are no long in the scene
   * and updating the textElement map based on the text updated in the scene
   */
  private async updateTextElementsFromScene() {
    for (const key of this.textElements.keys()) {
      //find text element in the scene
      const el = this.scene.elements?.filter(
        (el: any) => el.type === "text" && el.id === key,
      );
      if (el.length === 0) {
        this.textElements.delete(key); //if no longer in the scene, delete the text element
      } else {
        const text = await this.getText(key, false);
        if (text !== (el[0].originalText ?? el[0].text)) {
          const wrapAt = estimateMaxLineLen(el[0].text, el[0].originalText);
          this.textElements.set(key, {
            raw: el[0].originalText ?? el[0].text,
            parsed: (await this.parse(el[0].originalText ?? el[0].text)).parsed,
            wrapAt,
          });
        }
      }
    }
  }

  private async parseasync(key: string, raw: string, wrapAt: number) {
    this.textElements.set(key, {
      raw,
      parsed: (await this.parse(raw)).parsed,
      wrapAt,
    });
  }

  private parseLinks(text: string, position: number, parts: any): string {
    return (
      text.substring(position, parts.value.index) +
      (this.showLinkBrackets ? "[[" : "") +
      REGEX_LINK.getAliasOrLink(parts) +
      (this.showLinkBrackets ? "]]" : "")
    );
  }

  /**
   *
   * @param text
   * @returns [string,number] - the transcluded text, and the line number for the location of the text
   */
  public async getTransclusion(
    link: string,
  ): Promise<{ contents: string; lineNum: number }> {
    const linkParts = getLinkParts(link, this.file);
    const file = this.app.metadataCache.getFirstLinkpathDest(
      linkParts.path,
      this.file.path,
    );
    return await getTransclusion(
      linkParts,
      this.app,
      file,
      this.plugin.settings.pageTransclusionCharLimit,
    );
  }

  /**
   * Process aliases and block embeds
   * @param text
   * @returns
   */
  private async parse(text: string): Promise<{ parsed: string; link: string }> {
    let outString = "";
    let link = null;
    let position = 0;
    const res = REGEX_LINK.getRes(text);
    let linkIcon = false;
    let urlIcon = false;
    let parts;
    if (text.match(REG_LINKINDEX_HYPERLINK)) {
      link = text;
      urlIcon = true;
    }
    while (!(parts = res.next()).done) {
      if (!link) {
        const l = REGEX_LINK.getLink(parts);
        if (l.match(REG_LINKINDEX_HYPERLINK)) {
          link = l;
        } else {
          link = `[[${l}]]`;
        }
      }
      if (REGEX_LINK.isTransclusion(parts)) {
        //transclusion //parts.value[1] || parts.value[4]
        const contents = (await this.getTransclusion(REGEX_LINK.getLink(parts)))
          .contents;
        outString +=
          text.substring(position, parts.value.index) +
          wrapText(
            contents,
            REGEX_LINK.getWrapLength(
              parts,
              this.plugin.settings.wordWrappingDefault,
            ),
            this.plugin.settings.forceWrap,
          );
      } else {
        const parsedLink = this.parseLinks(text, position, parts);
        if (parsedLink) {
          outString += parsedLink;
          if (!(urlIcon || linkIcon)) {
            if (REGEX_LINK.getLink(parts).match(REG_LINKINDEX_HYPERLINK)) {
              urlIcon = true;
            } else {
              linkIcon = true;
            }
          }
        }
      }
      position = parts.value.index + parts.value[0].length;
    }
    outString += text.substring(position, text.length);
    if (linkIcon) {
      outString = this.linkPrefix + outString;
    }
    if (urlIcon) {
      outString = this.urlPrefix + outString;
    }

    return { parsed: outString, link };
  }

  /**
   * Does a quick parse of the raw text. Returns the parsed string if raw text does not include a transclusion.
   * Return null if raw text includes a transclusion.
   * This is implemented in a separate function, because by nature resolving a transclusion is an asynchronious
   * activity. Quick parse gets the job done synchronously if possible.
   * @param text
   */
  private quickParse(text: string): [string, string] {
    const hasTransclusion = (text: string): boolean => {
      const res = REGEX_LINK.getRes(text);
      let parts;
      while (!(parts = res.next()).done) {
        if (REGEX_LINK.isTransclusion(parts)) {
          return true;
        }
      }
      return false;
    };
    if (hasTransclusion(text)) {
      return [null, null];
    }

    let outString = "";
    let link = null;
    let position = 0;
    const res = REGEX_LINK.getRes(text);
    let linkIcon = false;
    let urlIcon = false;
    let parts;
    if (text.match(REG_LINKINDEX_HYPERLINK)) {
      link = text;
      urlIcon = true;
    }
    while (!(parts = res.next()).done) {
      if (!link) {
        const l = REGEX_LINK.getLink(parts);
        if (l.match(REG_LINKINDEX_HYPERLINK)) {
          link = l;
        } else {
          link = `[[${l}]]`;
        }
      }
      const parsedLink = this.parseLinks(text, position, parts);
      if (parsedLink) {
        outString += parsedLink;
        if (!(urlIcon || linkIcon)) {
          if (REGEX_LINK.getLink(parts).match(REG_LINKINDEX_HYPERLINK)) {
            urlIcon = true;
          } else {
            linkIcon = true;
          }
        }
      }
      position = parts.value.index + parts.value[0].length;
    }
    outString += text.substring(position, text.length);
    if (linkIcon) {
      outString = this.linkPrefix + outString;
    }
    if (urlIcon) {
      outString = this.urlPrefix + outString;
    }
    return [outString, link];
  }

  /**
   * Generate markdown file representation of excalidraw drawing
   * @returns markdown string
   */
  disableCompression: boolean = false;
  generateMD(deletedElements: ExcalidrawElement[] = []): string {
    let outString = "# Text Elements\n";
    for (const key of this.textElements.keys()) {
      outString += `${this.textElements.get(key).raw} ^${key}\n\n`;
    }

    for (const key of this.elementLinks.keys()) {
      outString += `${this.elementLinks.get(key)} ^${key}\n\n`;
    }

    outString +=
      this.equations.size > 0 || this.files.size > 0
        ? "\n# Embedded files\n"
        : "";
    if (this.equations.size > 0) {
      for (const key of this.equations.keys()) {
        outString += `${key}: $$${this.equations.get(key).latex}$$\n`;
      }
    }
    if (this.files.size > 0) {
      for (const key of this.files.keys()) {
        outString += `${key}: [[${this.files.get(key).linkParts.original}]]\n`;
      }
    }
    outString += this.equations.size > 0 || this.files.size > 0 ? "\n" : "";

    const sceneJSONstring = JSON.stringify({
      type: this.scene.type,
      version: this.scene.version,
      source: this.scene.source, 
      elements: this.scene.elements.concat(deletedElements),
      appState: this.scene.appState,
      files: this.scene.files
    }, null, "\t");
    return (
      outString +
      getMarkdownDrawingSection(
        sceneJSONstring,
        this.disableCompression ? false : this.plugin.settings.compress,
      )
    );
  }

  /**
   * deletes fileIds from Excalidraw data for files no longer in the scene
   * @returns
   */
  private async syncFiles(): Promise<boolean> {
    let dirty = false;
    const scene = this.scene as SceneDataWithFiles;

    //remove files and equations that no longer have a corresponding image element
    const fileIds = (
      scene.elements.filter(
        (e) => e.type === "image",
      ) as ExcalidrawImageElement[]
    ).map((e) => e.fileId);
    this.files.forEach((value, key) => {
      if (!fileIds.contains(key)) {
        this.files.delete(key);
        dirty = true;
      }
    });

    this.equations.forEach((value, key) => {
      if (!fileIds.contains(key)) {
        this.equations.delete(key);
        dirty = true;
      }
    });

    //check if there are any images that need to be processed in the new scene
    if (!scene.files || scene.files == {}) {
      return false;
    }

    //assing new fileId to duplicate equation and markdown files
    //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/601
    //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/593
    //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/297
    const processedIds = new Set<string>();
    fileIds.forEach(fileId=>{
      if(processedIds.has(fileId)) {
        const file = this.getFile(fileId);
        //const file = this.files.get(fileId as FileId);
        const equation = this.getEquation(fileId);
        //const equation = this.equations.get(fileId as FileId);
        //images should have a single reference, but equations and markdown embeds should have as many as instances of the file in the scene
        if(file && (file.file.extension !== "md" || this.plugin.isExcalidrawFile(file.file))) {
          return;
        }
        const newId = fileid();
        //scene.files[newId] = {...scene.files[fileId]};
        (scene.elements.filter((el:ExcalidrawImageElement)=>el.fileId === fileId)[0] as any).fileId = newId;
        dirty = true;
        processedIds.add(newId);
        if(file) {
          this.setFile(newId as FileId,new EmbeddedFile(this.plugin,this.file.path,file.linkParts.original));
           //this.files.set(newId as FileId,new EmbeddedFile(this.plugin,this.file.path,file.linkParts.original))
        }
        if(equation) {
          this.setEquation(newId as FileId, {latex:equation.latex, isLoaded:false});
          //this.equations.set(newId as FileId, equation);
        }
      }
      processedIds.add(fileId);
    });


    for (const key of Object.keys(scene.files)) {
      if (!(this.hasFile(key as FileId) || this.hasEquation(key as FileId))) {
        dirty = true;
        let fname = `Pasted Image ${window
          .moment()
          .format("YYYYMMDDHHmmss_SSS")}`;
        const mimeType = scene.files[key].mimeType;
        switch (mimeType) {
          case "image/png":
            fname += ".png";
            break;
          case "image/jpeg":
            fname += ".jpg";
            break;
          case "image/svg+xml":
            fname += ".svg";
            break;
          case "image/gif":
            fname += ".gif";
            break;
          default:
            fname += ".png";
        }
        const filepath = (
          await getAttachmentsFolderAndFilePath(this.app, this.file.path, fname)
        ).filepath;
        const dataURL = scene.files[key].dataURL;
        await this.app.vault.createBinary(
          filepath,
          getBinaryFileFromDataURL(dataURL),
        );
        const embeddedFile = new EmbeddedFile(
          this.plugin,
          this.file.path,
          filepath,
        );
        embeddedFile.setImage(
          dataURL,
          mimeType,
          { height: 0, width: 0 },
          scene.appState?.theme === "dark",
          mimeType === "image/svg+xml", //this treat all SVGs as if they had embedded images REF:addIMAGE
        );
        this.setFile(key as FileId, embeddedFile);
      }
    }

    //https://github.com/zsviczian/obsidian-excalidraw-plugin/issues/297
    /*const equations = new Set<string>();
    const duplicateEqs = new Set<string>();
    for (const key of fileIds) {
      if (this.hasEquation(key as FileId)) {
        if (equations.has(key)) {
          duplicateEqs.add(key);
        } else {
          equations.add(key);
        }
      }
    }
    if (duplicateEqs.size > 0) {
      for (const key of duplicateEqs.keys()) {
        const elements = this.scene.elements.filter(
          (el: ExcalidrawElement) => el.type === "image" && el.fileId === key,
        );
        for (let i = 1; i < elements.length; i++) {
          const newFileId = fileid() as FileId;
          this.setEquation(newFileId, {
            latex: this.getEquation(key as FileId).latex,
            isLoaded: false,
          });
          elements[i].fileId = newFileId;
          dirty = true;
        }
      }
    }*/

    return dirty;
  }

  public async syncElements(newScene: any, selectedElementIds?: {[key: string]: boolean}): Promise<boolean> {
    this.scene = newScene;
    let result = false;
    if (!this.compatibilityMode) {
      result = await this.syncFiles();
      this.scene.files = {}; //files contains the dataURLs of files. Once synced these are all saved to disk
    }
    this.updateElementLinksFromScene();
    result =
      result ||
      this.setLinkPrefix() ||
      this.setUrlPrefix() ||
      this.setShowLinkBrackets() ||
      this.findNewElementLinksInScene();
    await this.updateTextElementsFromScene();
    return result || this.findNewTextElementsInScene(selectedElementIds);
  }

  public async updateScene(newScene: any) {
    //console.log("Excalidraw.Data.updateScene()");
    this.scene = JSON_parse(newScene);
    this.updateElementLinksFromScene();
    const result =
      this.setLinkPrefix() ||
      this.setUrlPrefix() ||
      this.setShowLinkBrackets() ||
      this.findNewElementLinksInScene();
    await this.updateTextElementsFromScene();
    if (result || this.findNewTextElementsInScene()) {
      await this.updateSceneTextElements();
      return true;
    }
    return false;
  }

  public getRawText(id: string) {
    return this.textElements.get(id)?.raw;
  }

  public getParsedText(id: string): [string, string, string] {
    const t = this.textElements.get(id);
    if (!t) {
      return [null, null, null];
    }
    return [wrap(t.parsed, t.wrapAt), t.parsed, null];
  }

  public setTextElement(
    elementID: string,
    rawText: string,
    rawOriginalText: string,
    updateScene: Function,
  ): [string, string, string] {
    const maxLineLen = estimateMaxLineLen(rawText, rawOriginalText);
    const [parseResult, link] = this.quickParse(rawOriginalText); //will return the parsed result if raw text does not include transclusion
    if (parseResult) {
      //No transclusion
      this.textElements.set(elementID, {
        raw: rawOriginalText,
        parsed: parseResult,
        wrapAt: maxLineLen,
      });
      return [wrap(parseResult, maxLineLen), parseResult, link];
    }
    //transclusion needs to be resolved asynchornously
    this.parse(rawOriginalText).then((parseRes) => {
      const parsedText = parseRes.parsed;
      this.textElements.set(elementID, {
        raw: rawOriginalText,
        parsed: parsedText,
        wrapAt: maxLineLen,
      });
      if (parsedText) {
        updateScene(wrap(parsedText, maxLineLen), parsedText);
      }
    });
    return [null, null, null];
  }

  public async addTextElement(
    elementID: string,
    rawText: string,
    rawOriginalText: string,
  ): Promise<[string, string, string]> {
    let wrapAt: number = estimateMaxLineLen(rawText, rawOriginalText);
    if (this.textElements.has(elementID)) {
      wrapAt = this.textElements.get(elementID).wrapAt;
    }
    const parseResult = await this.parse(rawOriginalText);
    this.textElements.set(elementID, {
      raw: rawOriginalText,
      parsed: parseResult.parsed,
      wrapAt,
    });
    return [
      wrap(parseResult.parsed, wrapAt),
      parseResult.parsed,
      parseResult.link,
    ];
  }

  public deleteTextElement(id: string) {
    this.textElements.delete(id);
  }

  public getOpenMode(): { viewModeEnabled: boolean; zenModeEnabled: boolean } {
    const fileCache = this.app.metadataCache.getFileCache(this.file);
    let mode = this.plugin.settings.defaultMode;
    if (
      fileCache?.frontmatter &&
      fileCache.frontmatter[FRONTMATTER_KEY_DEFAULT_MODE] != null
    ) {
      mode = fileCache.frontmatter[FRONTMATTER_KEY_DEFAULT_MODE];
    }

    switch (mode) {
      case "zen":
        return { viewModeEnabled: false, zenModeEnabled: true };
      case "view":
        return { viewModeEnabled: true, zenModeEnabled: false };
      default:
        return { viewModeEnabled: false, zenModeEnabled: false };
    }
  }

  public getLinkOpacity(): number {
    const fileCache = this.app.metadataCache.getFileCache(this.file);
    let opacity = this.plugin.settings.linkOpacity;
    if (
      fileCache?.frontmatter &&
      fileCache.frontmatter[FRONTMATTER_KEY_LINKBUTTON_OPACITY] != null
    ) {
      opacity = fileCache.frontmatter[FRONTMATTER_KEY_LINKBUTTON_OPACITY];
    }
    return opacity; 
  }

  public getOnLoadScript(): string {
    const fileCache = this.app.metadataCache.getFileCache(this.file);
    if (
      fileCache?.frontmatter &&
      fileCache.frontmatter[FRONTMATTER_KEY_ONLOAD_SCRIPT] != null
    ) {
      return fileCache.frontmatter[FRONTMATTER_KEY_ONLOAD_SCRIPT];
    }
    return null; 
  }

  private setLinkPrefix(): boolean {
    const linkPrefix = this.linkPrefix;
    const fileCache = this.app.metadataCache.getFileCache(this.file);
    if (
      fileCache?.frontmatter &&
      fileCache.frontmatter[FRONTMATTER_KEY_CUSTOM_PREFIX] != null
    ) {
      this.linkPrefix = fileCache.frontmatter[FRONTMATTER_KEY_CUSTOM_PREFIX];
    } else {
      this.linkPrefix = this.plugin.settings.linkPrefix;
    }
    return linkPrefix != this.linkPrefix;
  }

  private setUrlPrefix(): boolean {
    const urlPrefix = this.urlPrefix;
    const fileCache = this.app.metadataCache.getFileCache(this.file);
    if (
      fileCache?.frontmatter &&
      fileCache.frontmatter[FRONTMATTER_KEY_CUSTOM_URL_PREFIX] != null
    ) {
      this.urlPrefix = fileCache.frontmatter[FRONTMATTER_KEY_CUSTOM_URL_PREFIX];
    } else {
      this.urlPrefix = this.plugin.settings.urlPrefix;
    }
    return urlPrefix != this.urlPrefix;
  }

  private setShowLinkBrackets(): boolean {
    const showLinkBrackets = this.showLinkBrackets;
    const fileCache = this.app.metadataCache.getFileCache(this.file);
    if (
      fileCache?.frontmatter &&
      fileCache.frontmatter[FRONTMATTER_KEY_CUSTOM_LINK_BRACKETS] != null
    ) {
      this.showLinkBrackets =
        fileCache.frontmatter[FRONTMATTER_KEY_CUSTOM_LINK_BRACKETS] != false;
    } else {
      this.showLinkBrackets = this.plugin.settings.showLinkBrackets;
    }
    return showLinkBrackets != this.showLinkBrackets;
  }

  /** 
   Files and equations copy/paste support
   This is not a complete solution, it assumes the source document is opened first
   at that time the fileId is stored in the master files/equations map
   when pasted the map is checked if the file already exists
   This will not work if pasting from one vault to another, but for the most common usecase 
   of copying an image or equation from one drawing to another within the same vault
   this is going to do the job
  */
  public setFile(fileId: FileId, data: EmbeddedFile) {
    //always store absolute path because in case of paste, relative path may not resolve ok
    if (!data) {
      return;
    }
    this.files.set(fileId, data);

    if (!data.file) {
      return;
    }

    const parts = data.linkParts.original.split("#");
    this.plugin.filesMaster.set(fileId, {
      path:data.file.path,
      blockrefData: parts.length === 1
        ? null
        : parts[1],
      hasSVGwithBitmap: data.isSVGwithBitmap,
    });
  }

  public getFiles(): EmbeddedFile[] {
    return Object.values(this.files);
  }

  public getFile(fileId: FileId): EmbeddedFile {
    let embeddedFile = this.files.get(fileId);
    if(embeddedFile) return embeddedFile;
    const masterFile = this.plugin.filesMaster.get(fileId);
    if(!masterFile) return embeddedFile;
    embeddedFile = new EmbeddedFile(
      this.plugin,
      this.file.path,
      masterFile.blockrefData
        ? masterFile.path + "#" + masterFile.blockrefData
        : masterFile.path
    );
    this.files.set(fileId,embeddedFile);
    return embeddedFile;
  }

  public getFileEntries() {
    return this.files.entries();
  }

  public deleteFile(fileId: FileId) {
    this.files.delete(fileId);
    //deliberately not deleting from plugin.filesMaster
    //could be present in other drawings as well
  }

  //Image copy/paste support
  public hasFile(fileId: FileId): boolean {
    if (this.files.has(fileId)) {
      return true;
    }
    if (this.plugin.filesMaster.has(fileId)) {
      const masterFile = this.plugin.filesMaster.get(fileId);
      if (!this.app.vault.getAbstractFileByPath(masterFile.path)) {
        this.plugin.filesMaster.delete(fileId);
        return true;
      } // the file no longer exists
      const embeddedFile = new EmbeddedFile(
        this.plugin,
        this.file.path,
        masterFile.blockrefData
          ? masterFile.path + "#" + masterFile.blockrefData
          : masterFile.path
      );
      this.files.set(fileId, embeddedFile);
      return true;
    }
    return false;
  }

  public setEquation(
    fileId: FileId,
    data: { latex: string; isLoaded: boolean },
  ) {
    this.equations.set(fileId, { latex: data.latex, isLoaded: data.isLoaded });
    this.plugin.equationsMaster.set(fileId, data.latex);
  }

  public getEquation(fileId: FileId): { latex: string; isLoaded: boolean } {
    let result = this.equations.get(fileId);
    if(result) return result;
    const latex = this.plugin.equationsMaster.get(fileId);
    if(!latex) return result;
    this.equations.set(fileId, {latex, isLoaded: false});
    return {latex, isLoaded: false};
  }

  public getEquationEntries() {
    return this.equations.entries();
  }

  public deleteEquation(fileId: FileId) {
    this.equations.delete(fileId);
    //deliberately not deleting from plugin.equationsMaster
    //could be present in other drawings as well
  }

  //Image copy/paste support
  public hasEquation(fileId: FileId): boolean {
    if (this.equations.has(fileId)) {
      return true;
    }
    if (this.plugin.equationsMaster.has(fileId)) {
      this.equations.set(fileId, {
        latex: this.plugin.equationsMaster.get(fileId),
        isLoaded: false,
      });
      return true;
    }
    return false;
  }
}

export const getTransclusion = async (
  linkParts: LinkParts,
  app: App,
  file: TFile,
  charCountLimit?: number,
): Promise<{ contents: string; lineNum: number; leadingHashes?: string; }> => {
  //file-name#^blockref
  //1         2 3

  if (!linkParts.path) {
    return { contents: linkParts.original.trim(), lineNum: 0 };
  } //filename not found
  if (!file || !(file instanceof TFile)) {
    return { contents: linkParts.original.trim(), lineNum: 0 };
  }
  const contents = await app.vault.read(file);
  if (!linkParts.ref) {
    //no blockreference
    return charCountLimit
      ? { contents: contents.substring(0, charCountLimit).trim(), lineNum: 0 }
      : { contents: contents.trim(), lineNum: 0 };
  }
  //const isParagraphRef = parts.value[2] ? true : false; //does the reference contain a ^ character?
  //const id = parts.value[3]; //the block ID or heading text

  const blocks = (
    await app.metadataCache.blockCache.getForFile(
      { isCancelled: () => false },
      file,
    )
  ).blocks.filter((block: any) => block.node.type != "comment");
  if (!blocks) {
    return { contents: linkParts.original.trim(), lineNum: 0 };
  }
  if (linkParts.isBlockRef) {
    let para = blocks.filter((block: any) => block.node.id == linkParts.ref)[0]
      ?.node;
    if (!para) {
      return { contents: linkParts.original.trim(), lineNum: 0 };
    }
    if (["blockquote", "listItem"].includes(para.type)) {
      para = para.children[0];
    } //blockquotes are special, they have one child, which has the paragraph
    const startPos = para.position.start.offset;
    const lineNum = para.position.start.line;
    const endPos =
      para.children[para.children.length - 1]?.position.start.offset - 1; //alternative: filter((c:any)=>c.type=="blockid")[0]
    return {
      contents: contents.substring(startPos, endPos).trim(),
      lineNum,
    };
  }
  const headings = blocks.filter(
    (block: any) => block.display.search(/^#+\s/) === 0,
  ); // startsWith("#"));
  let startPos: number = null;
  let lineNum: number = 0;
  let endPos: number = null;
  let depth:number = 1;
  for (let i = 0; i < headings.length; i++) {
    if (startPos && !endPos) {
      let j = i;
      while (j<headings.length && headings[j].node.depth>depth) {j++};
      if(j === headings.length && headings[j-1].node.depth > depth) {
        return {
          leadingHashes: "#".repeat(depth)+" ",
          contents: contents.substring(startPos).trim(),
          lineNum
        };    
      }
      endPos = headings[j].node.position.start.offset - 1;
      return {
        leadingHashes: "#".repeat(depth)+" ",
        contents: contents.substring(startPos, endPos).trim(),
        lineNum,
      };
    }
    const c = headings[i].node.children[0];
    const dataHeading = headings[i].node.data?.hProperties?.dataHeading;
    const cc = c?.children;
    //const refNoSpace = linkParts.ref.replaceAll(" ","");
    if (
      !startPos &&
      (c?.value?.replaceAll(REG_BLOCK_REF_CLEAN, "") === linkParts.ref ||
        c?.title?.replaceAll(REG_BLOCK_REF_CLEAN, "") === linkParts.ref ||
        dataHeading?.replaceAll(REG_BLOCK_REF_CLEAN, "") === linkParts.ref ||
        (cc
          ? cc[0]?.value?.replaceAll(REG_BLOCK_REF_CLEAN, "") === linkParts.ref
          : false))
    ) {
      startPos = headings[i].node.children[0]?.position.start.offset; //
      depth = headings[i].node.depth;
      lineNum = headings[i].node.children[0]?.position.start.line; //
    }
  }
  if (startPos) {
    return {
      leadingHashes: "#".repeat(depth) + " ",
      contents: contents.substring(startPos).trim(),
      lineNum 
    };
  }
  return { contents: linkParts.original.trim(), lineNum: 0 };
};
