import {NgModule} from "@angular/core";
import * as component from './index';
import {RouterModule} from "@angular/router";
import {CommonModule} from "@angular/common";
import {SharedModule} from "@shared/shared.module";
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    component.PageComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    FormsModule,
  ]
})
export class CoreModule {
}
