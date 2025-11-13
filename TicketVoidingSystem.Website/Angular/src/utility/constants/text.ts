export class CONFIG {
    static readonly EXPORT_EXCEL_LIMITED = 100000;
    static readonly TICKET_LISTING_LIMITED = 200000;
}

export class TEXT {
    static readonly INVALID_MATCHID = 'Invalid MatchId';
    static readonly INVALID_HDP = 'Invalid HDP!';
    static readonly INVALID_OU = 'Invalid OU!';
    static readonly INVALID_INPUT = 'Invalid Input.';
    static readonly INVALID_RUNS = 'Invalid Runs!';
    static readonly INVALID_ODDS = 'Invalid Odds!';
    static readonly INVALID_WICKET_OVER = 'Invalid Wicket/Over!';
    static readonly REQUIRED_CORRECT_ODDS = 'Invalid Correct Odds.';
    static readonly REQUIRED_SPREAD = 'Invalid Spread.';

    static readonly REQUIRED_MATCHID = 'MatchId is required.';
    static readonly REQUIRED_REQUEST_ID = 'Request ID is required.';
    static readonly REQUIRED_VOIDING_HISTORY_ID = 'Voiding History ID is required.';
    static readonly REQUIRED_SITE = 'Site is required.';
    static readonly REQUIRED_SUB_TYPE = 'Sub Type is required.';
    static readonly REQUIRED_VOID_VIP = 'Void VIP is required.';
    static readonly REQUIRED_FIELD = 'Required field.';

    static readonly EMPTY_LICENSEE = 'At least one Licensee must be selected.';
    static readonly EMPTY_CURRENCY = 'At least one Currency must be selected.';
    static readonly EMPTY_TICKET = 'At least one ticket must be selected.';
    static readonly AB_WHITE_LIST_ADDED_SUCCESS = 'Added User(s) successfully';
    static readonly INPUT_REASON = 'Please input reason.';
    static readonly INPUT_PASSWORD = 'Please input password.';
    static readonly INPUT_REMARK_ID = 'Please input RemarkId.';

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

    static readonly CONFIRM_VOID_TICKET = 'Are you sure you want to void selected tickets?';
    static readonly REQUEST_CONFIRMED_SUCCESSFULLY = 'Your request has been confirmed.';
    static readonly CONFIRM_VOID_TICKET_IN_PAGE = 'Only selected tickets on present page will be voided. Are you sure you want to proceed?';
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
    static readonly SELECT_AT_LEAST_ONE_OPTION = 'Please select at least one option!';

    static readonly EXPORT_EXCEL_LIMITED = 'We regret to inform you that data collected for this report exceeded the web site ' +
    'rendering capability (> ' + CONFIG.EXPORT_EXCEL_LIMITED.toString() + ' tickets). Please contact IT for help. Thank you!';
    static readonly TICKET_LISTING_LIMITED = 'We regret to inform you that data collected for this report exceeded the web site ' +
    'rendering capability (> ' + CONFIG.TICKET_LISTING_LIMITED.toString()  + ' tickets). Please change filter condition or contact IT for help. ' +
    'Thank you !';
    static readonly SEND_FILE = 'Are you sure you want to notify affected tickets to these Licensee(s): ';

    static readonly NOTIFY_RECOVER_SETTLED_MATCH = 'The selected ticket(s) will return to "Running" status, ' +
    'please resettle the match(es) to calculate it again.';
    static readonly THERE_ARE_INVALID_FIELDS = 'There are invalid fields';

