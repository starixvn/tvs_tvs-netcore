export class MenuItem {    
  constructor() {
    this.items = [];
  }

  id: number;
  name: string;
  isActive: boolean;
  displayOrder: number;
  environment: string;
  url: string;
  policy: number;
  functionName: string;
  parentId: number;
  parentName: string;
  validUrl: string;
  items: MenuItem[];
}