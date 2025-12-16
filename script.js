let currentTemplate = null;
let currentColor = null;
let generatedBlobUrl = null;

const stylesList = [
  "ヴァイス本家", "ブラウ", "ロゼ",
  "初心者", "エンジョイ", "真剣勝負",
  "コレクション", "対戦したい", "大会出ます",
  "デッキ相談したい", "リモートしたい",
  "YouTubeやってます", "ブログやってます",
  "リモート対戦募集", "趣味話したい"
];

const templateSettings = {
  simple: {
    fields: [
      { id: "name", label: "ハンドルネーム", span: 1 },
      { id: "sex", label: "性別", span: 1 },
      { id: "title", label: "好きな参戦作品", span: 2, large: true }
    ]
  },
  social: {
    fields: [
      { id: "name", label: "ハンドルネーム", span: 1 },
      { id: "sex", label: "性別", span: 1 },
      { id: "area", label: "活動地域", span: 1 },
      { id: "bushi", label: "ブシナビコード", span: 1 },
      { id: "discord", label: "Discord ID", span: 2 },
      { id: "title", label: "好きな参戦作品", span: 2, large: true }
    ]
  },
  push: {
    fields: [
      { id: "name", label: "ハンドルネーム", span: 1 },
      { id: "sex", label: "性別", span: 1 },
      { id: "oshi", label: "推しキャラ", span: 2 },
      { id: "title", label: "好きな参戦作品", span: 2, large: true },
      { id: "future", label: "今後来てほしいタイトル", span: 2, large: true }
    ]
  }
};

const colorSettings = {
  weiss: { bg: "#111", text: "#fff", border: "#fff" },
  blau: { bg: "#F8FAFF", text: "#1a3b5c", border: "#1a3b5c" },
  rose: { bg: "#FFEFEF", text: "#5c1a1a", border: "#5c1a1a" }
};

function selectTemplate(t, el) {
  currentTemplate = t;
  document.querySelectorAll("#template-selector .option-card")
    .forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  checkReady();
}

function selectColor(c, el) {
  currentColor = c;
  document.querySelectorAll("#color-selector .option-card")
    .forEach(c => c.classList.remove("selected"));
  el.classList.add("selected");
  checkReady();
}

function checkReady() {
  document.getElementById("btn-to-step2").disabled = !(currentTemplate && currentColor);
}

function goToStep1() {
  document.getElementById("step2").classList.remove("active");
  document.getElementById("step1").classList.add("active");
}

function goToStep2() {
  document.getElementById("step1").classList.remove("active");
  document.getElementById("step2").classList.add("active");
  window.scrollTo(0, 0);
  setTimeout(resizePreview, 100);
  setupCanvas();
}

function resizePreview() {
  const area = document.getElementById("capture-area");
  const outer = document.querySelector(".preview-outer");
  const scale = outer.offsetWidth / 1050;
  area.style.transform = `scale(${scale})`;
  outer.style.height = (1350 * scale) + "px";
}

function setupCanvas() {
  const theme = colorSettings[currentColor];
  const canvas = document.getElementById("resume-canvas");

  canvas.style.background = theme.bg;
  canvas.style.color = theme.text;
  canvas.style.setProperty("--border-color", theme.border);

  const grid = document.getElementById("preview-info-grid");
  const inputs = document.getElementById("dynamic-inputs");

  grid.innerHTML = "";
  inputs.innerHTML = "";

  templateSettings[currentTemplate].fields.forEach(f => {
    grid.innerHTML += `
      <div class="field-box" style="grid-column: span ${f.span}">
        <div class="field-label">${f.label}</div>
        <div class="field-value ${f.large ? "large" : ""}" id="prev-${f.id}"></div>
      </div>`;
    inputs.innerHTML += `
      <div class="form-group">
        <label>${f.label}</label>
        <input type="text" oninput="updateText('${f.id}', this.value, true)">
      </div>`;
  });

  const disp = document.getElementById("preview-styles");
  const inp = document.getElementById("style-inputs");

  disp.innerHTML = "";
  inp.innerHTML = "";

  stylesList.forEach((s, i) => {
    disp.innerHTML += `
      <div class="check-item" id="disp-style-${i}">
        <span class="check-mark"></span>${s}
      </div>`;
    inp.innerHTML += `
      <label class="checkbox-label" id="label-style-${i}">
        <input type="checkbox" onchange="toggleStyle(${i}, this)">${s}
      </label>`;
  });
}

function updateText(id, val, auto) {
  const el = document.getElementById("prev-" + id);
  if (!el) return;
  el.innerText = val;

  if (auto && !el.classList.contains("large")) {
    let size = 34;
    el.style.fontSize = size + "px";
    while (el.scrollWidth > el.offsetWidth && size > 14) {
      size--;
      el.style.fontSize = size + "px";
    }
  }
}

function toggleStyle(i, cb) {
  document.getElementById("disp-style-" + i).classList.toggle("checked", cb.checked);
  document.getElementById("label-style-" + i).classList.toggle("active", cb.checked);
}

function updateIcon(input) {
  if (!input.files[0]) return;
  const r = new FileReader();
  r.onload = e => {
    const img = document.getElementById("preview-icon");
    img.src = e.target.result;
    img.style.display = "block";
    document.getElementById("icon-placeholder").style.display = "none";
  };
  r.readAsDataURL(input.files[0]);
}

/* ★ここが最大の修正ポイント */
async function generateImage() {
  document.getElementById("step2").classList.remove("active");
  document.getElementById("step3").classList.add("active");

  const img = document.getElementById("generated-image");
  const msg = document.getElementById("loading-msg");
  const btn = document.getElementById("download-btn");

  img.style.display = "none";
  msg.style.display = "block";
  btn.disabled = true;

  window.scrollTo(0, 0);

  // フォント完全ロード待ち
  await document.fonts.ready;

  const target = document.getElementById("capture-area");

  const canvas = await html2canvas(target, {
    backgroundColor: null,
    useCORS: true,
    scale: 2
  });

  canvas.toBlob(blob => {
    if (generatedBlobUrl) URL.revokeObjectURL(generatedBlobUrl);
    generatedBlobUrl = URL.createObjectURL(blob);
    img.src = generatedBlobUrl;
    img.style.display = "block";
    msg.style.display = "none";
    btn.disabled = false;
  }, "image/png");
}

function downloadImage() {
  if (!generatedBlobUrl) return;
  const a = document.createElement("a");
  a.href = generatedBlobUrl;
  a.download = "WS_Resume.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function backToEdit() {
  document.getElementById("step3").classList.remove("active");
  document.getElementById("step2").classList.add("active");
}

function copyHashtag() {
  navigator.clipboard.writeText("#ヴァイス履歴書 #ヴァイス好きと繋がりたい");
  alert("コピーしました！");
}

}