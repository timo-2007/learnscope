import { Injectable } from '@angular/core';
import { supabase } from './supabase.client';

export interface ModuleEntry {
  id: string;
  title: string;
  slug: string;
}

export interface Subject {
  id: string;
  module_id: string;
  title: string;
  slug: string;
}

export interface Topic {
  id: string;
  subject_id: string;
  title: string;
  slug: string;
  content: string;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable({ providedIn: 'root' })
export class ContentService {
  getModules() {
    return supabase.from('modules').select('*').order('title');
  }

  createModule(title: string) {
    return supabase.from('modules').insert({ title, slug: slugify(title) }).select().single();
  }

  updateModule(id: string, title: string) {
    return supabase.from('modules').update({ title, slug: slugify(title) }).eq('id', id);
  }

  deleteModule(id: string) {
    return supabase.from('modules').delete().eq('id', id);
  }

  getSubjects(moduleId: string) {
    return supabase.from('subjects').select('*').eq('module_id', moduleId).order('title');
  }

  createSubject(moduleId: string, title: string) {
    return supabase.from('subjects').insert({ module_id: moduleId, title, slug: slugify(title) }).select().single();
  }

  updateSubject(id: string, title: string) {
    return supabase.from('subjects').update({ title, slug: slugify(title) }).eq('id', id);
  }

  deleteSubject(id: string) {
    return supabase.from('subjects').delete().eq('id', id);
  }

  getTopics(subjectId: string) {
    return supabase.from('topics').select('*').eq('subject_id', subjectId).order('title');
  }

  getTopic(id: string) {
    return supabase.from('topics').select('*').eq('id', id).single();
  }

  createTopic(subjectId: string, title: string, content: string) {
    return supabase.from('topics').insert({ subject_id: subjectId, title, slug: slugify(title), content }).select().single();
  }

  updateTopic(id: string, title: string, content: string) {
    return supabase.from('topics').update({ title, slug: slugify(title), content }).eq('id', id);
  }

  deleteTopic(id: string) {
    return supabase.from('topics').delete().eq('id', id);
  }
}
