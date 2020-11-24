import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core';
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
  constructor(private camera: Camera, private androidPermissions: AndroidPermissions, private base64ToGallery: Base64ToGallery,public loadingController: LoadingController) {

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
      //XOR the key with the first character 
      this.result += String.fromCharCode(k ^ plaintext.charCodeAt(c));
      this.binaryResult += ' ' + ("00000000" + Number(k ^ plaintext.charCodeAt(c)).toString(2)).slice(-8)
      console.log(k);

    }
    console.log('Cipher Text');
    console.log(this.result);
    this.openCamera(this.binaryResult + this.StringToBinary( "#cyb560#" + this.imageKey.value +"#cyb560#") ) //Open the camera with image key 
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
  //Hide the text inside the image
async hideImage (imageData,text){
  const loading = await this.loadingController.create({
    cssClass: 'my-custom-class',
    message: 'Please wait...',
  });
  await loading.present();
  this.myphoto = 'data:image/png;base64,' + imageData;
 //Get the Image base64
      var img = new Image();
      img.src = this.myphoto;
      var canvas = document.getElementById('canvas') as HTMLCanvasElement;
      var canvasEdited = document.getElementById('canvasEdited') as HTMLCanvasElement;
      var ctx = canvas.getContext('2d');
      var arr = [];
      img.onload = function () {
        //Draw the image in the canvas
        ctx.drawImage(img, 0, 0, img.width, img.height,
          0, 0, canvas.width, canvas.height);
          //Get the pixel data
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      // Edit and modify the pixel in a way to hide the text in the image 
        editPixels(imageData.data);
          console.log(imageData.data)
          //Draw the new image in the second canvas
        drawEditedImage(imageData);

      };

      function editPixels(imgData) {
        let rgbPixel = []
        //Pixel array is 1D array
        //Loop the pixel array till the text length is reached
        for (let i = 0; i < text.replace(/ /g, "").length; i++) {
          let firstIndex = (i * 3) //Get the first index of the current pixel 
          let currentPixel = [];
          //Get the current pixel RGB
            currentPixel = [imgData[firstIndex], imgData[firstIndex + 1], imgData[firstIndex + 2]]
            //Get the next pixel RGB   
            let nextPixel = [imgData[(firstIndex + 3)], imgData[(firstIndex + 3) + 1], imgData[(firstIndex + 3) + 2]]
            //Check if (the dominant color in the next pixel - the dominant color in the current pixel) are odd or even 
              if (Math.abs(((Number(getMax(nextPixel).max) - Number(getMax(currentPixel).max)) % 2)) !== Number(text.replace(/ /g, "")[i])) {
           //if the difference % 2 is different than the current binary modify it 
            if (imgData[getMax(nextPixel).maxIndex + (firstIndex + 3)] === 255) {
              // if the dominant is equal to 255 wich is the max do a minus but on all RGB so the max index won't change
              nextPixel[(firstIndex )] = nextPixel[(firstIndex )] - 1;
              nextPixel[1+(firstIndex )] = nextPixel[1+(firstIndex )] - 1;
              nextPixel[2+(firstIndex )] = nextPixel[2+(firstIndex )] - 1;
              imgData[(firstIndex + 3)] = imgData[(firstIndex + 3)] - 1;
              imgData[1 + (firstIndex + 3)] = imgData[1 + (firstIndex + 3)] - 1;
              imgData[2 + (firstIndex + 3)] = imgData[2 + (firstIndex + 3)] - 1;
            } else {
              //Add 1 to the next pixel dominant color
              nextPixel[getMax(nextPixel).maxIndex] = nextPixel[getMax(nextPixel).maxIndex] + 1           
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
let  image = canvasEdited.toDataURL()

this.base64ToGallery.base64ToGallery(image).then(
    res => alert( "Downloaded to "+ res),
    err => alert( err)
  );
}
}
