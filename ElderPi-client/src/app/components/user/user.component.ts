import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import { HttpService } from '../../service/http.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  email: { email: string }[] = null;

  constructor(private http: HttpService, private toast: ToastrManager) {
    this.getEmail();
  }

  ngOnInit() { }

  newEmail(myform) {

    let found = false;

    for(let i = 0; i < this.email.length; i++) {
      if(this.email[i].email === myform.form.value.email) found = true;
    }

    if(found) {
      this.toast.errorToastr('This email address is in your list', 'Duplicate email address');
      return;
    }

    this.http.addEmail(myform.form.value.email).subscribe(result => {
      this.email.push({email: myform.form.value.email});
      myform.reset();
    });
  }

  getEmail() {
    this.http.getEmail().subscribe(result => this.email = result);
  }

  deleteEmail(address) {
    this.http.deleteEmail(address.email).subscribe(result => {
      this.email = this.email.filter(item => item !== address);
    });
  }

}
