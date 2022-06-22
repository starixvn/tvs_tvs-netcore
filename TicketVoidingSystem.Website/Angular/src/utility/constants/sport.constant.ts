import { Selection } from '../models/selection.model';

export class SportType {
    static readonly SOCCER = 1;
    static readonly CRICKET = 50;
    static readonly ESPORTS = 43;
    static readonly TENNIS = 5;
    static readonly BASKETBALL = 2;

    static readonly MULTIPLE_OPTIONS: Selection[] = [
        { value: '1', name: 'Soccer', group: 'All' },
        { value: '2', name: 'Basketball', group: 'All' },
        { value: '9', name: 'Badminton', group: 'All' },
        { value: '43', name: 'E-Sports', group: 'All' },
        { value: '5', name: 'Tennis', group: 'All' },
    ];
}

export class EventType {
    static readonly LIVE = '1';
}