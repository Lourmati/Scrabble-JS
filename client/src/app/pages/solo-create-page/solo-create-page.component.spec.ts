import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoloCreatePageComponent } from './solo-create-page.component';

describe('SoloCreatePageComponent', () => {
    let component: SoloCreatePageComponent;
    let fixture: ComponentFixture<SoloCreatePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SoloCreatePageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SoloCreatePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
