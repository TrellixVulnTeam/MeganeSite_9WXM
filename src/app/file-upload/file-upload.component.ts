import { Component, OnInit, Input } from '@angular/core';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ManageXMVService } from 'src/app/services/ManageXMV.service';
import { ViewportScroller } from "@angular/common";

import { BucketList } from '../JsonServerClass';
import { Bucket_List_Info } from '../JsonServerClass';
import { OneBucketInfo } from '../JsonServerClass';
import { configServer } from '../JsonServerClass';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
  // providers:[ManageXMVService, {provide:'baseURL', useValue: ' http://localhost:8080'}]
})
// https://xmv-it-consulting.uc.r.appspot.com
// http://localhost:8080
export class FileUploadComponent implements OnInit {

  @Input() configServer=new configServer;
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
  jsonFile:string=''; // new content
  jsonObject:string='';
  nameObject:string=''; // new name object
  nameDelObject:string=''; // name object to delete
  SRCobjectName:string='';
  DESTobjectName:string='';

  constructor(
    private uploadService: FileUploadService,
    private ManageXMVService: ManageXMVService,
    private scroller: ViewportScroller,
    private http: HttpClient,
    
    ) { }

  ngOnInit(): void {
   this.getListBuckets();
  }


  selectBucket(event:string){
    this.bucket=event;
    this.getListObjects();
  }
  getListBuckets(): void {
    //this.uploadService.getListBuckets()
    this.ManageXMVService.getListBuckets(this.configServer)
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
    //this.uploadService.getFilesBucket(this.bucket)
    this.ManageXMVService.getListObjects(this.configServer, this.bucket)
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
    this.ManageXMVService.getMetaObject(this.configServer, this.bucket,this.SelectedObject)
    .subscribe(
      data => {
        console.log('successful retrieval of meta object ', data);
        this.contentMeta =data;
        if (data.contentType==='application/json'){
          this. RetrieveObject(this.SelectedObject);
        } else if (data.contentType.substring(0,5)==='image'){     

        } else if (data.contentType ==='application/octet-stream'){     
          this.updateMetadata();
        } 
        
      },
      error => {
        console.log('failure to get meta of objects ;  error = ', error);
       
      });
  }

  RetrieveObject(event:string){
    this.SelectedObject=event;
    this.ManageXMVService.getContentObject(this.configServer, this.bucket,this.SelectedObject)
    .subscribe(
      data => {
        console.log('successful retrieval of content of object ', data);
        this.currentFile=data;
        this.ContentObject =data;
        this.jsonFile=JSON.stringify(data);
        this.jsonObject=this.jsonFile;
        this.nameObject=this.SelectedObject;
      },
      error => {
        console.log('failure to get content of object ;  error = ', error);
       
      });
  }

  updateMetadata(){
    this.ManageXMVService.updateMetadata(this.configServer, this.bucket, this.SelectedObject )
      .subscribe(
        data => {
          console.log('MetaData successfully updated ', data);
        },
        error => {
          console.log('MetaData not updated ;  error = ', error);
         
        });
  }

  saveObject(){
    if (this.jsonFile!==this.jsonObject || this.SelectedObject!==this.nameObject){

      var blob = new Blob([this.jsonObject], {type: 'application/json'});
      var file=new File ([this.jsonObject],this.nameObject,{type: 'application/json'});
     
      this.ManageXMVService.uploadObjectInitial(this.configServer, this.bucket, file )
      .subscribe(
        (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round(100 * event.loaded / event.total);
            console.log('storage of content of object is in progress ', this.progress);
          } else if (event instanceof HttpResponse) {
            this.message = event.body.message;
            console.log('successful storage of content of object '+this.nameObject);
            // refresh list of objects
            this.SelectedObject='';
            this.nameObject='';
            this.jsonFile='';
            this.jsonObject='';
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
        });
    }
  }

  deleteObject(){
    
    this.ManageXMVService.deleteObject(this.configServer, this.bucket,this.nameDelObject)
    .subscribe(
      data => {
        console.log('successful deletion of object ', data);
        this.nameDelObject='';
        this.SelectedObject='';
        this.nameObject='';
        this.jsonFile='';
        this.jsonObject='';
        this.getListObjects();
      },
      error => {
        console.log('failure to delete object ;  error = ', error);
       
      });
  }

  renameObject(){
    
    this.ManageXMVService.renameObject(this.configServer, this.bucket,this.SRCobjectName, this.DESTobjectName)
    .subscribe(
      data => {
        console.log('successful renaming of object ', data);
        this.SRCobjectName='';
        this.DESTobjectName='';
        this.nameDelObject='';
        this.SelectedObject='';
        this.nameObject='';
        this.jsonFile='';
        this.jsonObject='';
        this.getListObjects();
      },
      error => {
        console.log('failure to rename object ;  error = ', error);
       
      });
  }
  reloadGoogle(){
        this.SRCobjectName='';
        this.DESTobjectName='';
        this.nameDelObject='';
        this.SelectedObject='';
        this.nameObject='';
        this.jsonFile='';
        this.jsonObject='';
        this.currentFile = undefined;
        this.selectedFiles = undefined;
        this.contentMeta=new OneBucketInfo;
        this.fileInfos.splice(0, this.fileInfos.length);
        this.getListBuckets();
  }

  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        //this.uploadService.upload(this.bucket,this.currentFile)
        this.ManageXMVService.uploadObjectInitial(this.configServer, this.bucket,this.currentFile)
          .subscribe(
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