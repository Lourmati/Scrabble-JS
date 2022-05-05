import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPageComponent } from '@app/pages/admin-page/admin-page.component';
import { ClassicPageComponent } from '@app/pages/classic-page/classic-page.component';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { HighScoresPageComponent } from '@app/pages/high-scores-page/high-scores-page.component';
import { Log2990PageComponent } from '@app/pages/log2990-page/log2990-page.component';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { MaterialPageComponent } from '@app/pages/material-page/material-page.component';
import { MultiplayerCreatePageComponent } from '@app/pages/multiplayer-create-page/multiplayer-create-page.component';
import { MultiplayerJoinPageComponent } from '@app/pages/multiplayer-join-page/multiplayer-join-page.component';
import { MultiplayerPageComponent } from '@app/pages/multiplayer-page/multiplayer-page.component';
import { MultiplayerWaitingPageComponent } from '@app/pages/multiplayer-waiting-page/multiplayer-waiting-page.component';
import { SoloCreatePageComponent } from '@app/pages/solo-create-page/solo-create-page.component';

const multiplayerChildren: Routes = [
    { path: 'create', component: MultiplayerCreatePageComponent },
    { path: 'join', component: MultiplayerJoinPageComponent },
    { path: 'waiting', component: MultiplayerWaitingPageComponent },
];

const childrenRoutes: Routes = [
    { path: 'material', component: MaterialPageComponent },
    { path: 'multiplayer', children: [{ path: '', component: MultiplayerPageComponent }, ...multiplayerChildren] },
    { path: 'solo', component: SoloCreatePageComponent, children: [{ path: '', component: SoloCreatePageComponent }] },
];

const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: MainPageComponent },
    { path: 'classic', children: [{ path: '', component: ClassicPageComponent }, ...childrenRoutes] },
    { path: 'log2990', children: [{ path: '', component: Log2990PageComponent }, ...childrenRoutes] },
    { path: 'high-scores', component: HighScoresPageComponent },
    { path: 'game', component: GamePageComponent },
    { path: 'admin', component: AdminPageComponent },
    { path: '**', redirectTo: '/home' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}
