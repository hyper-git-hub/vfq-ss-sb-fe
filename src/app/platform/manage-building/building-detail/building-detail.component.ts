import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BuildingService } from 'src/app/core/services/building.service';
import { ports } from 'src/environments/environment';

@Component({
  selector: 'app-building-detail',
  templateUrl: './building-detail.component.html',
  styleUrls: ['./building-detail.component.scss']
})
export class BuildingDetailComponent implements OnInit {
  
  buildingId: any;
  urlPort = ports;
  buildingFilters = { id: 0 };
  buildingDetails: any;
  address: any;
  type: any;
  appartments: any;
  offices: any;
  shops: any;
  lifts: any;
  hallways: any;

  types = [
    'Commercial Building',
    'Residental building',
    'Educational Building',
    'Hospital building',
    'Stadium',
    'Other'
  ];


  constructor(private activatedRoute: ActivatedRoute, private buildingService: BuildingService) { 
    this.activatedRoute.paramMap.subscribe(data => {
      this.buildingId = data['params']['id'];
      this.buildingFilters.id = this.buildingId;
      if (this.buildingFilters.id) {
        this.getBuildings(this.buildingFilters)
      }
    });
  }

  ngOnInit(): void {
  }

  getBuildings (buildingFilters) {
    this.buildingService.getBuilding(buildingFilters, this.urlPort.smartBuilding)
      .subscribe((resp: any) => {
        if (resp.data['data'] && resp.data['data'].length > 0) {
          this.buildingDetails = resp.data['data'][0];
          this.address = this.getfilteredValue('address');
          this.type = this.types[this.buildingDetails.type];
          this.appartments = this.getfilteredValue('appartments');
          this.offices = this.getfilteredValue('offices');
          this.shops = this.getfilteredValue('shops');
          this.lifts = this.getfilteredValue('lifts');
          this.hallways = this.getfilteredValue('hallways');
        }
      }, (err: any) => {
      });
  }

  getfilteredValue(value) {
    if (this.buildingDetails?.attributes) {
      const attribute = this.buildingDetails?.attributes.filter(item => {
        return item['name'].toLowerCase() == value
      })
      if (attribute && attribute.length > 0) {
        return attribute[0]['value']
      }
    }
  }
}
