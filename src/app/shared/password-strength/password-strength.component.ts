import { Component, Input, OnChanges, SimpleChange, Output, EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-password-strength',
  templateUrl: './password-strength.component.html',
  styleUrls: ['./password-strength.component.css']
})
export default class PasswordStrengthComponent implements OnChanges {

  constructor() { }

  ngOnInit(): void {
  }

  /**
  * @ignore
  */
  @Input() public passwordToCheck: string;
  /**
  * @ignore
  */
  @Output() passwordStrength = new EventEmitter<boolean>();

  /**
  * Global variables and their intialized values
  */
  bar0: string;
  bar1: string;
  bar2: string;
  bar3: string;
  bar4: string;
  msg = '';

  /**
  * Arrays of sell-hedge component
  */
  private colors = ['darkred', 'orangered', 'orange', 'yellowgreen', 'green'];

  private static checkStrength(p:any) {
    let force = 0;
    const regex = /[$-/:-?{-~!"^_@`\[\]]/g;

    const lowerLetters = /[a-z]+/.test(p);
    const upperLetters = /[A-Z]+/.test(p);
    const numbers = /[0-9]+/.test(p);
    const symbols = regex.test(p);
    const length = p.length >= 12;

    const flags = [lowerLetters, upperLetters, numbers, symbols, length];

    let passedMatches = 0;
    for (const flag of flags) {
      passedMatches += flag === true ? 1 : 0;
    }

    force += 2 * p.length + ((p.length >= 12) ? 1 : 0);
    force += passedMatches * 10;

    // short password
    force = (p.length <= 8) ? Math.min(force, 10) : force;

    // poor variety of characters
    force = (passedMatches === 1) ? Math.min(force, 10) : force;
    force = (passedMatches === 2) ? Math.min(force, 20) : force;
    force = (passedMatches === 3) ? Math.min(force, 30) : force;
    force = (passedMatches === 4) ? Math.min(force, 40) : force;
    force = (passedMatches === 5) ? Math.min(force, 50) : force;

    return force;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes.passwordToCheck.currentValue;
    this.setBarColors(5, '#DDD');
    if (password) {
      const c = this.getColor(PasswordStrengthComponent.checkStrength(password));
      this.setBarColors(c.idx, c.col);

      const pwdStrength = PasswordStrengthComponent.checkStrength(password);
      pwdStrength === 40 ? this.passwordStrength.emit(true) : this.passwordStrength.emit(false);

      switch (c.idx) {
        case 1:
          this.msg = 'Weak';//'Not Secure';
          break;
        case 2:
          this.msg = 'Weak';
          break;
        case 3:
          this.msg = 'Good'; //'Acceptable'
          break;
        case 4:
          this.msg = 'Good';
          break;
        case 5:
          this.msg = 'Strong';
          break;
      }
    } else {
      this.msg = '';
    }
  }


  private getColor(s) {
    let idx = 0;
    if (s <= 10) {
      idx = 0;
    } else 
    if (s <= 20) {
      idx = 1;
    } 
    else if (s <= 30) {
      idx = 2;
    } 
    else if (s <= 40) {
      idx = 3;
    } else if (s <= 50) {
      idx = 4;
    } else {
      idx = 5;
    }
    return {
      idx: idx + 1,
      col: this.colors[idx]
    };
  }

  private setBarColors(count, col) {
    for (let n = 0; n < count; n++) {
      this['bar' + n] = col;
    }
  }

}
