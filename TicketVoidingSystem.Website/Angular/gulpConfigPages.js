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
const configPages = [
  // homePage,
  // manageVoidServices,
  // abExceptionList,
  markTickets,
  ticketListing
];

module.exports = configPages;