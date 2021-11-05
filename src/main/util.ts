/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import { Library } from 'ffi-napi';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

function TEXT(text: string) {
  return Buffer.from(`${text}\0`, 'ucs2');
}

export function setTopBoke() {
  const user32 = new Library('user32', {
    GetTopWindow: ['long', ['long']],
    FindWindowW: ['int32', ['string', 'string']],
    SetActiveWindow: ['long', ['long']],
    SetForegroundWindow: ['bool', ['int32']],
    BringWindowToTop: ['bool', ['long']],
    ShowWindow: ['bool', ['long', 'int']],
    SwitchToThisWindow: ['void', ['long', 'bool']],
    GetForegroundWindow: ['long', []],
    AttachThreadInput: ['bool', ['int', 'long', 'bool']],
    GetWindowThreadProcessId: ['int', ['long', 'int']],
    SetWindowPos: [
      'bool',
      ['long', 'long', 'int', 'int', 'int', 'int', 'uint'],
    ],
    SetFocus: ['long', ['long']],
  });

  const winToSetOnTop = user32.FindWindowW(
    // @ts-ignore
    TEXT('Afx:400000:b:10003:6:f5e04bb'),
    null
  );
  // var winToSetOnTop = user32.FindWindowW(null, TEXT("fe-code - Microsoft Visual Studio RC"))
  // var setFocus = user32.SetForegroundWindow(winToSetOnTop)
  // var setFocus = user32.ShowWindow(winToSetOnTop, 5)
  const isSwitch = user32.SwitchToThisWindow(winToSetOnTop, true);

  console.log(winToSetOnTop, isSwitch);
}
