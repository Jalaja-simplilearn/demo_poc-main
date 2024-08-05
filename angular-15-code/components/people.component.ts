import { Component, ChangeDetectionStrategy } from '@angular/core';

interface Person {
  name: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PeopleComponent {
  includeUrl: string = 'app/template/peopleList.html';
  people: Person[] = this.generatePeople();

  public toggleTemplate(): void {
    this.includeUrl = this.includeUrl === 'app/template/peopleList.html' 
      ? 'app/template/peopleThumbnail.html' 
      : 'app/template/peopleList.html';
  }

  public removePerson(person: Person): void {
    const index = this.people.findIndex(p => p === person);
    if (index > -1) {
      this.people.splice(index, 1);
    }
  }

  private generatePeople(): Person[] {
    const firstNames = ['James', 'Christopher', 'Ronald', 'Mary', 'Lisa', 'Michelle', 'John', 'Daniel', 'Anthony', 'Patricia', 'Nancy', 'Laura'];
    const lastNames = ['Smith', 'Anderson', 'Clark', 'Wright', 'Mitchell', 'Johnson', 'Thomas', 'Rodriguez', 'Lopez', 'Perez'];
    const people: Person[] = [];

    while (people.length < 10) {
      const f = Math.floor(Math.random() * firstNames.length);
      const l = Math.floor(Math.random() * lastNames.length);
      people.push({
        name: `${firstNames[f]} ${lastNames[l]}`,
        email: `${lastNames[l].toLowerCase()}@company.com`,
        phone: Math.random().toString().slice(2, 12).match(/^(\d{3})(\d{3})(\d{4})/)!.slice(1).join('-')
      });
      firstNames.splice(f, 1);
      lastNames.splice(l, 1);
    }

    return people;
  }
}
