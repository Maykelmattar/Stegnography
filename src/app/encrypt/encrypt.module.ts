import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncryptPageRoutingModule } from './encrypt-routing.module';

import { EncryptPage } from './encrypt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncryptPageRoutingModule
  ],
  declarations: [EncryptPage]
})
export class EncryptPageModule {}
