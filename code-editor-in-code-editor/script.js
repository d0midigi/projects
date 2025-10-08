document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const editingArea = document.getElementById('editing-area');
    const highlightingArea = document.getElementById('highlighting-area');
    const lineNumbers = document.getElementById('line-numbers');
    const codeElement = highlightingArea.querySelector('code');
    const runButton = document.getElementById('run-button');
    const clearConsoleButton = document.getElementById('clear-console-button');
    const consoleOutput = document.getElementById('console-output');

    // --- Config ---
    const rootStyles = getComputedStyle(document.documentElement);
    const tabSize = parseInt(rootStyles.getPropertyValue('--tab-size').trim() || '4');
    const debounceDelay = 150; // ms delay for highlighting update
    let debounceTimer;

    // --- State ---
    let isHighlighting = false; // Prevent race conditions

    // --- Core Update Function ---
    function updateEditor() {
        if (isHighlighting) return; // Skip if already processing

        const code = editingArea.value;
        const scrollTop = editingArea.scrollTop;
        const scrollLeft = editingArea.scrollLeft;

        // 1. Syntax Highlighting (using the corrected function)
        highlightSyntax(code)
            .then(highlightedCode => {
                codeElement.innerHTML = highlightedCode + '\n'; // Add trailing newline for final line number

                // 2. Line Numbers
                updateLineNumbers(code);

                // 3. Restore scroll position AFTER content update & reflow
                editingArea.scrollTop = scrollTop;
                editingArea.scrollLeft = scrollLeft;

                // 4. Scroll Synchronization
                syncScroll(); // Ensure sync after potential layout changes
            })
            .catch(error => {
                console.error("Highlighting Error:", error);
                // Fallback: display plain code if highlighting fails
                codeElement.textContent = code + '\n';
                updateLineNumbers(code);
                editingArea.scrollTop = scrollTop;
                editingArea.scrollLeft = scrollLeft;
                syncScroll();
            });
    }

    // --- Debounced Update ---
    function requestUpdate() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateEditor, debounceDelay);
    }

    // --- CORRECTED Syntax Highlighting Logic (Iterative Approach) ---
    async function highlightSyntax(code) {
        isHighlighting = true; // Mark as busy
        try {
            // 1. Escape essential HTML characters first.
            let escapedCode = code.replace(/&/g, '&')
                                  .replace(/</g, '<')
                                  .replace(/>/g, '>');

            // 2. Define token patterns (order can matter for precedence if not handled later)
             const tokenDefinitions = [
                { type: 'comment', pattern: /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)/g },
                { type: 'string', pattern: /(`(?:\\.|[^`])*`|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')/g },
                { type: 'regex', pattern: /(\/(?![*+?])(?:\\.|[^/\\\n\[]|\[(?:\\.|[^\]])+\])+?\/(?:[gimyusuvd]*))/g }, // Improved regex literal matching
                { type: 'keyword', pattern: /\b(async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|export|extends|finally|for|from|function|if|import|in|instanceof|let|new|return|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/g },
                { type: 'boolean', pattern: /\b(true|false|null|undefined)\b/g }, // Combined boolean/null
                { type: 'number', pattern: /\b(0x[0-9a-fA-F]+|0b[01]+|0o[0-7]+|\d*\.?\d+(?:[eE][+-]?\d+)?(?:px|em|rem|%|vh|vw|pt|cm|mm|in)?)\b/gi }, // Added units here too
                { type: 'class-name', pattern: /\b([A-Z][a-zA-Z0-9_$]*)\b/g }, // PascalCase
                { type: 'function', pattern: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g }, // Function calls/defs
                { type: 'punctuation', pattern: /(=>|[+\-*/%<>=&|!?^~:;,.{}()[\]])/g }, // Includes => arrow
            ];

            // 3. Find all matches
            let matches = [];
            tokenDefinitions.forEach(def => {
                let match;
                // Important: Reset lastIndex for global regexes before each exec loop
                def.pattern.lastIndex = 0;
                while ((match = def.pattern.exec(escapedCode)) !== null) {
                    // Prevent infinite loops with zero-width matches
                    if (match.index === def.pattern.lastIndex) {
                        def.pattern.lastIndex++;
                    }
                     matches.push({
                        type: def.type,
                        start: match.index,
                        end: match.index + match[0].length,
                        content: match[0]
                    });
                }
            });

            // 4. Sort matches by start index. If start indices are equal, longer match wins (basic overlap resolution)
             matches.sort((a, b) => {
                if (a.start !== b.start) {
                    return a.start - b.start;
                }
                return b.end - a.end; // Longer match comes first
            });

            // 5. Filter overlapping matches (keep the first one at a given start index, which is the longest due to sorting)
            let filteredMatches = [];
            let lastEnd = -1;
            for (const match of matches) {
                 // Only add if it doesn't start within or is the same as the previous token
                if (match.start >= lastEnd) {
                    filteredMatches.push(match);
                    lastEnd = match.end;
                 }
                 // We could add more sophisticated overlap logic here if needed
            }


            // 6. Build the highlighted HTML string
            let highlightedHtml = '';
            let currentIndex = 0;
            filteredMatches.forEach(match => {
                // Append text before the current match
                if (match.start > currentIndex) {
                    highlightedHtml += escapedCode.substring(currentIndex, match.start);
                }
                // Append the highlighted match
                highlightedHtml += `<span class="token-${match.type}">${match.content}</span>`;
                currentIndex = match.end;
            });

            // Append any remaining text after the last match
            if (currentIndex < escapedCode.length) {
                highlightedHtml += escapedCode.substring(currentIndex);
            }

            return highlightedHtml;

        } finally {
             isHighlighting = false; // Release lock
        }
    }

    // --- Line Number Logic ---
    function updateLineNumbers(code) {
        const lines = code.split('\n');
        const lineCount = Math.max(1, lines.length);
        let numbersHTML = '';
        for (let i = 1; i <= lineCount; i++) {
            numbersHTML += `<div>${i}</div>`;
        }
        lineNumbers.innerHTML = numbersHTML;
    }

    // --- Scroll Synchronization ---
    function syncScroll() {
        const top = editingArea.scrollTop;
        const left = editingArea.scrollLeft;
        // Apply scroll to both highlighting area and line numbers
        highlightingArea.scrollTop = top;
        highlightingArea.scrollLeft = left;
        lineNumbers.scrollTop = top;
    }

    // --- Console Output Logic ---
    function logToConsole(message, type = 'log') {
        const entry = document.createElement('div');
        entry.classList.add(type); // log, warn, error, info

        // Basic formatting for different types
        let prefix = '';
        if (type === 'error') prefix = '❌ Error: ';
        else if (type === 'warn') prefix = '⚠️ Warn: ';

        // Try to pretty-print objects/arrays
        let content = '';
        if (typeof message === 'object' && message !== null) {
            try {
                content = JSON.stringify(message, null, 2); // Indent with 2 spaces
            } catch (e) { // Handle circular references
                content = '[Object (circular reference)]';
            }
        } else {
             content = String(message); // Convert other types to string
        }

        entry.textContent = prefix + content;
        consoleOutput.appendChild(entry);

        // Auto-scroll to the bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }

    // --- Code Execution Logic ---
    function runCode() {
        const codeToRun = editingArea.value;
        logToConsole(`🚀 Executing code...`, 'info'); // Indicate start

        // Create temporary overrides for console methods
        const consoleOverrides = {
            log: (...args) => args.forEach(arg => logToConsole(arg, 'log')),
            warn: (...args) => args.forEach(arg => logToConsole(arg, 'warn')),
            error: (...args) => args.forEach(arg => logToConsole(arg, 'error')),
            // Add more overrides if needed (info, debug, etc.)
            info: (...args) => args.forEach(arg => logToConsole(arg, 'info')),
        };

        // Store original console methods
        const originalConsole = { ...window.console };

        try {
            // Temporarily replace global console with our overrides
            Object.assign(window.console, consoleOverrides);

            // Execute the code using the Function constructor
            // Pass our overridden console into the function's scope if needed,
            // but modifying window.console is often easier for existing code.
            const runnableFunction = new Function(codeToRun);
            runnableFunction(); // Execute the code

            logToConsole(`✅ Execution finished.`, 'info');

        } catch (error) {
            console.error("Execution Error:", error); // Log to real console too
            logToConsole(error.toString(), 'error'); // Display error in custom console
        } finally {
            // ALWAYS restore the original console methods
            Object.assign(window.console, originalConsole);
        }
    }

    // --- Event Listeners ---
    editingArea.addEventListener('input', requestUpdate);
    editingArea.addEventListener('scroll', syncScroll);
    runButton.addEventListener('click', runCode);
    clearConsoleButton.addEventListener('click', () => {
        consoleOutput.innerHTML = ''; // Clear the console display
    });

    // Keydown listener (Tab, Enter, etc. - unchanged from previous version)
    editingArea.addEventListener('keydown', (e) => {
         const start = editingArea.selectionStart;
         const end = editingArea.selectionEnd;
         const value = editingArea.value;
         const tabString = ' '.repeat(tabSize);

         // TAB Key
        if (e.key === 'Tab' && !e.shiftKey) {
             e.preventDefault();
             const selection = value.substring(start, end);
             const includesNewline = selection.includes('\n');
             const startLineIndex = value.lastIndexOf('\n', start - 1) + 1;

             if (start !== end && includesNewline) {
                 const lines = value.substring(startLineIndex, end).split('\n');
                 let firstLineIndentedChars = 0;
                 const indentedText = lines.map((line, index) => {
                     if (index === lines.length - 1 && line === '') return '';
                     const indentedLine = tabString + line;
                     if (index === 0) firstLineIndentedChars = tabString.length;
                     return indentedLine;
                 }).join('\n');
                 editingArea.setRangeText(indentedText, startLineIndex, end, 'end');
                 editingArea.selectionStart = start + firstLineIndentedChars;
                 editingArea.selectionEnd = startLineIndex + indentedText.length;
             } else {
                 editingArea.setRangeText(tabString, start, end, 'end');
             }
             requestUpdate();
        }
         // SHIFT + TAB Key
        else if (e.key === 'Tab' && e.shiftKey) {
             e.preventDefault();
             const startLineIndex = value.lastIndexOf('\n', start - 1) + 1;
             let endLineIndex = value.lastIndexOf('\n', end - 1) + 1;
             if (end > start && value[end-1] === '\n') endLineIndex = value.lastIndexOf('\n', end - 2) + 1;
             const endLineEnd = value.indexOf('\n', endLineIndex);
             const selectionEndActualLine = endLineEnd === -1 ? value.length : endLineEnd;

             const linesToModify = value.substring(startLineIndex, selectionEndActualLine).split('\n');
             let charsRemovedTotal = 0;
             let firstLineCharsRemoved = 0;
             const outdentedText = linesToModify.map((line, index) => {
                 let removed = 0;
                 if (line.startsWith(tabString)) removed = tabSize;
                 else if (line.startsWith(' ')) removed = Math.min(line.match(/^\s*/)[0].length, tabSize);
                 if (removed > 0) {
                     if (index === 0) firstLineCharsRemoved = removed;
                     charsRemovedTotal += removed;
                     return line.substring(removed);
                 }
                 return line;
             }).join('\n');
             editingArea.setRangeText(outdentedText, startLineIndex, selectionEndActualLine, 'end');
             const newStart = Math.max(startLineIndex, start - firstLineCharsRemoved);
             const newEnd = Math.max(newStart, end - charsRemovedTotal);
             editingArea.selectionStart = newStart;
             editingArea.selectionEnd = newEnd;
             requestUpdate();
        }
         // ENTER Key
        else if (e.key === 'Enter') {
            e.preventDefault();
            const currentLineStart = value.lastIndexOf('\n', start - 1) + 1;
            const currentLine = value.substring(currentLineStart, start);
            const indentationMatch = currentLine.match(/^\s*/);
            const indentation = indentationMatch ? indentationMatch[0] : '';
            const trimmedLineEnd = currentLine.trimEnd().slice(-1);
            let extraIndent = '';
            if (['{', '[', '('].includes(trimmedLineEnd)) extraIndent = tabString;
            const insertText = '\n' + indentation + extraIndent;
            editingArea.setRangeText(insertText, start, end, 'end');
            editingArea.selectionStart = editingArea.selectionEnd = start + insertText.length;
            requestUpdate();
            setTimeout(syncScroll, 0);
        }
    });

    window.addEventListener('resize', syncScroll);

    // --- Initial Load ---
    updateEditor(); // Initial highlight
    logToConsole("Editor Ready. Type code and click Run.", "info"); // Initial console message

});