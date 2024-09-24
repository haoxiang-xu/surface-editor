export const iconManifest = {
  /* { System UI Icons } ------------------------------------------------------------------------------------------------------------- */
  arrow: () => import("./SVGs/UI/arrow.svg"),

  /* { context menu } */
  close: () => import("./SVGs/UI/close.svg"),
  rename: () => import("./SVGs/UI/rename.svg"),
  open_folder: () => import("./SVGs/UI/open_folder.svg"),
  open_file: () => import("./SVGs/UI/open_file.svg"),
  new_folder: () => import("./SVGs/UI/new_folder.svg"),
  new_file: () => import("./SVGs/UI/new_file.svg"),
  fold: () => import("./SVGs/UI/fold.svg"),
  unfold: () => import("./SVGs/UI/unfold.svg"),
  search: () => import("./SVGs/UI/search.svg"),
  copy: () => import("./SVGs/UI/copy.svg"),
  paste: () => import("./SVGs/UI/paste.svg"),

  /* {win32} */
  win32_maximize: () => import("./SVGs/UI/win32/maximize.svg"),
  win32_minimize: () => import("./SVGs/UI/win32/minimize.svg"),
  win32_restore: () => import("./SVGs/UI/win32/restore.svg"),

  /* { System UI Icons } ------------------------------------------------------------------------------------------------------------- */

  /* { File types Icons } ------------------------------------------------------------------------------------------------------------ */

  /* { Programming Languages } */
  JS: () => import("./SVGs/file_types/js.svg"),
  HTML: () => import("./SVGs/file_types/html.svg"),
  CSS: () => import("./SVGs/file_types/css.svg"),
  IPYNB: () => import("./SVGs/file_types/ipynb.svg"),
  JSON: () => import("./SVGs/file_types/json.svg"),
  PY: () => import("./SVGs/file_types/py.svg"),

  /* { Image } */
  PNG: () => import("./SVGs/file_types/png.svg"),

  /* { Document } */
  TXT: () => import("./SVGs/file_types/txt.svg"),
  PDF: () => import("./SVGs/file_types/pdf.svg"),
  DOCX: () => import("./SVGs/file_types/docx.svg"),
  XLSX: () => import("./SVGs/file_types/xlsx.svg"),
  PPTX: () => import("./SVGs/file_types/pptx.svg"),

  /* { Configuration } */
  GITIGNORE: () => import("./SVGs/file_types/gitignore.svg"),

  /* { File types Icons } ------------------------------------------------------------------------------------------------------------ */
};
