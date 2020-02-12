import {BehaviorSubject} from 'rxjs';

export const token$ = new BehaviorSubject(localStorage.getItem('token'));

export function updateToken(newToken) {
if (newToken) {
    localStorage.setItem('token', newToken);
} else {
    localStorage.removeItem('token');
}
token$.next(newToken);
}