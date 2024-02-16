import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComicPanelComponent } from './comic-panel.component';

describe('ComicPanelComponent', () => {
  let component: ComicPanelComponent;
  let fixture: ComponentFixture<ComicPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComicPanelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComicPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
