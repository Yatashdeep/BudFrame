/* 
**************************************************************************
Upload Image and merge the frame with the image using HTML2Canvas Library.
*************************************************************************** 
*/
import { Component } from '@angular/core';
import { NavController,ActionSheetController,ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import{File}from'@ionic-native/file'
import * as html2canvas from 'html2canvas';
import{SocialSharing}from'@ionic-native/social-sharing'
import { errorHandler } from '@angular/platform-browser/src/browser';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  public FileUriImage:string='assets/imgs/aboutus_bg.png'
  private win: any = window;
  public socialshare_id:any
  public sharableimage:any
  constructor(public toastCtrl:ToastController,public actionSheetCtrl:ActionSheetController,public socialsharing:SocialSharing,public file:File,public navCtrl: NavController,public camera: Camera,private DomSanitizer: DomSanitizer) {

  }

// Function to upload Photo where in Upload Choice function
// 1 refer to open by gallery and 2 refer to open by camera

  UploadPhoto()
  {
    let actionsheet = this.actionSheetCtrl.create({
      title: 'Image Upload!',
      buttons: [{
        text: 'Upload From Gallery',
        handler: () => {
       this.UploadChoice(1,this.camera.PictureSourceType.PHOTOLIBRARY)
        },
      }
        ,
      {
        text: 'Take A Snap',
        handler: () => {
         this.UploadChoice(2,this.camera.PictureSourceType.CAMERA)
        }
      }]
  
    })
    actionsheet.present(); 
  }
  UploadChoice(id,source)
  {
 
 // File_URI declare in camera options to get the image path of local from the device
   
 const options: CameraOptions = {
     quality: 100,
     sourceType: source,
     saveToPhotoAlbum: true,
     correctOrientation: true,
     encodingType: this.camera.EncodingType.JPEG,
     destinationType: this.camera.DestinationType.FILE_URI
    }
// convertFileSrc is used for allowing the permission to get the local path of device

    if(id==1)
   {
    this.camera.getPicture(options).then((imageData) => {
      this.FileUriImage=this.win.Ionic.WebView.convertFileSrc(imageData);

     }, (err) => {
       alert(err)
      // Handle error
     });
    }
    else if(id==2)
    {
     this.camera.getPicture(options).then((imageData) => {
      this.FileUriImage=this.win.Ionic.WebView.convertFileSrc(imageData);
  
    }, (err) => {
    alert(err)
    // Handle error
    })
    }

  }
// MergeImage function use HTML2CANVAS library to merge uploaded image with frame
// where the library get the html of frame and image to convert into image 


  MergeImage(id)
  {
    this.socialshare_id=id
    html2canvas(document.getElementById('results')).then((canvas) =>{
      var sharableimage= canvas.toDataURL("image/png");
   
      this.socialshare(sharableimage)
      });
     
  }

// In socialshare function socialshare_id parameter refers for social sharing options
// where 1 refer to facebook ,2 refer to wattsapp and 3 refer to instagram

   socialshare(sharableimage)
   {
     
   this.sharableimage=sharableimage
   
   if(this.socialshare_id==1)
   {
   this.socialsharing.shareViaFacebook('Have a look in this image !',this.sharableimage,null).then((data)=>{
      
       }).catch((e)=>{
         this.SocialErrorHandler('Facebook')
       })
    }
    else if(this.socialshare_id==2)
    {
      this.socialsharing.shareViaWhatsApp('Have a look in this image !',this.sharableimage,null).then((data)=>{
        
           }).catch((e)=>{
        this.SocialErrorHandler('WhatsApp')
           })
    }
    else if(this.socialshare_id==3)
    {
      this.socialsharing.shareViaInstagram('Have a look in this image !',this.sharableimage).then((data)=>{
        
           }).catch((e)=>{
            this.SocialErrorHandler('Instagram')
           })
    }
      }

// Function to handel error for Social sharing 

      SocialErrorHandler(message)
      {
        alert('Please Install the '+ message +' application')
      }

// Success share message
         

}
