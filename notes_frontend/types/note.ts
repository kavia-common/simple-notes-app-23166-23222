export type Note = {
  id: number | string
  title: string
  content: string
  created_at?: string
  updated_at?: string
};

export type NoteInput = {
  title: string
  content: string
};
