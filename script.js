let currentTemplate = null;
let currentColor = null;
let generatedBlobUrl = null;

const stylesList = [
    "ヴァイス本家", "ブラウ", "ロゼ", 
    "初心者", "エンジョイ", "真剣勝負",
    "コレクション", "対戦したい", "大会出ます",
    "デッキ相談したい", "リモートしたい", "YouTubeやってます",
    "ブログやってます", "リモート対戦募集", "趣味話したい"
];

// テンプレート設定
// ハンドルネームに multiline: true を付与して2行入力を許可
const templateSettings = {
    'simple': {
        fields: [
            { id: 'name', label: 'ハンドルネーム', span: 1, multiline: true },
            { id: 'sex', label: '性別', span: 1 },
            { id: 'title', label: '好きな参戦作品', span: 2, large: true }
        ]
    },
    'social': {
        fields: [
            { id: 'name', label: 'ハンドルネーム', span: 1, multiline: true },
            { id: 'sex', label: '性別', span: 1 },
            { id: 'area', label: '活動地域', span: 1 },
            { id: 'bushi', label: 'ブシナビコード', span: 1 },
            { id: 'discord', label: 'Discord ID', span: 2 },
            { id: 'title', label: '好きな参戦作品', span: 2, large: true }
        ]
    },
    'push': {
        fields: [
            { id: 'name', label: 'ハンドルネーム', span: 1, multiline: true },
            { id: 'sex', label: '性別', span: 1 },
            { id: 'oshi', label: '推しキャラ', span: 2 },
            { id: 'title', label: '好きな参戦作品', span: 2, large: true },
            { id: 'future', label: '今後来てほしいタイトル', span: 2, large: true }
        ]
    }
};

const colorSettings = {
    'weiss': { bg: '#111', text: '#fff', border: '#fff' },
    'blau': { bg: '#F8FAFF', text: '#1a3b5c', border: '#1a3b5c' },
    'rose': { bg: '#FFEFEF', text: '#5c1a1a', border: '#5c1a1a' }
};

// --- 初期化・選択系関数 ---

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

function checkReady() {
    document.getElementById('btn-to-step2').disabled = !(currentTemplate && currentColor);
}

function goToStep1() {
    switchPage('step1');
}

function goToStep2() {
    switchPage('step2');
    setTimeout(resizePreview, 100);
    setupCanvas();
}

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
}

function backToEdit() {
    switchPage('step2');
    setTimeout(resizePreview, 100);
}

// --- キャンバスセットアップ・リサイズ ---

function resizePreview() {
    const area = document.getElementById('capture-area');
    const outer = document.querySelector('.preview-outer');
    const scale = outer.offsetWidth / 1050;
    area.style.transform = `scale(${scale})`;
    outer.style.height = (1350 * scale) + "px";
}

window.addEventListener('resize', () => {
    if(document.getElementById('step2').classList.contains('active')){
        resizePreview();
    }
});

function setupCanvas() {
    const theme = colorSettings[currentColor];
    const config = templateSettings[currentTemplate];
    const canvas = document.getElementById('resume-canvas');
    
    canvas.style.setProperty('--primary-bg', theme.bg);
    canvas.style.setProperty('--primary-text', theme.text);
    canvas.style.setProperty('--border-color', theme.border);

    const grid = document.getElementById('preview-info-grid');
    const inputs = document.getElementById('dynamic-inputs');
    grid.innerHTML = ''; 
    inputs.innerHTML = '';
    
    config.fields.forEach(f => {
        // multilineがtrueならクラスを追加してCSSで折り返しを許可する
        const extraClass = f.large ? 'large' : (f.multiline ? 'multiline' : '');
        
        grid.innerHTML += `
            <div class="field-box" style="grid-column: span ${f.span}">
                <div class="field-label">${f.label}</div>
                <div class="field-value ${extraClass}" id="prev-${f.id}"></div>
            </div>`;
        
        inputs.innerHTML += `
            <div class="form-group">
                <label>${f.label}</label>
                <input type="text" oninput="updateText('${f.id}', this.value, true)" placeholder="${f.label}を入力">
            </div>`;
    });

    const styleDisplay = document.getElementById('preview-styles');
    const styleInputs = document.getElementById('style-inputs');
    styleDisplay.innerHTML = ''; 
    styleInputs.innerHTML = '';
    
    stylesList.forEach((s, i) => {
        styleDisplay.innerHTML += `
            <div class="check-item" id="disp-style-${i}">
                <span class="check-mark"></span>${s}
            </div>`;
        
        styleInputs.innerHTML += `
            <label class="checkbox-label" id="label-style-${i}">
                <input type="checkbox" onchange="toggleStyle(${i}, this)">${s}
            </label>`;
    });
}

