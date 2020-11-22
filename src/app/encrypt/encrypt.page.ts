import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-encrypt',
  templateUrl: './encrypt.page.html',
  styleUrls: ['./encrypt.page.scss'],
})
export class EncryptPage implements OnInit {
  hasWriteAccess: boolean = false;

  @ViewChild("plain") plain;
  title: string = "Encrypt";
  myphoto: any;
  binaryResult: '';
  s = [];
  result = "";
  t = [];
  showdownload = false;
  @ViewChild("key") key;
  @ViewChild("imageKey") imageKey;
  canvas;
  loading: any;
  context;
  constructor(private camera: Camera, private fileChooser: FileChooser, private androidPermissions: AndroidPermissions, private filePath: FilePath, private base64ToGallery: Base64ToGallery,public loadingController: LoadingController) {

  }
  checkPermissions() {
    this.androidPermissions
      .checkPermission(this.androidPermissions
        .PERMISSION.WRITE_EXTERNAL_STORAGE)
      .then((result) => {
        console.log('Has permission?', result.hasPermission);
        this.hasWriteAccess = result.hasPermission;
      }, (err) => {
        this.androidPermissions
          .requestPermission(this.androidPermissions
            .PERMISSION.WRITE_EXTERNAL_STORAGE);
      });
    if (!this.hasWriteAccess) {
      this.androidPermissions
        .requestPermissions([this.androidPermissions
          .PERMISSION.WRITE_EXTERNAL_STORAGE]);
    }
  }
   encrypt() {

    this.result = "";
    this.binaryResult = ''
    var rkey = this.key.value;
    var plaintext = this.plain.value;
    //first step 
    for (var i = 0; i < 256; i++) {
      this.s[i] = i;
      this.t[i] = rkey.charCodeAt(i % rkey.length);
    }
    console.log('First Step Result');
    console.log(this.s);
    console.log(this.t);
    //second step 
    var j = 0;
    var temp;
    for (var i = 0; i < 256; i++) {
      j = (j + this.s[i] + this.t[i]) % 256;
      temp = this.s[i];
      this.s[i] = this.s[j];
      this.s[j] = temp;
    }
    console.log('Second step result');
    console.log(this.s);
    console.log(this.t);
    //Third Step 
    var i = 0; var j = 0; var temp; var t; var k;
    for (var c = 0; c < plaintext.length; c++) {
      i = (i + 1) % 256;
      j = (j + this.s[i]) % 256;
      temp = this.s[i];
      this.s[j] = this.s[i];
      this.s[i] = temp;
      t = (this.s[i] + this.s[j]) % 256;
      k = this.s[t];
      this.result += String.fromCharCode(k ^ plaintext.charCodeAt(c));
      this.binaryResult += ' ' + ("00000000" + Number(k ^ plaintext.charCodeAt(c)).toString(2)).slice(-8)
      console.log(k);

    }


    console.log('solution');
    console.log(this.result);
    this.openCamera(this.binaryResult + this.StringToBinary( "#cyb560#" + this.imageKey.value +"#cyb560#") )
  }
  openCamera(text) {

    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,

    }
    this.camera.getPicture(options).then((imageData) => {
      
      this.hideImage(imageData,text)
    
    },
      (err) => {
        console.log(err)
      });
  }

  openGallery() {
    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    }
    this.camera.getPicture(options).then((imageData) => {

      this.myphoto = 'data:image/jpeg;base64,' + imageData;
    },
      (err) => {
        // Handle error
      });
  }

  ngOnInit() {
    this.checkPermissions();

  }
   StringToBinary(string) {

   let  returnValueBinary = "";
    for (var i = 0; i < string.length; i++) {
      returnValueBinary += ' ' + ("00000000" + Number(string[i].charCodeAt(0)).toString(2)).slice(-8)
    }
    return returnValueBinary
  }
async hideImage (imageData,text){
  const loading = await this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Please wait...',
  });
  await loading.present();
  this.myphoto = 'data:image/png;base64,' + imageData;
      var img = new Image();
      img.src = this.myphoto;
      var canvas = document.getElementById('canvas') as HTMLCanvasElement;
      var canvasEdited = document.getElementById('canvasEdited') as HTMLCanvasElement;
      var ctx = canvas.getContext('2d');
      var arr = [];
      img.onload = function () {
        // ctx.drawImage(img, 0, 0);
        ctx.drawImage(img, 0, 0, img.width, img.height,
          0, 0, canvas.width, canvas.height);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        editPixels(imageData.data);
          console.log(imageData.data)
        drawEditedImage(imageData);

      };

      function editPixels(imgData) {
     //   console.log(imgData)
        let rgbPixel = []
        for (let i = 0; i < text.replace(/ /g, "").length; i++) {
          let firstIndex = (i * 3)
          let currentPixel = [];
          // if (i === 0) {
            currentPixel = [imgData[firstIndex], imgData[firstIndex + 1], imgData[firstIndex + 2]]
          // } else {
          //   currentPixel = rgbPixel[rgbPixel.length - 1]
          // }
          let nextPixel = [imgData[(firstIndex + 3)], imgData[(firstIndex + 3) + 1], imgData[(firstIndex + 3) + 2]]
          if (Math.abs(((Number(getMax(nextPixel).max) - Number(getMax(currentPixel).max)) % 2)) !== Number(text.replace(/ /g, "")[i])) {
            nextPixel[getMax(nextPixel).maxIndex] = nextPixel[getMax(nextPixel).maxIndex] + 1
            if (imgData[getMax(nextPixel).maxIndex + (firstIndex + 3)] === 255) {
              imgData[(firstIndex + 3)] = imgData[(firstIndex + 3)] - 1;
              imgData[1 + (firstIndex + 3)] = imgData[1 + (firstIndex + 3)] - 1;
              imgData[2 + (firstIndex + 3)] = imgData[2 + (firstIndex + 3)] - 1;
            } else {
              imgData[getMax(nextPixel).maxIndex + (firstIndex + 3)] = imgData[getMax(nextPixel).maxIndex + (firstIndex + 3)] + 1
            }
          }
          if (i === 0) {
            rgbPixel.push(currentPixel)
          }
          rgbPixel.push(nextPixel)

        }

      }
      function drawEditedImage(newData) {
        var ctxEdited = canvasEdited.getContext('2d');
        ctxEdited.putImageData(newData, 0, 0);
     //   console.log(newData)
      //  console.log(canvasEdited.toDataURL());

      }
      function getMax(array) {
        let max = 0, maxIndex = 0
        for (let i = 0; i < array.length; i++) {
          if (max < array[i]) {
            max = array[i]
            maxIndex = i;
          }
        }
        return { 'max': max, 'maxIndex': maxIndex }
      }
      await loading.dismiss();
      this.showdownload=true;


}
downloadResult(){
  var canvasEdited = document.getElementById('canvasEdited') as HTMLCanvasElement;


let  image = canvasEdited.toDataURL()//.replace("image/png", "image/octet-stream");

this.base64ToGallery.base64ToGallery(image).then(
    res => alert( "Downloaded to "+ res),
    err => alert( err)
  );
}
}
