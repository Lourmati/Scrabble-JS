import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminDictionaryDeleteComponent } from '@app/components/admin-page/admin-dictionary-delete/admin-dictionary-delete.component';
import { AdminDictionaryEditComponent } from '@app/components/admin-page/admin-dictionary-edit/admin-dictionary-edit.component';
import { AdminDictionaryResetComponent } from '@app/components/admin-page/admin-dictionary-reset/admin-dictionary-reset.component';
import { AdminDictionaryComponent } from '@app/components/admin-page/admin-dictionary/admin-dictionary.component';
import { AdminGameHistoryComponent } from '@app/components/admin-page/admin-game-history/admin-game-history.component';
import { AdminVirtualPlayerDeleteComponent } from '@app/components/admin-page/admin-virtual-player-delete/admin-virtual-player-delete.component';
import { AdminVirtualPlayerEditComponent } from '@app/components/admin-page/admin-virtual-player-edit/admin-virtual-player-edit.component';
import { AdminVirtualPlayerComponent } from '@app/components/admin-page/admin-virtual-player/admin-virtual-player.component';
import { BestScoresClassiqueComponent } from '@app/components/best-scores/best-scores-classique/best-scores-classique.component';
import { BestScoresLOG2990Component } from '@app/components/best-scores/best-scores-log2990/best-scores-log2990.component';
import { CancelButtonComponent } from '@app/components/buttons/cancel-button/cancel-button.component';
import { ExchangeButtonComponent } from '@app/components/buttons/exchange-button/exchange-button.component';
import { PlayButtonComponent } from '@app/components/buttons/play-button/play-button.component';
import { ChatboxInputComponent } from '@app/components/chatbox/chatbox-input/chatbox-input.component';
import { ChatboxMessageComponent } from '@app/components/chatbox/chatbox-message/chatbox-message.component';
import { ChatboxMessagesComponent } from '@app/components/chatbox/chatbox-messages/chatbox-messages.component';
import { ChatboxComponent } from '@app/components/chatbox/chatbox/chatbox.component';
import { ControlPanelComponent } from '@app/components/control-panel/control-panel.component';
import { CreateGameComponent } from '@app/components/create-game/create-game.component';
import { EaselComponent } from '@app/components/easel/easel.component';
import { LetterComponent } from '@app/components/easel/letter/letter.component';
import { EndGameDialogComponent } from '@app/components/end-game-dialog/end-game-dialog.component';
import { EndGameComponent } from '@app/components/end-game/end-game.component';
import { PassButtonComponent } from '@app/components/pass-button/pass-button.component';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { SurrenderButtonComponent } from '@app/components/surrender/surrender-button/surrender-button.component';
import { SurrenderDialogComponent } from '@app/components/surrender/surrender-dialog/surrender-dialog.component';
import { AppRoutingModule } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AppComponent } from '@app/pages/app/app.component';
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
import { ObjectivesComponent } from './components/objectives/objectives/objectives.component';
import { AdminPageComponent } from './pages/admin-page/admin-page.component';
import { AdminBestScoresComponent } from './components/admin-page/admin-best-scores/admin-best-scores/admin-best-scores.component';

/**
 * Main module that is used in main.ts.
 * All automatically generated components will appear in this module.
 * Please do not move this module in the module folder.
 * Otherwise Angular Cli will not know in which module to put new component
 */
@NgModule({
    declarations: [
        AppComponent,
        ControlPanelComponent,
        GamePageComponent,
        MainPageComponent,
        MaterialPageComponent,
        PlayAreaComponent,
        SidebarComponent,
        MultiplayerPageComponent,
        MultiplayerCreatePageComponent,
        MultiplayerJoinPageComponent,
        MultiplayerWaitingPageComponent,
        ChatboxComponent,
        EaselComponent,
        ChatboxMessagesComponent,
        ChatboxMessageComponent,
        EaselComponent,
        LetterComponent,
        ChatboxInputComponent,
        ClassicPageComponent,
        PassButtonComponent,
        CreateGameComponent,
        SoloCreatePageComponent,
        Log2990PageComponent,
        HighScoresPageComponent,
        BestScoresClassiqueComponent,
        BestScoresLOG2990Component,
        SurrenderButtonComponent,
        SurrenderDialogComponent,
        EndGameComponent,
        EndGameDialogComponent,
        PlayButtonComponent,
        ExchangeButtonComponent,
        CancelButtonComponent,
        AdminPageComponent,
        AdminDictionaryComponent,
        AdminVirtualPlayerComponent,
        AdminGameHistoryComponent,
        AdminVirtualPlayerEditComponent,
        AdminVirtualPlayerDeleteComponent,
        AdminDictionaryEditComponent,
        AdminDictionaryDeleteComponent,
        ObjectivesComponent,
        AdminDictionaryResetComponent,
        AdminBestScoresComponent,
    ],
    imports: [
        AppMaterialModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        FormsModule,
        MatDialogModule,
        BrowserAnimationsModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
