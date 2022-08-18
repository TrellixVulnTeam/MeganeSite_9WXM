import { Component, OnInit, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Tutorial } from 'src/app/components/TutorialClass';
import { Observable } from 'rxjs';
import { TutorialService } from 'src/app/services/tutorial.service';
import { configServer } from '../../JsonServerClass';

@Component({
  selector: 'app-add-tutorial',
  templateUrl: './add-tutorial.component.html',
  styleUrls: ['./add-tutorial.component.css']
})
export class AddTutorialComponent implements OnInit {
  @Input() configServer=new configServer;
  tutorial = new Tutorial;
  submitted = false;
  theDatabase:string='XMVITdb';

  constructor(
    private tutorialService: TutorialService,
    private http: HttpClient,
    ) {}


  ngOnInit(): void {
   
  }

  saveTutorial(): void {
    const data = {
      title: this.tutorial.title,
      description: this.tutorial.description
    };
    this.tutorialService.create(this.configServer, this.tutorial, this.theDatabase)
        .subscribe(
          res => {
            console.log('add tutorial is successful');
            console.log(res);
            this.submitted = true;
          },
          error => {
            console.log('add tutorial failed  ', error);
          }
          );
  }


  newTutorial(): void {
    console.log('add tutorial: new Tutorial function')
    this.submitted = false;
    this.tutorial = {
      id:'',
      title: '',
      description: '',
      published: false
    };
  }

 
}