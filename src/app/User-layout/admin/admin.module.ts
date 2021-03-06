import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { CreateLurahComponent } from './component/create-lurah/create-lurah.component';
import { GetLurahComponent } from './component/get-lurah/get-lurah.component';
import { AdminProfileComponent } from './component/admin-profile/admin-profile.component';
import { CreateDistrictComponent } from './component/create-district/create-district.component';
import { GetDistrictComponent } from './component/get-district/get-district.component';
import { GetAllUsersComponent } from './component/get-all-users/get-all-users.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CreateLurahComponent,
    GetLurahComponent,
    AdminProfileComponent,
    CreateDistrictComponent,
    GetDistrictComponent,
    GetAllUsersComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    RouterModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
