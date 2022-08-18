import { Component } from '@angular/core';
import { configServer } from './JsonServerClass';
import { HttpClient } from '@angular/common/http';

import { ManageXMVService } from 'src/app/services/ManageXMV.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private http: HttpClient,
    private ManageXMVService: ManageXMVService,
    ) {}


  Error_msg:string='';
  MyOption:number=0;
  Test_Google_MongoDB:number=0;
  configServer=new configServer;
  
  ngOnInit(){
    /****
    const HTTP_Address='https://storage.googleapis.com/storage/v1/b/config-xmvit/o/configServer.json?alt=media';

    this.http.get<any>(HTTP_Address )
    .subscribe(data => {
      this.configServer=data;
    },
    err => {
      console.log('error to retrieve the configuration file ', err.status);
    }
    )
     */
    this.RetrieveObject();
  }

  RetrieveObject(){
    const InitconfigServer=new configServer;
    InitconfigServer.baseUrl='https://test-server-359505.uc.r.appspot.com';
    InitconfigServer.GoogleProjectId='xmv-it-consulting';
    this.ManageXMVService.getContentObject(InitconfigServer, 'config-xmvit','configServer.json')
    .subscribe(
      data => {
        this.configServer=data;
      },
      error => {
        console.log('error to retrieve the configuration file ;  error = ', error.status);
       
      });
  }

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
