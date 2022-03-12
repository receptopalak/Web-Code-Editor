var html = document.getElementById("html");
var css = document.getElementById("css");
var js = document.getElementById("js");
var code = document.getElementById("code").contentWindow.document;

function elementOver(element) {
  $(element).mouseover(function (e) {
    $(element.parentElement).css("width", "50%");
  });
}
function elementOut(element) {
  $(element).mouseout(function (e) {
    $(element.parentElement).css("width", "auto");
  });
}

elementOut(html);
elementOut(css);
elementOut(js);
elementOver(html);
elementOver(css);
elementOver(js);

document.addEventListener("keydown", function (event) {
  if (event.ctrlKey) {
    event.preventDefault();
  }
});

$(document).ready(function () {
  $(document).keydown(function (e) {

    if (e.ctrlKey & e.which == 83)
     compile();
  });
});

let htmlLocal = localStorage.getItem("currentHTML") ?? "";
let cssLocal = localStorage.getItem("currentCss") ?? "";
let jsLocal = localStorage.getItem("currentJs") ?? "";

function compile() {
  code.open();
  code.writeln(
    html.value +
      "<style>" +
      css.value +
      "</style>" +
      "<script>" +
      js.value +
      "</script>"
  );
  code.close();
  localStorage.setItem("currentHTML", html.value);
  localStorage.setItem("currentCss", css.value);
  localStorage.setItem("currentJs", js.value);
}

function saveIframe(id, filename) {
  var frameObj = document.getElementById(id);
  var frameContent = frameObj.contentWindow.document.body.innerHTML;
  var blob = new Blob(
    [
      `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Code Export</title>
        </head>
        <body>
        <style> 
        ${css.value}
        </style>
        ${html.value} 
        <script>
        ${js.value} 
        </script>  
        </body>
      </html>
      `,
    ],
    { type: "text/plain;charset=utf-8" }
  );
  saveAs(blob, `${filename}.html`);

  const htmlobject = {
    filename: filename,
    html: html.value,
    css: css.value,
    js: js.value,
  };

  SaveFileToLocalStorage(htmlobject);
}

function AskFileName(id) {
  swal({
    title: "Enter Your File Name",
    input: "text",
  }).then(function (text) {
    saveIframe(id, text);
  });
}

function currentCodes() {
  code.open();
  code.writeln(
    htmlLocal.value +
      "<style>" +
      cssLocal.value +
      "</style>" +
      "<script>" +
      jsLocal.value +
      "</script>"
  );
  code.close();
  html.innerHTML = htmlLocal;
  css.innerHTML = cssLocal;
  js.innerHTML = jsLocal;
  compile();
}

currentCodes();

function SaveFileToLocalStorage(data) {
  var a = [];
  a = JSON.parse(localStorage.getItem("saveTemp")) || [];
  a.push(data);
  localStorage.setItem("saveTemp", JSON.stringify(a));
}

function savedFiles() {
  const historyFiles = JSON.parse(localStorage.saveTemp);
  $("#historyfiles").empty();
  for (i = 0; i < historyFiles.length; i++) {
    $("#historyfiles").append(
      `<a class="dropdown-item text-dark" data-id="${i}" href="#" onclick="getOldFile(${i})">${historyFiles[i].filename}</a>`
    );
  }
}

function getOldFile(id) {
  const oldfile = JSON.parse(localStorage.saveTemp)[id];
  html.innerHTML = oldfile.html;
  css.innerHTML = oldfile.css;
  js.innerHTML = oldfile.js;
  compile();
}

function minpanel(element) {
  const panel = $(".code_panel")[0];
  const iframe = $("iframe")[0];
  min = panel.className.includes("d-none");
  if (panel.style.display != "none") {
    $(panel).hide("slow");

    $(iframe).addClass("iframe-selected");
    $("#min")[0].innerText = "Maximize ";
  } else {
    $(panel).show("slow");

    $(iframe).removeClass("iframe-selected");
    $("#min")[0].innerText = "Minimize ";
  }
}
