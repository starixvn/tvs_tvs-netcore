export class CONFIG {
    static readonly EXPORT_EXCEL_LIMITED = 100000;
    static readonly TICKET_LISTING_LIMITED = 200000;
}

export class TEXT {
    static readonly INVALID_MATCHID = 'Invalid MatchId.';
    static readonly INVALID_HDP = 'Invalid HDP!';
    static readonly INVALID_OU = 'Invalid OU!';
    static readonly INVALID_ODDS = 'Invalid Odds!';
    static readonly INVALID_RUNS = 'Invalid Runs!';
    static readonly INVALID_WICKET_OVER = 'Invalid Wicket/Over!';
    static readonly REQUIRED_CORRECT_ODDS = 'Invalid Correct Odds.';
    static readonly REQUIRED_SPREAD = 'Invalid Spread.';

    static readonly INVALID_FROMBETID = 'Invalid From BetID.';
    static readonly INVALID_TOBETID = 'Invalid To BetID.';
    static readonly INVALID_BETIDS = 'Invalid BetID(s) are highlighted in RED.';
    static readonly REQUIRED_MATCHID = 'MatchId is required.';
    static readonly REQUIRED_BETIDS = 'Bet ID is required.';
    static readonly REQUIRED_FROMBETID = 'From BetID is required.';
    static readonly REQUIRED_TOBETID = 'To BetID is required.';
    static readonly REQUIRED_REQUEST_ID = 'Request ID is required.';
    static readonly REQUIRED_VOIDING_HISTORY_ID = 'Voiding History ID is required.';
    static readonly REQUIRED_SITE = 'Site is required.';
    static readonly REQUIRED_SUB_TYPE = 'Sub Type is required.';
    static readonly REQUIRED_VOID_VIP = 'Void VIP is required.';
    static readonly REQUIRED_FIELD = 'Required field.';

    static readonly EMPTY_LICENSEE = 'At least one Licensee  must be selected.';
    static readonly EMPTY_CURRENCY = 'At least one Currency  must be selected.';
    static readonly EMPTY_TICKET = 'At least one ticket must be selected.';
    static readonly EMPTY_BETTYPE = 'At least one bettype must be selected.';
    static readonly EMPTY_SELECT = 'Please select at least one option!';
    static readonly INVALID_TRANSDATE = 'Invalid Trans Date';
    static readonly EVENT_HAS_NO_TICKET = 'The event has no ticket.';
    static readonly AB_WHITE_LIST_ADDED_SUCCESS = 'Added User(s) successfully';

    static readonly INPUT_REASON = 'Please input reason.';
    static readonly INPUT_PASSWORD = 'Please input password.';

    static readonly EMPTY_ENGLISH = 'You must enter English message.';
    static readonly INVALID_ENGLISH = 'You must include @@ in English message for replacing ticket number.';
    static readonly EMPTY_CHINESE_TRADITIONAL = 'You must enter Chinese Traditional message.';
    static readonly INVALID_CHINESE_TRADITIONAL = 'You must include @@ in Chinese Traditional message for replacing ticket number.';
    static readonly EMPTY_CHINESE_SIMPLIFIED = 'You must enter Chinese Simplified message.';
    static readonly INVALID_CHINESE_SIMPLIFIED = 'You must include @@ in Chinese Simplified message for replacing ticket number.';
    static readonly EMPTY_NEW_CHINESE_SIMPLIFIED = 'You must enter New Chinese Simplified message.';
    static readonly INVALID_NEW_CHINESE_SIMPLIFIED = 'You must include @@ in New Chinese Simplified message for replacing ticket number.';
    static readonly INVALID_THAI = 'You must include @@ in Thai message for replacing ticket number.';
    static readonly INVALID_KOREAN = 'You must include @@ in Korean message for replacing ticket number.';
    static readonly INVALID_JAPANESE = 'You must include @@ in Japanese message for replacing ticket number.';
    static readonly INVALID_ITALIAN = 'You must include @@ in Italian message for replacing ticket number.';
    static readonly INVALID_SPANISH = 'You must include @@ in Spanish message for replacing ticket number.';

    static readonly CONFIRM_NEGATIVE_CUSTORMER = 'This action could lead to a negative amount of Bet Credit of the following customers: ';
    static readonly CONFIRM_VOID_TICKET = 'Are you sure you want to void selected tickets?';
    static readonly REQUEST_CONFIRMED_SUCCESSFULLY = 'Your request has been confirmed.';
    static readonly CONFIRM_VOID_TICKET_IN_PAGE = 'Only selected tickets on present page will be voided. Are you sure you want to proceed?';
    static readonly CONFIRM_ADD_REQUEST_HAS_WARNING = 'There are some warnings in this request. Are you sure you want to process?';
    static readonly CONFIRM_YOU_WANT_TO_PROCESS = 'Are you sure you want to process?';
    static readonly WARNING_MESSAGE_ADD_REQUEST = 'There are some warnings in this request.';
    static readonly MESSAGE_EXCLUDE_ERROR_RELATED_MATCHES = 'Related match(es) excluded when creating new request because having no valid tickets in the current range:';

    static readonly INVALID_DATA_IN_REQUEST = 'There are some invalid data in this request, please check again!';

    static readonly CONFIRM_RECOVER_TICKET = 'Are you sure you want to recover selected tickets?';
    static readonly CONFIRM_RECOVER_TICKET_IN_PAGE =
    'Only selected tickets on present page will be recovered. Are you sure you want to proceed?';
    static readonly WARNING_FILTER_OPTION_CHANGED =
    'WARNING! The filter option was changed! \nYou are about to back the page and try a new search.';

    static readonly NO_CHECKED_BETTYPE = 'At least one bettype must be selected.';
    static readonly NO_BETTYPE = 'No bet type is offered for the inputted matchid.';
    static readonly NO_PARLAY_BETTYPE = 'No Parlay bet type is offered for the inputted matchid.';

    static readonly NO_BET_TEAM = 'Please select at least one option!';

    static readonly EXPORT_EXCEL_LIMITED = 'We regret to inform you that data collected for this report exceeded the web site ' +
    'rendering capability (> ' + CONFIG.EXPORT_EXCEL_LIMITED.toString() + ' tickets). Please contact IT for help. Thank you!';
    static readonly TICKET_LISTING_LIMITED = 'We regret to inform you that data collected for this report exceeded the web site ' +
    'rendering capability (> ' + CONFIG.TICKET_LISTING_LIMITED.toString()  + ' tickets). Please change filter condition or contact IT for help. ' +
    'Thank you !';
    static readonly SEND_FILE = 'Are you sure you want to notify affected tickets to these Licensee(s): ';

    static readonly NOTIFY_RECOVER_SETTLED_MATCH = 'The selected ticket(s) will return to "Running" status, ' +
    'please resettle the match(es) to calculate it again.';
    static readonly INVALID_SELECTION = 'Please select at least one option!';

}
