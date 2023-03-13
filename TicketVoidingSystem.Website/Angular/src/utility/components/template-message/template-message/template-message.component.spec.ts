import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpService } from '../../../../utility/services/http.service';
import { ToolTipModule } from '../../tooltip/tooltip.module';
import { MessagesComponent } from '../messages/messages.component';
import { TemplateMessageComponent } from './template-message.component';
import { InputText } from './template.model';
import { TemplateService } from './template.service';

describe('TemplateMessageComponent', () => {
  let component: TemplateMessageComponent;
  let fixture: ComponentFixture<TemplateMessageComponent>;

  const inputText: InputText = {
    msgEnglish: '',
    msgChineseTraditional: '',
    msgChineseSimplified: '',
    msgChineseNewSimplified: '',
    name: 'test',
    msgEnglishValue: 'test',
    msgChineseTraditionalValue: 'test',
    msgChineseSimplifiedValue: 'test',
    msgChineseNewSimplifiedValue: 'test',
    hideChinese: true,
    pattern: ''
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        TemplateMessageComponent,
        MessagesComponent
      ],
      imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ToolTipModule,
        HttpClientModule
      ],
      providers: [HttpService, TemplateService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateMessageComponent);
    component = fixture.componentInstance;
  });

  it('updateInputs when issue type is wrong market offered (12)', () => {
    // Arrange
    component.selectedTemplated.inputTexts = [inputText];
    const templateService = TestBed.get(TemplateService);
    spyOn(templateService, 'replaceScoreOfWrongMarketOffered');
    // Action and Assert
    component.updateInputs();
    expect(templateService.replaceScoreOfWrongMarketOffered).toHaveBeenCalled();
  });

  it('updateScore with score is not null', () => {
    // Arrange
    component.value.score = '1-0';
    const templateService = TestBed.get(TemplateService);
    spyOn(templateService, 'replaceEachLanguage');
    // Action and Assert
    component.updateScore();
    expect(templateService.replaceEachLanguage).toHaveBeenCalled();
  });

  it('updateScore with score is null', () => {
    // Arrange
    component.value.score = '';
    const templateService = TestBed.get(TemplateService);
    spyOn(templateService, 'replaceAll');
    // Action and Assert
    component.updateScore();
    expect(templateService.replaceAll).toHaveBeenCalled();
  });

  it('updateCheckStatement with checkSettled is true', () => {
    // Arrange
    component.value.checkSettled = true;
    const templateService = TestBed.get(TemplateService);
    spyOn(templateService, 'replaceEachLanguage');
    // Action and Assert
    component.updateCheckStatement();
    expect(templateService.replaceEachLanguage).toHaveBeenCalled();
  });

  it('updateCheckStatement with checkSettled is false', () => {
    // Arrange
    component.value.checkSettled = false;
    const templateService = TestBed.get(TemplateService);
    spyOn(templateService, 'replaceAll');
    // Action and Assert
    component.updateCheckStatement();
    expect(templateService.replaceAll).toHaveBeenCalled();
  });

  it('check validation', () => {
    // Arrange
    component.messagesComponent = new MessagesComponent(null);
    const testCases = [
      { validation: true, result: true },
      { validation: false, result: false }
    ];
    // Action and Assert
    for (const test of testCases) {
      component.messagesComponent.checkValidation = jasmine.createSpy().and.returnValue(test.validation);
      const expectedValue = component.checkValidation();
      expect(expectedValue).toBe(test.result);
    }
  });
});
