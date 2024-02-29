import { Component } from '@angular/core';
import { PaymentDetailService } from '../../shared/payment-detail.service';
import { NgForm } from '@angular/forms';
import { PaymentDetail } from '../../shared/payment-detail.model';

@Component({
  selector: 'app-payment-detail-form',
  templateUrl: './payment-detail-form.component.html',
  styleUrl: './payment-detail-form.component.css'
})
export class PaymentDetailFormComponent {
  constructor (public service : PaymentDetailService){

  }

  onSubmit(form: NgForm){
    this.service.formSubmitted = true
    if(form.valid){
    this.service.postPaymentDetail()
    .subscribe({
      next : res => {
        this.service.list = res as PaymentDetail[]
        this.service.resetForm(form)
      },
      error: err => {console.log(err)}
    })
    }
  }

}
