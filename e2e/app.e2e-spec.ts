import { CarshareAngularPage } from './app.po';

describe('carshare-angular App', () => {
  let page: CarshareAngularPage;

  beforeEach(() => {
    page = new CarshareAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
