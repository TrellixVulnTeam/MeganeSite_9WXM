import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'MeganeSite';
  Error_msg:string='';
  MyOption:number=0;
  Test_Google_MongoDB:number=0;
  SelectInput(event:any){
    if (Number(event.target.value)>2 && Number(event.target.value) <6){
      this.MyOption=Number(event.target.value);
    } else if (Number(event.target.value)===1 || Number(event.target.value) ===2){
        this.Test_Google_MongoDB=Number(event.target.value);
    } else if (Number(event.target.value)===0) {
      this.Test_Google_MongoDB=0;
    } else {
      this.MyOption=0}
    
  }

}
