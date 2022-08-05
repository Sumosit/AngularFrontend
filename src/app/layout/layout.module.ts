import {NgModule} from "@angular/core";
import * as component from './index';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LayoutRouterModule} from "@layout/layout-router.module";
import {SharedModule} from "@shared/shared.module";
import {DragDropModule} from "@angular/cdk/drag-drop";

@NgModule({
  declarations: [
    component.HomeComponent,
    component.ChatComponent,
    component.UsersComponent,

  ],
    imports: [
        CommonModule,
        FormsModule,
        LayoutRouterModule,
        SharedModule,
        ReactiveFormsModule,
        DragDropModule,
    ]
})
export class LayoutModule {}
