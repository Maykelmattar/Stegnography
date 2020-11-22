import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EncryptPage } from './encrypt.page';

describe('EncryptPage', () => {
  let component: EncryptPage;
  let fixture: ComponentFixture<EncryptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EncryptPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EncryptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
