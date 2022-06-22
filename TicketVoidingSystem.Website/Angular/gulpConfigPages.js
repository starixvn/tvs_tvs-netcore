const voidSingleBet = {
  pageName: 'VoidSingleBet',
  tsconfigFiles: [
    'void-single-bet/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/void-single-bet/',
  index: 'src/void-single-bet/index.cshtml',
  main: 'src/void-single-bet/main.ts',
  transformFolder: '../dist/void-single-bet',
  indexEJSPath: './src/void-single-bet/index.ejs'
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
  transformFolder: '../dist/ticket-listing',
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
  transformFolder: '../dist/mark-tickets',
  indexEJSPath: './src/mark-tickets/index.ejs'
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
  transformFolder: '../dist/ticket-voiding-system/add-request',
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
  transformFolder: '../dist/ticket-voiding-system/edit-request',
  indexEJSPath: './src/edit-request/index.ejs'
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
  transformFolder: '../dist/ticket-voiding-system/manage-request',
  indexEJSPath: './src/manage-request/index.ejs'
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
  transformFolder: '../dist/ticket-voiding-system/void-request',
  indexEJSPath: './src/void-request/index.ejs'
};

const getBetIdForVoiding = {
  pageName: 'GetBetIdForVoiding',
  tsconfigFiles: [
    'get-betid-for-voiding/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/ticket-voiding-system/get-betid-for-voiding/',
  index: 'src/get-betid-for-voiding/index.cshtml',
  main: 'src/get-betid-for-voiding/main.ts',
  transformFolder: '../dist/ticket-voiding-system/get-betid-for-voiding',
  indexEJSPath: './src/get-betid-for-voiding/index.ejs'
};

const voidFormulaBets = {
  pageName: 'VoidFormulaBets',
  tsconfigFiles: [
    'void-formula-bets/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/ticket-voiding-system/void-formula-bets/',
  index: 'src/void-formula-bets/index.cshtml',
  main: 'src/void-formula-bets/main.ts',
  transformFolder: '../dist/ticket-voiding-system/void-formula-bets',
  indexEJSPath: './src/void-formula-bets/index.ejs'
};

const afterVoidHistory = {
  pageName: 'AfterVoidHistory',
  tsconfigFiles: [
    'after-void-history/main.ts',
    'polyfills.ts'
  ],
  deployUrl: 'dist/ticket-voiding-system/after-void-history/',
  index: 'src/after-void-history/index.cshtml',
  main: 'src/after-void-history/main.ts',
  transformFolder: '../dist/ticket-voiding-system/after-void-history',
  indexEJSPath: './src/after-void-history/index.ejs'
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

const configPages = [
  // voidSingleBet,
  // ticketListing,
  // markTickets,
  // addRequest,
  // editRequest,
  // manageRequest,
  // voidRequest,
  // getBetIdForVoiding,
  // voidFormulaBets,
  // afterVoidHistory,
  abExceptionList
];

module.exports = configPages;