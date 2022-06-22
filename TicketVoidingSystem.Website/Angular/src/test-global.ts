import * as $ from 'jquery';
declare global {
  namespace NodeJS {
    interface Global {
      document: Document;
      window: Window;
      navigator: Navigator;
      $: JQueryStatic,
      jQuery: JQueryStatic
    }
  }
}

global.$ = global.jQuery = $; 