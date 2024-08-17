const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote", 'code-block'],
    [{ font: [] }],
    [{ align: ["right", "center", "justify"] }],
    [{ "list": "ordered" }, { "list": "bullet" }, { "list": "check" }, { "list": "uncheck" }, { "list": "star" }, { "list": "circle" }, { "list": "square" }, { "list": "dash" }, { "list": "dot" }, { "list": "number" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction
    ["link", "image"],
    [{ "color": ["black", "#0179D0", "blue", "white", "gray", "red", "green", "yellow", "purple", "orange", "pink"] }],
    [{ background: ["black", "white", "gray", "red", "#0179D0", "blue", "green", "yellow", "purple", "orange", "pink"] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "clean",
  "bold",
  "italic",
  "underline",
  "strike",
  "code",
  "blockquote",
  "list",
  "bullet",
  "link",
  "color",
  "image",
  "code-block",
  "background",
  "align",
  "size",
  "font",
  "script",
];

export const textEditorValues = {
  formats,
  modules
};