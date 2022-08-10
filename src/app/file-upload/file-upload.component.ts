import { Component, OnInit, Input } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ViewportScroller } from "@angular/common";

import { BucketList } from '../JsonServerClass';
import { Bucket_List_Info } from '../JsonServerClass';
import { OneBucketInfo } from '../JsonServerClass';


@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})

export class FileUploadComponent implements OnInit {
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  TabBuckets=[{name:''}];
  ContentObject:any;
  contentMeta=new OneBucketInfo;
  fileInfos:Array<any>=[];
  SelectedObject:string='';
  bucket:string='';
  jsonFile:string='';


  constructor(
    private uploadService: FileUploadService,
    private scroller: ViewportScroller,
    private http: HttpClient,
    ) { }
    
Google_Bucket_Access_RootPOST:string='https://storage.googleapis.com/upload/storage/v1/b/';
  
Google_Bucket_Name:string='manage-login'; 
Tab_photos:Array<string>=[];
Tab_Object:Array<string>=['xavier-monica-mariage-00',
'xavier-monica-mariage-01',
'xavier-monica-mariage-02',
'xavier-monica-mariage-03',
'xavier-monica-mariage-04'];

  ngOnInit(): void {
   this.getListBuckets();
  }


  selectBucket(event:string){
    this.bucket=event;
    this.getListObjects();
  }
  getListBuckets(): void {
    this.uploadService.getListBuckets()
    .subscribe(
      data => {
        console.log('successful retrieval of list of buckets ', data);
        this.TabBuckets =data;
      },
      error => {
        console.log('failure to get list of buckets ;  error = ', error);
       
      });
  }

  getListObjects(): void {
    this.jsonFile='';
    this.scroller.scrollToAnchor('targetObject');
    this.message='';
    this.fileInfos.splice(0,this.fileInfos.length);
     this.uploadService.getFilesBucket(this.bucket)
    .subscribe(
      data => {
        console.log('successful retrieval ofb list of objects ', data);
        this.fileInfos =data;
      },
      error => {
        console.log('failure to get list of objects ;  error = ', error);
       
      });
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  RetrieveMetaObject(event:string){
    this.scroller.scrollToAnchor('targetMeta');
    this.jsonFile='';
    this.SelectedObject=event;
    this.uploadService.getMetaObject(this.bucket,this.SelectedObject)
    .subscribe(
      data => {
        console.log('successful retrieval of meta object ', data);
        this.contentMeta =data;
        if (data.contentType==='application/json'){
          this. RetrieveObject(this.SelectedObject);
        } else if (data.contentType.substring(0,5)==='image'){     

        } 
        
      },
      error => {
        console.log('failure to get meta of objects ;  error = ', error);
       
      });
  }

  RetrieveObject(event:string){
    this.SelectedObject=event;
    this.uploadService.getContentObject(this.bucket,this.SelectedObject)
    .subscribe(
      data => {
        console.log('successful retrieval of content of object ', data);
        this.ContentObject =data;
        this.jsonFile=JSON.stringify(data);
      },
      error => {
        console.log('failure to get content of object ;  error = ', error);
       
      });
  }


  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.uploadService.upload(this.bucket,this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              // refresh list of objects
              this.getListObjects();
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          });
      }
      this.selectedFiles = undefined;
    }
  }
}