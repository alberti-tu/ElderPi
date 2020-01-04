import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  public emailList: { email: string }[] = null;

  constructor(private http: HttpService, private toast: ToastrService) {
    this.http.getEmail().subscribe(result => this.emailList = result);
  }

  ngOnInit() { }

  newEmail(myform) {

    let found = false;

    for (const item of this.emailList) {
      if (item.email === myform.form.value.email) { found = true; }
    }

    if (found) {
      this.toast.error('This email address is in your list', 'Duplicate email address');
      return;
    }

    this.http.addEmail(myform.form.value.email).subscribe(result => {
      this.emailList.push({email: myform.form.value.email});
      myform.reset();
    });
  }

  deleteEmail(address) {
    this.http.deleteEmail(address.email).subscribe(result => {
      this.emailList = this.emailList.filter(item => item !== address);
    });
  }

}
