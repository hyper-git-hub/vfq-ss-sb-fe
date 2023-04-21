import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  styleUrls: ['./confirm-box.component.css']
})
export class ConfirmBoxComponent implements OnInit {

  data: any;
  
  @ViewChild('buildingValue') buildingValue: ElementRef;


  constructor(
    private modalRef: NgbActiveModal,
    private dialog: NgbModal,
  ) {
    this.data = null;
    }

  ngOnInit(): void {
    // console.log("data confirm:",this.data);
  }


  onNoClick(): void {
    this.modalRef.close();
  }
  
  recordAction(selectedBtn?): void {
    if (selectedBtn) {
      this.modalRef.close(selectedBtn);
    } else {
      this.modalRef.close(this.buildingValue.nativeElement.value);
    }

  } 

}
