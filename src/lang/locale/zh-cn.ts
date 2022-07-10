import {
  FRONTMATTER_KEY_CUSTOM_LINK_BRACKETS,
  FRONTMATTER_KEY_CUSTOM_PREFIX,
  FRONTMATTER_KEY_CUSTOM_URL_PREFIX,
} from "src/Constants";

// 简体中文
export default {
  // main.ts
  INSTALL_SCRIPT: "安装此脚本",
  UPDATE_SCRIPT: "发现可用更新 - 点击安装",
  CHECKING_SCRIPT: "检查脚本更新 - 点击重新安装",
  UNABLETOCHECK_SCRIPT: "检查更新失败 - 点击重新安装",
  UPTODATE_SCRIPT: "已安装最新脚本 - 点击重新安装",
  OPEN_AS_EXCALIDRAW: "打开为 Excalidraw 绘图（Excalidraw 模式）",
  TOGGLE_MODE: "在 Excalidraw 和 Markdown 模式之间切换",
  CONVERT_NOTE_TO_EXCALIDRAW: "转换空白笔记为 Excalidraw 绘图",
  CONVERT_EXCALIDRAW: "转换 *.excalidraw 为 *.md 文件",
  CREATE_NEW: "新建 Excalidraw 绘图",
  CONVERT_FILE_KEEP_EXT: "*.excalidraw => *.excalidraw.md",
  CONVERT_FILE_REPLACE_EXT: "*.excalidraw => *.md (兼容 Logseq)",
  DOWNLOAD_LIBRARY: "导出 stencil 库为 *.excalidrawlib 文件",
  OPEN_EXISTING_NEW_PANE: "打开已有的绘图（在新面板）",
  OPEN_EXISTING_ACTIVE_PANE: "打开已有的绘图（在当前面板）",
  TRANSCLUDE: "插入（嵌入）绘图到当前文档",
  TRANSCLUDE_MOST_RECENT: "插入（嵌入）最近编辑的绘图到当前文档",
  NEW_IN_NEW_PANE: "新建绘图（在新面板）",
  NEW_IN_ACTIVE_PANE: "新建绘图（在当前面板）",
  NEW_IN_NEW_PANE_EMBED: "新建绘图（在新面板），并插入（嵌入）到当前文档",
  NEW_IN_ACTIVE_PANE_EMBED: "新建绘图（在当前面板），并插入（嵌入）到当前文档",
  EXPORT_SVG: "导出 SVG 文件到当前目录",
  EXPORT_PNG: "导出 PNG 文件到当前目录",
  TOGGLE_LOCK: "切换文本元素的原文/预览模式",
  DELETE_FILE: "删除所选的图像或以图像形式嵌入的 Markdown 文档（包括其源文件）",
  INSERT_LINK_TO_ELEMENT: "复制所选元素（以链接形式）",
  INSERT_LINK_TO_ELEMENT_ERROR: "未选择画布里的单个元素",
  INSERT_LINK_TO_ELEMENT_READY: "链接已生成并复制到剪贴板",
  INSERT_LINK: "插入（链接）文件到当前绘图",
  INSERT_IMAGE: "插入（以图像形式嵌入）图像到当前绘图",
  INSERT_MD: "插入（以图像形式嵌入） Markdown 文档到当前绘图",
  INSERT_LATEX: "插入 LaTeX 公式",
  ENTER_LATEX: "输入 LaTeX 表达式",
  READ_RELEASE_NOTES: "阅读本插件的最新发行版本说明",
  TRAY_MODE: "切换绘图工具属性页的面板（Panel）/托盘（Tray）模式",
  SEARCH: "搜索文本",

  //ExcalidrawView.ts
  INSTALL_SCRIPT_BUTTON: "安装或更新 Excalidraw 自动化脚本",
  OPEN_AS_MD: "打开为 Markdown 文件（Markdown 模式）",
  SAVE_AS_PNG: "导出 PNG 到当前目录（按住 CTRL/CMD 设定导出路径）",
  SAVE_AS_SVG: "导出 SVG 到当前目录（按住 CTRL/CMD 设定导出路径）",
  OPEN_LINK: "打开所选元素里的链接 \n（按住 SHIFT 在新面板打开）",
  EXPORT_EXCALIDRAW: "导出为 .Excalidraw 文件",
  LINK_BUTTON_CLICK_NO_TEXT:
    "请选择一个含有链接的图形或文本元素。\n" +
    "按住 SHIFT 并点击此按钮可在新面板中打开链接。\n" +
    "您也可以直接在画布中按住 CTRL/CMD 并点击图形或文本元素来打开链接。",
  TEXT_ELEMENT_EMPTY:
    "未选中图形或文本元素，或者元素不包含有效的链接（[[链接|别名]] 或 [别名](链接)）",
  FILENAME_INVALID_CHARS: '文件名不能含有以下符号： * " \\  < > : | ? #',
  FILE_DOES_NOT_EXIST:
    "文件不存在。按住 ALT（或 ALT + SHIFT）并点击链接来创建新文件。",
  FORCE_SAVE:
    "立刻保存该绘图，并更新其他嵌入了该绘图的面板。\n（详见插件设置中的定期保存选项）",
  RAW: "文本元素正以原文（RAW）模式显示链接。\n点击切换到预览（PREVIEW）模式",
  PARSED:
    "文本元素正以预览（PREVIEW）模式显示链接。\n点击切换到原文（RAW）模式",
  NOFILE: "Excalidraw（没有文件）",
  COMPATIBILITY_MODE:
    "*.excalidraw 文件以兼容模式打开。转换为新格式以获得完整的插件功能。",
  CONVERT_FILE: "转换为新格式",

  //settings.ts
  RELEASE_NOTES_NAME: "显示更新说明",
  RELEASE_NOTES_DESC:
    "<b>开启：</b>每次更新本插件后，显示最新发行版本的说明。<br>" +
    "<b>关闭：</b>您仍可以在 <a href='https://github.com/zsviczian/obsidian-excalidraw-plugin/releases'>GitHub</a> 上阅读更新说明。",
  FOLDER_NAME: "Excalidraw 文件夹",
  FOLDER_DESC: "新绘图的默认存储路径。若为空，将在库的根目录中创建新绘图。",
  FOLDER_EMBED_NAME: "将 Excalidraw 文件夹用于“新建绘图”命令创建的绘图",
  FOLDER_EMBED_DESC:
    "在命令面板中执行“新建绘图，并插入（嵌入）到当前文档”之类命令时，" +
    "新绘图的存储路径。<br>" +
    "<b>开启：</b>使用 Excalidraw 文件夹。 <b>关闭：</b>使用 Obsidian 设置的新附件默认位置。",
  TEMPLATE_NAME: "Excalidraw 模板文件",
  TEMPLATE_DESC:
    "Excalidraw 模板文件的完整路径。<br>" +
    "如果您的模板在默认的 Excalidraw 文件夹中且文件名是 " +
    "Template.md，则此项应设为 Excalidraw/Template.md（也可省略 .md 扩展名，即 Excalidraw/Template）。<br>" +
    "如果您在兼容模式下使用 Excalidraw，那么您的模板文件也必须是旧的 *.excalidraw 格式，" +
    "例如 Excalidraw/Template.excalidraw。",
  SCRIPT_FOLDER_NAME: "Excalidraw 自动化脚本的文件夹",
  SCRIPT_FOLDER_DESC:
    "此文件夹用于存放 Excalidraw 自动化脚本。" +
    "您可以在 Obsidian 命令面板中执行这些脚本，" +
    "还可以为喜欢的脚本分配快捷键，就像为其他 Obsidian 命令分配快捷键一样。<br>" +
    "该项不能设为库的根目录。",
  COMPRESS_NAME: "压缩 Excalidraw JSON",
  COMPRESS_DESC:
    "Excalidraw 绘图文件默认将元素记录为 JSON 格式。开启此项，可将元素的 JSON 数据以 BASE64 编码" +
    "（使用 <a href='https://pieroxy.net/blog/pages/lz-string/index.html'>LZ-String</a> 算法）。" +
    "这样做的好处是：一方面可以避免原来的明文 JSON 数据干扰 Obsidian 的文本搜索结果，" +
    "另一方面减小了绘图文件的体积。<br>" +
    "当您通过功能区按钮或命令将绘图切换成 Markdown 模式时，" +
    "数据将被解码回 JSON 格式以便阅读和编辑；" +
    "而当您切换回 Excalidraw 模式时，数据就会被再次编码。<br>" +
    "开启此项后，对于之前已存在的未压缩的绘图文件，" +
    "需要重新打开并保存它们才能生效。",
  AUTOSAVE_NAME: "定期保存",
  AUTOSAVE_DESC:
    "定期保存当前绘图。此功能专为移动设备设计 —— " +
    "在桌面端，当您关闭 Excalidraw 或 Obsidian，或者移动焦点到其他面板的时候，软件是会自动保存的；" +
    "但是在手机或平板上通过滑动手势退出 Obsidian 时，可能无法顺利触发自动保存。因此我添加了定期保存功能作为弥补。",
  AUTOSAVE_INTERVAL_NAME: "定期保存的时间间隔",
  AUTOSAVE_INTERVAL_DESC:
    "每隔多长时间执行一次保存。如果当前绘图没有发生改变，将不会进行定期保存。",
  FILENAME_HEAD: "文件名",
  FILENAME_DESC:
    "<p>点击阅读" +
    "<a href='https://momentjs.com/docs/#/displaying/format/'>日期和时间格式参考</a>。</p>",
  FILENAME_SAMPLE: "当前设置下，新绘图的文件名形如：",
  FILENAME_EMBED_SAMPLE: "“新建绘图”命令创建的绘图的文件名形如：",
  FILENAME_PREFIX_NAME: "文件名前缀",
  FILENAME_PREFIX_DESC: "文件名的第一部分",
  FILENAME_PREFIX_EMBED_NAME: "“新建绘图”命令创建的绘图的文件名前缀",
  FILENAME_PREFIX_EMBED_DESC:
    "若开启此项，" +
    "则在命令面板中执行“新建绘图，并插入（嵌入）到当前文档”之类命令时，" +
    "创建的绘图文件名将以当前文档名作为开头。",
  FILENAME_POSTFIX_NAME: "“新建绘图”命令创建的绘图的文件名后缀",
  FILENAME_POSTFIX_DESC:
    "介于文件名前缀和文件名日期之间的文本。仅对“新建绘图”命令创建的绘图生效。",
  FILENAME_DATE_NAME: "文件名日期",
  FILENAME_DATE_DESC: "文件名的最后一部分",
  FILENAME_EXCALIDRAW_EXTENSION_NAME: "文件扩展名（.excalidraw.md 或 .md）",
  FILENAME_EXCALIDRAW_EXTENSION_DESC:
    "该选项在兼容模式（即非 Excalidraw 专用 Markdown 文件）下不会生效。<br>" +
    "<b>开启：</b>使用 .excalidraw.md 作为扩展名；<b>关闭：</b>使用 .md 作为扩展名。",
  /*SVG_IN_MD_NAME: "SVG Snapshot to markdown file",
  SVG_IN_MD_DESC: "If the switch is 'on' Excalidraw will include an SVG snapshot in the markdown file. "+
                  "When SVG snapshots are saved to the Excalidraw.md file, drawings that include large png, jpg, gif images may take extreme long time to open in markdown view. " +
                  "On the other hand, SVG snapshots provide some level of platform independence and longevity to your drawings. Even if Excalidraw will no longer exist, the snapshot " +
                  "can be opened with an app that reads SVGs. In addition hover previews will be less resource intensive if SVG snapshots are enabled.",*/
  DISPLAY_HEAD: "显示",
  LEFTHANDED_MODE_NAME: "左手模式",
  LEFTHANDED_MODE_DESC:
    "目前只影响托盘模式下，绘图工具属性页的位置。若开启此项，则托盘处于右侧。",
  MATCH_THEME_NAME: "使新建的绘图匹配 Obsidian 主题",
  MATCH_THEME_DESC:
    "如果 Obsidian 使用黑暗主题，新建的绘图文件也将使用黑暗主题。<br>" +
    "但是若设置了模板，新建的绘图文件将跟随模板主题；另外，此功能不会作用于已有的绘图。",
  MATCH_THEME_ALWAYS_NAME: "使已有的绘图匹配 Obsidian 主题",
  MATCH_THEME_ALWAYS_DESC:
    "如果 Obsidian 使用黑暗主题，则绘图文件也将以黑暗主题打开；反之亦然。",
  MATCH_THEME_TRIGGER_NAME: "Excalidraw 主题跟随 Obsidian 主题变化",
  MATCH_THEME_TRIGGER_DESC:
    "开启此项，则切换 Obsidian 的黑暗/明亮主题时，当前活动的 Excalidraw 面板的主题会随之改变。",
  DEFAULT_OPEN_MODE_NAME: "Excalidraw 的默认运行模式",
  DEFAULT_OPEN_MODE_DESC:
    "设置 Excalidraw 的运行模式：普通模式，禅模式，或者阅读模式。<br>" +
    "您可为某个绘图单独设置此项，方法是在其 Frontmatter 中添加形如 <code>excalidraw-default-mode: normal/zen/view</code> 的键值对。",
  ZOOM_TO_FIT_NAME: "自动缩放以适应面板调整",
  ZOOM_TO_FIT_DESC: "调整面板大小时，自适应地缩放画布",
  ZOOM_TO_FIT_MAX_LEVEL_NAME: "自动缩放的最高级别",
  ZOOM_TO_FIT_MAX_LEVEL_DESC:
    "自动缩放画布时，允许放大的最高级别。该值不能低于 0.5（50%）且不能超过 10（1000%）。",
  LINKS_HEAD: "链接（Links） & 嵌入到绘图中的文档（Transclusion）",
  LINKS_DESC:
    "按住 CTRL/CMD 并点击包含 <code>[[链接]]</code> 的文本元素可以打开其中的链接。" +
    "如果所选文本元素包含多个 <code>[[有效的 Obsidian 链接]]</code> ，只会打开第一个链接；" +
    "如果所选文本元素包含有效的 URL 链接 (如 <code>https://</code> 或 <code>http://</code>)，" +
    "插件会在浏览器中打开 URL 链接。<br>" +
    "链接的源文件被重命名时，绘图中相应的 <code>[[链接]]</code> 也会同步更新。" +
    "若您不愿绘图中的链接文本因此而变化，可用 <code>[[链接|别名]]</code> 来使用别名。",
  ADJACENT_PANE_NAME: "在相邻面板中打开",
  ADJACENT_PANE_DESC:
    "按住 CTRL/CMD + SHIFT 并点击链接时，插件默认会在新面板中打开该链接。<br>" +
    "若开启此项，Excalidraw 会先尝试寻找已有的相邻面板（按照右侧、左侧、上方、下方的顺序），" +
    "并在其中打开链接。如果找不到，" +
    "再在新面板中打开链接。",
  LINK_BRACKETS_NAME: "在链接的两侧显示 [[中括号]]",
  LINK_BRACKETS_DESC: `${
    "文本元素处于预览模式时，在链接的两侧显示中括号。<br>" +
    "您可为某个绘图单独设置此项，方法是在其 Frontmatter 中添加形如 <code>"
  }${FRONTMATTER_KEY_CUSTOM_LINK_BRACKETS}: true/false</code> 的键值对。`,
  LINK_PREFIX_NAME: "链接的前缀",
  LINK_PREFIX_DESC: `${
    "文本元素处于预览模式时，如果其中包含链接，则添加此前缀。<br>" +
    "您可为某个绘图单独设置此项，方法是在其 Frontmatter 中添加形如 <code>"
  }${FRONTMATTER_KEY_CUSTOM_PREFIX}: "📍 "</code> 的键值对。`,
  URL_PREFIX_NAME: "URL 的前缀",
  URL_PREFIX_DESC: `${
    "预览模式下，如果文本元素包含 URL 链接，则添加此前缀。<br>" +
    "您可为某个绘图单独设置此项，方法是在其 Frontmatter 中添加形如 <code>"
  }${FRONTMATTER_KEY_CUSTOM_URL_PREFIX}: "🌐 "</code> 的键值对。`,
  HOVERPREVIEW_NAME: "鼠标悬停预览链接",
  HOVERPREVIEW_DESC:
    "<b>开启：</b>鼠标悬停在 <code>[[链接]]</code> 上即可预览。<br><b>关闭：</b>鼠标悬停在 <code>[[链接]]</code> 上，并且按住 CTRL/CMD 时进行预览。",
  LINKOPACITY_NAME: "链接标识的透明度",
  LINKOPACITY_DESC:
    "含有链接的元素，其右上角的链接标识的透明度。介于 0（全透明）到 1（不透明）之间。",
  LINK_CTRL_CLICK_NAME:
    "按住 CTRL/CMD 并点击含有 [[链接]] 或 [别名](链接) 的文本来打开链接",
  LINK_CTRL_CLICK_DESC:
    "如果此功能影响到您使用某些原版 Excalidraw 功能，可将其关闭。" +
    "关闭后，您只能通过绘图面板标题栏中的链接按钮来打开链接。",
  TRANSCLUSION_WRAP_NAME: "嵌入文档（Translusion）的折行方式",
  TRANSCLUSION_WRAP_DESC:
    "中的 number 表示嵌入的文本溢出时，在第几个字符处进行折行。<br>" +
    "此开关控制具体的折行方式。若开启，则严格在 number 处折行，禁止溢出；" +
    "若关闭，则允许在 number 位置后最近的空格处折行。",
  TRANSCLUSION_DEFAULT_WRAP_NAME: "嵌入文档（Translusion）的默认折行位置",
  TRANSCLUSION_DEFAULT_WRAP_DESC:
    "除了通过 <code>![[doc#^block]]{number}</code> 中的 number 来控制折行位置，您也可以在此设置 number 的默认值。<br>" +
    "一般设为 0 即可，表示不设置固定的默认值，这样当您需要嵌入文档到便签中时，" +
    "Excalidraw 能更好地帮您自动处理。",
  PAGE_TRANSCLUSION_CHARCOUNT_NAME: "嵌入文档（Translusion）的最大显示字符数",
  PAGE_TRANSCLUSION_CHARCOUNT_DESC:
    "以 <code>![[Markdown 文档]]</code> 的形式将文档嵌入到绘图中时，" +
    "该文档在绘图中可显示的最大字符数量。",
  GET_URL_TITLE_NAME: "使用 iframly 获取页面标题",
  GET_URL_TITLE_DESC:
    "拖放链接到 Excalidraw 时，使用 <code>http://iframely.server.crestify.com/iframely?url=</code> 来获取页面的标题。",
  MD_HEAD: "以图像形式嵌入到绘图中的 Markdown 文档（MD-Embed）",
  MD_HEAD_DESC:
    "您可以将 Markdown 文档以图像（而非链接）的形式嵌入到绘图中，" +
    "方法是按住 CTRL/CMD 并从文件管理器中把文档拖入绘图，或者使用命令面板里的相关命令。",
  MD_TRANSCLUDE_WIDTH_NAME: "MD-Embed 的默认宽度",
  MD_TRANSCLUDE_WIDTH_DESC:
    "MD-Embed 图像的宽度。该选项会影响到折行，以及图像元素的宽度。<br>" +
    "您可为绘图中的某个 MD-Embed 单独设置此项，方法是将绘图切换至 Markdown 模式，" +
    "并修改相应的 <code>[[Embed文件名#标题|宽度x最大高度]]</code>。",
  MD_TRANSCLUDE_HEIGHT_NAME: "MD-Embed 的默认最大高度",
  MD_TRANSCLUDE_HEIGHT_DESC:
    "MD-Embed 图像的高度取决于文档内容的多少，但最大不会超过该值。<br>" +
    "您可为绘图中的某个 MD-Embed 单独设置此项，方法是将绘图切换至 Markdown 模式，并修改相应的 <code>[[Embed文件名#^块引ID|宽度x最大高度]]</code>。",
  MD_DEFAULT_FONT_NAME: "MD-Embed 的默认字体",
  MD_DEFAULT_FONT_DESC:
    "可以设为 <code>Virgil</code>，<code>Casadia</code> 或其他有效的 .ttf/.woff/.woff2 字体文件（如 <code>我的字体.woff2</code>）。<br>" +
    "您可为某个 MD-Embed 单独设置此项，方法是在其源文件的 Frontmatter 中添加形如 <code>excalidraw-font: 字体名或文件名</code> 的键值对。",
  MD_DEFAULT_COLOR_NAME: "MD-Embed 的默认文本颜色",
  MD_DEFAULT_COLOR_DESC:
    "可以填写 HTML 颜色名，如 steelblue（参考 <a href='https://www.w3schools.com/colors/colors_names.asp'>HTML Color Names</a>），或者有效的 16 进制颜色值，例如 #e67700，或者任何其他有效的 CSS 颜色。<br>" +
    "您可为某个 MD-Embed 单独设置此项，方法是在其源文件的 Frontmatter 中添加形如 <code>excalidraw-font-color: steelblue</code> 的键值对。",
  MD_DEFAULT_BORDER_COLOR_NAME: "MD-Embed 的默认边框颜色",
  MD_DEFAULT_BORDER_COLOR_DESC:
    "可以填写 HTML 颜色名，如 steelblue（参考 <a href='https://www.w3schools.com/colors/colors_names.asp'>HTML Color Names</a>），或者有效的 16 进制颜色值，例如 #e67700，或者任何其他有效的 CSS 颜色。<br>" +
    "您可为某个 MD-Embed 单独设置此项，方法是在其源文件的 Frontmatter 中添加形如 <code>excalidraw-border-color: gray</code> 的键值对。<br>" +
    "如果您不想要边框，请留空。",
  MD_CSS_NAME: "MD-Embed 的默认 CSS 样式表",
  MD_CSS_DESC:
    "MD-Embed 图像所采用的 CSS 样式表文件名。需包含扩展名，例如 md-embed.css。" +
    "允许使用 Markdown 文件（如 md-embed-css.md），但其内容应符合 CSS 语法。<br>" +
    "如果您要查询 CSS 所作用的 HTML 节点，请在 Obsidian 开发者控制台（CTRL+SHIFT+i）中键入命令：" +
    "<code>ExcalidrawAutomate.mostRecentMarkdownSVG</code> —— 这将显示 Excalidraw 最近生成的 SVG。<br>" +
    "此外，在 CSS 中不能任意地设置字体，您一般只能使用系统默认的标准字体（详见 README），" +
    "但可以通过上面的设置来额外添加一个自定义字体。<br>" +
    "您可为某个 MD-Embed 单独设置此项，方法是在其源文件的 Frontmatter 中添加形如 <code>excalidraw-css: 库中的CSS文件或CSS片段</code> 的键值对。",
  EMBED_HEAD: "嵌入到文档中的绘图（Embed） & 导出",
  EMBED_PREVIEW_SVG_NAME: "在 Markdown 阅读视图下显示 SVG 格式的预览图",
  EMBED_PREVIEW_SVG_DESC:
    "Obsidian 的 Markdown 阅读视图默认会将嵌入的绘图显示为 SVG 格式的预览图。若关闭此项，则显示为 PNG 格式。",
  PREVIEW_MATCH_OBSIDIAN_NAME: "预览图匹配 Obsidian 主题",
  PREVIEW_MATCH_OBSIDIAN_DESC:
    "开启此项，则当 Obsidian 处于黑暗模式时，预览图也会以黑暗模式渲染；" +
    "当 Obsidian 处于明亮模式时，的预览图也会以明亮模式渲染。<br>您可能还需要关闭“导出的图像包含背景”开关，来获得与 Obsidian 更加协调的观感。",
  EMBED_WIDTH_NAME: "预览图的默认宽度",
  EMBED_WIDTH_DESC:
    "该选项同时作用于 Obsidian 实时预览模式下的编辑视图和阅读视图，以及鼠标悬停时的预览图。<br>" +
    "您可为嵌入到文档中的某个绘图单独设置此项，" +
    "方法是修改相应的链接格式为形如 <code>![[drawing.excalidraw|100]]</code> 或 <code>[[drawing.excalidraw|100x100]]</code> 的格式。",
  EMBED_TYPE_NAME: "“嵌入绘图到当前文档”命令的源文件类型",
  EMBED_TYPE_DESC:
    "在命令面板中执行“嵌入绘图到当前文档”之类命令时，要嵌入绘图文件，还是嵌入其 PNG 或 SVG 副本。<br>" +
    "如果您想在该下拉框中选择 PNG 或 SVG 副本，需要先开启下方的“自动导出 PNG 格式副本”或“自动导出 SVG 格式副本”开关。" +
    "若您选择了嵌入 PNG 或 SVG 副本，当绘图缺少对应的 PNG 或 SVG 副本时，该命令将会插入一条损坏的链接，您需要打开绘图文件并手动导出副本才能修复 —— " +
    "该选项不会帮您自动生成 PNG/SVG 副本，而只会引用已经存在的 PNG/SVG 副本。",
  EMBED_WIKILINK_NAME: "“嵌入绘图到当前文档”命令产生的链接类型",
  EMBED_WIKILINK_DESC:
    "<b>开启：</b>将产生 <code>![[Wiki 链接]]</code>。<b>关闭：</b>将产生 <code>![](Markdown 链接)</code>。",
  EXPORT_PNG_SCALE_NAME: "导出 PNG 图像的比例",
  EXPORT_PNG_SCALE_DESC: "导出的 PNG 图像的大小比例",
  EXPORT_BACKGROUND_NAME: "导出的图像包含背景",
  EXPORT_BACKGROUND_DESC: "如果关闭，将导出透明背景的图像。",
  EXPORT_SVG_PADDING_NAME: "导出 SVG 图像的边距",
  EXPORT_SVG_PADDING_DESC:
    "导出的 PNG 图像的空白边距（像素）。增加该值，可以避免在导出 SVG 图像时，过于靠近画布边缘的图形被裁掉。",
  EXPORT_THEME_NAME: "导出的图像包含主题",
  EXPORT_THEME_DESC:
    "导出与绘图的黑暗/明亮主题匹配的图像。" +
    "如果关闭，在黑暗主题下导出的图像将和明亮主题一样。",
  EXPORT_HEAD: "导出设置",
  EXPORT_SYNC_NAME: "保持 .SVG 和 .PNG 文件名与绘图文件同步",
  EXPORT_SYNC_DESC:
    "打开后，当绘图文件被重命名时，插件将同步更新同文件夹下的同名 .SVG 和 .PNG 文件。" +
    "当绘图文件被删除时，插件将自动删除同文件夹下的同名 .SVG 和 .PNG 文件。",
  EXPORT_SVG_NAME: "自动导出 SVG 格式副本",
  EXPORT_SVG_DESC:
    "自动导出和绘图文件同名的 SVG 格式副本。" +
    "插件会将副本保存到绘图文件所在的文件夹中。" +
    "在文档中嵌入这个 SVG 文件，相比直接嵌入绘图文件，具有更强的跨平台能力。<br>" +
    "此开关开启时，每次您编辑 Excalidraw 绘图，其 SVG 文件副本都会同步更新。",
  EXPORT_PNG_NAME: "自动导出 PNG 格式副本",
  EXPORT_PNG_DESC: "和“自动导出 SVG 格式副本”类似，但是导出格式为 *.PNG。",
  COMPATIBILITY_HEAD: "兼容性设置",
  EXPORT_EXCALIDRAW_NAME: "自动导出 Excalidraw 格式副本",
  EXPORT_EXCALIDRAW_DESC:
    "和“自动导出 SVG 格式副本”类似，但是导出格式为 *.excalidraw。",
  SYNC_EXCALIDRAW_NAME: "保持同一绘图的新旧格式文件内容一致",
  SYNC_EXCALIDRAW_DESC:
    "如果旧格式（*.excalidraw）绘图文件的修改日期比新格式（*.md）更新，" +
    "则根据旧格式文件的内容来更新新格式文件。",
  COMPATIBILITY_MODE_NAME: "以旧格式创建新绘图",
  COMPATIBILITY_MODE_DESC:
    "开启此功能后，您通过功能区按钮、命令面板、" +
    "文件浏览器等创建的绘图都将是旧格式（*.excalidraw）。" +
    "此外，您打开旧格式绘图文件时将不再收到提醒消息。",
  EXPERIMENTAL_HEAD: "实验性功能",
  EXPERIMENTAL_DESC:
    "以下部分设置不会立即生效，需要刷新文件资源管理器或者重启 Obsidian 才会生效。",
  FIELD_SUGGESTER_NAME: "开启 Field Suggester",
  FIELD_SUGGESTER_DESC:
    "开启后，当您在编辑器中输入 <code>excalidraw-</code> 或者 <code>ea.</code> 时，会弹出一个带有函数说明的自动补全提示菜单。<br>" +
    "该功能借鉴了 Breadcrumbs 和 Templater 插件。",
  FILETYPE_NAME: "在文件浏览器中为 excalidraw.md 文件添加类型标识符（如 ✏️）",
  FILETYPE_DESC: "可通过下一项设置来自定义类型标识符。",
  FILETAG_NAME: "excalidraw.md 文件的类型标识符",
  FILETAG_DESC: "要显示为类型标识符的 emoji 或文本。",
  INSERT_EMOJI: "插入 emoji",
  LIVEPREVIEW_NAME: "嵌入绘图到文档时，模拟嵌入图像的语法",
  LIVEPREVIEW_DESC:
    "开启此项，则可在 Obsidian 实时预览模式的编辑视图下，用形如 <code>![[绘图|宽度|样式]]</code> 的语法来嵌入绘图。<br>" +
    "该选项不会在已打开的文档中立刻生效 —— " +
    "你需要重新打开此文档来使其生效。",
  ENABLE_FOURTH_FONT_NAME: "为文本元素启用本地字体",
  ENABLE_FOURTH_FONT_DESC:
    "开启此项后，文本元素的属性面板里会多出一个本地字体按钮。<br>" +
    "使用了本地字体的绘图文件，将会失去一部分跨平台能力 —— " +
    "若将绘图文件移动到其他库中打开，显示效果可能会截然不同；" +
    "若在 excalidraw.com 或者其他版本的 Excalidraw 中打开，使用本地字体的文本会变回系统默认字体。",
  FOURTH_FONT_NAME: "本地字体文件",
  FOURTH_FONT_DESC:
    "选择库文件夹中的一个 .ttf, .woff 或 .woff2 字体文件作为本地字体文件。" +
    "若未选择文件，则使用默认的 Virgil 字体。",
  SCRIPT_SETTINGS_HEAD: "已安装脚本的设置",

  //openDrawings.ts
  SELECT_FILE: "选择一个文件后按回车。",
  NO_MATCH: "查询不到匹配的文件。",
  SELECT_FILE_TO_LINK: "选择要插入（链接）到当前绘图中的文件。",
  SELECT_DRAWING: "选择要插入（以图像形式嵌入）到当前绘图中的图像。",
  TYPE_FILENAME: "键入要选择的绘图名称。",
  SELECT_FILE_OR_TYPE_NEW: "选择已有绘图，或者新绘图的类型，然后按回车。",
  SELECT_TO_EMBED: "选择要插入（嵌入）到当前文档中的绘图。",
  SELECT_MD: "选择要插入（以图像形式嵌入）到当前绘图中的 Markdown 文档。",

  //EmbeddedFileLoader.ts
  INFINITE_LOOP_WARNING:
    "EXCALIDRAW 警告\n停止加载嵌入的图像，因为此文件中存在死循环：\n",

  //Scripts.ts
  SCRIPT_EXECUTION_ERROR: "脚本运行错误。请在开发者控制台中查看错误信息。",

  //ExcalidrawData.ts
  LOAD_FROM_BACKUP: "Excalidraw 文件已损坏。尝试从备份文件中加载。",

  //ObsidianMenu.tsx
  GOTO_FULLSCREEN: "进入全屏模式",
  EXIT_FULLSCREEN: "退出全屏模式",
  TOGGLE_FULLSCREEN: "切换全屏模式",
};
