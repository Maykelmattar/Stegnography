import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DecryptPageRoutingModule } from './decrypt-routing.module';

import { DecryptPage } from './decrypt.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DecryptPageRoutingModule
  ],
  declarations: [DecryptPage]
})
export class DecryptPageModule {}
