import {RouterModule, Routes} from "@angular/router";
import * as component from './index';
import {NgModule} from "@angular/core";

const routes: Routes = [
  {path: 'home', component: component.HomeComponent},
  {path: 'chat', component: component.ChatComponent},
  {path: 'users', component: component.UsersComponent}
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRouterModule {
}
