let currentTemplate = null;
let currentColor = null;
let generatedBlobUrl = null;

const stylesList = ["ヴァイス本家", "ブラウ", "ロゼ", "初心者", "エンジョイ", "真剣勝負", "コレクション", "対戦したい", "大会出ます", "デッキ相談したい", "リモートしたい", "YouTubeやってます", "ブログやってます", "リモート対戦募集", "趣味話したい"];

const templateSettings = {
    'simple': { fields: [{ id: 'name', label: 'ハンドルネーム', span: 1 }, { id: 'sex', label: '性別', span: 1 }, { id: 'title', label: '好きな参戦作品', span: 2, large: true }] },
    'social': { fields: [{ id: 'name', label: 'ハンドルネーム', span: 1 }, { id: 'sex', label: '性別', span: 1 }, { id: 'area', label: '活動地域', span: 1 }, { id: 'bushi', label: 'ブシナビコード', span: 1 }, { id: 'discord', label: 'Discord ID', span: 2 }, { id: 'title', label: '好きな参戦作品', span: 2, large: true }] },
    'push': { fields: [{ id: 'name', label: 'ハンドルネーム', span: 1 }, { id: 'sex', label: '性別', span: 1 }, { id: 'oshi', label: '推しキャラ', span: 2 }, { id: 'title', label: '好きな参戦作品', span: 2, large: true }, { id: 'future', label: '今後来てほしいタイトル', span: 2, large: true }] }
};

const colorSettings = {
    'weiss': { bg: '#111', text: '#fff', border: '#fff' },
    'blau': { bg: '#F8FAFF', text: '#1a3b5c', border: '#1a3b5c' },
    'rose': { bg: '#FFEFEF', text: '#5c1a1a', border: '#5c1a1a' }
};

function selectTemplate(t, el) {
    currentTemplate = t;
    document.querySelectorAll('#template-selector .option-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    checkReady();
}

function selectColor(c, el) {
    currentColor = c;
    document.querySelectorAll('#color-selector .option-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    checkReady();
}

function checkReady() { document.getElementById('btn-to-step2').disabled = !(currentTemplate && currentColor); }
function goToStep1() { document.getElementById('step2').classList.remove('active'); document.getElementById('step1').classList.add('active'); }

function goToStep2() {
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step2').classList.add('active');
    window.scrollTo(0, 0);
    setTimeout(resizePreview, 100);
    setupCanvas();
}

function resizePreview() {
    const area = document.getElementById('capture-area');
    const outer = document.querySelector('.preview-outer');
    const scale = outer.offsetWidth / 1050;
    area.style.transform = `scale(${scale})`;
    outer.style.height = (1350 * scale) + "px";
}

function setupCanvas() {
    const theme = colorSettings[currentColor];
    const config = templateSettings[currentTemplate];
    const canvas = document.getElementById('resume-canvas');
    canvas.style.setProperty('--primary-bg', theme.bg);
    canvas.style.setProperty('--primary-text', theme.text);
    canvas.style.setProperty('--border-color', theme.border);

    const grid = document.getElementById('preview-info-grid');
    const inputs = document.getElementById('dynamic-inputs');
    grid.innerHTML = ''; inputs.innerHTML = '';
    
    config.fields.forEach(f => {
        grid.innerHTML += `<div class="field-box" style="grid-column: span ${f.span}"><div class="field-label">${f.label}</div><div class="field-value ${f.large ? 'large' : ''}" id="prev-${f.id}"></div></div>`;
        inputs.innerHTML += `<div class="form-group"><label>${f.label}</label><input type="text" oninput="updateText('${f.id}', this.value, true)"></div>`;
    });

    const styleDisplay = document.getElementById('preview-styles');
    const styleInputs = document.getElementById('style-inputs');
    styleDisplay.innerHTML = ''; styleInputs.innerHTML = '';
    stylesList.forEach((s, i) => {
        styleDisplay.innerHTML += `<div class="check-item" id="disp-style-${i}"><span class="check-mark"></span>${s}</div>`;
        styleInputs.innerHTML += `<label class="checkbox-label" id="label-style-${i}"><input type="checkbox" onchange="toggleStyle(${i}, this)">${s}</label>`;
    });
}

function updateText(id, val, isAutoFit) {
    const el = document.getElementById('prev-' + id);
    if (!el) return;
    el.innerText = val;
    if (isAutoFit && !el.classList.contains('large')) {
        let fontSize = 34; el.style.fontSize = fontSize + "px";
        while (el.scrollWidth > el.offsetWidth && fontSize > 14) {
            fontSize -= 1; el.style.fontSize = fontSize + "px";
        }
    }
}

function toggleStyle(index, cb) {
    const disp = document.getElementById('disp-style-' + index);
    const label = document.getElementById('label-style-' + index);
    cb.checked ? (disp.classList.add('checked'), label.classList.add('active')) : (disp.classList.remove('checked'), label.classList.remove('active'));
}

function updateIcon(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.getElementById('preview-icon');
            img.src = e.target.result; img.style.display = 'block';
            document.getElementById('icon-placeholder').style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

async function generateImage() {
    document.getElementById('step2').classList.remove('active');
    document.getElementById('step3').classList.add('active');
    const dlBtn = document.getElementById('download-btn');
    const imgMsg = document.getElementById('loading-msg');
    const resultImg = document.getElementById('generated-image');
    
    dlBtn.disabled = true;
    imgMsg.style.display = "block";
    resultImg.style.display = "none";
    window.scrollTo(0, 0);

    const area = document.getElementById('capture-area');
    const originalTransform = area.style.transform;
    area.style.transform = "none";

    await new Promise(r => setTimeout(r, 500));

    try {
        const canvas = await html2canvas(document.getElementById('resume-canvas'), {
            scale: 2, useCORS: true, backgroundColor: colorSettings[currentColor].bg, logging: false
        });

        canvas.toBlob((blob) => {
            if (generatedBlobUrl) URL.revokeObjectURL(generatedBlobUrl);
            generatedBlobUrl = URL.createObjectURL(blob);
            resultImg.src = generatedBlobUrl;
            resultImg.style.display = "block";
            imgMsg.style.display = "none";
            dlBtn.disabled = false;
        }, 'image/png');
    } catch (err) {
        alert("生成に失敗しました。");
        backToEdit();
    } finally {
        area.style.transform = originalTransform;
    }
}

function downloadImage() {
    if (!generatedBlobUrl) return;
    const link = document.createElement('a');
    link.href = generatedBlobUrl;
    link.download = `WS_Resume_${Date.now()}.png`;
    link.click();
}

function copyHashtag() {
    navigator.clipboard.writeText("#ヴァイス履歴書 #ヴァイス好きと繋がりたい").then(() => alert("コピーしました！"));
}

function backToEdit() {
    document.getElementById('step3').classList.remove('active');
    document.getElementById('step2').classList.add('active');
}