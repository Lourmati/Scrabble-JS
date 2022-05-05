import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminDictionaryDeleteComponent } from './admin-dictionary-delete.component';

describe('AdminDictionaryDeleteComponent', () => {
    let component: AdminDictionaryDeleteComponent;
    let fixture: ComponentFixture<AdminDictionaryDeleteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminDictionaryDeleteComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminDictionaryDeleteComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
