const homePage = {
  pageName: 'HomePage',
  tsconfigFiles: [
    'home-page/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/home-page/',
  index: 'src/home-page/index.cshtml',
  main: 'src/home-page/main.ts',
  transformFolder: '../wwwroot/dist/home-page',
  indexEJSPath: './src/home-page/index.ejs'
};

const manageVoidServices = {
  pageName: 'ManageVoidServices',
  tsconfigFiles: [
    'manage-void-services/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/manage-void-services/',
  index: 'src/manage-void-services/index.cshtml',
  main: 'src/manage-void-services/main.ts',
  transformFolder: '../wwwroot/dist/manage-void-services',
  indexEJSPath: './src/manage-void-services/index.ejs'
};

const abExceptionList = {
  pageName: 'ABExceptionList',
  tsconfigFiles: [
    'ab-exception-list/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/ab-exception-list/',
  index: 'src/ab-exception-list/index.cshtml',
  main: 'src/ab-exception-list/main.ts',
  transformFolder: '../wwwroot/dist/ab-exception-list',
  indexEJSPath: './src/ab-exception-list/index.ejs'
};

const ticketListing = {
  pageName: 'TicketListing',
  tsconfigFiles: [
    'ticket-listing/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/ticket-listing/',
  index: 'src/ticket-listing/index.cshtml',
  main: 'src/ticket-listing/main.ts',
  transformFolder: '../wwwroot/dist/ticket-listing',
  indexEJSPath: './src/ticket-listing/index.ejs'
};

const markTickets = {
  pageName: 'MarkTickets',
  tsconfigFiles: [
    'mark-tickets/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/mark-tickets/',
  index: 'src/mark-tickets/index.cshtml',
  main: 'src/mark-tickets/main.ts',
  transformFolder: '../wwwroot/dist/mark-tickets',
  indexEJSPath: './src/mark-tickets/index.ejs'
};

const voidSingleBet = {
  pageName: 'VoidSingleBet',
  tsconfigFiles: [
    'void-single-bet/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/void-single-bet/',
  index: 'src/void-single-bet/index.cshtml',
  main: 'src/void-single-bet/main.ts',
  transformFolder: '../wwwroot/dist/void-single-bet',
  indexEJSPath: './src/void-single-bet/index.ejs'
};

const voidRequest = {
  pageName: 'VoidRequest',
  tsconfigFiles: [
    'void-request/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/ticket-voiding-system/void-request/',
  index: 'src/void-request/index.cshtml',
  main: 'src/void-request/main.ts',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/void-request',
  indexEJSPath: './src/void-request/index.ejs'
};

const manageRequest = {
  pageName: 'ManageRequest',
  tsconfigFiles: [
    'manage-request/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/ticket-voiding-system/manage-request/',
  index: 'src/manage-request/index.cshtml',
  main: 'src/manage-request/main.ts',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/manage-request',
  indexEJSPath: './src/manage-request/index.ejs'
};

const addRequest = {
  pageName: 'AddRequest',
  tsconfigFiles: [
    'add-request/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/ticket-voiding-system/add-request/',
  index: 'src/add-request/index.cshtml',
  main: 'src/add-request/main.ts',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/add-request',
  indexEJSPath: './src/add-request/index.ejs'
};

const editRequest = {
  pageName: 'EditRequest',
  tsconfigFiles: [
    'edit-request/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/ticket-voiding-system/edit-request/',
  index: 'src/edit-request/index.cshtml',
  main: 'src/edit-request/main.ts',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/edit-request',
  indexEJSPath: './src/edit-request/index.ejs'
};

const voidByBetId = {
  pageName: 'VoidByBetId',
  tsconfigFiles: [
    'void-by-bet-id/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/void-by-bet-id/',
  index: 'src/void-by-bet-id/index.cshtml',
  main: 'src/void-by-bet-id/main.ts',
  transformFolder: '../wwwroot/dist/void-by-bet-id',
  indexEJSPath: './src/void-by-bet-id/index.ejs'
};

const addRequestNavigation = {
  pageName: 'AddRequestNavigation',
  tsconfigFiles: [
    'add-request-new/navigation/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/add-request-new/navigation/',
  index: 'src/add-request-new/navigation/index.cshtml',
  main: 'src/add-request-new/navigation/main.ts',
  transformFolder: '../wwwroot/dist/add-request-new/navigation',
  indexEJSPath: './src/add-request-new/navigation/index.ejs'
};

const archivedTicket = {
  pageName: 'ArchivedTicket',
  tsconfigFiles: [
    'add-request-new/events/archived-ticket/main.ts',
    'polyfills.ts'
  ],
  index: 'src/add-request-new/shared/index.cshtml',
  indexEJSPath: './src/add-request-new/shared/index.ejs',
  main: 'src/add-request-new/events/archived-ticket/main.ts',
  deployUrl: 'dist/ticket-voiding-system/archived-ticket',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/archived-ticket'
};

const redCard = {
  pageName: 'RedCard',
  tsconfigFiles: [
    'add-request-new/events/red-card/main.ts',
    'polyfills.ts'
  ],
  index: 'src/add-request-new/shared/index.cshtml',
  indexEJSPath: './src/add-request-new/shared/index.ejs',
  main: 'src/add-request-new/events/red-card/main.ts',
  deployUrl: 'dist/ticket-voiding-system/red-card/',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/red-card'
};

const wrongScore = {
  pageName: 'WrongScore',
  tsconfigFiles: [
    'add-request-new/events/wrong-score/main.ts',
    'polyfills.ts'
  ],
  index: 'src/add-request-new/shared/index.cshtml',
  indexEJSPath: './src/add-request-new/shared/index.ejs',
  main: 'src/add-request-new/events/wrong-score/main.ts',
  deployUrl: 'dist/ticket-voiding-system/wrong-score/',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/wrong-score'
};

const technicalError = {
  pageName: 'TechnicalError',
  tsconfigFiles: [
    'add-request-new/events/technical-error/main.ts',
    'polyfills.ts'
  ],
  index: 'src/add-request-new/shared/index.cshtml',
  indexEJSPath: './src/add-request-new/shared/index.ejs',
  main: 'src/add-request-new/events/technical-error/main.ts',
  deployUrl: 'dist/ticket-voiding-system/technical-error/',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/technical-error'
};

const dangerAccepted = {
  pageName: 'DangerAccepted',
  tsconfigFiles: [
    'add-request-new/events/danger-accepted/main.ts',
    'polyfills.ts'
  ],
  index: 'src/add-request-new/shared/index.cshtml',
  indexEJSPath: './src/add-request-new/shared/index.ejs',
  main: 'src/add-request-new/events/danger-accepted/main.ts',
  deployUrl: 'dist/ticket-voiding-system/danger-accepted/',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/danger-accepted'
};

const wrongHdp = {
  pageName: 'WrongHdp',
  tsconfigFiles: [
    'add-request-new/events/wrong-hdp/main.ts',
    'polyfills.ts'
  ],
  index: 'src/add-request-new/shared/index.cshtml',
  indexEJSPath: './src/add-request-new/shared/index.ejs',
  main: 'src/add-request-new/events/wrong-hdp/main.ts',
  deployUrl: 'dist/ticket-voiding-system/wrong-hdp/',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/wrong-hdp'
};

const wrongOu = {
  pageName: 'WrongOu',
  tsconfigFiles: [
    'add-request-new/events/wrong-ou/main.ts',
    'polyfills.ts'
  ],
  index: 'src/add-request-new/shared/index.cshtml',
  indexEJSPath: './src/add-request-new/shared/index.ejs',
  main: 'src/add-request-new/events/wrong-ou/main.ts',
  deployUrl: 'dist/ticket-voiding-system/wrong-ou/',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/wrong-ou'
};

const wrongOdds = {
  pageName: 'WrongOdds',
  tsconfigFiles: [
    'add-request-new/events/wrong-odds/main.ts',
    'polyfills.ts'
  ],
  index: 'src/add-request-new/shared/index.cshtml',
  indexEJSPath: './src/add-request-new/shared/index.ejs',
  main: 'src/add-request-new/events/wrong-odds/main.ts',
  deployUrl: 'dist/ticket-voiding-system/wrong-odds/',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/wrong-odds'
};

const wrongOddsSportsBook = {
  pageName: 'WrongOddsSportsBook',
  tsconfigFiles: [
    'add-request-new/events/wrong-odds-sports-book/main.ts',
    'polyfills.ts'
  ],
  index: 'src/add-request-new/shared/index.cshtml',
  indexEJSPath: './src/add-request-new/shared/index.ejs',
  main: 'src/add-request-new/events/wrong-odds-sports-book/main.ts',
  deployUrl: 'dist/ticket-voiding-system/wrong-odds-sports-book/',
  transformFolder: '../wwwroot/dist/ticket-voiding-system/wrong-odds-sports-book'
};

const configPages = [
  //homePage,
  //manageVoidServices,
  //abExceptionList,
  //markTickets,
  //ticketListing,
  //voidSingleBet,
  //voidRequest,
  //manageRequest,
  // addRequest,
  // editRequest,
  //voidByBetId
  //archivedTicket,
  //dangerAccepted,
  //redCard,
  //wrongScore,
  //technicalError,
  wrongHdp,
  wrongOu,
  wrongOdds,
  wrongOddsSportsBook
];

module.exports = configPages;