// ==============================================
// 0. グローバル変数と初期設定
// ==============================================
let selectedColor = 'default'; // 選択されたカラーを保持

// ==============================================
// 1. テンプレートの定義（HTMLの挿入コンテンツ）
// ==============================================

// スタイル（チェックボックス）の共通部分
const styleCheckboxesHTML = `
    <h2>▼スタイル</h2>
    <div class="checkbox-grid">
        <label><input type="checkbox" name="style" value="初心者"> 初心者</label>
        <label><input type="checkbox" name="style" value="エンジョイ"> エンジョイ</label>
        <label><input type="checkbox" name="style" value="真剣勝負"> 真剣勝負</label>
        <label><input type="checkbox" name="style" value="コレクション"> コレクション</label>
        <label><input type="checkbox" name="style" value="対戦したい"> 対戦したい</label>
        <label><input type="checkbox" name="style" value="大会出ます"> 大会出ます</label>
        <label><input type="checkbox" name="style" value="デッキ相談したい"> デッキ相談したい</label>
        <label><input type="checkbox" name="style" value="リモートしたい"> リモートしたい</label>
        <label><input type="checkbox" name="style" value="YouTubeやってます"> YouTubeやってます</label>
        <label><input type="checkbox" name="style" value="ブログやってます"> ブログやってます</label>
        <label><input type="checkbox" name="style" value="リモート対戦募集"> リモート対戦募集</label>
        <label><input type="checkbox" name="style" value="趣味話したい"> 趣味話したい</label>
    </div>
`;

// プロフィール画像とアップロードボタンの共通部分
const profileImageHTML = `
    <div class="profile-image-section">
        <div class="image-preview" id="imagePreview">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 4C13.66 4 15 5.34 15 7C15 8.66 13.66 10 12 10C10.34 10 9 8.66 9 7C9 5.34 10.34 4 12 4ZM12 20C9.34 20 6.67 18.66 5 16C5.03 14 8.35 12.33 12 12.33C15.65 12.33 18.97 14 19 16C17.33 18.66 14.66 20 12 20Z" fill="var(--base-text-color)"/>
            </svg>
        </div>
        <input type="file" id="imageUpload" accept="image/*" class="input-hidden">
        <label for="imageUpload" class="upload-button" id="uploadButtonLabel">画像をアップロード</label>
    </div>
`;

// 共通の大見出し定義
const mainTitleHTML = `<h1 class="main-title">ヴァイスシュヴァルツ履歴書</h1>`;

// テンプレート A: シンプル (ハンドルネーム, 性別, 好きな参戦作品)
const templateA = `
    ${mainTitleHTML}
    <div class="header-info">
        ${profileImageHTML}
        <div class="text-inputs-grid" style="grid-template-columns: repeat(2, 1fr);">
            <label>ハンドルネーム: <input type="text" data-field="handleName"></label>
            <label>性別: <input type="text" data-field="gender"></label>
            <label class="full-width-input">好きな参戦作品: <input type="text" data-field="favoriteTitles"></label>
        </div>
    </div>
    ${styleCheckboxesHTML}
    <h2>▼フリースペース</h2>
    <textarea data-field="freeSpace"></textarea>
`;

// テンプレート C: 交流重視 (活動地域、ブシナビコード、Discord ID)
const templateC = `
    ${mainTitleHTML}
    <div class="header-info">
        ${profileImageHTML}
        <div class="text-inputs-grid" style="grid-template-columns: repeat(3, 1fr);">
            <label>ハンドルネーム: <input type="text" data-field="handleName"></label>
            <label>性別: <input type="text" data-field="gender"></label>
            <label>活動地域: <input type="text" data-field="area"></label>
            <label>ブシナビコード: <input type="text" data-field="bushinaviCode"></label>
            <label>Discord ID: <input type="text" data-field="discordId"></label>
            <label class="full-width-input">好きな参戦作品: <input type="text" data-field="favoriteTitles"></label>
        </div>
    </div>
    ${styleCheckboxesHTML}
    <h2>▼フリースペース</h2>
    <textarea data-field="freeSpace"></textarea>
`;

// テンプレート B: 推し語り重視 (推しキャラ, 今後来てほしいタイトル)
const templateB = `
    ${mainTitleHTML}
    <div class="header-info">
        ${profileImageHTML}
        <div class="text-inputs-grid" style="grid-template-columns: repeat(3, 1fr);">
            <label>ハンドルネーム: <input type="text" data-field="handleName"></label>
            <label>性別: <input type="text" data-field="gender"></label>
            <label>推しキャラ: <input type="text" data-field="favoriteCharacter"></label>
            <label class="full-width-input">好きな参戦作品: <input type="text" data-field="favoriteTitles"></label>
            <label class="full-width-input">今後来てほしいタイトル: <input type="text" data-field="desiredTitles"></label>
        </div>
    </div>
    ${styleCheckboxesHTML}
    <h2>▼フリースペース</h2>
    <textarea data-field="freeSpace"></textarea>
`;

const templates = {
    'template-a': templateA,
    'template-b': templateB,
    'template-c': templateC
};

// ==============================================
// 2. ページ切り替えとカラーリング設定
// ==============================================
/**
 * ページを切り替える関数
 */
function goToPage(targetPageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    document.getElementById(targetPageId).classList.add('active');
    window.scrollTo(0, 0); 
}
window.goToPage = goToPage;


/**
 * カラーテーマを適用する関数
 */
