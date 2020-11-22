import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DecryptPage } from './decrypt.page';

const routes: Routes = [
  {
    path: '',
    component: DecryptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DecryptPageRoutingModule {}
