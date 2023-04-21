import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-user-configuration',
  templateUrl: './user-configuration.component.html',
  styleUrls: ['./user-configuration.component.scss']
})
export class UserConfigurationComponent implements OnInit {
  breadCrumbs: any[];
  types: any[];

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) {
    this.breadCrumbs = [
      {
        name: "Dashboard",
        url: "/ss/dashboard",
        icon: "ri-pie-chart-box-line"
      },
      {
        name: "Configurations",
        url: "",
        icon: ""
      },
    ];
  }

  ngOnInit(): void {
  }

  onSubmit() {
    const slug = `https://dev.gateway.iot.vodafone.com.qa/users/user-profile/preferences`;
    this.apiService.post(slug, {}).subscribe((resp: any) => {

    }, (err: any) => {
      this.toastr.error(err.error['message'], 'Error updating user preferences');
    });
  }
}
