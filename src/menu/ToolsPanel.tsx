import clsx from "clsx";
import { Notice, TFile } from "obsidian";
import * as React from "react";
import { ActionButton } from "./ActionButton";
import { ICONS } from "./ActionIcons";
import { SCRIPT_INSTALL_FOLDER } from "../Constants";
import { insertLaTeXToView, search } from "../ExcalidrawAutomate";
import ExcalidrawView, { TextMode } from "../ExcalidrawView";
import { t } from "../lang/helpers";
import { ReleaseNotes } from "../dialogs/ReleaseNotes";
import { ScriptIconMap } from "../Scripts";
import { getIMGFilename } from "../utils/FileUtils";

declare const PLUGIN_VERSION:string;
const dark = '<svg style="stroke:#ced4da;#212529;color:#ced4da;fill:#ced4da" ';
const light = '<svg style="stroke:#212529;color:#212529;fill:#212529" ';

type PanelProps = {
  visible: boolean;
  view: ExcalidrawView;
  centerPointer: Function;
};

export type PanelState = {
  visible: boolean;
  top: number;
  left: number;
  theme: "dark" | "light";
  excalidrawViewMode: boolean;
  minimized: boolean;
  isFullscreen: boolean;
  isPreviewMode: boolean;
  scriptIconMap: ScriptIconMap;
};

const TOOLS_PANEL_WIDTH = 228;

export class ToolsPanel extends React.Component<PanelProps, PanelState> {
  pos1: number = 0;
  pos2: number = 0;
  pos3: number = 0;
  pos4: number = 0;
  penDownX: number = 0;
  penDownY: number = 0;
  previousWidth: number = 0;
  previousHeight: number = 0;
  onRightEdge: boolean = false;
  onBottomEdge: boolean = false;
  private containerRef: React.RefObject<HTMLDivElement>;

  constructor(props: PanelProps) {
    super(props);
    const react = props.view.plugin.getPackage(props.view.ownerWindow).react;
    this.containerRef = react.createRef();
    this.state = {
      visible: props.visible,
      top: 50,
      left: 200,
      theme: "dark",
      excalidrawViewMode: false,
      minimized: false,
      isFullscreen: false,
      isPreviewMode: true,
      scriptIconMap: {},
    };
  }

  updateScriptIconMap(scriptIconMap: ScriptIconMap) {
    this.setState(() => {
      return { scriptIconMap };
    });
  }

  setPreviewMode(isPreviewMode: boolean) {
    this.setState(() => {
      return {
        isPreviewMode,
      };
    });
  }

  setFullscreen(isFullscreen: boolean) {
    this.setState(() => {
      return {
        isFullscreen,
      };
    });
  }

  setExcalidrawViewMode(isViewModeEnabled: boolean) {
    this.setState(() => {
      return {
        excalidrawViewMode: isViewModeEnabled,
      };
    });
  }

  toggleVisibility(isMobileOrZen: boolean) {
    this.setTopCenter(isMobileOrZen);
    this.setState((prevState: PanelState) => {
      return {
        visible: !prevState.visible,
      };
    });
  }

  setTheme(theme: "dark" | "light") {
    this.setState((prevState: PanelState) => {
      return {
        theme,
      };
    });
  }

  setTopCenter(isMobileOrZen: boolean) {
    this.setState(() => {
      return {
        left:
          (this.containerRef.current.clientWidth -
            TOOLS_PANEL_WIDTH -
            (isMobileOrZen ? 0 : TOOLS_PANEL_WIDTH + 4)) /
            2 +
          this.containerRef.current.parentElement.offsetLeft +
          (isMobileOrZen ? 0 : TOOLS_PANEL_WIDTH + 4),
        top: 64 + this.containerRef.current.parentElement.offsetTop,
      };
    });
  }

