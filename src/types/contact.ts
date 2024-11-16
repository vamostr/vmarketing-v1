export interface ContactGroup {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
}

export interface ContactTag {
  id: string;
  name: string;
  color: string;
}

export interface Contact {
  id: string;
  phone: string;
  name: string;
  email?: string;
  company?: string;
  notes?: string;
  groups: string[]; // group ids
  tags: string[]; // tag ids
  source: 'manual' | 'import' | 'whatsapp';
  createdAt: Date;
  updatedAt: Date;
  lastInteraction?: Date;
}