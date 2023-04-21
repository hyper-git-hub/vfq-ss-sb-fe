import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
  loggedInUser: any;
  userpkg: any;
  downloadurl: string = '';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.getUser();
    this.userpkg = this.loggedInUser.customer.associations[0].package.name

    if (this.userpkg == "Advance") {
      this.downloadurl = "../../../../assets/doc/IoT-AT-User Guide V2.0 Advance.docx"
    } else {
      this.downloadurl = "../../../../assets/doc/IoT-AT-User Guide V2.0 PnG.docx"
    }
  }

}
