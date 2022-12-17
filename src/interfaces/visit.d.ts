export interface Visit {
  id: String
  visit_id: String
  visit_status: Status
  created_at: String
  updated_at: String
}

export declare type Status = String | "progress" | "done" | "cancel"