    static readonly TICKET_LIMIT_EXCEEDED = 'Tickets of inputted username are too high. Please reduce and try again.';
    static readonly REQUIRED_USERNAME = 'Username is required.';
    static readonly INVALID_USERNAMES = 'All Username(s) must be valid.';
    static readonly MAX_USERNAME_EXCEEDED = 'Max Username Exceeded.';
    static readonly SELECTED_VAR_OPTIONS = 'Please select NO VAR/VAR.';
    static readonly INVALID_TEMPLATE_MESSAGE = 'Invalid template message.';
    static readonly ALL_TICKETS_VOIDED = 'All tickets has been voided';
    static readonly CONFIRM_VOID_ALL_TICKETS = 'Are you sure you want to proceed? Please confirm and wait for the notification.';
    static readonly INVALID_SETTING_TIME = 'Please fulfill AA/PA/SA values or left all fields blank.';
    static readonly FROM_TIME_MUST_SMALLER_THAN_TO_TIME = 'From Time must be smaller than To Time';
    static readonly INVALID_TIME_FORMAT = 'Invalid Date Time format. The correct format is "HH:mm:ss.SSS AM/PM"';
    static readonly NO_VALID_TICKETS_IN_RANGE = 'No valid tickets found in the current range';
    static readonly FROM_TIME_MUST_GREATER_THAN_DEFAULT = 'Edited From Time must be greater than the default From Time';
    static readonly TO_TIME_MUST_SMALLER_THAN_FOLLOWING_CONSECUTIVE_FROM_TIME = 'Edited To Time must be smaller than the default From Time of the following consecutive score.';
    static readonly MATCH_ID_EXISTS_IN_LIST = 'MatchId already exists in the list';
    static readonly TO_TIME_MUST_SMALLER_THAN_NEXT_FROM_TIME = 'Edited To Time must be smaller than the next From Time';
    static readonly REQUIRED_WRONG_MARKET = 'Wrong Market is required.';
    static readonly REQUIRED_ACTUAL_MARKET = 'Actual Market is required.';
    static readonly REQUIRED_HOME_FAVORITE = 'Home Favorite is required.';
    static readonly REQUIRED_AWAY_FAVORITE = 'Away Favorite is required.';
    static readonly REQUIRED_HDP_VALUE = 'Hdp value is required.';
    static readonly EXPORT_LARGE_FILE = 'Not allow to export large file. Please contact IT for help. Thank you!';
    static readonly NO_RESULTS = 'No Results.';
    static readonly NO_PERMISSION_ON_ISSUETYPES = 'You are not authorized on this function.';
    static readonly INVALID_SETTLED_TICKETS = 'Settled ticket';
    static readonly INVALID_UNSUPPORTED_TICKETS = 'Unsupported ticket';
    static readonly INVALID_SINGLE_TICKETS = 'Single ticket';
    static readonly INVALID_MIX_PARLAY_TICKETS = 'Mix Parlay ticket';
    static readonly INVALID_EXISTING_ON_OTHER_REQUEST = 'Existing on other request';
    static readonly INVALID_TICKETS = 'Invalid ticket';
    static readonly BEING_BALANCE_UP = 'Being Balance Up';
    static readonly INVALID_NONLIVE_TICKETS = 'Non-Live ticket';
    static readonly INVALID_DIFFERENT_LIVE_SCORE = 'Different live score';
    static readonly INVALID_AB_WHITE_LIST_TICKETS = 'AB Exception List ticket';
    static readonly INVALID_UNSUPPORTED_DATE_RANGE_TICKETS = 'Unsupported date range';
    static readonly ADD_REQUEST_RESULT_TITLE = 'Add Request Result';
    static readonly EDIT_REQUEST_RESULT_TITLE = 'Edit Request Result';
    static readonly INVALID_TO_DATE = 'Invalid To Date';

    static readonly INVALID_REQUESTID = 'Invalid RequestId.';
    static readonly INVALID_BETID = 'All BetID(s) must be valid.';
    static readonly INVALID_FROMBETID = 'Invalid From BetID.';
    static readonly REQUIRED_BETIDS = 'Bet ID is required.';
    static readonly REQUIRED_ACTUAL_SCORE = 'Actual Score is required.';
    static readonly REQUIRED_PRODUCT = 'Products is required.';
    static readonly REQUIRED_TICKET_STATUS = 'Ticket status is required.';
    static readonly INVALID_USERNAME = 'Invalid username';
    static readonly EMPTY_MATCH = 'At least one match must be selected.';
    static readonly EMPTY_USER = 'At least one user must be selected.';
    static readonly EMPTY_REQUEST = 'Please input Request No.';
    static readonly INVALID_MATCH = 'Invalid match';
    static readonly INVALID_BET_ID = 'Invalid BetID.';
    static readonly INVALID_SITE_DB_DOWN = 'Ticket of siteDB down';
    static readonly AFTER_BALANCE_UP_TICKETS = 'Being Balance Up';
    static readonly INVALID_USERNAME_SITE_DB_DOWN = 'Username has tickets of siteDB down';
    static readonly CONFIRM_CHECK_BY = 'Are you sure you want to verify request ';
    static readonly CONFIRM_UNCHECK_BY = 'Are you sure you want to unverify request ';
    static readonly CONFIRM_NEGATIVE_CUSTOMER = `This action could lead to a negative amount of Bet Credit of the following customers: {0}`;
    static readonly CONFIRM_MARK_TICKET = 'Are you sure you want to mark tickets?';
    static readonly CONFIRM_UNMARK_TICKET = 'Are you sure you want to unmark tickets?';
    static readonly NO_PERMISSION = 'WARNING! Not allowed to mark settled ticket! You are about to back the page and try a new search.';
    static readonly INVALID_VALUE = 'Invalid Value!';
    static readonly EXPORT_FROMDATE_BEFORE_BALANCEDAY = 'We regret to inform you that data collected for this report exceeded ' +
    'the web site rendering capability.  We suggest that you should export and view this report in Excel format instead. Thank you !';
}
