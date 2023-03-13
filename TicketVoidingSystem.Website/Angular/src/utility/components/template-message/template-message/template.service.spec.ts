import { Message } from '../messages/message';
import { TemplateService } from './template.service';
import { TemplateContent } from './template.model';
import { TemplateContentConst, TemplateReplace } from './template.const';

describe('TemplateService', () => {
  const templateService = new TemplateService();

  it('Replace WrongScore Of WrongScore IssueType', () => {
    // Arrange
    const message = new Message();
    const score = '1-0';
    const replacedContent: TemplateContent = {
      msgEnglish: `(${TemplateContentConst.SCORE.msgEnglish} ${score} ${TemplateContentConst.ONWARDS.msgEnglish}) `,
      msgChineseTraditional:
        `(${TemplateContentConst.SCORE.msgChineseTraditional} ${score} ${TemplateContentConst.ONWARDS.msgChineseTraditional}) `,
      msgChineseSimplified:
        `(${TemplateContentConst.SCORE.msgChineseSimplified} ${score} ${TemplateContentConst.ONWARDS.msgChineseSimplified}) `,
      msgChineseNewSimplified:
        `(${TemplateContentConst.SCORE.msgChineseNewSimplified} ${score} ${TemplateContentConst.ONWARDS.msgChineseNewSimplified}) `
    };
    spyOn(templateService, 'replaceEachLanguage');
    // Action and Assert
    templateService.replaceWrongScoreOfWrongScoreIssueType(message, score);
    expect(templateService.replaceEachLanguage).toHaveBeenCalledWith(message, TemplateReplace.WRONG_SCORE_ONWARDS, replacedContent);
  });

  it('Replace WrongScore Of WrongScore IssueType when input score is null', () => {
    // Arrange
    const message = new Message();
    const score = '';
    spyOn(templateService, 'replaceAll');
    // Action and Assert
    templateService.replaceWrongScoreOfWrongScoreIssueType(message, score);
    expect(templateService.replaceAll).toHaveBeenCalledWith(message, TemplateReplace.WRONG_SCORE_ONWARDS, '');
  });

  it('Replace ActualScore Of WrongScore IssueType', () => {
    // Arrange
    const message = new Message();
    const score = '1-0';
    const replacedContent: TemplateContent = {
      msgEnglish: `${score} ${TemplateContentConst.ONWARDS.msgEnglish}`,
      msgChineseTraditional: `${score} ${TemplateContentConst.ONWARDS.msgChineseTraditional}`,
      msgChineseSimplified: `${score} ${TemplateContentConst.ONWARDS.msgChineseSimplified}`,
      msgChineseNewSimplified: `${score} ${TemplateContentConst.ONWARDS.msgChineseNewSimplified}`
    };
    spyOn(templateService, 'replaceEachLanguage');
    // Action and Assert
    templateService.replaceActualScoreOfWrongScoreIssueType(message, score);
    expect(templateService.replaceEachLanguage).toHaveBeenCalledWith(message, TemplateReplace.ACTUAL_SCORE_ONWARDS, replacedContent);
  });

  it('Replace ActualScore Of WrongScore IssueType when input score is null', () => {
    // Arrange
    const message = new Message();
    const score = '';
    spyOn(templateService, 'replaceAll');
    // Action and Assert
    templateService.replaceActualScoreOfWrongScoreIssueType(message, score);
    expect(templateService.replaceAll).toHaveBeenCalledWith(message, TemplateReplace.ACTUAL_SCORE_ONWARDS, '');
  });
});
