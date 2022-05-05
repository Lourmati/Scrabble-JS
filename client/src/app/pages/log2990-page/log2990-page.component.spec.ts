import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Log2990PageComponent } from './log2990-page.component';

describe('Log2990PageComponent', () => {
    let component: Log2990PageComponent;
    let fixture: ComponentFixture<Log2990PageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [Log2990PageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(Log2990PageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