// --- 入力反映ロジック (最終調整) ---

function updateText(id, val, isAutoFit) {
    const el = document.getElementById('prev-' + id);
    if (!el) return;
    el.innerText = val;
    
    // 自動縮小ロジック
    if (isAutoFit) {
        let fontSize = 32; // 初期最大サイズ
        let minSize = 8;   // 最小サイズ
        el.style.fontSize = fontSize + "px";

        // 1. 完全1行固定の項目 (性別, ID, 地域など)
        if (!el.classList.contains('large') && !el.classList.contains('multiline')) {
            // 横幅が溢れている限り縮小
            while (el.scrollWidth > el.clientWidth && fontSize > minSize) {
                fontSize--;
                el.style.fontSize = fontSize + "px";
            }
        } 
        // 2. 複数行OKの項目 (large または multiline=名前)
        else {
            // 縦幅が溢れている限り縮小 (2行を超えたら小さくする)
            while (el.scrollHeight > el.clientHeight && fontSize > minSize) {
                fontSize--;
                el.style.fontSize = fontSize + "px";
            }
        }
    }
}

function toggleStyle(index, cb) {
    const disp = document.getElementById('disp-style-' + index);
    const label = document.getElementById('label-style-' + index);
    if (cb.checked) {
        disp.classList.add('checked');
        label.classList.add('active');
    } else {
        disp.classList.remove('checked');
        label.classList.remove('active');
    }
}

function updateIcon(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = e => {
            const img = document.getElementById('preview-icon');
            img.src = e.target.result;
            img.style.display = 'block';
            document.getElementById('icon-placeholder').style.display = 'none';
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// --- 画像生成 ---

async function generateImage() {
    document.getElementById('loading-overlay').style.display = 'flex';
    window.scrollTo(0, 0);

    const area = document.getElementById('capture-area');
    const originalTransform = area.style.transform;
    area.style.transform = "none";

    await new Promise(resolve => setTimeout(resolve, 500));

    try {
        const canvas = await html2canvas(document.getElementById('resume-canvas'), {
            scale: 1,
            useCORS: true,
            backgroundColor: colorSettings[currentColor].bg,
            logging: false,
            windowWidth: 1050, 
            windowHeight: 1350
        });

        canvas.toBlob((blob) => {
            if (generatedBlobUrl) URL.revokeObjectURL(generatedBlobUrl);
            generatedBlobUrl = URL.createObjectURL(blob);
            
            const resultImg = document.getElementById('generated-image');
            resultImg.src = generatedBlobUrl;
            resultImg.style.display = "block";
            
            document.getElementById('loading-overlay').style.display = 'none';
            switchPage('step3');
            
        }, 'image/png');

    } catch (err) {
        console.error(err);
        alert("画像の生成に失敗しました。");
        document.getElementById('loading-overlay').style.display = 'none';
        area.style.transform = originalTransform;
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
    const text = document.getElementById('hashtag-text').innerText;
    navigator.clipboard.writeText(text).then(() => {
        alert("ハッシュタグをコピーしました！");
    }).catch(err => {
        alert("コピーに失敗しました。");
    });
}