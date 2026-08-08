import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
  IonList, IonItem, IonLabel, IonIcon, IonButton, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline, chevronDownOutline, chevronForwardOutline } from 'ionicons/icons';
import { AuthButtonComponent } from '../../core/auth-button.component';
import { ContentService, ModuleEntry, Subject, Topic } from '../../core/content.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    RouterLink,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonMenuButton,
    IonList, IonItem, IonLabel, IonIcon, IonButton,
    AuthButtonComponent,
  ],
})
export class DashboardPage implements OnInit {
  private content = inject(ContentService);
  private alertCtrl = inject(AlertController);

  modules = signal<ModuleEntry[]>([]);
  expandedModuleId = signal<string | null>(null);
  subjectsByModule = signal<Record<string, Subject[]>>({});
  expandedSubjectId = signal<string | null>(null);
  topicsBySubject = signal<Record<string, Topic[]>>({});

  constructor() {
    addIcons({ addOutline, createOutline, trashOutline, chevronDownOutline, chevronForwardOutline });
  }

  ngOnInit() {
    this.loadModules();
  }

  private loadModules() {
    this.content.getModules().then(({ data }) => this.modules.set(data ?? []));
  }

  private loadSubjects(moduleId: string) {
    this.content.getSubjects(moduleId).then(({ data }) => {
      this.subjectsByModule.update((map) => ({ ...map, [moduleId]: data ?? [] }));
    });
  }

  private loadTopics(subjectId: string) {
    this.content.getTopics(subjectId).then(({ data }) => {
      this.topicsBySubject.update((map) => ({ ...map, [subjectId]: data ?? [] }));
    });
  }

  toggleModule(moduleId: string) {
    if (this.expandedModuleId() === moduleId) {
      this.expandedModuleId.set(null);
      return;
    }
    this.expandedModuleId.set(moduleId);
    this.expandedSubjectId.set(null);
    if (!this.subjectsByModule()[moduleId]) {
      this.loadSubjects(moduleId);
    }
  }

  toggleSubject(subjectId: string) {
    if (this.expandedSubjectId() === subjectId) {
      this.expandedSubjectId.set(null);
      return;
    }
    this.expandedSubjectId.set(subjectId);
    if (!this.topicsBySubject()[subjectId]) {
      this.loadTopics(subjectId);
    }
  }

  private async promptTitle(header: string, currentTitle = ''): Promise<string | null> {
    const alert = await this.alertCtrl.create({
      header,
      inputs: [{ name: 'title', type: 'text', value: currentTitle, placeholder: 'Titel' }],
      buttons: [
        { text: 'Abbrechen', role: 'cancel' },
        { text: 'Speichern', role: 'confirm' },
      ],
    });
    await alert.present();
    const { role, data } = await alert.onDidDismiss();
    const title = (data?.values?.title ?? '').trim();
    return role === 'confirm' && title ? title : null;
  }

  private async confirmDelete(header: string): Promise<boolean> {
    const alert = await this.alertCtrl.create({
      header,
      message: 'Das kann nicht rückgängig gemacht werden.',
      buttons: [
        { text: 'Abbrechen', role: 'cancel' },
        { text: 'Löschen', role: 'confirm' },
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss();
    return role === 'confirm';
  }

  async addModule() {
    const title = await this.promptTitle('Neues Module');
    if (!title) return;
    await this.content.createModule(title);
    this.loadModules();
  }

  async editModule(module: ModuleEntry) {
    const title = await this.promptTitle('Module umbenennen', module.title);
    if (!title) return;
    await this.content.updateModule(module.id, title);
    this.loadModules();
  }

  async deleteModule(module: ModuleEntry) {
    if (!(await this.confirmDelete(`"${module.title}" löschen?`))) return;
    await this.content.deleteModule(module.id);
    this.loadModules();
  }

  async addSubject(moduleId: string) {
    const title = await this.promptTitle('Neues Subject');
    if (!title) return;
    await this.content.createSubject(moduleId, title);
    this.loadSubjects(moduleId);
  }

  async editSubject(subject: Subject) {
    const title = await this.promptTitle('Subject umbenennen', subject.title);
    if (!title) return;
    await this.content.updateSubject(subject.id, title);
    this.loadSubjects(subject.module_id);
  }

  async deleteSubject(subject: Subject) {
    if (!(await this.confirmDelete(`"${subject.title}" löschen?`))) return;
    await this.content.deleteSubject(subject.id);
    this.loadSubjects(subject.module_id);
  }

  async deleteTopic(topic: Topic) {
    if (!(await this.confirmDelete(`"${topic.title}" löschen?`))) return;
    await this.content.deleteTopic(topic.id);
    this.loadTopics(topic.subject_id);
  }
}
