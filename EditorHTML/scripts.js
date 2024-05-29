function newFile() {
    document.getElementById('editor').value = '';
    updateEditor();
}

function saveFile() {
    const content = document.getElementById('editor').value;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'documento.html';
    a.click();
    URL.revokeObjectURL(url);
}

function saveAsFile() {
    const content = document.getElementById('editor').value;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = prompt('Guardar como', 'documento.html');
    if (a.download) {
        a.click();
        URL.revokeObjectURL(url);
    }
}

function printFile() {
    const content = document.getElementById('editor').value;
    const newWindow = window.open();
    newWindow.document.write(content);
    newWindow.print();
    newWindow.close();
}

function findText() {
    const text = prompt('Buscar:');
    const editor = document.getElementById('editor');
    const content = editor.value;
    const startIndex = content.indexOf(text);
    if (startIndex !== -1) {
        const endIndex = startIndex + text.length;
        editor.setSelectionRange(startIndex, endIndex);
        editor.focus();
    } else {
        alert('Texto no encontrado.');
    }
}

function replaceText() {
    const findText = prompt('Buscar:');
    const replaceText = prompt('Reemplazar con:');
    const editor = document.getElementById('editor');
    const content = editor.value;
    const newContent = content.split(findText).join(replaceText);
    editor.value = newContent;
    updateEditor();
}

function goToLine() {
    const line = parseInt(prompt('Ir a la línea:'), 10);
    const editor = document.getElementById('editor');
    const content = editor.value.split('\n');
    let position = 0;
    for (let i = 0; i < line - 1 && i < content.length; i++) {
        position += content[i].length + 1;
    }
    editor.setSelectionRange(position, position);
    editor.focus();
}

function checkUnclosedTags() {
    const content = document.getElementById('editor').value;
    const regex = /<([a-z][a-z0-9]*)\b[^>]*>(?!<\/\1>)/gi;
    const unclosedTags = [];
    let match;
    while ((match = regex.exec(content)) !== null) {
        unclosedTags.push(match[1]);
    }
    if (unclosedTags.length > 0) {
        alert('Etiquetas no cerradas: ' + unclosedTags.join(', '));
    } else {
        alert('No hay etiquetas no cerradas.');
    }
}

function updateEditor() {
    const editor = document.getElementById('editor');
    const highlighting = document.getElementById('highlighting');
    highlighting.innerHTML = highlightHTML(editor.value);
    updateLineNumbers();
}

function highlightHTML(code) {
    const keywords = {
        tag: /<\/?([a-z][\w]*)\b[^>]*>/gi,
        attribute: /([a-z-]+)(=)/gi,
        string: /"[^"]*"|'[^']*'/g,
        reserved: /\b(html|head|title|body|h[1-6]|p|a|div|span|meta|link|script|style)\b/g // Palabras reservadas de HTML
    };
    return code.replace(keywords.tag, '<span class="tag">$&</span>')
               .replace(keywords.attribute, '<span class="attribute">$1</span>$2')
               .replace(keywords.string, '<span class="string">$&</span>')
               .replace(keywords.reserved, '<span class="reserved">$&</span>'); // Aplicar la clase CSS a las palabras reservadas
}

function updateLineNumbers() {
    const editor = document.getElementById('editor');
    const lineNumbers = document.getElementById('lineNumbers');
    const lines = editor.value.split('\n').length;
    lineNumbers.innerHTML = Array.from({ length: lines }, (_, i) => i + 1).join('<br>');
}

function syncScroll() {
    const editor = document.getElementById('editor');
    const highlighting = document.getElementById('highlighting');
    highlighting.scrollTop = editor.scrollTop;
    highlighting.scrollLeft = editor.scrollLeft;
}

function openFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById('editor').value = e.target.result;
        updateEditor();
    };
    reader.readAsText(file);
}
