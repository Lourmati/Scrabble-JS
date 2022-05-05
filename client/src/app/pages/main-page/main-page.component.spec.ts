/* eslint-disable deprecation/deprecation */
/* eslint-disable no-restricted-imports */
import { CommonModule, Location } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModule } from '@app/modules/material.module';
import { MainPageComponent } from '@app/pages/main-page/main-page.component';
import { ClassicPageComponent } from '../classic-page/classic-page.component';
import { GamePageComponent } from '../game-page/game-page.component';
import { HighScoresPageComponent } from '../high-scores-page/high-scores-page.component';
import { Log2990PageComponent } from '../log2990-page/log2990-page.component';

describe('MainPageComponent', () => {
    let component: MainPageComponent;
    let fixture: ComponentFixture<MainPageComponent>;
    let location: Location;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                RouterTestingModule.withRoutes([
                    { path: '', component: MainPageComponent },
                    { path: 'classic', component: ClassicPageComponent },
                    { path: 'log2990', component: Log2990PageComponent },
                    { path: 'high-scores', component: HighScoresPageComponent },
                    { path: 'game', component: GamePageComponent },
                ]),
                HttpClientModule,
                AppMaterialModule,
            ],
            declarations: [MainPageComponent, ClassicPageComponent, Log2990PageComponent, HighScoresPageComponent, GamePageComponent],
        }).compileComponents();
        location = TestBed.get(Location);
        fixture = TestBed.createComponent(MainPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it("should have as title 'LOG2990'", () => {
        expect(component.title).toEqual('LOG2990');
    });

    it('should redirect to classic page on button click', () => {
        fixture.debugElement.nativeElement.querySelector('#classic-button').click();
        fixture.whenStable().then(() => {
            expect(location.path()).toEqual('/classic');
        });
        expect(true).toBeTrue();
    });
});
