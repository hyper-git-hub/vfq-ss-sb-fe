import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulbDetailComponent } from './bulb-detail/bulb-detail.component';
import { BulbComponent } from './bulb/bulb.component';
import { SocketDetailComponent } from './socket-detail/socket-detail.component';
import { SocketComponent } from './socket/socket.component';

const routes: Routes = [
  { path: 'bulb', component: BulbComponent },
  { path: 'socket', component: SocketComponent },
  { path: 'bulb-detail/:id', component: BulbDetailComponent },
  { path: 'socket-detail/:id', component: SocketDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmartControlRoutingModule { }
