import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class PasswordService {

  private readonly SuggestedLength = 30;

  public hash(password: string): string {
    const standardPassword = this.fillPasswordUpTo30Chars(password);
    const seed = this.toSeedNumber(standardPassword);
    const hexString = this.toHexString(seed);
    return this.toHashString(hexString);
  }

  private fillPasswordUpTo30Chars(password: string): string {
    const remainLength = this.SuggestedLength - password.length;
    for (let i = 1; i <= remainLength; i++) {
      password += String.fromCharCode(21);
    }
    return password;
  }

  private toSeedNumber(password: string): number {
    let seed = 1.0;
    for (let i = 1; i <= this.SuggestedLength; i++) {
      const result = password.charCodeAt(i - 1);
      const temp: number = this.SuggestedLength + result * i;
      seed *= temp;
    }
    return seed;
  }

  private toHexString(seed: number): string {
    const seedString = Number(seed.toPrecision(15)).toString().toUpperCase();
    let hexString = ``;
    for (let i = 1; i <= seedString.length; i++) {
      const length = (seedString.length - i < 2) ? seedString.length - i + 1 : 3;
      hexString += this.getHexString(seedString.substring(i - 1, i - 1 + length));
    }
    return hexString;
  }

  private toHashString(hexString: string): string {
    let hash = ``;
    for (let i = 20; i <= hexString.length - 18; i += 2) {
      hash += hexString.substring(i - 1, i);
    }
    return hash;
  }

  private getHexString(value: string): string {
    let number = ``;
    for (let i = 1; i <= value.length; i++) {
      number = `${number}${value.charCodeAt(i - 1)}`;
    }
    return parseInt(number).toString(16).toUpperCase();
  }
}
