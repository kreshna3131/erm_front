export interface Laboratorium {
  id: String
  allow: Boolean
  visit_id: String
  user_id: String
  unique_id: String
  info: String
  status: Status
  is_read_lab: String
  is_read_doc: String
  created_by: String
  updated_by: String
  created_for: String
  created_at: String
  updated_at: String
}

export declare type Status = String | "waiting" | "progress" | "fixing" | "done" | "cancel"