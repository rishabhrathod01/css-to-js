// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import convert from './helpers';

function positionFactory(positionObj: {
  line?: any;
  character?: any;
  _line?: any;
  _character?: any;
}) {
  const position = new vscode.Position(
    positionObj._line,
    positionObj._character
  );
  return position;
}

function rangeFactory(selectionObj: vscode.Selection, length: number) {
  let selection = selectionObj;
  let selectionStart = selection.start;
  let selectionEnd = selection.end;
  const vscodeWindow = vscode.window;
  return new vscode.Range(
    positionFactory(selectionStart),
    positionFactory(selectionEnd)
  );
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated

  let convertCommand = vscode.commands.registerCommand(
    'extension.convertCSStoJS',
    () => {
      const editor = vscode.window.activeTextEditor;

      // return if there's no editor or it's not a javascript file
      if (
        !editor ||
        !/javascript|typescript|css/.test(editor.document.languageId)
      ) {
        return;
      }
      const selection = editor.selection;
      const lineText = editor.document.lineAt(selection.start.line).text;
      const selectedText = editor.document.getText(selection);
      const convertableText = selectedText || lineText;
      const range = rangeFactory(selection, selectedText.length);
      editor.edit((builder) => {
        const newValue = builder.replace(range, convert(convertableText));
        return newValue;
      });
    }
  );
  context.subscriptions.push(convertCommand);
}

// this method is called when your extension is deactivated
export function deactivate() {}
