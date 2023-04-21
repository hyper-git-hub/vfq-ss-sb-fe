import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiIdentifier } from 'src/environments/environment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuildingService {

  constructor(public http: HttpClient) {

  }

  converToFormdata(data) {
    var form_data = new FormData();
    for (var key in data) {
      form_data.append(key, data[key]);
    }
    return form_data;
  }

  getBuilding(params, port = '') {
    let url;
    if (params.id) {
      url = `${apiIdentifier.smartBuilding}${port}/building/?id=${params.id}`;
    } else {
      url = `${apiIdentifier.smartBuilding}${port}/building/?limit=${params.limit}&offset=${params.offset}`;
    }
    let a = this.http.get(url)
    return a;
  }

  addBuilding(param, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/`;
    let a = this.http.post(url, param)
    return a;
  }

  addFloor(param, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/space/`;
    let a = this.http.post(url, param)
    return a;
  
  }

  addSpace(param, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/space/attribute/`;
    let a = this.http.post(url, param)
    return a;
  }

  getBuildingFloors(id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/floor/?building_id=${id}`;
    let a = this.http.get(url)
    return a;
  }

  getFloorsforbulb(params,port = '',) {
    const url = `${apiIdentifier.smartBuilding}${port}/building/floor/?${params}`;
    let a = this.http.get(url)
    return a;
  }

  getopenbulb(params,port = '',) {
    const url = `${apiIdentifier.smartBuilding}${port}/building/openarea/?${params}`;
    let a = this.http.get(url)
    return a;
  }
  
  
  createFloorName(params, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/floor/`;
    let a = this.http.post(url, params)
    return a;
  }

  createOpenArea(params, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/openarea/`;
    let a = this.http.post(url, params)
    return a;
  }

  editOpenArea(params, id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/openarea/?id=${id}`;
    let a = this.http.patch(url, params)
    return a;
  }

  editSpaceAttribute(params, id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/spacename/?id=${id}`;
    let a = this.http.patch(url, params)
    return a;
  }

  getBuildingOpenAreas(id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/openarea/?building_id=${id}`;
    let a = this.http.get(url)
    return a;
  }

  getFloors(port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/space/`;
    let a = this.http.get(url)
    return a;
  }

  getFloorsById(id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/space/?floor_id=${id}`;
    let a = this.http.get(url)
    return a;
  }

  getFloorsbulb(params, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/space/?${params}`;
    let a = this.http.get(url)
    return a;
  }
  
  
  deleteFloorById(id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/floor/?id=${id}`;
    let a = this.http.delete(url)
    return a;
  }

  deleteOpenAreaById(id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/openarea/?id=${id}`;
    let a = this.http.delete(url)
    return a;
  }

  editbuilding(param, id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/?id=${id}`;
    let a = this.http.patch(url, param)
    return a;
  }

  editFloor(param, id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/floor/?id=${id}`;
    let a = this.http.patch(url, param)
    return a;
  }

  editSpaceAttributeTable(param, id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/space/attribute/?id=${id}`;
    let a = this.http.patch(url, param)
    return a;
  }

  deleteSpaceAttributeTable(id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/spacename/?id=${id}`;
    let a = this.http.delete(url)
    return a;
  }

  editSpace(param, id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/space/attribute?floor_id=${id}`;
    let a = this.http.patch(url, param)
    return a;
  }

  getSpace(id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/space/attribute/?floor_id=${id}`;
    let a = this.http.get(url)
    return a;
  }

  getSpaceAttribute(id, space, port = '') {
    let url;
    if (space) {
      url = `${apiIdentifier.smartBuilding}${port}/building/space/attribute/?floor_id=${id}&space_id=${space}`;
    } else {
      url = `${apiIdentifier.smartBuilding}${port}/building/space/attribute/?floor_id=${id}`;
    }
    let a = this.http.get(url)
    return a;
  }

  getSpaceAttribute1(id, space, port = '') {
    let url;
    if (space) {
      url = `${apiIdentifier.smartBuilding}${port}/building/spacename/?floor_id=${id}&space_id=${space}`;
    } else {
      url = `${apiIdentifier.smartBuilding}${port}/building/spacename/?floor_id=${id}`;
    }
    let a = this.http.get(url)
    return a;
  }

  getBuildingSpaces(id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/spacename/?floor_id=${id}`;
    let a = this.http.get(url)
    return a;
  }

  deletingBuildingSpaces(id, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/spacename/?id=${id}`;
    let a = this.http.delete(url)
    return a;
  }

  createSpaceName(param, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/spacename/`;
    let a = this.http.post(url, param)
    return a;
  }


  getBulbListing(params, port = '') {
    let url;
      url = `${apiIdentifier.smartBuilding}${port}/building/smart_devices/?${params}`;
    let a = this.http.get(url)
    return a;
  }
  getBuildinglist(params, port = '') {
    let url;
      url = `${apiIdentifier.smartBuilding}${port}/building/?${params}`;
    let a = this.http.get(url)
    return a;
  }

  
}