  updatePosition(deltaY: number = 0, deltaX: number = 0) {
    this.setState(() => {
      const {
        offsetTop,
        offsetLeft,
        clientWidth: width,
        clientHeight: height,
      } = this.containerRef.current.firstElementChild as HTMLElement;

      const top = offsetTop - deltaY;
      const left = offsetLeft - deltaX;

      const {
        clientWidth: parentWidth,
        clientHeight: parentHeight,
        offsetTop: parentOffsetTop,
        offsetLeft: parentOffsetLeft,
      } = this.containerRef.current.parentElement;

      this.previousHeight = parentHeight;
      this.previousWidth = parentWidth;
      this.onBottomEdge = top >= parentHeight - height + parentOffsetTop;
      this.onRightEdge = left >= parentWidth - width + parentOffsetLeft;

      return {
        top:
          top < parentOffsetTop
            ? parentOffsetTop
            : this.onBottomEdge
            ? parentHeight - height + parentOffsetTop
            : top,
        left:
          left < parentOffsetLeft
            ? parentOffsetLeft
            : this.onRightEdge
            ? parentWidth - width + parentOffsetLeft
            : left,
      };
    });
  }

  render() {
    return (
      <div
        ref={this.containerRef}
        className={clsx("excalidraw", {
          "theme--dark": this.state.theme === "dark",
        })}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          touchAction: "none",
        }}
      >
        <div
          className="Island"
          style={{
            top: `${this.state.top}px`,
            left: `${this.state.left}px`,
            width: `${TOOLS_PANEL_WIDTH}px`,
            display:
              this.state.visible && !this.state.excalidrawViewMode
                ? "block"
                : "none",
            height: "fit-content",
            maxHeight: "400px",
            zIndex: 5,
          }}
        >
          <div
            style={{
              height: "26px",
              width: "100%",
              cursor: "move",
            }}
            onClick={(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
              event.preventDefault();
              if (
                Math.abs(this.penDownX - this.pos3) > 5 ||
                Math.abs(this.penDownY - this.pos4) > 5
              ) {
                return;
              }
              this.setState((prevState: PanelState) => {
                return {
                  minimized: !prevState.minimized,
                };
              });
            }}
            onPointerDown={(event: React.PointerEvent) => {
              const onDrag = (e: PointerEvent) => {
                e.preventDefault();
                this.pos1 = this.pos3 - e.clientX;
                this.pos2 = this.pos4 - e.clientY;
                this.pos3 = e.clientX;
                this.pos4 = e.clientY;
                this.updatePosition(this.pos2, this.pos1);
              };

              const onPointerUp = () => {
                this.props.view.ownerDocument?.removeEventListener("pointerup", onPointerUp);
                this.props.view.ownerDocument?.removeEventListener("pointermove", onDrag);
              };

              event.preventDefault();
              this.penDownX = this.pos3 = event.clientX;
              this.penDownY = this.pos4 = event.clientY;
              this.props.view.ownerDocument.addEventListener("pointerup", onPointerUp);
              this.props.view.ownerDocument.addEventListener("pointermove", onDrag);
            }}
          >
            <svg
              aria-hidden="true"
              focusable="false"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 228 26"
            >
              <path
                stroke="var(--icon-fill-color)"
                strokeWidth="2"
                d="M40,7 h148 M40,13 h148 M40,19 h148"
              />
            </svg>
          </div>
          <div
            className="Island App-menu__left scrollbar"
            style={{
              maxHeight: "350px",
              //@ts-ignore
              "--padding": 2,
              display: this.state.minimized ? "none" : "block",
            }}
          >
            <div className="panelColumn">
              <fieldset>
                <legend>Utility actions</legend>
                <div className="buttonList buttonListIcon">
                  <ActionButton
                    key={"search"}
                    title={t("SEARCH")}
                    action={() => {
                      search(this.props.view);
                    }}
                    icon={ICONS.search}
                    view={this.props.view}
                  />
                  <ActionButton
                    key={"release-notes"}
                    title={t("READ_RELEASE_NOTES")}
                    action={() => {
                      new ReleaseNotes(
                        this.props.view.app,
                        this.props.view.plugin,
                        PLUGIN_VERSION,
                      ).open();
                    }}
                    icon={ICONS.releaseNotes}
                    view={this.props.view}
                  />
                  {this.state.isPreviewMode === null ? (
                    <ActionButton
                      key={"convert"}
                      title={t("CONVERT_FILE")}
                      action={() => {
                        this.props.view.convertExcalidrawToMD();
                      }}
                      icon={ICONS.convertFile}
                      view={this.props.view}
                    />
                  ) : (
                    <ActionButton
                      key={"viewmode"}
                      title={this.state.isPreviewMode ? t("PARSED") : t("RAW")}
                      action={() => {
                        if (this.state.isPreviewMode) {
                          this.props.view.changeTextMode(TextMode.raw);
                        } else {
                          this.props.view.changeTextMode(TextMode.parsed);
                        }
                      }}
                      icon={
                        this.state.isPreviewMode
                          ? ICONS.rawMode
                          : ICONS.parsedMode
                      }
                      view={this.props.view}
                    />
                  )}
                  <ActionButton
                    key={"tray-mode"}
                    title={t("TRAY_MODE")}
                    action={() => {
                      this.props.view.toggleTrayMode();
                    }}
                    icon={ICONS.trayMode}
                    view={this.props.view}
                  />
                  <ActionButton
                    key={"fullscreen"}
                    title={
                      this.state.isFullscreen
                        ? t("EXIT_FULLSCREEN")
                        : t("GOTO_FULLSCREEN")
                    }
                    action={() => {
                      if (this.state.isFullscreen) {
                        this.props.view.exitFullscreen();
                      } else {
                        this.props.view.gotoFullscreen();
                      }
                    }}
                    icon={
                      this.state.isFullscreen
                        ? ICONS.exitFullScreen
                        : ICONS.gotoFullScreen
                    }
                    view={this.props.view}
                  />
                </div>
              </fieldset>
              <fieldset>
                <legend>Export actions</legend>
                <div className="buttonList buttonListIcon">
                  <ActionButton
                    key={"lib"}
                    title={t("DOWNLOAD_LIBRARY")}
                    action={() => {
                      this.props.view.plugin.exportLibrary();
                    }}
                    icon={ICONS.exportLibrary}
                    view={this.props.view}
                  />
                  <ActionButton
                    key={"svg"}
                    title={t("EXPORT_SVG")}
                    action={() => {
                      this.props.view.saveSVG();
                      new Notice(
                        `File saved: ${getIMGFilename(
                          this.props.view.file.path,
                          "svg",
                        )}`,
                      );
                    }}
                    icon={ICONS.exportSVG}
                    view={this.props.view}
                  />
                  <ActionButton
                    key={"png"}
                    title={t("EXPORT_PNG")}
                    action={() => {
                      this.props.view.savePNG();
                      new Notice(
                        `File saved: ${getIMGFilename(
                          this.props.view.file.path,
                          "png",
                        )}`,
                      );
                    }}
                    icon={ICONS.exportPNG}
                    view={this.props.view}
                  />
                  <ActionButton
                    key={"excalidraw"}
                    title={t("EXPORT_EXCALIDRAW")}
                    action={() => {
                      this.props.view.exportExcalidraw();
                    }}
                    icon={ICONS.exportExcalidraw}
                    view={this.props.view}
                  />
                  <ActionButton
                    key={"md"}
                    title={t("OPEN_AS_MD")}
                    action={() => {
                      this.props.view.openAsMarkdown();
                    }}
                    icon={ICONS.switchToMarkdown}
                    view={this.props.view}
                  />
                </div>
              </fieldset>
              <fieldset>
                <legend>Insert actions</legend>
                <div className="buttonList buttonListIcon">
                  <ActionButton
                    key={"image"}
                    title={t("INSERT_IMAGE")}
                    action={() => {
                      this.props.centerPointer();
                      this.props.view.plugin.insertImageDialog.start(
                        this.props.view,
                      );
                    }}
                    icon={ICONS.insertImage}
                    view={this.props.view}
                  />
                  <ActionButton
                    key={"insertMD"}
                    title={t("INSERT_MD")}
                    action={() => {
                      this.props.centerPointer();
                      this.props.view.plugin.insertMDDialog.start(
                        this.props.view,
                      );
                    }}
                    icon={ICONS.insertMD}
                    view={this.props.view}
                  />
                  <ActionButton
                    key={"latex"}
                    title={t("INSERT_LATEX")}
                    action={() => {
                      this.props.centerPointer();
                      insertLaTeXToView(this.props.view);
                    }}
                    icon={ICONS.insertLaTeX}
                    view={this.props.view}
                  />
                  <ActionButton
                    key={"link"}
                    title={t("INSERT_LINK")}
                    action={() => {
                      this.props.centerPointer();
                      this.props.view.plugin.insertLinkDialog.start(
                        this.props.view.file.path,
                        this.props.view.addText,
                      );
                    }}
                    icon={ICONS.insertLink}
                    view={this.props.view}
                  />
                  <ActionButton
                    key={"link-to-element"}
                    title={t("INSERT_LINK_TO_ELEMENT")}
                    action={() => {
                      this.props.view.copyLinkToSelectedElementToClipboard();
                    }}
                    icon={ICONS.copyElementLink}
                    view={this.props.view}
                  />
                </div>
              </fieldset>
              {this.renderScriptButtons(false)}
              {this.renderScriptButtons(true)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderScriptButtons(isDownloaded: boolean) {
    if (Object.keys(this.state.scriptIconMap).length === 0) {
      return "";
    }

    const downloadedScriptsRoot = `${this.props.view.plugin.settings.scriptFolderPath}/${SCRIPT_INSTALL_FOLDER}/`;

    const filterCondition = (key: string): boolean =>
      isDownloaded
        ? key.startsWith(downloadedScriptsRoot)
        : !key.startsWith(downloadedScriptsRoot);

    if (
      Object.keys(this.state.scriptIconMap).filter((k) => filterCondition(k))
        .length === 0
    ) {
      return "";
    }

    return (
      <fieldset>
        <legend>{isDownloaded ? "Downloaded" : "User"} Scripts</legend>
        <div className="buttonList buttonListIcon">
          {Object.keys(this.state.scriptIconMap)
            .filter((k) => filterCondition(k))
            .sort()
            .map((key: string) => (
              <ActionButton
                key={key}
                title={
                  isDownloaded
                    ? this.state.scriptIconMap[key].name.replace(
                        `${SCRIPT_INSTALL_FOLDER}/`,
                        "",
                      )
                    : this.state.scriptIconMap[key].name
                }
                action={async () => {
                  const f =
                    this.props.view.app.vault.getAbstractFileByPath(key);
                  if (f && f instanceof TFile) {
                    this.props.view.plugin.scriptEngine.executeScript(
                      this.props.view,
                      await this.props.view.plugin.app.vault.read(f),
                      this.props.view.plugin.scriptEngine.getScriptName(f)
                    );
                  }
                }}
                icon={
                  this.state.scriptIconMap[key].svgString ? (
                    <img
                      src={`data:image/svg+xml,${encodeURIComponent(
                        this.state.theme === "dark"
                          ? this.state.scriptIconMap[key].svgString.replace(
                              "<svg ",
                              dark,
                            )
                          : this.state.scriptIconMap[key].svgString.replace(
                              "<svg ",
                              light,
                            ),
                      )}`}
                    />
                  ) : (
                    ICONS.cog
                  )
                }
                view={this.props.view}
              />
            ))}
        </div>
      </fieldset>
    );
  }
}