function applyColorTheme(color) {
    // 既存のテーマクラスを全て削除
    document.body.classList.remove('theme-skyblue', 'theme-pink');
    
    // 選択されたカラーテーマを追加
    if (color === 'skyblue') {
        document.body.classList.add('theme-skyblue');
    } else if (color === 'pink') {
        document.body.classList.add('theme-pink');
    }
    selectedColor = color;

    // ボタンの選択状態を更新
    document.querySelectorAll('.color-button').forEach(btn => {
        if (btn.getAttribute('data-color') === color) {
            btn.classList.add('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
}
window.applyColorTheme = applyColorTheme;


/**
 * テンプレートを選択し、作成ページに移動する関数
 */
function selectTemplate(templateId) {
    // カラーが選択されていない場合はアラート
    if (!selectedColor) {
        alert("先にカラーリングを選んでください！");
        return;
    }

    const formArea = document.getElementById('resume-form-area');
    
    // テンプレートのHTMLを挿入
    formArea.innerHTML = templates[templateId];

    // 画像アップロードのイベントリスナーを再設定
    setupImageUploadListener();

    // ページ②へ移動
    goToPage('page-create');
}
window.selectTemplate = selectTemplate;


// ==============================================
// 3. 画像アップロード機能
// ==============================================
function setupImageUploadListener() {
    const imageUploadInput = document.getElementById('imageUpload');
    if (imageUploadInput) {
        imageUploadInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('imagePreview');
                    preview.innerHTML = '';
                    
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    preview.appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

// ==============================================
// 4. 画像生成とダウンロード機能
// ==============================================
/**
 * 入力要素から値を取り出し、画像化用のテキスト要素を挿入する
 * @param {HTMLElement} container - 履歴書フォーム全体
 */
function prepareForImageGeneration(container) {
    // 1. アップロードボタンを非表示にする
    const uploadButton = document.getElementById('uploadButtonLabel');
    if (uploadButton) {
        uploadButton.classList.add('input-hidden');
    }

    // 2. 入力フォームの値を画像化しやすいテキストに変換
    container.querySelectorAll('input[type="text"], textarea').forEach(input => {
        const value = input.value;
        const fieldName = input.getAttribute('data-field');

        // input要素を非表示にする
        input.classList.add('input-hidden');

        // 表示用の新しい要素を作成
        const displayElement = document.createElement('div');
        displayElement.className = input.tagName === 'TEXTAREA' ? 'display-text display-textarea' : 'display-text';
        displayElement.textContent = value || ''; // 値がない場合は空文字
        displayElement.setAttribute('data-display-for', fieldName); // どの入力に対応するか記録

        // input要素の直後に追加
        input.parentNode.insertBefore(displayElement, input.nextSibling);
    });
}

/**
 * 画像生成後にフォームを入力状態に戻す
 * @param {HTMLElement} container - 履歴書フォーム全体
 */
function restoreForm(container) {
    // 1. アップロードボタンを再表示する
    const uploadButton = document.getElementById('uploadButtonLabel');
    if (uploadButton) {
        uploadButton.classList.remove('input-hidden');
    }
    
    // 2. 表示用テキストを削除し、入力要素を再表示する
    container.querySelectorAll('.display-text').forEach(displayElement => {
        displayElement.remove();
    });

    container.querySelectorAll('.input-hidden').forEach(input => {
        input.classList.remove('input-hidden');
    });
}

// 画像出力ボタンのイベントリスナー
document.getElementById('generateImageButton').addEventListener('click', function() {
    
    const container = document.getElementById('resume-form-area');

    // 画像生成前に準備 (文字潰れ対策＆ボタン非表示)
    prepareForImageGeneration(container);
    
    // scale: 2 で安定した画像を出力 (800x1200 → 1600x2400でキャプチャ)
    html2canvas(container, { 
        scale: 2,
        useCORS: true
    }).then(canvas => {
        
        // 画像生成後にフォームを元に戻す
        restoreForm(container);
        
        const resultCanvas = document.getElementById('resumeCanvas');
        
        // resultCanvasのサイズをキャプチャしたcanvasのサイズに合わせる
        resultCanvas.width = canvas.width;
        resultCanvas.height = canvas.height;
        
        const ctx = resultCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0);

        // ページ③へ移動
        goToPage('page-result');
        
    }).catch(error => {
        console.error("画像生成エラー:", error);
        alert("エラー: プレビューを作成できませんでした。");

        // エラー時もフォームを元に戻す
        restoreForm(container);
    });
});

// 画像保存（ダウンロード）ボタンのイベントリスナー
document.getElementById('downloadButton').addEventListener('click', function() {
    const canvas = document.getElementById('resumeCanvas');
    
    const imageURL = canvas.toDataURL('image/png');
    
    const a = document.createElement('a');
    a.href = imageURL;
    a.download = 'WeissSchwarz_Profile_Makers.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
});

// ==============================================
// 5. ハッシュタグコピー機能
// ==============================================
/**
 * 指定されたIDの要素のテキスト内容をクリップボードにコピーする
 */
function copyToClipboard(elementId) {
    const textToCopy = document.getElementById(elementId).textContent;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert('ハッシュタグをクリップボードにコピーしました！');
    }).catch(err => {
        console.error('コピーに失敗しました', err);
    });
}
window.copyToClipboard = copyToClipboard;

// ==============================================
// 6. 初期化
// ==============================================
// ページをロードした時、必ずページ①から始める
document.addEventListener('DOMContentLoaded', () => {
    goToPage('page-select');
    
    // カラーボタンのイベントリスナーを設定
    document.querySelectorAll('.color-button').forEach(button => {
        button.addEventListener('click', () => {
            applyColorTheme(button.getAttribute('data-color'));
        });
    });

    // 初期化時、デフォルトカラーを選択状態にする
    applyColorTheme('default');
});