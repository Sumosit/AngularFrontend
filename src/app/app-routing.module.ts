import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageComponent} from "@core/components/page/page.component";

const routes: Routes = [
  {
    path: '', component: PageComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@layout/layout.module').then(m => m.LayoutModule)
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
