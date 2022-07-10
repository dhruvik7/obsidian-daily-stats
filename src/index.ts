import "obsidian";
//import { ExcalidrawAutomate } from "./ExcalidrawAutomate";
export {ExcalidrawAutomateInterface} from  "./types";
export type { ExcalidrawBindableElement, ExcalidrawElement, FileId, FillStyle, StrokeSharpness, StrokeStyle } from "@zsviczian/excalidraw/types/element/types";
export type { Point } from "@zsviczian/excalidraw/types/types";
export const getEA = (view?:any): any => {
  try {
    return window.ExcalidrawAutomate.getAPI(view);
  } catch(e) {
    console.log({message: "Excalidraw not available", fn: getEA});
    return null;
  }
}