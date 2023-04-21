import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { apiIdentifier } from 'src/environments/environment';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserserviceService {

  constructor(public http: HttpClient) {

  }

  converToFormdata(data) {
    var form_data = new FormData();
    for (var key in data) {
      form_data.append(key, data[key]);
    }
    return form_data;
  }

  getContract(params?, port = '') {
    const url = `${apiIdentifier.monolith}${port}/Contract/?${params}`;
    let a = this.http.get(url)
    return a;
  }
  addContract(param, port = '') {
    // let newData = this.converToFormdata(param);
    const url = `${apiIdentifier.monolith}${port}/Contract/`;
    let a = this.http.post(url, param)
    return a;
  }
  patchContract(param, id, port = '') {
    const url = `${apiIdentifier.monolith}${port}/Contract/${id}/`;
    let a = this.http.patch(url, param)
    return a;
  }

  deleteContract(params?, port = '') {
    const url = `${apiIdentifier.monolith}${port}/Contract/${params}`;
    return this.http.delete(url);
  }
  getCustomer(params?, port = '') {
    const url = `${apiIdentifier.monolith}${port}/Customer/${params}`;
    let a = this.http.get(url)
    return a;
  }

  // Department APIS
  getDepartment(params?, port = '') {
    const url = `${apiIdentifier.monolith}${port}/Department/?${params}`;
    let a = this.http.get(url)
    return a;
  }
  addDepartment(param, port = '') {
    // let newData = this.converToFormdata(param);
    const url = `${apiIdentifier.monolith}${port}/Department/`;
    let a = this.http.post(url, param)
    return a;
  }
  patchDepartment(param, port = '') {

    const url = `${apiIdentifier.monolith}${port}/Department/${param['editdepid']}/`;
    let a = this.http.patch(url, param)
    return a;
  }
  deleteDepartment(params?, port = '') {
    const url = `${apiIdentifier.monolith}${port}/Department/${params}`;
    return this.http.delete(url);
  }
  activeInactiveDep(param, id, port = '') {
    const url = `${apiIdentifier.monolith}${port}/Department/${id}/`;
    let a = this.http.patch(url, param)
    return a;
  }




  //users

  getDepartmentDropdown(port = '') {
    const url = `${apiIdentifier.monolith}${port}/Department/`;
    let a = this.http.get(url)
    return a;
  }
  getUserListing(params, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/user-listing?${params}`;
    return this.http.get(url);
  }



  //Manage Cameras 
  getCameraListing(params, port = '') {
    const url = `${apiIdentifier.smartBuilding}${port}/building/smart_devices/?${params}`;
    return this.http.get(url);
  }
  deleteCameraListing(id, port = '') {
    const url = `${apiIdentifier.monolith}${port}/manage-camera?id=${id}`;
    return this.http.delete(url);
  }
  postCameraListing(params, port = '') {
    // let covertedData = this.converToFormdata(params);
    const url = `${apiIdentifier.monolith}${port}/manage-camera`;
    return this.http.post(url, params);
  }
  patchCameraListing(params,id, port = '') {
    let covertedData = this.converToFormdata(params);
    const url = `${apiIdentifier.monolith}${port}/manage-camera?id=${id}`;
    return this.http.patch(url, covertedData);
  }
  getmacAdd(port = '') {
    const url = `${apiIdentifier.monolith}${port}/get-mac-address`;
    return this.http.get(url);
  }

  //surveillance Dashboad (get cameraDetail use also in livefeed)
  getCameraDetail(params,port = '') {
    const url = `${apiIdentifier.monolith}${port}/manage-camera?${params}`;
    return this.http.get(url);
  }
  patchCameraViews(payload, port = '') {
    // let covertedData = this.converToFormdata(params);
    const url = `${apiIdentifier.monolith}${port}/views`;
    return this.http.patch(url, payload);
  }


  //playback
  getCameradropdown(params, port = '') {
    const url = `${apiIdentifier.monolith}${port}/manage-camera?${params}`;
    return this.http.get(url);
  }
  getplayback(params) {
    const url = `${environment.baseUrlStreaming}/surveillance/playback/?${params}`;
    return this.http.get(url);
  }
 


   //livefeed
  getuserpref(params,port = '') {
    const url = `${apiIdentifier.monolith}${port}/user-preference?guid=${params.guid}`;
    return this.http.get(url);
  }
  saveViews(payload,params, port = '') {
    const url = `${apiIdentifier.monolith}${port}/user-preference?${params}`;
    let a = this.http.patch(url, payload, params)
    return a;
  }


  getUserProfileImageList(customerID, usecaseID, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/user-profile/customer/usecase/users?customer_id=${customerID}&usecase_id=${usecaseID}`;
    return this.http.get(url);
  }

  postUserListing(params, port = '') {
    let covertedData = this.converToFormdata(params);
    const url = `${apiIdentifier.userMS}${port}/users/user-listing`;
    return this.http.post(url, covertedData);
  }



  postDownloadVideo(payload, port = '') {
    // let covertedData = this.converToFormdata(params);
    const url = `${apiIdentifier.monolith}${port}/download`;
    return this.http.post(url, payload);
  }




  patchUserListing(params, port = '') {
    let covertedData = this.converToFormdata(params);
    const url = `${apiIdentifier.userMS}${port}/users/user-profile/info`;
    return this.http.patch(url, covertedData);
  }



 

n
  deleteUserListing(id, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/user-profile?email=${id}&usecase=5`;
    return this.http.delete(url);
  }



  patchUser(param, id, port = '') {
    let covertedData = this.converToFormdata(param);
    const url = `${apiIdentifier.userMS}${port}/users/user-profile/info`;
    return this.http.patch(url, covertedData);
  }
  deleteUser(id, port = '') {
    const url = `${apiIdentifier.userMS}${port}/users/user-profile?email=${id}`;
    return this.http.delete(url);
  }

 

  unblockUserListing(params, port = '') {
    let covertedData = this.converToFormdata(params);
    const url = `${apiIdentifier.userMS}${port}/users/user-profile/status`;
    return this.http.post(url, covertedData);
  }


  // patchUser(param,id,port = '') {
  //   let covertedData = this.converToFormdata(param);
  //    const url = `${port}/users/user-profile/info`;
  //   return this.http.patch(url, covertedData);
  // }




  // Role & Access API
  getAssignGroups(params?, port = '') {
    const url = `${environment.baseUrlRA}${port}/api/role-and-access/group?${params}`;
    let a = this.http.get(url)
    return a;
  }
  addGroup(data, port = '') {
    // let covertedData = this.converToFormdata(data);
    const url = `${environment.baseUrlRA}${port}/api/role-and-access/group`;
    return this.http.post(url, data);
  }
  updateGroup(data, port = '') {
    const url = `${environment.baseUrlRA}${port}/api/role-and-access/group?id=${data.id}`;
    return this.http.patch(url, data);
  }

  unallocateUserFromGroup(data, port = '') {
    const url = `${environment.baseUrlRA}${port}/api/role-and-access/un-assign`;
    return this.http.patch(url, data);
  }

  deleteGroup(params?, port = '') {
    const url = `${environment.baseUrlRA}${port}/api/role-and-access/group?id=${params}`;
    return this.http.delete(url);
  }

  addAssignGroup(data, port = '') {
    const url = `${environment.baseUrlRA}${port}/api/role-and-access/assign`;
    return this.http.post(url, data);
  }

  getFeaturesAndPackages(usecaseId, port = '') {
    const url = `${environment.baseUrlRA}${port}/api/role-and-access/customer-feature?use_case_id=${usecaseId}`;
    let a = this.http.get(url)
    return a;
  }

  getAllUsersAssignGroup(port = '') {
    const url = `${environment.baseUrlRA}${port}/api/role-and-access/un-assigned-user`;
    let a = this.http.get(url)
    return a;
  }








}
