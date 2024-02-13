import { SgqUiPage } from './app.po';

describe('sgq-ui App', () => {
  let page: SgqUiPage;

  beforeEach(() => {
    page = new SgqUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
