import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDictionaryResetComponent } from './admin-dictionary-reset.component';

describe('AdminDictionaryResetComponent', () => {
    let component: AdminDictionaryResetComponent;
    let fixture: ComponentFixture<AdminDictionaryResetComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminDictionaryResetComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminDictionaryResetComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
