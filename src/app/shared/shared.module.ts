import {NgModule} from "@angular/core";
import * as component from './index';
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

const components : any = [
  component.LoadingBlockComponent
]
@NgModule({
  declarations: [
    ...components
  ],
    imports: [
        CommonModule,
        RouterModule
    ],
  exports: [
    ...components
  ]
})
export class SharedModule {}
