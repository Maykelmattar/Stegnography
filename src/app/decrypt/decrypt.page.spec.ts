import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DecryptPage } from './decrypt.page';

describe('DecryptPage', () => {
  let component: DecryptPage;
  let fixture: ComponentFixture<DecryptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecryptPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DecryptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
