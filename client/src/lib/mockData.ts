export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  avatar: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  contactId: string;
  dueDate: string;
}

export interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in-progress' | 'done';
  dueDate: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
}

export const mockContacts: Contact[] = [
  { id: '1', name: 'Alice Freeman', email: 'alice@techcorp.com', phone: '+1 (555) 123-4567', company: 'TechCorp', role: 'CTO', avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Bob Smith', email: 'bob@innovate.io', phone: '+1 (555) 987-6543', company: 'Innovate Inc', role: 'Product Manager', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Carol Danvers', email: 'carol@shield.gov', phone: '+1 (555) 555-5555', company: 'S.H.I.E.L.D.', role: 'Director', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Dave Wilson', email: 'dave@startup.xyz', phone: '+1 (555) 111-2222', company: 'Startup XYZ', role: 'Founder', avatar: 'https://i.pravatar.cc/150?u=4' },
];

export const mockDeals: Deal[] = [
  { id: '1', title: 'Enterprise License', value: 50000, stage: 'proposal', contactId: '1', dueDate: '2023-12-15' },
  { id: '2', title: 'Q1 Consulting', value: 12000, stage: 'qualified', contactId: '2', dueDate: '2023-11-30' },
  { id: '3', title: 'Security Audit', value: 25000, stage: 'negotiation', contactId: '3', dueDate: '2023-12-01' },
  { id: '4', title: 'Seed Funding', value: 1000000, stage: 'new', contactId: '4', dueDate: '2024-01-15' },
  { id: '5', title: 'Add-on Features', value: 5000, stage: 'won', contactId: '1', dueDate: '2023-10-10' },
];

export const mockTasks: Task[] = [
  { id: '1', title: 'Call Alice about contract', status: 'todo', dueDate: '2023-11-25', assignedTo: 'Me', priority: 'high' },
  { id: '2', title: 'Prepare slide deck for Innovate', status: 'in-progress', dueDate: '2023-11-26', assignedTo: 'Me', priority: 'medium' },
  { id: '3', title: 'Send invoice to TechCorp', status: 'done', dueDate: '2023-11-20', assignedTo: 'Finance', priority: 'high' },
];

export const stages = [
  { id: 'new', label: 'New' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
];
